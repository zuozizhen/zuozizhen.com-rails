---
draft: false
title: "写给设计师的个人网站搭建指南（二）：代码学习大纲"
snippet: "对于设计师我推荐的代码学习大纲"
image: "https://imagedelivery.net/8B08sdLvw783CQcaKhUoYw/1e696fac-4ad7-470d-e9ac-97e10b7ee500/public"
published_at: "2021-04-18"
---
我认为对于设计师来说，在学习代码的过程中，有两点是非常重要的：

1. 知道学习的目的和要学到什么程度。
2. 理解学习的不同东西间的相互关系。

**先来理解第一点：知道学习的目的和要学到什么程度。**

其实就像学习做饭一样，给自己做饭和去米其林餐厅应聘是不一样的，我们首先得知道学习的目的什么，才能明确要学到什么程度。

本来我们的目标就是会做家常菜即可，但偏偏按照大厨的标准要求自己，上来就学三个月刀工，这明显就是不合理的。

学习代码也是一样，如果仅仅是为了搭建自己的个人网站，第一阶段需要认真学的东西只有两个：HTML 和 CSS。我们并不是程序员，只是需要一些技术手段来表达，所以 HTML + CSS 已经够用了。当然，踏踏实实的把这两部分内容理解通透之后，再去了解 JS 也不迟。

**我们再来看看第二点：理解学习的不同东西间的相互关系。**

还是以做饭为例，我们需要了解过程中不同的原料、厨具、调料之间的配合关系：什么原料该用什么刀处理、在什么时候放油最合适、不同的菜火候该如何把握。

在搭建个人网站的过程中，也不是学习完 HTML 和 CSS 就完事大吉了，也需要非常多的其它知识来辅助你达到最终的目标，我们也需要理解不同技术间的关系，来掌握其中的“火候”

下面是我总结的学习大纲，包含了搭建网站过程中所需的几乎所有方面：

## 学习大纲

### 1. 软件工具：VSCode、SourceTree

VSCode 是用来写代码用的，SourceTree 是当我们使用 Github 托管代码时管理用的，都是必不可少的基础工具。

对于 VSCode，我们需要学习它的快捷键和安装适合的插件，这样可以大大提升开发的效率。

对于 Soursetree 来说，它其实是 Git 的可视化操作，所以首先需要先了解 Git 的基本用法，然后用 Soursetree 管理你托管在 Github 上的代码。

#### 📕 学习资料：

VSCode 配置教程：[https://zhuanlan.zhihu.com/p/113222681](https://zhuanlan.zhihu.com/p/113222681)

SourceTree 安装教程：[https://juejin.cn/post/6844903620454907911](https://juejin.cn/post/6844903620454907911)

猴子都能懂的 GIT 入门：[https://backlog.com/git-tutorial/cn/](https://backlog.com/git-tutorial/cn/)

#### 📙 课外阅读：

Webstorm（更强大的代码编辑器，内置功能丰富）：[https://www.jetbrains.com/webstorm/](https://www.jetbrains.com/webstorm/)

Atom（以颜值高著称的代码编辑器）：[https://atom.io/](https://atom.io/)

VIM 教程（一种极为技术的操作方式）：[https://coolshell.cn/articles/5426.html](https://coolshell.cn/articles/5426.html)

###2. 基础语言：HTML 和 CSS

我们会用这两种种语言来和浏览器描述我们想要的效果，简单来说，HTML 是描述结构的，CSS 是描述效果的。就像毛坯房和装修的关系一样，我们先用 HTML 来搭建起房子的基本结构，然后再用 CSS 来装修。

#### 📕 学习资料：

HTML + CSS 在线教程（学习 **响应式 Web 设计** 部分）：[https://learn.freecodecamp.one/](https://learn.freecodecamp.one/)

#### 📙 课外阅读：

HTML + CSS 文档（当字典看）：[https://developer.mozilla.org/zh-CN/docs/Learn/Getting_started_with_the_web](https://developer.mozilla.org/zh-CN/docs/Learn/Getting_started_with_the_web)

Flex 布局教程：语法篇：[http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html](http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html)

CSS Grid 网格布局教程：[https://www.ruanyifeng.com/blog/2019/03/grid-layout-tutorial.html](https://www.ruanyifeng.com/blog/2019/03/grid-layout-tutorial.html)

###2. 进阶语言：Pug、SASS

用 Pug 和 SASS 写出来的东西，最后都会被编译为 HTML 和 CSS，你可以理解为这是是两个传话筒，你可以用一种更简单的方式表达，但传话筒会把他们翻译成浏览器听的懂的语言。

#### 📕 学习资料：

Pug 文档：[https://www.pugjs.cn/api/getting-started.html](https://www.pugjs.cn/api/getting-started.html)

SASS 用法指南：[https://www.ruanyifeng.com/blog/2012/06/sass.html](https://www.ruanyifeng.com/blog/2012/06/sass.html)

#### 📙 课外阅读：

Stylus（另一种 CSS 的写法，比 SASS 更加简洁）：[https://stylus.bootcss.com/](https://stylus.bootcss.com/)

### 3. CSS 框架：Bootstrap、Bulma

简单理解，就是我们从头开始做东西太难了，所以有人帮我们做了半成品，这类东西就是提前帮我们写好的 HTML 和 CSS，我们只需要拿着这些东西拼凑就可以开始做网站了。好处是做起来非常快，但毕竟是别人做的，坏处就是改起来会比较麻烦，而且做出来的网站会很雷同。

#### 📕 学习资料：

Bootstrap 官网：[https://v4.bootcss.com/](https://v4.bootcss.com/)

Bulma 官网：[https://bulma.io/](https://bulma.io/)

#### 📙 课外阅读：

Tailwind 官网（有独特理念的 CSS 框架）：[https://tailwindcss.com/](https://tailwindcss.com/)

### 4. 包管理器：npm

我们在搭建一个网站的时候，我们有时不需要每个功能都自己写，所以会依赖很多其它的代码库，这个时候用什么管理呢？就是使用 npm，我们通过在终端敲一些命令，就可以做安装、升级、卸载等操作了。

#### 📕 学习资料：

npm 中文文档：[https://www.npmjs.cn/](https://www.npmjs.cn/)

#### 📙 课外阅读：

yarn 中文文档（另一个包管理器）：[https://yarn.bootcss.com/docs/](https://yarn.bootcss.com/docs/)

### 6. 终端：iTerm2

我们在操作 npm 和在本地启动服务时，必须用到终端，你可以理解为是有些功能是没有图形化界面的，只能在终端通过命令行来使用，你也可以在 VSCode 中调出自带的终端工具。

也可以下载 iTerm2，这是一个第三方终端工具，更加强大和好用，也能通过一个叫 Oh My Zsh 的第三方工具来加强和美化它。

#### 📕 学习资料：

iTerm2 + Oh My Zsh：[https://juejin.cn/post/6844904178075058189](https://juejin.cn/post/6844904178075058189)

#### 📙 课外阅读：

Hyper（一个新的终端工具，特点是高颜值）：[https://hyper.is/](https://hyper.is/)

### 7. 浏览器调试工具

其实浏览器自带了可以让我们直接编辑网页预览效果的工具，在 Chrome 浏览器中按下 `⌥⌘I`就可以调出调试工具，此时我们就可以直接调整网页上的样式，一方面自己调试会更加方便，另一方面也可以去看看自己喜欢的网站都是怎么实现的

#### 📕 学习资料：

Chrome 调试技巧：[https://www.yuque.com/fe9/basic/gcawte](https://www.yuque.com/fe9/basic/gcawte)

### 7. 代码托管：Github

Github 是一个基于 Git 的代码托管平台，我们需要把代码放到 Github 上，之后通过下面的自动部署平台来生成我们的网站。

#### 📕 学习资料：

Github 官网：[https://github.com/](https://github.com/)

#### 📙 课外阅读：

程序员常逛的 Github，原来是个隐藏的学习网站：[https://sspai.com/post/58120](https://sspai.com/post/58120)

### 9. 静态网站生成器：Jekyll

用静态网站生成器可以把 Markdown 转为 HTML，非常适合用来做博客或者文档网站。

#### 📕 学习资料：

Jekyll（适合做博客）：[https://www.jekyll.com.cn/](https://www.jekyll.com.cn/)

认识与入门 Markdown：[https://sspai.com/post/25137](https://sspai.com/post/25137)

#### 📙 课外阅读：

Vuepress（适合做文档或博客）：[https://vuepress.vuejs.org/zh/](https://vuepress.vuejs.org/zh/)

Hexo（适合做博客）：[https://hexo.io/zh-cn/](https://hexo.io/zh-cn/)

docsify（适合做文档）：[https://docsify.js.org/#/](https://docsify.js.org/#/)

###8. 自动部署平台：Vercel

这是我们用来将网站自动部署上线所使用的服务，依赖 Github 的代码仓库。

#### 📕 学习资料：

Vercel 官网：[https://vercel.com/](https://vercel.com/)

#### 📙 课外阅读：

Netlify官网（另一款类似的服务）：[https://www.netlify.com/](https://www.netlify.com/)

### 10. 了解框架：Vue、React

Vue 和 React 都是用于构建用户界面的 JavaScript 框架，所以它们并不是一种语言，JavaScript 是一种语言，它们是用 JavaScript 写出的不同框架。

如果要学习框架，是务必需要先学习 JavaScript 基础的。

#### 📕 学习资料：

Vue：[https://cn.vuejs.org/v2/guide/index.html](https://cn.vuejs.org/v2/guide/index.html)

React：[https://zh-hans.reactjs.org/](https://zh-hans.reactjs.org/)

### 7. 信息源：

这里是我大部分获取最新技术信息的来源，我的理解是信息源在精不在多，也希望大家能去降低自己获取信息的密度。

#### 📕 学习资料：

国外关于技术的讨论精选：[https://hackernewsletter.com/](https://hackernewsletter.com/)

有关 CSS 的技巧和思考：[https://css-tricks.com/](https://css-tricks.com/)

在线各种 CSS 的效果案例：[https://codepen.io/](https://codepen.io/)

很有趣的周刊，涉及面较广：[http://www.ruanyifeng.com/blog/2021/04/weekly-issue-154.html](http://www.ruanyifeng.com/blog/2021/04/weekly-issue-154.html)

#### 📙 课外阅读：

湾区日报（关于创业与技术的文章）：[https://wanqu.co/](https://wanqu.co/)

Josh Wcomeau（一个前端工程师的个人博客，擅长研究 CSS 动画）：[https://www.joshwcomeau.com](https://www.joshwcomeau.com)

Indie Hackers（国外独立开发者社区）：[https://www.indiehackers.com](https://www.indiehackers.com)
