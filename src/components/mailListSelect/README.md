使用

引入组件

    `import MemberSelect from '@/components/mailListSelect'`
    `Vue.component('MemberSelect', MemberSelect)`

使用组件
  
    `<member-select type="input" :value="member"  @onChange="memberOnChange" />`


API

`| 参数  | 说明       | 类型   | 可选值     | 默认值                     |`
`| ----- | ---------- | ------ | ---------- | -------------------------- |`
`| value | 所选的值   | Object | ——         | {userId: "", userName: ""} |`
`| type  | 选择框类型 | String | input/list | input                      |`
`| title  | type为list时可用 | String | —— | ——                    |`

Events

`| 事件名称 | 说明     | 回调参数 |`
`| -------- | -------- | -------- |`
`| onChange | 人员选择 | member   |`