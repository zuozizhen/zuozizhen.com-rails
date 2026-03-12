---
draft: false
title: "写给设计师的个人网站搭建指南（一）：从域名到网站"
snippet: "用最浅显易懂的方式教大家选择适合的方式从头搭建一个属于自己的网站"
image: "https://imagedelivery.net/8B08sdLvw783CQcaKhUoYw/5479e68d-b9bc-44c4-5c0f-34ad33615f00/public"
published_at: "2021-04-11"
---
对于设计师来说，拥有一个像下面一样的个人网站是发挥创意，展示能力极好的机会，但面对陌生的代码、域名的购买、服务器的配置、DNS 的迁移等等繁琐的过程，总是会让许多设计师望而却步。

![image-20210411130726514](https://imagedelivery.net/8B08sdLvw783CQcaKhUoYw/5a918321-8dea-488a-2509-81bec6f4ef00/public)

这个系列文章中我会给大家普及常见的搭建网站的方式和所需的代码知识，用最浅显易懂的方式教大家选择适合的方式从头搭建一个属于自己的网站。

本篇文章为第一部分，了解如何将一个域名变成可以访问的网站的完整流程。

## 1. 购买心仪的域名

作为个人网站来说，有自己的独立域名当然是最好的，在配置和管理上我们可以做到完全自己掌控。

所以第一步，就是挑选一个自己喜欢的域名，我推荐大家在 Godaddy 上购买域名，非常快捷和简单：

1. 前往 [godaddy.com](https://sg.godaddy.com/) ，注册登陆账号。

![image-20210410233009360](https://imagedelivery.net/8B08sdLvw783CQcaKhUoYw/b0cab8ea-d257-43de-a650-4df530d26000/public)

2. 搜索你想要的域名，推荐可以直接使用姓名的拼音、英文名或者随便你喜欢的域名，买它！（如果不是热门或者价值很高的域名，一年价格大概在 100 左右，但一般第一年会打折，所以会很便宜）

![image-20210410233623180](https://imagedelivery.net/8B08sdLvw783CQcaKhUoYw/b8443ca1-7d10-4ffb-b98e-146776920a00/public)

3. 大功告成，现在你已经拥有属于自己的域名了。

![image-20210410234856111](https://imagedelivery.net/8B08sdLvw783CQcaKhUoYw/4b1c96da-6073-4f6b-8ecd-e3a24d140a00/public)

此时我们仅有域名但还没有内容，就像拿到了门牌号但房子还没有改起来，我们该如何把门牌号挂到我们的房子上呢？接下来我们先从如何盖房子说起。

## 2. 选择适合自己的建站方式

我们大体有三种建站选择

1. 一是使用 [Wordpress](https://wordpress.com/zh-cn/) 、[Ghost](https://ghost.org/) 之类的专门用来做博客的服务，它的好处是对于设计师来说可以基本不用关注代码，直接用现成的模版加可视化编辑器就可以搭建出一个还不错的网站，而且自带博客系统，当然也可以用来做作品集。

但弊端是网站的设计我们不能完全把控，很大程度上依赖模版本身的初始设计和可扩展性，即使可以自定义，过程也是很痛苦的。

![image-20210411130923035](https://imagedelivery.net/8B08sdLvw783CQcaKhUoYw/4e0e1a5f-ea7b-4f38-3714-6214ce258e00/public)

2. 二是 [Webflow](https://webflow.com/)、[Wix](https://zh.wix.com/) 等可视化网站生成器，它们的特点是相对来说自定义程度更高，理论上可以实现你想要的大多数网站设计，功能也是非常强大的，还可以做在线商店之类的网站。

但是需要一些对于代码的理解，比如 CSS 的布局方式、样式调整等，另一方面如果用来做博客的话，并不如上述的专门做博客的服务好用，他更适合做一些静态的站点，比如作品集之类的。

![image-20210411131017250](https://imagedelivery.net/8B08sdLvw783CQcaKhUoYw/72cf4082-0497-4b69-a36b-4c2bfbcd2c00/public)


3. 三是 [Jekyll](https://jekyllrb.com/) 、[Vuepress](https://vuepress.vuejs.org/zh/)、[Hexo](https://hexo.io/zh-cn/) 等静态网站生成器，这些框架可以帮助你快速构建可部署的静态网站，包括你以 Markdown 写的博客文章。

但如果使用上述的静态网站生成器，会需要 HTML、CSS、和一些基础的对技术和代码的了解，因为虽然他们也有主题，但是如果自定义的话，需要直接去改动代码，但这种方式就可以实现理论上可以实现的你的所有设计构想。

我的个人网站：[zuozizhen.com](https://zuozizhen.com/) 和 [figmachina.com](https://figmachina.com/) 就是分别使用 Jekyll 和 Vuepress 构建的（_截止到 2020年_），接下来我们主要分享的如何以此种方式跑通整个流程

![image-20210411131101735](https://imagedelivery.net/8B08sdLvw783CQcaKhUoYw/0837fdcc-25cf-4545-087d-64004fa57800/public)

当你会一些简单的前端后，可选择性就大很多了，我推荐大家使用Jekyll 或者 Vuepress，因为 Hexo 是基于Node.js的，速度快是它的优势

作为老牌博客的模版引擎，Jekyll 有很好的生态环境，我们遇到的绝大部分问题在网上都能找到解决方案，而且使用 Rails 的先天条件使得它更简单易学。Vuepress 是基于 Vue 的，同样生态非常好，也相对容易上手和学习。

下面我们以使用 Jekyll 为例，看看是如何一步一步的搭建起我们的个人网站

## 3. 代码托管

在我们安装和使用 Jekyll 之前，有一个问题要先解决，我们个人网站的代码应该放到哪里。域名上吗？不对，域名只是个门牌号，我们不可能把房子盖在门牌号上，所以我们需要找到一块用来盖房子的地皮，也就是一个在线上存放代码的地方。

我推荐使用  [Github](https://github.com/)，现在你可以简单的把它当作一个存储代码的网盘，我们需要做的就是把代码放到上面，然后使用 Git 来保持代码的更新。（[Git 入门](https://backlog.com/git-tutorial/cn/intro/intro1_1.html)）

![image-20210411161953695](https://imagedelivery.net/8B08sdLvw783CQcaKhUoYw/aff5ce42-fe69-4c61-0b29-49069695e700/public)

如果使用命令行来操作 Git 也使很多设计师头疼，所以我们需要一款图形化界面的Git管理工具，我在这里向大家推荐开源的 [Sourcetree](https://www.sourcetreeapp.com/)，会使我们在执行 Git 相关的命令时会更加便利。

![image-20210411131250946](https://imagedelivery.net/8B08sdLvw783CQcaKhUoYw/3099e373-c5c7-4f65-050d-517013a0f400/public)

代码编辑工具不用太多考虑，直接下载 [VSCode](https://code.visualstudio.com/) 即可。

![image-20210411131339484](https://imagedelivery.net/8B08sdLvw783CQcaKhUoYw/4925f308-87d5-4d9d-0712-5bcacbb46b00/public)

接下来我们要做的是建立一个仓库（repository）：

1. 注册一个 [Github](https://github.com/) 账号，登陆后点击右上角 + 号，在菜单中选择 **New repository**：

![image-20210411003902578](https://imagedelivery.net/8B08sdLvw783CQcaKhUoYw/d1a4687a-c8af-4a6c-f0ef-953a1b599500/public)

2. 接下来只需要在 **Repository name** 中为仓库起一个名字，其余可以都保持默认，点击下面绿色的 **Create repository** 按钮：

![image-20210411004221621](https://imagedelivery.net/8B08sdLvw783CQcaKhUoYw/40680d9f-6173-4514-25e3-2536b4718100/public)

3. 仓库已经创建好了，然后我们需要做一个叫做 克隆（Clone） 的操作，用来把代码放到仓库里，我们打开 [Sourcetree](https://www.sourcetreeapp.com/) ，在新建中找到 从 URL 克隆。

![image-20210411005326376](https://imagedelivery.net/8B08sdLvw783CQcaKhUoYw/654d4e4f-38a0-48b6-141e-576138549800/public)

4. 接下来我们回到之前创建好的仓库页面，将仓库的 HTTPS 地址复制：

![image-20210411104950967](https://imagedelivery.net/8B08sdLvw783CQcaKhUoYw/92a85f80-e6af-4862-2d22-a150050c6900/public)

5. 回到 [Sourcetree](https://www.sourcetreeapp.com/) ，点击 从 URL 克隆，在弹窗中将之前复制的地址粘贴到 源 URL 中，点击克隆（目标路径为克隆到本地所在的文件夹路径，可以自行选择）：

![image-20210411005815337](https://imagedelivery.net/8B08sdLvw783CQcaKhUoYw/a319258f-f0be-4d3d-ec24-a0b8507edd00/public)

6. 把你的个人网站代码放到这个文件夹中，你会在文件状态下看到很多的更改信息，点击未暂存文件前面的勾选框，更改会变为已暂存文件，此时点击提交（同时勾选立即推送变更到 `origin/master`，如果没有勾选的话，需要再点击上面的推送按钮，推送提交到仓库）

![image-20210411105303245](https://imagedelivery.net/8B08sdLvw783CQcaKhUoYw/652e02d3-7f40-4185-b2e0-80a5ae3e2400/public)

7. 成功之后，回到 Github 上查看，你会发现仓库中有了内容，这就是我们刚刚提交的个人网站代码，以后代码或文章的更新也是通过这种方式来进行。

	由于安装 Jekyll 和修改网站代码本身需要一定的代码知识，所以跳过了安装 Jekyll 本身的过程，大家可以通过 [官网上的教程](https://www.jekyll.com.cn/docs/installation/macos/) 或者在网站自行搜索相关资料来完成这步。

![image-20210411110417714](https://imagedelivery.net/8B08sdLvw783CQcaKhUoYw/9a0d1c49-d9b7-4c19-b444-dbf18b98d200/public)

或者也可以先只放一个 `index.html` 用来跑通流程：

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
		<title>我的个人网站</title>
	</head>
	<body>
		<p>Hello</p>
	</body>
</html>
```

## 4. 挑选部署平台

一切准备好之后，我们需要把网站部署到一个地方，同时让域名可以访问到。

将自己的网站托管在服务器上固然是一个选择，但是操作和管理上的不便对我们无疑是又增加了一个挑战，这里我们有几个解决方式：

1. 一是使用 Github 的服务 [GitPages](https://pages.github.com/)，利用 Github 本身自带的网站部署非常的快捷，但是缺点是只能支持 Jekyll，不支持其它的框架，所以局限性很大。

2. 二是选择一个自动部署平台，这里可以有的选择有 [Netlify](https://www.netlify.com/ ) 和 [Vercel](https://vercel.com/)，推荐大家使用 Vercel，据我测试在国内的访问速度会更快一点，同时体验和交互也做的更好。

我们以  [Vercel](https://vercel.com/) 为例，看看如何将网站运行起来：

1. 使用 Github 账号登陆  [Vercel](https://vercel.com/)：

![image-20210411112048232](https://imagedelivery.net/8B08sdLvw783CQcaKhUoYw/d0b8139b-9945-4b28-1713-2609698fdb00/public)

2. 登陆成功后点击 **New Project**：

![image-20210411112208244](https://imagedelivery.net/8B08sdLvw783CQcaKhUoYw/273596eb-869e-4af3-140c-15cdab732a00/public)

3. 找到你的个人网站仓库，点击 **Import**：

![image-20210411112920368](https://imagedelivery.net/8B08sdLvw783CQcaKhUoYw/f26b968c-a412-4df9-bd85-48bc25236a00/public)

5. 确认信息无误后，点击 **Deploy**：

![image-20210411113036610](https://imagedelivery.net/8B08sdLvw783CQcaKhUoYw/db95b2a6-917f-46f4-1eb9-3cbf849aef00/public)

6. 成功之后，我们进入到项目的主页，这时网站已经运行起来了，但是只能通过它给的域名访问，还没有和我们刚所购买的域名连接起来。我们需要进入到项目的 **Settings - Domains** 页面，在右侧输入所购买的域名，然后点击 Add，成功之后点开新增域名的 **Nameservers**，我们需要前面的 **Intended Nameservers 信息：

![image-20210411114450585](https://imagedelivery.net/8B08sdLvw783CQcaKhUoYw/c9fba54e-ffc1-4854-5288-be9ad5c3a200/public)

7. 回到 Godaddy，在我的产品页面，找到域名，点击管理 DNS：

![image-20210411114536416](https://imagedelivery.net/8B08sdLvw783CQcaKhUoYw/4c32689a-bb0e-4e85-0792-a4f0ae367c00/public)

8. 在此处把两个域名服务器改为上面 Vercel 提供的 Intended Nameservers 中的两个新域名服务器：

![image-20210411114813337](https://imagedelivery.net/8B08sdLvw783CQcaKhUoYw/38a1d353-d524-4034-5cbb-7f5670eaad00/public)

![image-20210411114754177](https://imagedelivery.net/8B08sdLvw783CQcaKhUoYw/6d93e2ce-b1f8-4711-61bf-95c19604e000/public)

9. 可能需要稍微等久一点，当 Vercel 中域名下出现这两个蓝色提示时，代表网站就可以访问了。

![image-20210411115748770](https://imagedelivery.net/8B08sdLvw783CQcaKhUoYw/f89a098a-3004-4fa4-9ce0-ae6d3d728900/public)

我们现在已经把门牌号挂在了房子上，网站的整个搭建部署包括域名的配置就已经全部完成，现在在任何地方都可以输入域名来访问你的个人网站了。

这里的流程图可以帮助大家再次梳理下整个流程：

![image-20210411124329429](https://imagedelivery.net/8B08sdLvw783CQcaKhUoYw/e33d9c8b-eaec-4724-b8cb-1b7b103dad00/public)

今天主要是了解流程，中间跳过了安装 Jekyll 和具体构建代码的过程，因为这需要大家有一定的代码知识和对于技术的基本了解，当然你可以尝试跟着网上搜索出来的教程来一步步的操作，同样也是很好的学习过程。

下一篇文章 **《写给设计师的个人网站搭建指南（二） - 代码学习大纲》**，我会和大家分享设计师学习代码的整体思路：从哪里开始，要学哪些模块，在什么地方学习等，帮大家理清思路，对未知的事物有更清晰和系统化的了解。
