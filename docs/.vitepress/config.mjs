import { defineConfig } from 'vitepress'
import { fileURLToPath, URL } from 'node:url'
import { getSidebar } from './utils/getSidebar'

export default defineConfig({
  title: "dongcy's Blog",
  description:
    "dongcy's tech blog: An undergraduate's journey through frontend development, sharing insights, tips, and experiences in web technologies.",
  srcDir: './src', // 根目录
  base: '/blog/', // 部署到github 仓库的名字
  head: [['link', { rel: 'icon', href: `/blog/logo.png` }]],
  themeConfig: {
    logo: `/blog/logo.png`,
    // 顶部导航栏
    nav: [
      { text: '👋 AboutMe', link: '/AboutMe.md' },
      { text: '💭 Blogs', link: '/Notes/index.md' },
      { text: '🦄 Projects', link: '/Projects.md' },
      { text: '👫 Friends', link: '/Friends.md' }
    ],

    // 文章页面左侧导航
    // 对于以 /Notes/ 开头的路由（页面路径），
    // 使用 getSidebar() 函数来自动生成侧边栏。
    sidebar: {
      '/Notes/': getSidebar('/docs/src', '/Notes/')
    },
    //修改页脚
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },
    //搜索
    search: {
      provider: 'local'
    },
    //最后更新时间 git配合使用
    lastUpdated: {
      text: '最后更改时间',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'short'
      }
    },
    //社交链接
    socialLinks: [{ icon: 'github', link: 'https://github.com/dongcy97' }],
    // 首页底部版权声明
    footer: {
      copyright: 'Copyright © 2025-present dongcy97'
    },
    // 文章内导航栏标题
    outlineTitle: '导航栏'
  },
  vite: {
    css: {
      // 当使用 package.json 配置时，这里可以省略 postcss 配置
      // 因为 PostCSS 会自动读取 package.json 中的配置
      postcss: './postcss.config.js'
    },
    resolve: {
      alias: [
        {
          find: /^.*\/VPDocFooterLastUpdated\.vue$/,
          replacement: fileURLToPath(new URL('./components/UpdateTime.vue', import.meta.url))
        },
        {
          find: /^.*\/VPFooter\.vue$/,
          replacement: fileURLToPath(new URL('./components/Footer.vue', import.meta.url))
        }
      ]
    }
  },
  // markdown math公式
  markdown: {
    math: true
  }
})
