/** @type {import('tailwindcss').Config} */
export default {
  // 设置内容路径 作用是告诉TailwindCSS从哪些文件中提取样式
  content: ['./docs/.vitepress/**/*.{vue,js}', './docs/**/*.md'],
  theme: {
    extend: {
      colors: {
        VPLight: '#3451b2',
        VPDark: '#a8b1ff'
      }
    }
  },
  plugins: [],
  // 设置暗模式
  darkMode: 'class'
}
