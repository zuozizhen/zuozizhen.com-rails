require "net/http"

module Api
  class ChatController < ApplicationController
    include ActionController::Live
    skip_forgery_protection

    def create
      messages = params[:messages]

      response.headers["Content-Type"] = "text/event-stream"
      response.headers["Cache-Control"] = "no-cache"
      response.headers["X-Accel-Buffering"] = "no"

      if !messages.is_a?(Array) || messages.empty?
        stream_event("error", { message: "消息不能为空" })
        return
      end

      endpoint = ENV["AI_API_ENDPOINT"].to_s
      model = ENV["AI_MODEL"].to_s
      api_key = ENV["AI_API_KEY"].to_s

      if endpoint.blank? || model.blank? || api_key.blank?
        stream_event("error", { message: "AI 配置缺失，请设置 AI_API_ENDPOINT / AI_API_KEY / AI_MODEL" })
        return
      end

      proxy_stream(endpoint:, api_key:, model:, messages:)
    rescue StandardError => e
      stream_event("error", { message: e.message })
    ensure
      response.stream.close
    end

    private

    def proxy_stream(endpoint:, api_key:, model:, messages:)
      uri = URI.parse(endpoint)
      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = uri.scheme == "https"

      # Sanitize user messages, prepend system prompt
      user_messages = messages.map do |m|
        { role: m["role"].to_s, content: m["content"].to_s }
      end.select { |m| %w[user assistant].include?(m[:role]) }

      all_messages = [ { role: "system", content: system_prompt } ] + user_messages

      request = Net::HTTP::Post.new(uri)
      request["Content-Type"] = "application/json"
      request["Accept"] = "text/event-stream"
      request["Authorization"] = "Bearer #{api_key}" if api_key.present?
      request.body = {
        model:,
        stream: true,
        messages: all_messages
      }.to_json

      full_text = +""

      http.request(request) do |upstream|
        unless upstream.is_a?(Net::HTTPSuccess)
          stream_event("error", { message: "upstream error: #{upstream.code}" })
          return
        end

        parse_upstream_sse(upstream) do |text|
          full_text << text
          stream_event("delta", { text: text })
        end

        stream_event("done", { text: full_text })
      end
    end

    def parse_upstream_sse(upstream)
      buffer = +""

      upstream.read_body do |chunk|
        buffer << chunk

        while (line_break = buffer.index("\n"))
          line = buffer.slice!(0..line_break).strip
          next if line.blank?
          next unless line.start_with?("data:")

          data = line.delete_prefix("data:").strip
          break if data == "[DONE]"

          payload = JSON.parse(data) rescue nil
          next if payload.blank?

          text = extract_text(payload)
          yield(text) if text.present?
        end
      end
    end

    def extract_text(payload)
      return payload["text"].to_s if payload["text"].present?

      choice = payload["choices"]&.first || {}
      return choice.dig("delta", "content").to_s if choice.dig("delta", "content").present?
      return choice.dig("message", "content").to_s if choice.dig("message", "content").present?

      ""
    end

    def stream_event(name, payload)
      response.stream.write("event: #{name}\n")
      response.stream.write("data: #{payload.to_json}\n\n")
    end

    def system_prompt
      blogs_json = Blog.recent.map { |b|
        { title: b.title, slug: b.slug, date: b.formatted_date }
      }

      projects_json = Project.recent.map { |p|
        { title: p.title, duty: p.duty, snippet: p.snippet.to_s }
      }

      <<~PROMPT
        你是左子祯（zuozizhen）的 AI 分身，用第一人称「我」来回答所有问题。
        你的语气随和、真诚，像朋友聊天一样自然，但保持专业。回答简洁有力，不啰嗦。

        ## 关于我
        - 我是一名产品设计师和创作者，对设计和创造充满热情
        - 个人网站：zuozizhen.com
        - 邮箱：hi@zuozizhen.com
        - 社交：Twitter(@zuozizhen)、小红书、Substack Newsletter（zuozizhen.substack.com）

        ## 工作经历（从近到远）
        - Creatie（2024）— 设计中心负责人，负责 Creatie 品牌 VI 设计
        - MasterGo / 莫高设计（2019-2023）— 产品设计负责人 → 设计中心负责人
          - MasterGo 一号员工，从零到一领导品牌定义、产品规划、界面设计和设计系统搭建
          - 主导 MasterGo Design System，追求品质感、可复用性和工程统一
          - 负责莫高设计品牌升级、MasterGo 1.0 品牌 VI
          - 负责视觉设计和活动设计（设计师人格测试、好设季活动、罗永浩代言 KV 等）
        - 蓝湖（2021）— UI 设计师，设计蓝湖新版官网（lanhuapp.com）
        - 锤子科技 Smartisan（2018）— UI 设计师
          - Smartisan OS 7.0 Design System（基于 Figma 的大型设计系统）
          - Smartisan Web Sketch Library
        - 魔门云 CacheMoment（2017）— 产品设计师，CacheMoment 0-1 产品设计及品牌重塑

        ## 个人项目
        - NotionChina（notionchina.co）— Notion 中文站，2021
        - FigmaChina（figmachina.com）— Figma 中文站，2019

        ## 分享的资源
        - 极简简历模版包（¥12）
        - Notion 极简简历模版（免费）
        - Figma 极简简历模版（免费）
        - Notion 个人年终总结模版（免费）

        ## 我的文章数据
        文章链接格式为 https://zuozizhen.com/blog/{slug}
        #{blogs_json.to_json}

        ## 我的项目作品数据
        #{projects_json.to_json}

        ## 线下分享经历
        - 受邀在字节跳动内部为今日头条 UED 做 Figma 分享
        - 受自如邀请做 Figma 与设计系统的线下分享
        - 受最毕设邀请做多元化思维的线上分享

        ## 回复格式规则（极其重要，必须严格遵守）
        你的回复会被渲染在一个终端界面中。前端已经内置了结构化数据的渲染组件。

        当需要展示数据列表时，在回复中插入以下标记（独占一行），前端会自动替换为格式化的终端组件：

        - {{blog_all}} — 展示全部文章列表
        - {{blog:slug1,slug2,slug3}} — 展示指定的几篇文章，用逗号分隔 slug
        - {{projects}} — 展示全部项目列表
        - {{resources}} — 展示全部资源列表

        示例回复：
        "我写过不少文章，这是完整列表：
        {{blog_all}}"

        "关于 Figma 我写过这几篇：
        {{blog:figma-bytedance,figmachina,meetup-ziru}}"

        标记前后可以有普通文字。普通文字中：
        - 用 **加粗** 强调关键词
        - 提到单篇文章时用 [文章标题](https://zuozizhen.com/blog/slug) 格式
        - 不要使用 emoji
        - 列表用 - 开头

        ## 重要规则
        1. 只回答与我（左子祯）相关的问题：我的经历、项目、设计理念、文章、资源等
        2. 如果用户问与我无关的问题（比如写代码、做数学题、聊政治、问天气等），礼貌拒绝并引导回来，例如：「这个我不太擅长回答哈，不过你可以问我关于设计、我的项目或者工作经历之类的～」
        3. 不要编造我没有的经历或项目
        4. 当用户问到某篇文章或某个项目时，附上对应的链接
        5. 用中文回答，除非用户用英文提问
        6. 回答控制在 2-4 句话以内，除非用户要求列出文章列表或详细展开
      PROMPT
    end
  end
end
