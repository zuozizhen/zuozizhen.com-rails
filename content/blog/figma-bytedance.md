---
draft: false
title: "深入了解 Figma — 下一代设计神器（字节跳动内部分享文字版）"
snippet: "受邀在字节跳动内部为今日头条 UED 所做的线下分享"
image: "https://imagedelivery.net/8B08sdLvw783CQcaKhUoYw/7280e3d5-8e39-47a5-d1a9-fa71e6594900/public"
published_at: "2019-06-14"
---
## 什么是 Figma

Figma 是一个**基于浏览器**的协作式 UI 设计工具，Figma 从推出至今越来越受到 UI 设计师的青睐，如今也有很多的设计团队投入了Figma 的怀抱，接下来会聊聊为什么我们应该选择 Figma 而不是 Sketch。

## 基于浏览器有什么好处

- **跨平台**（Win,、Chrome、Linux、Mac、TNT）
- **无需保存**
- 设计文件现在是一个**链接**

## 但我觉得文件存在本地更安全

- Figma 支持**历史版本恢复**，免费版最多保存 30 天。专业或团队版无限制
- Figma 考虑了灾难恢复，所有的基础架构都**分布在 3 个 AWS 数据中心**，其中任何一个数据中心意外发生故障，其它数据中心将继续工作。
- 刚获得了红杉资本领投的 4000 万美元 C 轮融资

## 那它有 Sketch 快么？

基于原生 OS 开发的软件自然能更好的使用硬件资源，但 Figma 在**速度上完胜** Sketch，即使在处理大文件时也是如此。

## 但 Figma 有插件么，Sketch 上我依赖很多插件完成工作

Figma **原生支持**很多 Sketch 需要插件甚至依靠其它应用才能完成的功能，当然，Figma 也**支持插件开发**。

## 哇，那它都有些什么功能

**Figma = Sketch（UI 设计）+ InVision（原型设计） + Zeplin（标注）+**
**Dropbox（云端同步）+ Abstract（版本历史）+ Craft-Freehand（实时讨论） +**
**Liveshare（实时分享）+ Team Library （团队组件库）+  Web API（第三方接入）+ …**

### UI 设计

Figma 是为 UI 设计而生的设计工具，除了有和 Sketch 一样基本的操作和功能，还有许多专为 UI 设计而生的强大功能。

### 原型设计

你可以在 Figma 里面无缝完成从设计到原型演示的切换，不需要反复同步设计图到第三方平台，我们同样可以利用 Figma Mirror 在手机上预览效果。

### 前端协作

工程师可以在设计图上量取位置、并且可以导出所需任何资源（包括 CSS、iOS、Android 样式）

### 实时协作 + 内置评论

在 Figma 里，设计和协作可以是同时进行的，任何人都可以在设计图的任何地方添加评论， 你可以在评论中@其他人或将评论标记为已解决。

### 矢量网络（Vector Network）

![](https://imagedelivery.net/8B08sdLvw783CQcaKhUoYw/9c3d757a-ae06-4ed5-7507-b61fd0fc9c00/public)

### 团队 Library

我们可以跨项目共享和更新 Component、Style，需要注意的是免费版不能跨文件共享 Component。

### Web Font & Font Icon

Figma 原生支持 Google fonts 和 FontAwesome。

### 已经推出的 Web API **和即将推出的** Write API

可以快速轻松地对内部公司工作流程进行脚本改进，或将 Figma 与其他工具集成

### Uber **和** GitHub **如何使用** Figma API

![](https://imagedelivery.net/8B08sdLvw783CQcaKhUoYw/adeaf8c5-6410-44e5-ef00-116f201a0400/public)

###### Uber 员工通过 Figma的 API 查看反馈到电视上的实时设计文件

![](https://imagedelivery.net/8B08sdLvw783CQcaKhUoYw/2aa9f895-ab4c-4579-32ff-bb873718af00/public)

###### GitHub Octicon 在 Figma 和 Github 仓库中，未来可以通过 Write API 可以做到双向同步

### 示例

![](https://imagedelivery.net/8B08sdLvw783CQcaKhUoYw/1bb5d7d0-441d-460d-82f0-b88ff3662700/public)

## 啊，那上手会不会很难？

- 和 Sketch 相似的界面和快捷键，支持**导入 Sketch 文件**
- 甚至比 Sketch 更容易上手

## 不算问题的问题

1. 快速稳定的体验需要科学上网
2. 专业版每人每月15刀，企业团队版每人每月45刀，年付会有优惠

## 如何利用 Figma **改进我们的工作流程呢？**

### 几个概念：

- “**Group（组）**” 只是一种对图层进行分组的方法 - 组本身不是对象，意味着**组不影响约束或具有明确的界限**。
- “**Frame**” 是一个容器 - 可以管理 Constraints ，**有自己的大小和边界**。
- “**Artboard（画板）**” 是一种命名习惯 - 可以制作一个 Frame 并将其称为“画板”
- “**Constraints（约束）**” 类似于 Sketch 里面的 Resizing ，给图层设置布局改变时图层的响应策略。
- “**Component（组件）**” 类似于 Sketch 里面的 Symbol，但使用会更加灵活
- “**Instance（实例）**” Component 的一个实例，随 Maser Component 改变
- “**Styles（样式）**” 可以共享的字体、颜色、阴影等属性

### 1. 我们可以通过实时协作更快地迭代

迭代时间可以从几天缩短到几分钟，不会再有下面的场景：

- 同步 Sketch Library
- “把源文件发我，我改下”
- 谁也不知道自己手上的文件是不是最新版。

### 2. 我们的工作流程会更加的无缝和包容

设计文件现在是一个链接，这意味着：

- 设计师可以更轻松地并行工作。
- 工程师可以更早的查看设计稿进行技术评审。
- 利益相关者或任何有链接的人都可以看到设计从想法到实现的过程。
- **设计现在是一个整体而不是在设计过程被分割成多个文件**。

### 3. 我们从设计到代码的过渡会更快且具有一致性

在 Figma 中，我们更容易的以前端的思维方式进行设计。
首先，Figma 使用 Frames 而不是画板，有什么区别呢？

#### 1. Frames 可以互相嵌套。

把一个较小的 Frame 拖到另一个较大的 Frame 上时会自动成为它的子元素。

#### 2. 元素的定位和约束相对于其父级 Frame

我们可以使用 Frames 将屏幕划分为不同的内容区域，然后在这些部分内嵌套组件。
这种方法与自动分组，相对定位和约束相结合，可以轻松快速构建一致且响应式设计。

#### 3. 使用这样的框架对前端很有帮助

因为 Figma 中的 Frames 类似于 HTML 中的容器（div）。
工程师能够看到嵌套在各自容器中的 UI 元素，这意味着他们在写代码时会对布局有更好的了解。

![](https://imagedelivery.net/8B08sdLvw783CQcaKhUoYw/f9aef1ac-c394-40ea-b88b-d2f70459d700/public)

### 4. 我们的设计系统将更灵活和易用

Sketch 有 Symbol，Figma 有 Component。
不同之处在于 Component 比 Symbol 更灵活，我们可以用更少的组件做更多的事情

#### Component 如何比 Symbol 更灵活？

在 Sketch 中，我们可以使用 Symbol Overrides 来编辑文本或交换嵌套 Symbols。
但是，如果想要更改其他属性（字体大小，边框粗细或背景颜色等），则必须创建一个新的 Symbol。
要解决这个问题，你可以将每个属性单独做一个Symbol然后把他们嵌套在一起，但数量会越来越多，对于大型项目和复杂的 UI，维护会越来越复杂和难以使用
使用 Figma，我们可以访问和修改 component 中任何层的属性，而无需将其从 master component 中分离。

![](https://imagedelivery.net/8B08sdLvw783CQcaKhUoYw/dc9a6718-4ecd-49bf-5893-51ce77911700/public)

###### 1.创建一个 component，然后将其复制以创建两个 instances

![](https://imagedelivery.net/8B08sdLvw783CQcaKhUoYw/4d99901c-7875-4c39-8970-af3d7412b100/public)

###### 2.对 master component 的更改会立即同步到其所有 instances

![](https://imagedelivery.net/8B08sdLvw783CQcaKhUoYw/40dcf69b-3362-4cc5-00f0-c497cf936800/public)

###### 3.除非更改了 master component 的属性，否则任何属性都将被覆盖。


#### 与 Symbol 相比，Component 为何更易用？

1. 首先，在创建 component 时，我们不必担心**命名结构**（icon/app/search）。
2. 和Sketch不同的是，重命名 master components 时它将更新所有 instances。
3. 要创建一个 component 类别，只需将它们分组到一个 Frame 中，并将该 Frame 命名为该类别即可，这意味着只需拖动组件就可以轻松地重新组织事物。
4. 访问 Figma 中的 component 比访问 Sketch 中的 symbol 更容易。我们不必考虑命名结构来导航符号名称的嵌套菜单。相反，我们可以看到component的缩略图列表。
5. 要将 component 添加到画布或更换instances，只需拖放到画布即可。

![](https://imagedelivery.net/8B08sdLvw783CQcaKhUoYw/256a9975-5089-41ca-9f79-cacd10cb5d00/public)

###### 在侧边栏的面板中浏览所有的components

Component 更方便的一点是，在 Figma 中，可以在较大视图的上下文中编辑 master component，而不必转到单独的页面进行编辑。

## 不过 Figma 连中文文档都没有，中文资料也很少，遇到问题很难找到解决办法

从知乎相关的话题关注度上我们就可以大概了解到Figma在中国的普及程度，比起 Sketch 和 PS 来说实在是少的可怜

![](https://imagedelivery.net/8B08sdLvw783CQcaKhUoYw/b1c13f92-2867-4967-89e9-db935fba0900/public)

![](https://imagedelivery.net/8B08sdLvw783CQcaKhUoYw/34ac0b01-8ef9-41bd-7d42-e1c9738f3200/public)

![](https://imagedelivery.net/8B08sdLvw783CQcaKhUoYw/0e915c7a-1699-4ee7-9721-03de93013600/public)

## 即将到来的 FigmaChina.com

FigmaChina 是一个为大家提供 Figma 相关学习资料的网站，会逐渐更新以下内容，希望可以帮助到大家

- 开源的中文文档
- 技巧分享和使用心得
- 社区
- 更多…

## 参考链接

1. [**A Sketch user’s perspective on switching to Figma**](https://www.figma.com/blog/a-sketch-users-perspective-on-switching-to-figma/#now-let-s-get-to-the-really-good-stuff)
2. [**30 days deep into Figma — Full review**](https://blog.usejournal.com/30-days-deep-into-figma-full-review-7fffbb237c27)
3. [**Introducing: Figma’s Platform**](https://www.figma.com/blog/introducing-figmas-platform/#take-workflow-inspiration-from-uber-github)
4. [**Introducing Vector Networks**](https://medium.com/figma-design/introducing-vector-networks-3b877d2b864f)
5. [**Introducing Smart Selection**](https://www.figma.com/blog/introducing-smart-selection/)
6. [**Figma Security**](https://www.figma.com/security/)
7. [**2018 Design Tools Survey Results**](https://uxtools.co/survey-2018)
8. [**Figma raises $40MM Series C round led by Sequoia**](https://www.figma.com/blog/figma-series-c/)
