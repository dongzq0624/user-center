import Vue from 'vue'
import App from './App'
import i18n from './i18n'
import store from './store'
import router from './router'
import { Divider, Popover } from 'ant-design-vue'
import noContent from './components/no-content.vue'
import MemberSelect from './components/mailListSelect'
import dictSelect from './components/dictionarySelect'
import MemberGroup from './components/memberGroup'
import '@/vab'
import './utils/flexible'
import './utils/rem'
// 加载svg
import '@/icons/index'
/**
 * @description 正式环境默认使用mock，正式项目记得注释后再打包
 */
import { baseURL } from './config'
import { isExternal } from '@/utils/validate'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import TreeSelect from '@riophae/vue-treeselect'
import VueParticles from 'vue-particles'

import AnBaseTable from './components/an-common/an-base_table.vue'
import AnBaseTableSearch from './components/an-common/an-base_table_search.vue'
import AnBaseFormDialog from './components/an-common/an-base_form_dialog.vue'

Vue.use(VueParticles)
Vue.use(Divider)
Vue.use(Popover)
Vue.component('TreeSelect', TreeSelect)
Vue.component('NoContent', noContent)
Vue.component('MemberSelect', MemberSelect)
Vue.component('DictSelect', dictSelect)
Vue.component('MemberGroup', MemberGroup)
Vue.component('AnBaseTable', AnBaseTable)
Vue.component('AnBaseTableSearch', AnBaseTableSearch)
Vue.component('AnBaseFormDialog', AnBaseFormDialog)
if (process.env.NODE_ENV === 'production' && !isExternal(baseURL)) {
  const { mockXHR } = require('@/utils/static')
  mockXHR()
}

/**
 * @description 生产环境启用组件初始化，编译，渲染和补丁性能跟踪。仅在开发模式和支持 Performance.mark API的浏览器中工作。
 */
if (process.env.NODE_ENV === 'development') {
  Vue.config.performance = true
}

new Vue({
  el: '#app',
  i18n,
  store,
  router,
  render: (h) => h(App),
})
