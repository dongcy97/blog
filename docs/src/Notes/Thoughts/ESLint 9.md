---
outline: deep
desc: ESLint 9.x Flat Config 完全指南
tags: ESLint
order: 1
updateTime: '2025-03-22 10:00'
---

## 基本概念

ESLint 9.x 引入了全新的 Flat Config 系统，相比传统的 `.eslintrc.*` 配置，它具有以下特点：

- 使用 `eslint.config.js` 作为配置文件

- 采用数组形式组织配置

- 支持 ESM 模块导入导出

- 更清晰的配置结构和更好的性能

## 配置文件结构

基本结构是一个导出的数组，每个元素为一个配置对象：

```javascript
// eslint.config.js
import js from '@eslint/js'

export default [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    rules: {
      semi: ['error', 'always']
    }
  }
]
```

每个配置对象按顺序应用，后面的配置会覆盖前面的配置

## 配置属性详解

### files

指定配置适用的文件范围，使用 glob 模式：

```javascript
{
  files: ['**/*.js', '**/*.ts', 'src/**/*.jsx']
}
```

特殊情况：

- 如果不指定 files，配置将应用于所有文件
- 可以使用否定模式：['**/*.js', '!**/*.test.js']

### ignores

指定要忽略的文件，也使用 glob 模式：

```javascript
{
  ignores: [
    '**/node_modules/**',
    '**/dist/**',
    '**/build/**',
    '**/.vitepress/cache/**',
    '**/coverage/**'
  ]
}
```

注意：

- ignores 优先级高于 files
- 可以创建一个只包含 ignores 的配置对象，它将应用于所有其他配置

### languageOptions

配置解析器和语言环境：

```javascript
{
  languageOptions: {
    // 指定解析器
    parser: tsParser,

    // 解析器选项
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      project: './tsconfig.json',
      ecmaFeatures: {
        jsx: true
      },
      extraFileExtensions: ['.vue']
    },

    // 全局变量
    globals: {
      // 浏览器环境
      window: 'readonly',
      document: 'readonly',
      navigator: 'readonly',
      fetch: 'readonly',

      // Node.js 环境
      process: 'readonly',
      __dirname: 'readonly',

      // 框架特定
      defineProps: 'readonly',  // Vue
      React: 'readonly',        // React

      // 测试环境
      describe: 'readonly',
      it: 'readonly',
      expect: 'readonly'
    },

    // ECMAScript 版本
    ecmaVersion: 2022,

    // 源码类型
    sourceType: 'module'
  }
}
```

### plugins

引入并配置插件：

```javascript
{
  plugins: {
    '@typescript-eslint': tsPlugin,
    'vue': vuePlugin,
    'react': reactPlugin,
    'import': importPlugin,
    // 自定义名称
    'my-custom-name': somePlugin
  }
}
```

注意：

- 插件名称作为键，插件对象作为值
- 可以为插件指定自定义名称
- 插件规则使用时需要带上插件前缀，如 '@typescript-eslint/no-explicit-any'

### rules

配置 ESLint 规则：

```javascript
{
  rules: {
    // 基础规则
    'semi': ['error', 'always'],
    'quotes': ['error', 'single'],
    'no-console': 'warn',
    'no-unused-vars': 'error',

    // 插件规则
    '@typescript-eslint/no-explicit-any': 'warn',
    'vue/attributes-order': 'off',
    'react/jsx-uses-react': 'error',

    // 复杂配置
    'indent': ['error', 2, {
      SwitchCase: 1,
      VariableDeclarator: 'first'
    }]
  }
}
```

规则级别：

- 'off' 或 0 - 关闭规则
- 'warn' 或 1 - 警告级别（不影响退出码）
- 'error' 或 2 - 错误级别（触发非零退出码）

### settings

在不同规则之间共享设置：

```javascript
{
  settings: {
    'import/resolver': {
      typescript: {},
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx']
      }
    },
    'react': {
      version: 'detect',
      pragma: 'React'
    },
    'vue': {
      version: 3
    },
    // 自定义设置
    'myCustomSetting': {
      option1: true
    }
  }
}
```

### linterOptions

配置 ESLint 检查器行为：

```javascript
{
  linterOptions: {
    // 报告未使用的禁用指令
    reportUnusedDisableDirectives: true,

    // 禁止内联配置
    noInlineConfig: false,

    // 报告未使用的 eslint-enable 指令
    reportUnusedEslintIgnores: true
  }
}
```

### processor

指定文件处理器：

```javascript
{
  files: ['**/*.md'],
  processor: mdProcessor
}
```

处理器可以从一种文件类型中提取代码块，然后让 ESLint 对这些代码块进行检查。

## 常用配置示例

### JavaScript 项目

```javascript
import js from '@eslint/js'

export default [
  js.configs.recommended,
  {
    ignores: ['**/node_modules/**', '**/dist/**']
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module'
    },
    rules: {
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
      'no-console': 'warn'
    }
  }
]
```

### TypeScript 项目

```javascript
import js from '@eslint/js'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'

export default [
  js.configs.recommended,
  {
    ignores: ['**/node_modules/**', '**/dist/**']
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json'
      }
    },
    plugins: {
      '@typescript-eslint': tsPlugin
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'error'
    }
  }
]
```

### Vue 项目

```javascript
import js from '@eslint/js'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import vuePlugin from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'

export default [
  js.configs.recommended,
  {
    ignores: ['**/node_modules/**', '**/dist/**']
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: 'latest',
        sourceType: 'module',
        extraFileExtensions: ['.vue']
      },
      globals: {
        defineProps: 'readonly',
        defineEmits: 'readonly',
        defineExpose: 'readonly',
        withDefaults: 'readonly'
      }
    },
    plugins: {
      vue: vuePlugin
    },
    rules: {
      ...vuePlugin.configs.recommended.rules,
      'vue/attributes-order': 'error',
      'vue/require-default-prop': 'error',
      'vue/multi-word-component-names': 'off'
    }
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser
    },
    plugins: {
      '@typescript-eslint': tsPlugin
    },
    rules: {
      ...tsPlugin.configs.recommended.rules
    }
  }
]
```

### React 项目

```javascript
import js from '@eslint/js'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'

export default [
  js.configs.recommended,
  {
    ignores: ['**/node_modules/**', '**/dist/**']
  },
  {
    files: ['**/*.jsx', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        React: 'readonly',
        JSX: 'readonly'
      }
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react-hooks/exhaustive-deps': 'warn'
    },
    settings: {
      react: {
        version: 'detect'
      }
    }
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser
    },
    plugins: {
      '@typescript-eslint': tsPlugin
    },
    rules: {
      ...tsPlugin.configs.recommended.rules
    }
  }
]
```

### 混合项目

```javascript
import js from '@eslint/js'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import vuePlugin from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'
import reactPlugin from 'eslint-plugin-react'

export default [
  js.configs.recommended,
  {
    ignores: ['**/node_modules/**', '**/dist/**', '**/build/**']
  },

  // JavaScript 基础配置
  {
    files: ['**/*.js', '**/*.jsx'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module'
    },
    rules: {
      semi: ['error', 'always'],
      quotes: ['error', 'single']
    }
  },

  // TypeScript 配置
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json'
      }
    },
    plugins: {
      '@typescript-eslint': tsPlugin
    },
    rules: {
      ...tsPlugin.configs.recommended.rules
    }
  },

  // Vue 配置
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        extraFileExtensions: ['.vue']
      }
    },
    plugins: {
      vue: vuePlugin
    },
    rules: {
      ...vuePlugin.configs.recommended.rules
    }
  },

  // React 配置
  {
    files: ['**/*.jsx', '**/*.tsx'],
    plugins: {
      react: reactPlugin
    },
    rules: {
      ...reactPlugin.configs.recommended.rules
    },
    settings: {
      react: {
        version: 'detect'
      }
    }
  },

  // 测试文件配置
  {
    files: ['**/*.test.js', '**/*.spec.js', '**/*.test.ts', '**/*.spec.ts'],
    languageOptions: {
      globals: {
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        jest: 'readonly'
      }
    },
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'off'
    }
  }
]
```

## 迁移指南

从 ESLint 8.x 迁移到 ESLint 9.x 的主要步骤：

1. 更新依赖

```sh
   npm install eslint@latest @eslint/js --save-dev
```

2. 创建新配置文件

- 创建 eslint.config.js 文件
- 移除 .eslintrc.\* 文件

3. 转换配置

- extends → 导入并展开配置
- env → languageOptions.globals
- parserOptions → languageOptions.parserOptions
- plugins → 导入并在 plugins 对象中使用

4. 文件匹配

- 使用 files 和 ignores 替代 overrides

5. 插件规则

- 直接从插件导入推荐配置：...pluginName.configs.recommended.rules

## 常见问题与解决方案

1. 解析器错误
   如果遇到 "Parsing error" 或 "Unexpected token"：

```js
// Vue 文件解析错误解决方案
{
  files: ['**/*.vue'],
  languageOptions: {
    parser: vueParser,
    parserOptions: {
      parser: tsParser,  // 用于解析 <script> 标签中的内容
      extraFileExtensions: ['.vue']
    }
  }
}
```

2. 插件重复定义
   如果遇到 "Cannot redefine plugin" 错误：

```js
// 错误示例
export default [
  ...compat.extends('plugin:@typescript-eslint/recommended'),
  {
    plugins: {
      '@typescript-eslint': tsPlugin  // 重复定义
    }
  }
]

// 正确示例
export default [
  {
    plugins: {
      '@typescript-eslint': tsPlugin
    },
    rules: {
      ...tsPlugin.configs.recommended.rules
    }
  }
]
```

3. 全局变量未定义
   添加适当的全局变量定义：

```js
{
  languageOptions: {
    globals: {
      // 浏览器环境
      window: 'readonly',
      document: 'readonly',

      // Node.js 环境
      process: 'readonly',

      // 框架特定
      Vue: 'readonly',
      React: 'readonly'
    }
  }
}
```

4. 规则冲突
   处理规则冲突：

```js
{
  rules: {
    // 禁用基础规则，启用 TypeScript 版本
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'error',

    // 禁用冲突的规则
    'react/prop-types': 'off'  // 使用 TypeScript 类型时
  }
}
```

## 性能优化

提高 ESLint 检查性能的技巧：

1. 精确的文件匹配

```js
   {
     files: ['src/**/*.js'],  // 比 '**/*.js' 更精确
   }
```

2. 缓存检查结果

```shell
 eslint --cache .
```

3. 并行检查

```shell
eslint --parallel .
```

4. 忽略大型文件

```js
{
  ignores: ['**/node_modules/**', '**/dist/**', '**/build/**']
}
```

5. 减少规则数量

- 只启用真正需要的规则
- 考虑在开发环境禁用计算密集型规则

## 参考资料

ESLint 官方文档
ESLint Flat Config 迁移指南
TypeScript ESLint
ESLint Plugin Vue
ESLint Plugin React

通过本指南，您应该能够全面了解 ESLint 9.x 的 Flat Config 系统，并能够为各种项目类型创建适合的配置。随着项目的发展，您可以根据需要调整和扩展这些配置。
