---
outline: deep
desc: 静态站点生成器
tags: SSG
order: 1
updateTime: '2025-03-22 20:03'
---

## VitePress

前身 VuePress

VuePress VitePress Rspress 静态站点生成器 Static Site Generator (SSG)

作用于项目(博客，营销页面，档案，文档)

## 怎么用？

安装

```sh
npm i vitepress -D
```

初始化

```sh
npx vitepress init
```

## vitepress 特有的 formatter

规则必须是三个- 必须写在头部

```md
---
prev:
text: "学习笔记"
link: /Notes/Learning/

next:
text: "网络请求"
link: /Notes/Learning/network

---
```

config 配置项：docFooter
作用：修改页脚

## SEO(搜索引擎优化)

TDK title description keywords
爬虫机器人会抓取网站的这三个值

```md
---
head:
  - - meta
    - name: title
      content: Runtime API Examples
  - - meta
    - name: description
      content: Examples of using the runtime APIs provided by VitePress
---
```

## 最后修改时间

这个必须配合 git 才有效 git 提交这个文件的时间 它就会被列为最后修改时间

```js
lastUpdated: {
    text: '最后更改时间',
    formatOptions: {
        dateStyle: 'full',
        timeStyle: 'short'
    }
}
```

## 部署静态网站

例如 GitHub

1. 打开仓库的 setting
2. 点击 pages
3. 选择 branch
4. 选择分支 选择 docs 点击 save 保存
