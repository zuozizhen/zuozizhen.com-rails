import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["body", "output", "input"]
  static values = {
    blogs: String,
    allBlogs: String,
    projects: String,
    aboutPath: String,
    homePath: String,
    chatPath: String
  }

  connect() {
    this.history = []
    this.historyIndex = -1
    this.isComposing = false
    this.blogs = JSON.parse(this.blogsValue || "[]")
    this.allBlogs = JSON.parse(this.allBlogsValue || "[]")
    this.projects = JSON.parse(this.projectsValue || "[]")
    this.commands = [
      "/help", "/whoami", "/about", "/blog", "/read", "/open",
      "/projects", "/resources", "/contact", "/links", "/neofetch",
      "/clear", "/home"
    ]
    this.chatMessages = []

    this.restoreState()
    if (!this.outputTarget.innerHTML.trim()) this.printWelcome()

    this.focusInput()
    this.element.addEventListener("click", (e) => {
      if (e.target.closest(".terminal-input-editor")) return
      this.focusInput()
    })
    this.persistState()
  }

  compositionStart() { this.isComposing = true }
  compositionEnd() { this.isComposing = false }
  focusInput() { this.inputTarget.focus() }

  runCmd(e) {
    const cmd = e.currentTarget.dataset.cmd
    if (!cmd) return
    this.inputTarget.value = ""
    this.historyIndex = -1
    this.history.unshift(cmd)
    this.executeInput(cmd)
    this.persistState()
    this.focusInput()
  }

  handleKey(e) {
    if (this.isComposing || e.isComposing) return

    if (this.acList) {
      if (e.key === "ArrowUp") { e.preventDefault(); this.navigateAutocomplete(-1); return }
      if (e.key === "ArrowDown") { e.preventDefault(); this.navigateAutocomplete(1); return }
      if (e.key === "Enter") { e.preventDefault(); this.selectAutocomplete(); return }
      if (e.key === "Escape") { e.preventDefault(); this.hideAutocomplete(); return }
      if (e.key === "Tab") { e.preventDefault(); this.selectAutocomplete(); return }
      this.hideAutocomplete()
    }

    if (e.key === "Enter") {
      e.preventDefault()
      const input = this.inputTarget.value.trim()
      this.inputTarget.value = ""
      this.historyIndex = -1
      if (!input) return
      this.history.unshift(input)
      this.executeInput(input)
      this.persistState()
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      if (this.historyIndex < this.history.length - 1) {
        this.historyIndex++
        this.inputTarget.value = this.history[this.historyIndex]
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (this.historyIndex > 0) {
        this.historyIndex--
        this.inputTarget.value = this.history[this.historyIndex]
      } else {
        this.historyIndex = -1
        this.inputTarget.value = ""
      }
    } else if (e.key === "Tab") {
      e.preventDefault()
      this.autocomplete(this.inputTarget)
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault()
      this.outputTarget.innerHTML = ""
      this.persistState()
    } else if (e.key === "Escape") {
      this.hideAutocomplete()
    }
  }

  executeInput(input) {
    if (input.startsWith("/")) {
      this.executeCommandBlock(input)
      return
    }
    this.executeChat(input)
  }

  executeCommandBlock(raw) {
    const cmd = raw.trim()
    const parts = cmd.split(/\s+/)
    const command = (parts[0] || "").toLowerCase()

    if (command === "/clear") {
      this.clearTerminal()
      return
    }
    if (!command) return

    const { block, output } = this.createBlock(cmd, false)
    const result = this.getCommandOutput(raw, command, parts)

    if (result.error) {
      block.classList.remove("block-ok")
      block.classList.add("block-error")
    }
    if (result.html) {
      output.innerHTML = result.html
      if (result.noPreWrap) output.style.whiteSpace = "normal"
    }

    this.scrollToBottom()
    this.persistState()
  }

  async executeChat(message) {
    const user = this.createBlock(message, false)
    user.output.textContent = ""

    this.chatMessages.push({ role: "user", content: message })

    const assistant = this.createBlock("ai", false)
    assistant.output.innerHTML = '<span class="dim">思考中...</span>'
    assistant.output.style.whiteSpace = "normal"
    this.scrollToBottom()

    const fullText = await this.streamChat(assistant.block, assistant.output)

    if (fullText) {
      this.chatMessages.push({ role: "assistant", content: fullText })
    }

    this.scrollToBottom()
    this.persistState()
  }

  async streamChat(block, output) {
    const csrfToken = document.querySelector("meta[name='csrf-token']")?.content
    const chatPath = this.chatPathValue || "/api/chat"
    let fullText = ""
    let renderTimer = null

    const scheduleRender = () => {
      if (renderTimer) return
      renderTimer = requestAnimationFrame(() => {
        output.innerHTML = this.renderMarkdown(fullText)
        this.scrollToBottom()
        renderTimer = null
      })
    }

    try {
      const response = await fetch(chatPath, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "text/event-stream",
          ...(csrfToken ? { "X-CSRF-Token": csrfToken } : {})
        },
        body: JSON.stringify({ messages: this.chatMessages })
      })

      if (!response.ok || !response.body) {
        throw new Error(`请求失败 (${response.status})`)
      }

      output.innerHTML = ""
      const reader = response.body.getReader()
      const decoder = new TextDecoder("utf-8")
      let buffer = ""
      let done = false

      while (!done) {
        const result = await reader.read()
        done = result.done
        if (result.value) {
          buffer += decoder.decode(result.value, { stream: true })
          const parsed = this.consumeSseBuffer(buffer)
          buffer = parsed.buffer

          parsed.events.forEach((evt) => {
            const payload = this.safeJsonParse(evt.data)
            if (evt.event === "delta") {
              const text = payload?.text || ""
              if (text) {
                fullText += text
                scheduleRender()
              }
            } else if (evt.event === "error") {
              block.classList.remove("block-ok")
              block.classList.add("block-error")
              output.innerHTML = `<span class="error-text">${this.escapeHtml(payload?.message || "AI 请求失败")}</span>`
              fullText = ""
            }
          })
        }
      }

      // Final render to ensure complete
      if (fullText) {
        if (renderTimer) cancelAnimationFrame(renderTimer)
        output.innerHTML = this.renderMarkdown(fullText)
      } else if (!output.innerHTML.trim()) {
        output.innerHTML = '<span class="dim">未收到回复。</span>'
      }
    } catch (error) {
      block.classList.remove("block-ok")
      block.classList.add("block-error")
      output.innerHTML = `<span class="error-text">AI 请求失败: ${this.escapeHtml(error.message)}</span>`
      fullText = ""
    }

    return fullText
  }

  consumeSseBuffer(rawBuffer) {
    const events = []
    const chunks = rawBuffer.split("\n\n")
    const buffer = chunks.pop() || ""

    chunks.forEach((chunk) => {
      const lines = chunk.split("\n")
      let event = "message"
      const dataLines = []

      lines.forEach((line) => {
        if (line.startsWith("event:")) event = line.slice(6).trim()
        if (line.startsWith("data:")) dataLines.push(line.slice(5).trim())
      })

      if (dataLines.length > 0) {
        events.push({ event, data: dataLines.join("\n") })
      }
    })

    return { events, buffer }
  }

  safeJsonParse(value) {
    try { return JSON.parse(value) } catch { return null }
  }

  autocomplete(input) {
    const raw = input.value
    if (!raw.startsWith("/")) {
      this.hideAutocomplete()
      return
    }

    const lower = raw.toLowerCase()

    if (lower === "/") {
      this.showCommandAutocomplete(this.commands)
      return
    }

    if (lower === "/read" || lower === "/open") {
      input.value = `${lower} `
      this.showSlugAutocomplete(lower.slice(1), "")
      return
    }

    if (lower.startsWith("/read ") || lower.startsWith("/open ")) {
      const isRead = lower.startsWith("/read ")
      const prefix = isRead ? "read" : "open"
      const partial = lower.slice(prefix.length + 2).trim()
      this.showSlugAutocomplete(prefix, partial)
      return
    }

    const matched = this.commands.filter((c) => c.startsWith(lower.trim()))
    if (lower.startsWith("/re") && matched.includes("/read")) {
      input.value = "/read"
      this.hideAutocomplete()
      return
    }
    if (matched.length === 1) {
      input.value = matched[0]
      this.hideAutocomplete()
      return
    }
    if (matched.length > 1) {
      this.showCommandAutocomplete(matched)
      return
    }

    this.hideAutocomplete()
  }

  showCommandAutocomplete(commands) {
    this.hideAutocomplete()
    this.acMode = "command"
    this.acSelectedIndex = 0
    this.acItems = commands
    const list = this.buildAutocompleteContainer()

    commands.forEach((cmd, i) => {
      const item = document.createElement("div")
      item.classList.add("autocomplete-item")
      if (i === 0) item.classList.add("active")
      item.innerHTML = `<span class="ac-slug">${this.escapeHtml(cmd)}</span>`
      item.addEventListener("click", () => {
        this.inputTarget.value = cmd
        this.hideAutocomplete()
        this.focusInput()
      })
      item.addEventListener("mouseenter", () => this.activateAutocompleteIndex(i))
      list.appendChild(item)
    })

    this.mountAutocomplete(list)
  }

  showSlugAutocomplete(prefix, partial) {
    this.hideAutocomplete()
    const matches = partial
      ? this.allBlogs.filter((b) => b.slug.toLowerCase().includes(partial))
      : this.allBlogs

    if (matches.length === 0) return

    this.acMode = "slug"
    this.acSelectedIndex = 0
    this.acItems = matches
    this.acPrefix = prefix
    const list = this.buildAutocompleteContainer()

    matches.forEach((b, i) => {
      const item = document.createElement("div")
      item.classList.add("autocomplete-item")
      if (i === 0) item.classList.add("active")
      item.innerHTML = `<span class="ac-slug">${this.escapeHtml(b.slug)}</span><span class="ac-title">${this.escapeHtml(b.title)}</span><span class="ac-date">${b.date || ""}</span>`
      item.addEventListener("click", () => {
        this.inputTarget.value = `/${prefix} ${b.slug}`
        this.hideAutocomplete()
        this.focusInput()
      })
      item.addEventListener("mouseenter", () => this.activateAutocompleteIndex(i))
      list.appendChild(item)
    })

    this.mountAutocomplete(list)
  }

  buildAutocompleteContainer() {
    const list = document.createElement("div")
    list.classList.add("autocomplete-list")
    return list
  }

  mountAutocomplete(list) {
    const inputBlock = this.inputTarget.closest(".terminal-input-block")
    if (!inputBlock) return
    inputBlock.appendChild(list)
    this.acList = list
  }

  activateAutocompleteIndex(index) {
    if (!this.acList) return
    const items = this.acList.querySelectorAll(".autocomplete-item")
    items[this.acSelectedIndex]?.classList.remove("active")
    this.acSelectedIndex = index
    items[this.acSelectedIndex]?.classList.add("active")
  }

  hideAutocomplete() {
    if (this.acList) {
      this.acList.remove()
      this.acList = null
    }
    this.acItems = null
    this.acMode = null
  }

  navigateAutocomplete(direction) {
    if (!this.acList || !this.acItems) return
    const items = this.acList.querySelectorAll(".autocomplete-item")
    if (items.length === 0) return

    items[this.acSelectedIndex]?.classList.remove("active")
    this.acSelectedIndex = (this.acSelectedIndex + direction + items.length) % items.length
    items[this.acSelectedIndex]?.classList.add("active")
    items[this.acSelectedIndex]?.scrollIntoView({ block: "nearest" })
  }

  selectAutocomplete() {
    if (!this.acItems || this.acItems.length === 0) return

    if (this.acMode === "command") {
      this.inputTarget.value = this.acItems[this.acSelectedIndex]
    } else if (this.acMode === "slug") {
      const blog = this.acItems[this.acSelectedIndex]
      this.inputTarget.value = `/${this.acPrefix} ${blog.slug}`
    }

    this.hideAutocomplete()
    this.focusInput()
  }

  createBlock(cmd, isError) {
    const time = new Date().toLocaleTimeString("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    })

    const block = document.createElement("div")
    block.classList.add("terminal-block", isError ? "block-error" : "block-ok")

    const header = document.createElement("div")
    header.classList.add("block-header")
    header.innerHTML = `<div class="block-cmd"><span class="syn-prompt">➜</span> ${this.highlightSyntax(cmd)}</div><span class="block-time">${time}</span>`

    const output = document.createElement("div")
    output.classList.add("block-output")

    block.appendChild(header)
    block.appendChild(output)
    this.outputTarget.appendChild(block)

    return { block, output }
  }

  getCommandOutput(raw, command, parts) {
    const handlers = {
      "/help": () => ({ html: this.helpText() }),
      "/whoami": () => ({ html: `我是<span class="highlight">左子祯</span> — 设计师, 创作者。` }),
      "/about": () => ({ html: `我是一名产品设计师，乐于创作和分享，对创造充满热情。\n了解 <a href="${this.aboutPathValue}">更多关于我 →</a>` }),
      "/blog": () => ({ html: parts.includes("--all") ? this.blogAllText() : this.blogText() }),
      "/projects": () => ({ html: this.projectsText() }),
      "/resources": () => ({ html: this.resourcesText() }),
      "/contact": () => ({ html: `<span class="section-title">联系我</span>\n\n欢迎联系 → <a href="mailto:hi@zuozizhen.com">hi@zuozizhen.com</a>` }),
      "/links": () => ({ html: `<span class="section-title">社交链接</span>\n\n<span class="tree-branch">├──</span> <a href="https://twitter.com/zuozizhen" target="_blank">Twitter</a>\n<span class="tree-branch">├──</span> <a href="https://www.xiaohongshu.com/user/profile/5c5f7e25000000001000fc79" target="_blank">小红书</a>\n<span class="tree-branch">├──</span> <a href="https://zuozizhen.substack.com" target="_blank">Newsletter</a>\n<span class="tree-branch">└──</span> <a href="mailto:hi@zuozizhen.com">Email</a>` }),
      "/home": () => { window.location.href = this.homePathValue; return { html: "" } },
      "/neofetch": () => ({ html: this.neofetchText() }),
      "/read": () => this.readArticle(raw),
      "/open": () => this.openArticle(raw)
    }

    if (handlers[command]) return handlers[command]()
    return { html: `<span class="error-text">command not found: ${this.escapeHtml(command)}</span>\n<span class="dim">输入 <span class="syn-command">/help</span> 查看可用命令</span>`, error: true }
  }

  helpText() {
    return `<span class="section-title">可用命令:</span>

  <span class="syn-command">/whoami</span>              <span class="dim">—</span> 我是谁
  <span class="syn-command">/about</span>               <span class="dim">—</span> 关于我
  <span class="syn-command">/blog</span>                <span class="dim">—</span> 最近的文章
  <span class="syn-command">/blog</span> <span class="syn-flag">--all</span>          <span class="dim">—</span> 全部文章
  <span class="syn-command">/read</span> <span class="syn-path">&lt;slug&gt;</span>        <span class="dim">—</span> 在终端中阅读文章
  <span class="syn-command">/open</span> <span class="syn-path">&lt;slug&gt;</span>        <span class="dim">—</span> 在浏览器中打开文章
  <span class="syn-command">/projects</span>            <span class="dim">—</span> 我的项目
  <span class="syn-command">/resources</span>           <span class="dim">—</span> 资源推荐
  <span class="syn-command">/contact</span>             <span class="dim">—</span> 联系方式
  <span class="syn-command">/links</span>               <span class="dim">—</span> 社交链接
  <span class="syn-command">/neofetch</span>            <span class="dim">—</span> 系统信息
  <span class="syn-command">/clear</span>               <span class="dim">—</span> 清屏并清空会话缓存
  <span class="syn-command">/home</span>                <span class="dim">—</span> 回到首页
  <span class="syn-command">/help</span>                <span class="dim">—</span> 显示帮助`
  }

  blogText() {
    let out = `<span class="section-title">最近文章</span>\n`
    this.blogs.forEach((b, i) => {
      const branch = i === this.blogs.length - 1 ? "└──" : "├──"
      out += `<span class="tree-branch">${branch}</span> <a href="${b.url}">${this.escapeHtml(b.title)}</a>\n`
      out += `<span class="tree-branch">│</span>   <span class="syn-path">${b.slug}</span> <span class="dim">${b.date || ""}</span>\n`
    })
    out += `\n<span class="dim">输入 <span class="syn-command">/blog --all</span> 查看全部 · <span class="syn-command">/read</span> <span class="syn-path">&lt;slug&gt;</span> 阅读</span>`
    return out
  }

  blogAllText() {
    let out = `<span class="section-title">全部文章</span>\n`
    this.allBlogs.forEach((b, i) => {
      const branch = i === this.allBlogs.length - 1 ? "└──" : "├──"
      out += `<span class="tree-branch">${branch}</span> <a href="${b.url}">${this.escapeHtml(b.title)}</a>\n`
      out += `<span class="tree-branch">│</span>   <span class="syn-path">${b.slug}</span> <span class="dim">${b.date || ""}</span>\n`
    })
    return out
  }

  blogFilteredText(slugs) {
    const filtered = slugs.map(s => this.allBlogs.find(b => b.slug === s)).filter(Boolean)
    if (filtered.length === 0) return ""
    let out = ""
    filtered.forEach((b, i) => {
      const branch = i === filtered.length - 1 ? "└──" : "├──"
      out += `<span class="tree-branch">${branch}</span> <a href="${b.url}">${this.escapeHtml(b.title)}</a>\n`
      out += `<span class="tree-branch">│</span>   <span class="syn-path">${b.slug}</span> <span class="dim">${b.date || ""}</span>\n`
    })
    return out
  }

  projectsText() {
    let out = `<span class="section-title">项目</span>\n`
    this.projects.forEach((p, i) => {
      const branch = i === this.projects.length - 1 ? "└──" : "├──"
      out += `<span class="tree-branch">${branch}</span> <a href="${p.url}" target="_blank">${this.escapeHtml(p.name)}</a> <span class="dim">(${p.year})</span> — ${this.escapeHtml(p.desc)}\n`
    })
    return out
  }

  resourcesText() {
    return `<span class="section-title">资源</span>\n\n<span class="tree-branch">├──</span> <a href="https://afdian.com/item/40d6ab9a3a9111ee96535254001e7c00" target="_blank">极简简历模版包</a>\n<span class="tree-branch">├──</span> <a href="https://arlogrey.lemonsqueezy.com/checkout/buy/0c70f01e-b150-4175-b286-ed21ee5a57b6" target="_blank">Notion 极简简历模版</a>\n<span class="tree-branch">├──</span> <a href="https://arlogrey.lemonsqueezy.com/checkout/buy/a8c1d2ff-7a1c-41e8-a6b7-3b38c3ec60ad" target="_blank">Figma 极简简历模版</a>\n<span class="tree-branch">└──</span> <a href="https://www.notion.so/zh-cn/templates/personal-year-end-summary" target="_blank">Notion 个人年终总结模版</a>`
  }

  neofetchText() {
    return `<span class="syn-command">zuozizhen</span><span class="dim">@</span><span class="syn-command">web</span>
<span class="dim">──────────────</span>
<span class="syn-flag">OS:</span>        Web Browser
<span class="syn-flag">Host:</span>      zuozizhen.com
<span class="syn-flag">Shell:</span>     zsh (simulated)
<span class="syn-flag">Theme:</span>     Dark
<span class="syn-flag">Terminal:</span>  Stimulus.js
<span class="syn-flag">Role:</span>      产品设计师 & 创作者
<span class="syn-flag">Uptime:</span>    since 1997
<span class="syn-flag">Packages:</span>  Rails, Hotwire, Turbo`
  }

  readArticle(cmd) {
    const slug = cmd.trim().split(/\s+/)[1]
    if (!slug) return { html: `<span class="dim">用法: <span class="syn-command">/read</span> <span class="syn-path">&lt;slug&gt;</span> · 输入 <span class="syn-command">/blog</span> 查看文章列表</span>` }
    const blog = this.allBlogs.find((b) => b.slug === slug)
    if (!blog) return { html: `<span class="error-text">找不到文章: ${this.escapeHtml(slug)}</span>`, error: true }

    let cleanContent = blog.content
      .replace(/\n{3,}/g, "\n\n")
      .replace(/<\/p>\s*<p>/g, "</p><p>")
      .replace(/<br\s*\/?>\s*<br\s*\/?>/g, "<br>")
      .trim()

    let out = `<div class="terminal-article">`
    out += `<div class="article-title">${this.escapeHtml(blog.title)}</div>`
    out += `<div class="article-meta">${blog.date || ""}</div>`
    if (blog.image) out += `<div class="terminal-img-frame" data-label="cover"><img src="${blog.image}" alt="${this.escapeHtml(blog.title)}" loading="lazy" /></div>`
    out += `<div class="article-body">${cleanContent}</div>`
    out += `</div>`
    out += `<div style="margin-top:8px"><span class="dim">在浏览器中查看:</span> <a href="${blog.url}">${blog.url}</a></div>`
    return { html: out, noPreWrap: true }
  }

  openArticle(cmd) {
    const slug = cmd.trim().split(/\s+/)[1]
    if (!slug) return { html: `<span class="dim">用法: <span class="syn-command">/open</span> <span class="syn-path">&lt;slug&gt;</span></span>` }
    const blog = this.allBlogs.find((b) => b.slug === slug)
    if (blog) {
      window.location.href = blog.url
      return { html: "" }
    }
    return { html: `<span class="error-text">找不到: ${this.escapeHtml(slug)}</span>`, error: true }
  }

  printWelcome() {
    const block = document.createElement("div")
    block.classList.add("terminal-block", "block-ok")
    block.innerHTML = `<div class="block-output"><div class="crush-banner">
  <div class="crush-top">
    <span class="crush-text">ZUOZIZHEN</span>
    <div class="crush-meta">
      <span class="crush-version">v1.0</span>
      <span class="crush-tag">terminal</span>
    </div>
    <div class="crush-dots">▪ ▪ ▪ ▪ ▪</div>
  </div>
  <div class="crush-stripe-row">
    <div class="crush-stripes"></div>
  </div>
  <div class="crush-cyber-line"></div>
</div><span class="dim">输入 <span class="syn-command">/help</span> 查看命令，或直接输入内容与 AI 对话。</span></div>`
    this.outputTarget.appendChild(block)
  }

  clearTerminal() {
    this.outputTarget.innerHTML = ""
    this.history = []
    this.historyIndex = -1
    this.chatMessages = []
    sessionStorage.removeItem("terminal.output.html")
    sessionStorage.removeItem("terminal.history")
    sessionStorage.removeItem("terminal.chatMessages")
    this.persistState()
  }

  persistState() {
    sessionStorage.setItem("terminal.output.html", this.outputTarget.innerHTML)
    sessionStorage.setItem("terminal.history", JSON.stringify(this.history))
    sessionStorage.setItem("terminal.chatMessages", JSON.stringify(this.chatMessages))
  }

  restoreState() {
    const outputHtml = sessionStorage.getItem("terminal.output.html")
    const history = sessionStorage.getItem("terminal.history")
    const chatMessages = sessionStorage.getItem("terminal.chatMessages")
    if (outputHtml) this.outputTarget.innerHTML = outputHtml
    if (history) {
      try { this.history = JSON.parse(history) } catch { this.history = [] }
    }
    if (chatMessages) {
      try { this.chatMessages = JSON.parse(chatMessages) } catch { this.chatMessages = [] }
    }
  }

  renderMarkdown(text) {
    // Split into lines, process block-level elements first
    const lines = text.split("\n")
    const result = []
    let i = 0

    while (i < lines.length) {
      const line = lines[i]

      // Component tags: {{blog_all}}, {{blog:slug1,slug2}}, {{projects}}, {{resources}}
      const tagMatch = line.match(/^\{\{(.+?)\}\}$/)
      if (tagMatch) {
        const tag = tagMatch[1]
        let componentHtml = ""
        if (tag === "blog_all") {
          componentHtml = this.blogAllText()
        } else if (tag === "projects") {
          componentHtml = this.projectsText()
        } else if (tag === "resources") {
          componentHtml = this.resourcesText()
        } else if (tag.startsWith("blog:")) {
          const slugs = tag.slice(5).split(",").map(s => s.trim())
          componentHtml = this.blogFilteredText(slugs)
        }
        if (componentHtml) {
          result.push(`<div style="white-space:pre-wrap;margin:4px 0;">${componentHtml}</div>`)
        } else {
          result.push(`<div style="margin:3px 0;">${this.inlineFormat(line)}</div>`)
        }
        i++
        continue
      }

      // Code block
      if (line.startsWith("```")) {
        const lang = line.slice(3).trim()
        const codeLines = []
        i++
        let closed = false
        while (i < lines.length) {
          if (lines[i].startsWith("```")) {
            closed = true
            i++
            break
          }
          codeLines.push(lines[i])
          i++
        }

        // Structured data blocks — only render when closed
        if (closed && lang.startsWith("json:")) {
          // No longer used, skip
          continue
        }

        if (closed) {
          // Normal code block
          result.push(`<pre style="background:#111;border:1px solid #1f1f1f;border-radius:6px;padding:10px 14px;margin:8px 0;overflow-x:auto;white-space:pre;"><code style="color:#a1a1aa;font-size:13px;">${codeLines.map(l => this.escapeHtml(l)).join("\n")}</code></pre>`)
        } else {
          // Unclosed code block (streaming) — show as dimmed loading indicator
          if (lang.startsWith("json:")) {
            result.push('<div style="margin:4px 0;"><span style="color:#52525b;">加载中...</span></div>')
          } else {
            result.push(`<pre style="background:#111;border:1px solid #1f1f1f;border-radius:6px;padding:10px 14px;margin:8px 0;overflow-x:auto;white-space:pre;"><code style="color:#a1a1aa;font-size:13px;">${codeLines.map(l => this.escapeHtml(l)).join("\n")}</code></pre>`)
          }
        }
        continue
      }

      // Tree branch lines: ├── / └──
      if (line.match(/^[├└]── /)) {
        const title = line.replace(/^[├└]── /, "")
        const branch = line.startsWith("└") ? "└──" : "├──"
        result.push(`<div style="margin:3px 0;"><span style="color:#3f3f46;">${branch}</span> ${this.inlineFormat(title)}</div>`)
        i++
        continue
      }

      // Tree continuation: │   slug date
      if (line.match(/^│\s+/)) {
        const content = line.replace(/^│\s+/, "")
        result.push(`<div style="margin:0 0 2px;"><span style="color:#3f3f46;">│</span>   <span style="color:#52525b;">${this.inlineFormat(content)}</span></div>`)
        i++
        continue
      }

      // Empty line → spacing
      if (line.trim() === "") {
        result.push('<div style="height:6px;"></div>')
        i++
        continue
      }

      // Horizontal rule
      if (line.trim() === "---" || line.trim() === "***") {
        result.push('<hr style="border:none;border-top:1px dashed #2a2a2a;margin:12px 0;">')
        i++
        continue
      }

      // Headers
      if (line.startsWith("### ")) {
        result.push(`<div style="color:#60a5fa;font-weight:600;font-size:14px;margin:12px 0 4px;">${this.inlineFormat(line.slice(4))}</div>`)
        i++
        continue
      }
      if (line.startsWith("## ")) {
        result.push(`<div style="color:#60a5fa;font-weight:600;font-size:15px;margin:14px 0 6px;">${this.inlineFormat(line.slice(3))}</div>`)
        i++
        continue
      }
      if (line.startsWith("# ")) {
        result.push(`<div style="color:#60a5fa;font-weight:700;font-size:16px;margin:16px 0 8px;">${this.inlineFormat(line.slice(2))}</div>`)
        i++
        continue
      }

      // Blockquote
      if (line.startsWith("> ")) {
        result.push(`<div style="border-left:3px solid #22c55e;padding:4px 12px;margin:6px 0;color:#a1a1aa;font-style:italic;">${this.inlineFormat(line.slice(2))}</div>`)
        i++
        continue
      }

      // Unordered list
      if (line.match(/^[-*] /)) {
        result.push(`<div style="padding-left:14px;position:relative;margin:3px 0;"><span style="color:#22c55e;position:absolute;left:0;">▸</span>${this.inlineFormat(line.replace(/^[-*] /, ""))}</div>`)
        i++
        continue
      }

      // Ordered list
      const olMatch = line.match(/^(\d+)\. (.+)/)
      if (olMatch) {
        result.push(`<div style="padding-left:20px;position:relative;margin:3px 0;"><span style="color:#22c55e;position:absolute;left:0;font-weight:600;font-size:12px;">${olMatch[1]}.</span>${this.inlineFormat(olMatch[2])}</div>`)
        i++
        continue
      }

      // Normal paragraph
      result.push(`<div style="margin:3px 0;">${this.inlineFormat(line)}</div>`)
      i++
    }

    return result.join("")
  }

  inlineFormat(text) {
    let s = this.escapeHtml(text)

    // Inline code
    s = s.replace(/`([^`]+)`/g, '<code style="background:#1a1a1a;color:#fbbf24;padding:2px 6px;border-radius:3px;font-size:13px;">$1</code>')

    // Bold
    s = s.replace(/\*\*(.+?)\*\*/g, '<span style="color:#e2e8f0;font-weight:600;">$1</span>')

    // Italic
    s = s.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em style="color:#a1a1aa;">$1</em>')

    // Markdown links [text](url)
    s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g, '<a href="$2" target="_blank" style="color:#5eead4;text-decoration:underline;text-underline-offset:2px;">$1</a>')

    // Bare URLs (not already in href="...")
    s = s.replace(/(?<!")(?<!=)(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" style="color:#5eead4;text-decoration:underline;text-underline-offset:2px;">$1</a>')

    return s
  }

  highlightSyntax(cmd) {
    if (!cmd) return ""
    if (!cmd.startsWith("/")) return `<span class="syn-arg">${this.escapeHtml(cmd)}</span>`

    const parts = cmd.match(/(?:[^\s"]+|"[^"]*")+/g) || []
    if (parts.length === 0) return ""

    return parts.map((part, i) => {
      if (i === 0) return `<span class="syn-command">${this.escapeHtml(part)}</span>`
      if (part.startsWith("--") || part.startsWith("-")) return `<span class="syn-flag">${this.escapeHtml(part)}</span>`
      if (part.startsWith('"') && part.endsWith('"')) return `<span class="syn-string">${this.escapeHtml(part)}</span>`
      if (part.includes("/") || part.includes(".")) return `<span class="syn-path">${this.escapeHtml(part)}</span>`
      return `<span class="syn-arg">${this.escapeHtml(part)}</span>`
    }).join(" ")
  }

  scrollToBottom() {
    requestAnimationFrame(() => { this.bodyTarget.scrollTop = this.bodyTarget.scrollHeight })
  }

  escapeHtml(str) {
    const div = document.createElement("div")
    div.textContent = str
    return div.innerHTML
  }
}
