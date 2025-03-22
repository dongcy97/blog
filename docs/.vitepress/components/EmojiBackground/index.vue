<template>
  <!-- 绝对定位的背景容器，覆盖全屏，深色/浅色主题适配 -->
  <div
    ref="emojiBgRef"
    class="absolute left-0 top-0 -z-[1] flex h-screen w-full flex-col gap-1 overflow-hidden dark:bg-slate-900 bg-slate-50/95"
  >
    <!-- 遍历渲染的表情行 -->
    <div
      class="emoji-line leading-10"
      v-for="(line, lineIndex) in renderEmojis"
      :key="lineIndex"
      :style="getRadomStyle()"
    >
      <!-- 每行中的表情 -->
      <span class="text-3xl opacity-20" v-for="(emoji, emojiIndex) in line" :key="emojiIndex">
        {{ emoji }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CSSProperties, onMounted, ref } from 'vue'
import emojiJson from './emoji-compact.json'

// 从 JSON 文件加载表情列表
const emojis: string[] = emojiJson

const useEmojiBackground = () => {
  // 背景容器的引用
  const emojiBgRef = ref<HTMLElement | null>(null)
  // 存储渲染的表情二维数组
  const renderEmojis = ref<string[][]>([])

  // 生成随机动画样式
  const getRadomStyle = () => {
    return {
      // 随机动画持续时间（60-120秒）
      animationDuration: `${Math.random() * 60 + 60}s`,
      // 随机动画方向
      animationDirection: Math.random() > 0.5 ? 'reverse' : 'normal'
    } as CSSProperties
  }

  // 随机选择一个表情
  const randomEmoji = () => {
    const index = Math.floor(Math.random() * emojis.length)
    return emojis.at(index)!
  }

  // 生成指定数量的随机表情
  const randomEmojis = (len: number) => {
    return new Array(len).fill(0).map(() => randomEmoji())
  }

  // 计算并渲染表情背景
  const getRenderEmojis = () => {
    // 获取容器高度
    const height = emojiBgRef.value?.clientHeight || 0
    // 计算可容纳的行数
    const countLines = Math.max(1, Math.floor(height / 40))
    // 计算每行的表情数量
    const emojiPerLine = Math.max(1, Math.floor(window.innerWidth / 40) * 2)
    // 分批渲染的间隔
    const interval = 5

    // 递归分块渲染表情
    const renderChunk = (start: number, end: number) => {
      // 确保 start 和 end 在有效范围内
      if (start >= countLines) return

      // 调整 end 不超过总行数
      const adjustedEnd = Math.min(end, countLines)

      // 生成一个表情块
      const chunk = new Array(adjustedEnd - start).fill(0).map(() => randomEmojis(emojiPerLine))
      // 追加到渲染数组
      renderEmojis.value = [...renderEmojis.value, ...chunk]

      // 使用 requestAnimationFrame 分批渲染，提高性能
      if (adjustedEnd < countLines) {
        requestAnimationFrame(() => {
          renderChunk(adjustedEnd, Math.min(adjustedEnd + interval, countLines))
        })
      }
    }

    // 重置渲染数组并开始渲染
    renderEmojis.value = []
    renderChunk(0, interval)
  }

  return { renderEmojis, getRenderEmojis, emojiBgRef, getRadomStyle }
}

// 解构并使用 hook
const { renderEmojis, getRenderEmojis, emojiBgRef, getRadomStyle } = useEmojiBackground()

// 组件挂载时触发渲染
onMounted(() => {
  getRenderEmojis()
})
</script>

<style scoped>
/* 定义表情移动动画 */
@keyframes move {
  0% {
    transform: translateX(0);
  }

  50% {
    transform: translateX(-90%);
  }

  100% {
    transform: translateY(0);
  }
}

/* 表情行样式 */
.emoji-line {
  white-space: nowrap;
  animation: move 60s linear infinite;
}
</style>
