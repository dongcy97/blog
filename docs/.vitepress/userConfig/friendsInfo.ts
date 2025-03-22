export interface Friend {
  avatar?: string // 头像链接
  name: string // 用户 id
  link: string // 博客链接
  title?: string // 用户头衔
  tag?: string // 用户标签
  color?: string // 标签颜色
  isMe?: boolean // 是否是自己
}
/**
 * TODO: 缺项处理
 * 在此处填写你的友情链接
 */
export const friendsInfo: Friend[] = [
  {
    avatar: 'https://avatars.githubusercontent.com/u/49082837?v=4',
    name: 'ZbWeR',
    title: 'Blog模板作者 🪁',
    link: 'https://blog.zbwer.work/',
    tag: '电子科技大学👨‍🎓',
    color: 'indigo'
  },
  {
    avatar: 'https://avatars.githubusercontent.com/u/32630999?v=4',
    name: '小满zs',
    title: '计算机爱好者而已，主业修空调',
    link: 'https://github.com/message163',
    tag: '南开大学',
    color: 'indigo'
  }
]
