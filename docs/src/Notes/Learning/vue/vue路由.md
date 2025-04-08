---
outline: 2
title: vue路由
desc: vue路由
tags: vue
order: 2
updateTime: '2025-04-08 23:37'
---

## 路由介绍

### 是什么

因为vue是单页应用不会有那么多html 让我们跳转 所有要使用路由做页面的跳转

Vue 路由允许我们通过不同的 URL 访问不同的内容。通过 Vue 可以实现多视图的单页Web应用

### 安装

使用Vue3 安装对应的router4版本

使用Vue2安装对应的router3版本

## 基本路由

### router-link

请注意，我们没有使用常规的 `a` 标签，而是使用一个自定义组件 `router-link` 来创建链接。这使得 Vue Router 可以在不重新加载页面的情况下更改 URL，处理 URL 的生成以及编码。我们将在后面看到如何从这些功能中获益。

### router-view

`router-view` 将显示与 url 对应的组件。你可以把它放在任何地方，以适应你的布局

### 用例

```html
<template>
  <div>
    <h2>我是父路由</h2>
    <!-- <router-view></router-view> -->
    <h2>声明式导航</h2>
    <!-- <RouterLink :to="{ name: 'Login' }">login</RouterLink> -->
    <RouterLink to="/app/login">login</RouterLink>
    <RouterLink style="margin-left: 10px;" to="/app/reg">reg</RouterLink>
    <RouterLink style="margin-left: 10px;" to="/app/home">home</RouterLink>
    <h2>编程式导航</h2>
    <button @click="toPage('login')">Login</button>&nbsp;
    <button @click="toPage('reg')">Reg</button>
    <!-- 可以放在组件任意位置 -->
    <!-- 子路由呈现位置 -->
    <router-view></router-view>
    <!-- 命名视图 -->
    <RouterView name="test"></RouterView>
  </div>
</template>
<script setup lang="ts">
  import { useRouter } from 'vue-router'
  /**
   * replace 链接式导航 添加上就会无历史记录
   * router.replace(url) 编程式导航 无历史记录方式
   * router.go router.back 历史记录前进后退
   */
  const router = useRouter()
  const toPage = (url: string) => {
    // 字符串跳转方式
    // router.push(url)
    // 对象式跳转方式
    router.push({
      path: url
    })
    // 命名式跳转方式
    // router.push({
    //     name: url
    // })
  }
</script>
<style scoped></style>
```

```ts
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
// vue3 使用createRouter vue2 是同vueRouter
// vue2 mode history vue3 createWebHistory
// 原理通过window.addEventListener('hashchange',()=>{})监听变化
// vue2 mode  hash  vue3  createWebHashHistory
// 原理通过window.addEventListener('popstate',()=>{})监听变化
// vue2 mode abstact vue3  createMemoryHistory 服务端渲染
// 子路由加/表示绝对路径 不加是相对路径

const routes: Array<RouteRecordRaw> = [
  {
    path: '/app',
    component: () => import('../components/30_router/views/app.vue'),
    alias: ['/', '/app1'], //给路由起多个名字
    // redirect: '/app/login',
    // redirect: {
    //     path:'/app/login'
    // },
    redirect: (to) => {
      console.log(to, 'to')

      // return '/app/login'
      return {
        path: '/app/login',
        query: {
          name: '长燚'
        }
      }
    },
    children: [
      {
        path: 'login',
        name: 'Login',
        component: () => import('../components/30_router/views/login.vue')
      },
      {
        // path: '/app/reg', // 子路由加 / 表示绝对路径
        path: 'reg', // 不加/ 表示相对路径
        name: 'Reg',
        component: () => import('../components/30_router/views/reg.vue')
      },
      {
        path: 'home',
        name: 'Home',
        components: {
          test: () => import('../components/30_router/views/home.vue')
        }
      },
      {
        path: 'detail/:id',
        name: 'Detail',
        component: () => import('../components/30_router/views/detail.vue')
      }
    ]
  }
]
const router = createRouter({
  history: createWebHistory(),
  routes
})
export default router
```

```ts
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
createApp(App).use(router).mount('#app')
```

## 命名路由-编程式导航

### 是什么

除了 `path` 之外，你还可以为任何路由提供 `name`。这有以下优点：

- 没有硬编码的 URL
- `params` 的自动编码/解码。
- 防止你在 url 中出现打字错误。
- 绕过路径排序（如显示一个）

```ts
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Login',
    component: () => import('../components/login.vue')
  },
  {
    path: '/reg',
    name: 'Reg',
    component: () => import('../components/reg.vue')
  }
]
```

[router-link](https://so.csdn.net/so/search?q=router-link&spm=1001.2101.3001.7020)跳转方式需要改变 变为对象并且有对应name

```html
<h1>小满最骚</h1>
<div>
  <router-link :to="{name:'Login'}">Login</router-link>
  <router-link style="margin-left:10px" :to="{name:'Reg'}">Reg</router-link>
</div>
<hr />
```

### 编程式导航

除了使用 `<router-link>` 创建 a 标签来定义导航链接，我们还可以借助 router 的[实例方法](https://so.csdn.net/so/search?q=实例方法&spm=1001.2101.3001.7020)，通过编写代码来实现。

```ts
const toPage = () => {
  // 字符串跳转方式
  // router.push('/reg')
  // 对象式跳转方式
  router.push({
    path: '/reg'
  })
  // 命名式跳转方式
  // router.push({
  //     name: 'Reg'
  // })
}
```

## 历史记录

### replace的使用

采用replace进行页面的跳转会同样也会创建渲染新的[Vue组件](https://so.csdn.net/so/search?q=Vue组件&spm=1001.2101.3001.7020)，但是在history中其不会重复保存记录，而是替换原有的vue组件；

[router-link](https://so.csdn.net/so/search?q=router-link&spm=1001.2101.3001.7020) 使用方法

replace 链接式导航 添加上就会无历史记录

```html
<router-link replace to="/">Login</router-link>
<router-link replace style="margin-left:10px" to="/reg">Reg</router-link>
```

router.replace(url) 编程式导航 无历史记录方式

```ts
import { useRouter } from 'vue-router'
const router = useRouter()

const toPage = (url: string) => {
  router.replace(url)
}
```

### 横跨历史

`router.go` `router.back` 历史记录前进后退

## 路由传参

### query路由传参

编程式导航 使用router push 或者 replace 的时候 改为对象形式新增query 必须传入一个对象

```ts
const toDetail = (item: Item) => {
  router.push({
    path: '/reg',
    query: item
  })
}
```

**接受参数**

**使用 useRoute 的 query**

```ts
import { useRoute } from 'vue-router';
const route = useRoute()

 <div>品牌：{{ route.query?.name }}</div>
 <div>价格：{{ route.query?.price }}</div>
 <div>ID：{{ route.query?.id }}</div>
```

### Params路由传参

编程式导航 使用router push 或者 replace 的时候 改为对象形式并且只能使用name，path无效，然后传入params

```ts
const toDetail = (item: Item) => {
  router.push({
    name: 'Reg',
    params: item
  })
}
```

**接受参数**

**使用 useRoute 的 params**

```ts
import { useRoute } from 'vue-router';
const route = useRoute()
<div>品牌：{{ route.params?.name }}</div>
<div>价格：{{ route.params?.price }}</div>
<div>ID：{{ route.params?.id }}</div>
```

### 动态路由传参

很多时候，我们需要将给定匹配模式的路由映射到同一个组件。例如，我们可能有一个 User 组件，它应该对所有用户进行渲染，但用户 ID 不同。在 Vue Router 中，我们可以在路径中使用一个动态字段来实现，我们称之为 路径参数

路径参数 用冒号 : 表示。当一个路由被匹配时，它的 params 的值将在每个组件

```ts
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Login',
    component: () => import('../components/login.vue')
  },
  {
    //动态路由参数
    path: '/reg/:id',
    name: 'Reg',
    component: () => import('../components/reg.vue')
  }
]
```

### query与params区别

- query 传参配置的是 path，而 params 传参配置的是name，在 params中配置 path 无效

- query 在路由配置不需要设置参数，而 params 必须设置，原因是params传参刷新会无效，但是 query 会保存传递过来的值，刷新不变
- query 传递的参数会显示在地址栏中

- 路由配置

## 嵌套路由

### 是什么

一些应用程序的 UI 由多层嵌套的组件组成。在这种情况下，URL 的片段通常对应于特定的嵌套组件结构

如你所见，`children` 配置只是另一个路由数组，就像 `routes` 本身一样。因此，你可以根据自己的需要，不断地嵌套视图

TIPS：不要忘记写router-view，每一层路由规则对应一个router-view

```ts
const routes: Array<RouteRecordRaw> = [
  {
    path: '/user',
    component: () => import('../components/footer.vue'),
    children: [
      {
        path: '',
        name: 'Login',
        component: () => import('../components/login.vue')
      },
      {
        path: 'reg',
        name: 'Reg',
        component: () => import('../components/reg.vue')
      }
    ]
  }
]
```

## 命名路由

### 是什么

命名视图可以在同一级（同一个组件）中展示更多的路由视图，而不是嵌套显示。 命名视图可以让一个组件中具有多个路由渲染出口，这对于一些特定的布局组件非常有用。 命名视图的概念非常类似于“具名插槽”，并且视图的默认名称也是 default。

一个视图使用一个组件渲染，因此对于同个路由，多个视图就需要多个组件。确保正确使用 components 配置 (带上 s)

```ts
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    components: {
      default: () => import('../components/layout/menu.vue'),
      header: () => import('../components/layout/header.vue'),
      content: () => import('../components/layout/content.vue')
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
```

对应[Router-view](https://so.csdn.net/so/search?q=Router-view&spm=1001.2101.3001.7020) 通过name 对应组件

```vue
<div>
        <router-view></router-view>
        <router-view name="header"></router-view>
        <router-view name="content"></router-view>
    </div>
```

## 重定向

### redirect

#### 字符串形式配置

访问/ 重定向到 /user （地址栏显示/,内容为/user路由的内容）

```ts
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('../components/root.vue'),
    redirect: '/user1',
    children: [
      {
        path: '/user1',
        components: {
          default: () => import('../components/A.vue')
        }
      },
      {
        path: '/user2',
        components: {
          bbb: () => import('../components/B.vue'),
          ccc: () => import('../components/C.vue')
        }
      }
    ]
  }
]
```

#### 对象形式配置

```ts
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('../components/root.vue'),
    redirect: { path: '/user1' },
    children: [
      {
        path: '/user1',
        components: {
          default: () => import('../components/A.vue')
        }
      },
      {
        path: '/user2',
        components: {
          bbb: () => import('../components/B.vue'),
          ccc: () => import('../components/C.vue')
        }
      }
    ]
  }
]
```

#### 函数模式（可以传参）

```ts
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('../components/root.vue'),
    redirect: (to) => {
      return {
        path: '/user1',
        query: to.query
      }
    },
    children: [
      {
        path: '/user1',
        components: {
          default: () => import('../components/A.vue')
        }
      },
      {
        path: '/user2',
        components: {
          bbb: () => import('../components/B.vue'),
          ccc: () => import('../components/C.vue')
        }
      }
    ]
  }
]
```

### 别名 alias

**将 `/` 别名为 `/`**root**，意味着当用户访问 `/`**root**时，URL 仍然是 `/user`，但会被匹配为用户正在访问 `/`**

```ts
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('../components/root.vue'),
    alias: ['/root', '/root2', '/root3'],
    children: [
      {
        path: 'user1',
        components: {
          default: () => import('../components/A.vue')
        }
      },
      {
        path: 'user2',
        components: {
          bbb: () => import('../components/B.vue'),
          ccc: () => import('../components/C.vue')
        }
      }
    ]
  }
]
```

## 导航守卫

### 全局前置守卫

router.beforeEach

```ts
router.beforeEach((to, from, next) => {
  console.log(to, from)
  next()
})
//每个守卫方法接收三个参数：
//to: Route， 即将要进入的目标 路由对象；
//from: Route，当前导航正要离开的路由；
//next(): 进行管道中的下一个钩子。如果全部钩子执行完了，则导航的状态就是 confirmed (确认的)。
//next(false): 中断当前的导航。如果浏览器的 URL 改变了 (可能是用户手动或者浏览器后退按钮)，那么 URL 地址会重置到 from 路由对应的地址。
//next('/') 或者 next({ path: '/' }): 跳转到一个不同的地址。当前的导航被中断，然后进行一个新的导航。
```

### 全局后置守卫

router.afterEach

```ts
router.afterEach((to, from) => {
  Vnode.component?.exposed?.endLoading()
})
```

## 路由元信息

### 是什么

通过路由记录的 `meta` 属性可以定义路由的**元信息**。使用路由元信息可以在路由中附加自定义的数据，例如：

- 权限校验标识。
- 路由组件的过渡名称。
- 路由组件持久化缓存 (keep-alive) 的相关配置。
- 标题名称

我们可以在**导航守卫**或者是**路由对象**中访问路由的元信息数据。

```ts
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/views/Login.vue'),
      meta: {
        title: '登录'
      }
    },
    {
      path: '/index',
      component: () => import('@/views/Index.vue'),
      meta: {
        title: '首页'
      }
    }
  ]
})
```

### 使用TS扩展

如果不使用扩展 将会是unknow类型

```ts
declare module 'vue-router' {
  interface RouteMeta {
    title?: string
  }
}
```

## 路由过渡动效

### 是什么

想要在你的路径组件上使用转场，并对导航进行动画处理，你需要使用 [v-slot API](https://router.vuejs.org/zh/api/#router-view-s-v-slot)：

```vue
<router-view #default="{ route, Component }">
        <transition  :enter-active-class="`animate__animated ${route.meta.transition}`">
            <component :is="Component"></component>
        </transition>
    </router-view>
```

上面的用法会对所有的路由使用相同的过渡。如果你想让每个路由的组件有不同的过渡，你可以将[元信息](https://router.vuejs.org/zh/guide/advanced/meta.html)和动态的 `name` 结合在一起，放在`<transition>` 上：

```ts
declare module 'vue-router' {
  interface RouteMeta {
    title: string
    transition: string
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/views/Login.vue'),
      meta: {
        title: '登录页面',
        transition: 'animate__fadeInUp'
      }
    },
    {
      path: '/index',
      component: () => import('@/views/Index.vue'),
      meta: {
        title: '首页！！！',
        transition: 'animate__bounceIn'
      }
    }
  ]
})
```

## 滚动行为

### 是什么

使用前端路由，当切换到新路由时，想要页面滚到顶部，或者是保持原先的滚动位置，就像重新加载页面那样。[vue-router](https://so.csdn.net/so/search?q=vue-router&spm=1001.2101.3001.7020) 可以自定义路由切换时页面如何滚动。

当创建一个 Router 实例，你可以提供一个 `scrollBehavior` 方法

```ts
const router = createRouter({
  history: createWebHistory(),
  // scrollBehavior 只能作用于html与body中出现滚动条
  scrollBehavior: (_to, _from, savePosition) => {
    // return {
    //     top:999
    // }
    if (savePosition) {
      return savePosition
    } else {
      return new Promise((r) => {
        r({
          top: 999
        })
      })
    }
  },
  routes
})
```

scrollBehavior 方法接收 to 和 from 路由对象。第三个参数 savedPosition 当且仅当 popstate 导航 (通过浏览器的 前进/后退 按钮触发) 时才可用。

scrollBehavior 返回滚动位置的对象信息，长这样：

```js
{ left: number, top: number }
```

## 动态路由

### 是什么

我们一般使用动态路由都是后台会返回一个[路由表](https://so.csdn.net/so/search?q=路由表&spm=1001.2101.3001.7020)前端通过调接口拿到后处理(后端处理路由)

主要使用的方法就是router.addRoute

### 添加路由

动态路由主要通过两个函数实现。router.addRoute() 和 router.removeRoute()。它们只注册一个新的路由，也就是说，如果新增加的路由与当前位置相匹配，就需要你用 router.push() 或 router.replace() 来手动导航，才能显示该新路由

```ts
router.addRoute({ path: '/about', component: About })
```

### 删除路由

有几个不同的方法来删除现有的路由：

通过添加一个名称冲突的路由。如果添加与现有途径名称相同的途径，会先删除路由，再添加路由：

```ts
router.addRoute({ path: '/about', name: 'about', component: About })
// 这将会删除之前已经添加的路由，因为他们具有相同的名字且名字必须是唯一的
router.addRoute({ path: '/other', name: 'about', component: Other })
```

通过调用 `router.addRoute()` 返回的回调：

```ts
const removeRoute = router.addRoute(routeRecord)
removeRoute() // 删除路由如果存在的话
```

当路由没有名称时，这很有用。

通过使用 `router.removeRoute()` 按名称删除路由：

```ts
router.addRoute({ path: '/about', name: 'about', component: About })
// 删除路由
router.removeRoute('about')
```

当路由被删除时，**所有的别名和子路由也会被同时删除**

### 查看现有路由

Vue Router 提供了两个功能来查看现有的路由：

- [router.hasRoute()](https://router.vuejs.org/zh/api/#hasroute)：检查路由是否存在。
- [router.getRoutes()](https://router.vuejs.org/zh/api/#getroutes)：获取一个包含所有路由记录的数组

**注意一个事项vite在使用动态路由的时候无法使用别名@ 必须使用相对路径**
