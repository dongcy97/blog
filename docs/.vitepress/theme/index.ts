/**
 * 这是VitePress主题的入口文件：
 * 继承默认主题
 * 导入所有CSS样式文件
 * 注册自定义组件（LinkCard和HText）
 * 配置图片点击放大功能（medium-zoom）
 */
import DefaultTheme from 'vitepress/theme'
import { Theme, useRoute } from 'vitepress'
import './tailwind.css' // 导入TailwindCSS样式文件
import './var.css' // 导入自定义CSS样式文件
import './article.css' // 导入自定义CSS样式文件
import './print.css' // 导入自定义CSS样式文件

import LinkCard from '../components/LinkCard.vue'
import HText from '../components/HText.vue'
import mediumZoom from 'medium-zoom' // 导入mediumZoom库
import { onMounted, watch, nextTick } from 'vue' // 导入vue的生命周期钩子函数

export default {
  extends: DefaultTheme,
  enhanceApp(ctx) {
    // 在应用中注册组件
    ctx.app.component('LinkCard', LinkCard)
    ctx.app.component('HText', HText)
  },

  setup() {
    const route = useRoute()
    // 初始化mediumZoom
    const initZoom = () => {
      // 设置图片点击放大功能
      mediumZoom('.main img', { background: 'var(--vp-c-bg)', margin: 24 }) //
    }
    onMounted(() => initZoom())
    // 监听路由变化，当路由变化时重新初始化mediumZoom
    watch(
      () => route.path,
      () => nextTick(() => initZoom())
    )
  }
} satisfies Theme
