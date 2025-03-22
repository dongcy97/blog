// 导入eslint的js配置
import js from '@eslint/js'
// 导入typescript的解析器和插件
import * as tsParser from '@typescript-eslint/parser'
import * as tsPlugin from '@typescript-eslint/eslint-plugin'
import vuePlugin from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'

// 导出默认配置
export default [
  // 全局基础配置
  {
    ignores: ['**/node_modules/**', '**/dist/**', '**/.vitepress/cache/**', '**/.vitepress/dist/**']
  },

  // JavaScript 配置
  js.configs.recommended,

  // Vue 文件配置
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        parser: tsParser,
        extraFileExtensions: ['.vue']
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
        HTMLElement: 'readonly',
        requestAnimationFrame: 'readonly',
        fetch: 'readonly',
        console: 'readonly'
      }
    },
    plugins: {
      vue: vuePlugin
    },
    rules: {
      ...vuePlugin.configs.recommended.rules,
      'vue/attributes-order': 'off'
    }
  },

  // TypeScript 配置
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
        process: 'readonly',
        console: 'readonly'
      }
    },
    plugins: {
      '@typescript-eslint': tsPlugin
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'warn'
    }
  },

  // JavaScript 文件配置
  {
    files: ['**/*.js'],
    languageOptions: {
      globals: {
        process: 'readonly',
        console: 'readonly'
      }
    }
  },

  // Markdown 文件配置 - 完全忽略
  {
    files: ['**/*.md'],
    ignores: ['**/*.md']
  }
]
