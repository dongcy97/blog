---
outline: 2
title: pinia
desc: pinia 介绍
tags: vue
order: 3
updateTime: '2025-04-08 23:37'
---

## Pinia 介绍

### 是什么

全局状态管理工具

Pinia.js 有如下特点：

- 完整的 ts 的支持；

- 足够轻量，压缩后的体积只有1kb左右;
- 去除 mutations，只有 state，getters，actions；
- actions 支持同步和异步；
- 代码扁平化没有模块嵌套，只有 store 的概念，store 之间可以自由使用，每一个store都是独立的
- 无需手动添加 store，store 一旦创建便会自动添加；
- 支持Vue3 和 Vue2

### 使用

引入注册vue3

```ts
import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'

const pinia = createPinia()
let app = createApp(App)
app.use(pinia)
app.mount('#app')
```

引入注册vue2

如果你使用的是 Vue 2，你还需要安装一个插件，并在应用的根部注入创建的 `pinia`：

```ts
import { createPinia, PiniaVuePlugin } from 'pinia'

Vue.use(PiniaVuePlugin)
const pinia = createPinia()

new Vue({
  el: '#app',
  // other options...
  // ...
  // note the same `pinia` instance can be used across multiple Vue apps on
  // the same page
  pinia
})
```

## 初始化仓库

**新建一个文件夹**

**新建文件[name].ts**

**定义仓库Store**

```ts
import { defineStore } from 'pinia'
```

**我们需要知道存储是使用定义的`defineStore()`，并且它需要一个唯一的名称，作为第一个参数传递**

我这儿名称抽离出去了

新建文件store-namespace/index.ts

```ts
export const enum Names {
  Test = 'TEST'
}
```

store 引入

```ts
import { defineStore } from 'pinia'
import { Names } from './store-namespace'

export const useTestStore = defineStore(Names.Test, {})
```

这个*名称*，也称为*id*，是必要的，Pania 使用它来将`store`连接到 [devtools](https://so.csdn.net/so/search?q=devtools&spm=1001.2101.3001.7020)。将返回的函数命名为*use...*是可组合项之间的约定，以使其使用习惯

**定义值**

**State 箭头函数 返回一个对象 在对象里面定义值**

```ts
import { defineStore } from 'pinia'
import { Names } from './store-namespce'

export const useTestStore = defineStore(Names.Test, {
  state: () => {
    return {
      current: 1
    }
  },
  //类似于computed 可以帮我们去修饰我们的值
  getters: {},
  //可以操作异步 和 同步提交state
  actions: {}
})
```

## defineStore

### Option Store

与 Vue 的选项式 API 类似，我们也可以传入一个带有 `state`、`actions` 与 `getters` 属性的 Option 对象

```ts
export const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0 }),
  getters: {
    double: (state) => state.count * 2
  },
  actions: {
    increment() {
      this.count++
    }
  }
})
```

你可以认为 `state` 是 store 的数据 (`data`)，`getters` 是 store 的计算属性 (`computed`)，而 `actions` 则是方法 (`methods`)。

为方便上手使用，Option Store 应尽可能直观简单。

### Setup Store

也存在另一种定义 store 的可用语法。与 Vue 组合式 API 的 [setup 函数](https://cn.vuejs.org/api/composition-api-setup.html) 相似，我们可以传入一个函数，该函数定义了一些响应式属性和方法，并且返回一个带有我们想暴露出去的属性和方法的对象。

```ts
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})
```

在 _Setup Store_ 中：

- `ref()` 就是 `state` 属性
- `computed()` 就是 `getters`
- `function()` 就是 `actions`

注意，要让 pinia 正确识别 `state`，你**必须**在 setup store 中返回 **`state` 的所有属性**。这意味着，你不能在 store 中使用**私有**属性。不完整返回会影响 [SSR](https://pinia.vuejs.org/zh/cookbook/composables.html) ，开发工具和其他插件的正常运行。

## state

### State 是允许直接修改值的

```ts
import { userStore } from '../../store'
let user = userStore()
user.name = '杜甫'
```

### 批量修改State的值

```ts
import { userStore } from '../../store'
let user = userStore()
user.$patch({ name: '杜甫' })
```

### 批量修改函数形式

```ts
import { userStore } from '../../store'
let user = userStore()
user.$patch((state) => (state.name = '杜甫'))
```

### 通过原始对象修改整个实例

`$state`您可以通过将store的属性设置为新对象来替换store的整个状态

缺点就是必须修改整个对象的所有属性

```ts
import { userStore } from '../../store'
let user = userStore()
user.$state = { name: '杜甫' }
```

### 通过actions修改

```ts
import { userStore } from '../../store'
let user = userStore()
user.setName('杜甫') //需要在action定义方法setName
```

## 解构store

### 是什么

在[Pinia](https://so.csdn.net/so/search?q=Pinia&spm=1001.2101.3001.7020)是不允许直接解构是会失去响应性的

```ts
const Test = useTestStore()
const { current, name } = Test
console.log(current, name)
```

差异对比

修改Test current [解构](https://so.csdn.net/so/search?q=解构&spm=1001.2101.3001.7020)完之后的数据不会变

而源数据是会变的

```vue
<template>
  <div>origin value {{ Test.current }}</div>
  <div>
    pinia:{{ current }}--{{ name }}
    change :
    <button @click="change">change</button>
  </div>
</template>

<script setup lang="ts">
import { useTestStore } from './store'

const Test = useTestStore()

const change = () => {
  Test.current++
}

const { current, name } = Test

console.log(current, name)
</script>

<style></style>
```

解决方案可以使用 storeToRefs

```ts
import { storeToRefs } from 'pinia'

const Test = useTestStore()

const { current, name } = storeToRefs(Test)
```

## actions

支持同步异步

同步 直接调用即可

异步 可以结合async await 修饰

```ts
actions: {
        // 同步
        setName(val) {
            this.name = val
        },
        setRoutes(val) {
            this.routes = val
        },
        // 异步
        async setAge(val) {
            let res = await age(val)
            this.age = res
        }
    }
```

## getters

使用[箭头函数](https://so.csdn.net/so/search?q=箭头函数&spm=1001.2101.3001.7020)不能使用this this指向已经改变指向undefined 修改值请用state

主要作用类似于computed 数据修饰并且有缓存

```ts
    getters:{
       newPrice:(state)=>  `$${state.user.price}`
    },
```

普通函数形式可以使用this

```ts
getters:{
   newCurrent ():number {
       return ++this.current
   }
},
```

## API

### $reset

重置`store`到他的初始状态

将会把state所有值 重置回 原始状态

```ts
import { userStore } from '../../store'
let user = userStore()
const reset = () => {
  user.$reset()
}
```

### $subscribe

订阅state的改变

类似于Vuex 的abscribe 只要有state 的变化就会走这个函数

```ts
import { userStore } from '../../store'
let user = userStore()
//$subscribe 观察state中值的变化
user.$subscribe(
  (args, state) => {
    console.log('args', args)
    console.log('state', state)
  },
  {
    detached: true, //为true时组件销毁了事件也会监听
    deep: true,
    flush: 'post'
  }
)
```

### $onAction

只要有actions被调用就会走这个函数

第二个参数为true时组件销毁了事件也会监听

```ts
import { userStore } from '../../store'
let user = userStore()
//$onAction,第二个参数为true时组件销毁了事件也会监听
user.$onAction((args) => {
  args.after(() => {
    console.log('我是最后走的after')
  })
  console.log(args)
}, true)
```

## pinia 插件

### 是什么

由于有了底层 API 的支持，Pinia store 现在完全支持扩展。以下是你可以扩展的内容：

- 为 store 添加新的属性
- 定义 store 时增加新的选项
- 为 store 增加新的方法
- 包装现有的方法
- 改变甚至取消 action
- 实现副作用，如[本地存储](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- **仅**应用插件于特定 store

插件是通过 `pinia.use()` 添加到 pinia 实例的。最简单的例子是通过返回一个对象将一个静态属性添加到所有 store。

```ts
import { createPinia } from 'pinia'

// 创建的每个 store 中都会添加一个名为 `secret` 的属性。
// 在安装此插件后，插件可以保存在不同的文件中
function SecretPiniaPlugin() {
  return { secret: 'the cake is a lie' }
}

const pinia = createPinia()
// 将该插件交给 Pinia
pinia.use(SecretPiniaPlugin)

// 在另一个文件中
const store = useStore()
store.secret // 'the cake is a lie'
```

`pinia` 和 `vuex` 都有一个通病 页面刷新状态会丢失

我们可以写一个pinia 插件缓存他的值

插件只会应用于**在 `pinia` 传递给应用后**创建的 store，否则它们不会生效。

```ts
import { userStore } from '../../store'
let user = userStore() //应用后创建的 store
```

```ts
import { toRaw } from 'vue'
import { userStore } from '../../store/index.ts'
const __piniaKey__ = 'dcy'
interface Option {
  key?: string
}
export default (option: Option) => {
  //将函数返回给pinia  让pinia  调用 注入 context
  return (context) => {
    const { store } = context
    const data = getStorage(`${option.key ?? __piniaKey__}-${store.$id}`)
    //store中state的值发生变化执行subscribe回调
    store.$subscribe(() => {
      setStorage(`${option.key ?? __piniaKey__}-${store.$id}`, toRaw(store.$state))
    })
    //返回值覆盖pinia的store原始值
    return {
      ...data
    }
  }
}
const setStorage = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value))
}
export const removeStorage = (option: Option) => {
  const store = userStore()
  localStorage.removeItem(`${option.key ?? __piniaKey__}-${store.$id}`)
}
const getStorage = (key: string) => {
  return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : {}
}
```

```ts
//引入自定义数据持久化 piniaPlugin
import piniaPlugin from './utils/persistence'
//引入pinia vue3是createPinia vue2是PiniaPlugin
import { createPinia } from 'pinia'
const store = createPinia()
// store中的插件函数返回的对象会复制合并到store对象的state中去
store.use(
  piniaPlugin({
    key: 'pinia'
  })
)
```
