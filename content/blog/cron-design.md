---
draft: false
title: "被 Notion 收购的 Cron 有哪些值得学习的设计细节"
snippet: "关于 Cron 的设计细节分享"
image: "https://imagedelivery.net/8B08sdLvw783CQcaKhUoYw/1dcb870a-1511-451e-3fb8-1a1221462600/public"
published_at: "2022-06-15"
---
最近 Notion 宣布收购了日历产品 Cron，看到很多人都评价 Cron 是“日历应用设计天花板”，我也有幸拿到了朋友给的邀请码，第一时间体验后，发现了很多值得学习的设计细节，在这里分享给大家。

![](https://imagedelivery.net/8B08sdLvw783CQcaKhUoYw/85583485-70d3-49fa-066a-792a28108b00/public)

1.Cron 右侧栏底部有着微妙的纹理，在鼠标滑过时，会跟随鼠标轨迹发光：

![](https://imagedelivery.net/8B08sdLvw783CQcaKhUoYw/4599c24c-d911-4c0e-19d7-c13810242000/public)

2.点击输入框，会发现输入光标也设计成了主题色，这在其它产品中很少见：

![](https://imagedelivery.net/8B08sdLvw783CQcaKhUoYw/2160bb2c-35e0-43da-2e18-d16b44834700/public)

3.当我们操作不合理而弹出提示 Toast 时，Cron 并没有用颜色来吸引眼球，而是给 Toast 加上了呼吸灯的特效：

![](https://imagedelivery.net/8B08sdLvw783CQcaKhUoYw/ac030f79-0cbb-4f4e-03f5-b3c9c36e4100/public)

4.Cron 中的菜单背景均使用了微弱的渐变（和极细的描边）：

![](https://imagedelivery.net/8B08sdLvw783CQcaKhUoYw/bb9a6980-17d7-4c3b-5b9a-7b37609aaf00/public)

5.下拉菜单没有对齐菜单本身，而是对齐选项的高亮边缘：

![](https://imagedelivery.net/8B08sdLvw783CQcaKhUoYw/09e5b3f3-6791-4ea0-7244-9dc8d5aecf00/public)

6.嵌套时，里层使用更小的圆角，让嵌套圆角看起来更自然：

![](https://imagedelivery.net/8B08sdLvw783CQcaKhUoYw/62fdbafb-9147-47a7-de59-fb8d4829f500/public)

7.Cron 中的菜单使用了 3 层投影来模拟更真实的投影效果（再加上 Cron 使用了微妙的渐变背景色和极细的描边，让菜单看起来非常有质感）：

![](https://imagedelivery.net/8B08sdLvw783CQcaKhUoYw/e4fa9481-74e2-454a-8e96-cb968256d000/public)

8.Cron 定义了多种不同的过渡时长在不同场景下使用，我们可以体验到 Toast、按钮、弹窗的过渡时长甚至曲线都是有微妙区别的：

![](https://imagedelivery.net/8B08sdLvw783CQcaKhUoYw/4a09cc60-6e79-4a84-e535-21e1a907ab00/public)

9.搜索过程中的微动效（Searching 后面的... 有跑马灯动效）：

![](https://imagedelivery.net/8B08sdLvw783CQcaKhUoYw/3f842132-12bd-4284-8436-607f97e4da00/public)

除了这些细节之外，Cron 的整体设计也很优秀，克制和细腻的颜色使用，强一致性的排版和元素，这些都是非常值得我们学习的地方。

可以看到 ，Notion 和 Cron 在设计上可以说有着相同的理念：克制且细腻，这可能也是 Notion 对 Cron 欣赏的原因之一，也是我们更应该去学习的理念。
