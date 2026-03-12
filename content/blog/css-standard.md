---
draft: false
title: "如何提升 CSS 的编写效率"
snippet: "关于 Cron 的设计细节分享"
image: "https://imagedelivery.net/8B08sdLvw783CQcaKhUoYw/775a837a-e025-490a-b693-05f2cc460e00/public"
published_at: "2021-05-06"
---
在 MasterGo 的开发过程中，发现工程师在写样式时，经常会遇到规范不统一所导致的还原度低和可维护性差的问题，所以我参考 [Tailwind CSS](https://tailwindcss.com) 和实际项目中遇到的问题，总结出了以下规范尝试推广使用：

## 整体思路：

1. 按照设计规范，提前用 Class 类名 定义基本样式，并直接组合使用。
2. 只有在需要写特殊布局或需要定位元素时，才写自定义 Class。

## 解决问题：

1. 所有的样式都是由定义好的类名组合而来，可以和设计规范做到完全统一。
2. 减少自定义 Class，提高代码复用率。
3. 减少交付时的不确定因素，提高验收通过率。
4. 提升可读性。

## 一些原则：

1. 使用 CSS 原生变量。
2. 如果不必要，不写 Class。
3. 不要随意使用 `<p>` 标签， 因为 `<p>` 标签有默认的段落样式。

## 使用示例：

```html
<div className="flex-c mt-24 radius-l bg-tran-4">
    <div className="h2 text-tran-50 ">Title</div>
    <div className="p4 text-tran-30">Desc</div>
</div>
```

## 默认结构

```bash
styles
- index.scss
- custom
  - index.scss
- variables
  - base.scss
  - custom.scss
- variants
  - base.scss
  - custom.scss
```

## 2. 说明

```bash
styles
- index.scss（默认入口文件，只负责引用，不写样式）
- custom（自定义样式目录）
  - index.scss（主文件，负责引用其它文件，可写样式）
  - ...（按模块分文件写对应样式）
- variables（变量目录）
  - base.scss（默认变量，通用）
  - custom.scss（通过引用默认变量定义的自定义变量，不通用）
- variants（样式目录）
  - base.scss（默认样式，通用）
  - custom.scss（自定义样式，通常是一些特定用法的 Class，不通用）
```

## 3. 例子

### 示例：入口文件

```bash
styles
- index.scss
```

```javascript
@import "./custom/index.scss";
@import "./variables/base.scss";
@import "./variables/custom.scss";
@import "./variants/base.scss";
@import "./variants/custom.scss";
```

### 示例：自定义样式主文件

```bash
custom
- index.scss
```

```javascript
@import './format.scss';
@import './shadowMenu.scss';
@import './layout.scss';
@import './form.scss';
@import './animation.scss';
@import './highlight.scss'
...
```

### 示例：variables - base

```bash
- variables（变量目录）
  - base.scss（默认变量，可以通用）
```

```css
:root {
    --color-tran-4: rgba(255, 255, 255, 0.04);
    --color-tran-6: rgba(255, 255, 255, 0.06);
    --color-tran-8: rgba(255, 255, 255, 0.08);
    --color-tran-12: rgba(255, 255, 255, 0.12);
    --color-tran-18: rgba(255, 255, 255, 0.18);
    --color-tran-30: rgba(255, 255, 255, 0.3);
    --color-tran-50: rgba(255, 255, 255, 0.5);
    --color-tran-70: rgba(255, 255, 255, 0.7);
    --color-tran-90: rgba(255, 255, 255, 0.9);
    ...
}
```

### 示例：variables - custom

```bash
- variables（变量目录）
  - custom.scss（通过引用默认变量定义的自定义变量，不通用）
```

```css
:root {
    --color-main: var(--color-gray-7);
    --color-text: var(--color-tran-90);
    --color-background: var(--color-tran-6);

    --border-white: var(--color-tran-6);

    --color-tab-text: var(--color-tran-50);
    --color-tab-text-hover: var(--color-tran-70);
    --color-tab-text-active: var(--color-tran-90);

    --color-tab-underline-active: var(--color-tran-90);
}
```

### 示例：variants - base

```bash
- variants（样式目录）
  - base.scss（默认样式，可以通用）
```

```css
.text-tran-4 {
  color: var(--color-tran-4);
}
.text-tran-6 {
  color: var(--color-tran-6);
}
.text-tran-8 {
  color: var(--color-tran-8);
}
.text-tran-12 {
  color: var(--color-tran-12);
}
.text-tran-30 {
  color: var(--color-tran-30);
}
.text-tran-50 {
  color: var(--color-tran-50);
}
.text-tran-70 {
  color: var(--color-tran-70);
}
.text-tran-90 {
  color: var(--color-tran-90);
}
...
```

### 示例：variants - custom

```bash
- variants（样式目录）
  - custom.scss（自定义样式，通常是一些特定用法的 Class，不通用）
```

```css
.border-b-block {
  box-shadow: inset 0px -1px 0px var(--border-black);
}
.border-b-wrap {
  box-shadow: inset 0px -1px 0px var(--border-white);
}
.input-focus {
  box-shadow: 0 0 0 1px var(--color-focus-border) inset;
}
```

## 需要继续思考

1. 如何复用多个类名的集合？
2. 是否需要 VSCode 插件来提示和自动补全默认类名
