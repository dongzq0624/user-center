/**
 * @description 登录、获取用户信息、退出登录、清除token逻辑，不建议修改
 */
import Vue from 'vue'
import { getUserInfo, login, logout, socialLogin } from '@/api/user/user'
import { roleDetail } from '@/api/application/roleManagement'
import {
  getToken,
  removeToken,
  setToken,
  getClientToken,
  setClientToken,
} from '@/utils/token'
import router, { resetRouter } from '@/router'
import { isArray, isString } from '@/utils/validate'
import { title, tokenName } from '@/config'

const state = () => ({
  token: getToken(),
  clientToken: getClientToken(),
  username: '游客',
  avatar: require('@/assets/img/user.gif'),
  userInfo: {},
  isStaff: false,
  fileSortType: 'thumbnail',
  isExpiration: '',
  loginUserId: '',
  redirectUrl: '',
})
const getters = {
  clientToken: (state) => state.clientToken,
  token: (state) => state.token,
  username: (state) => state.username,
  avatar: (state) => state.avatar,
  userInfo: (state) => state.userInfo,
  fileSortType: (state) => state.fileSortType,
  isExpiration: (state) => state.isExpiration,
  loginUserId: (state) => state.loginUserId,
  redirectUrl: (state) => state.redirectUrl,
}
const mutations = {
  /**
   * @description 设置token
   * @param {*} state
   * @param {*} token
   */
  setToken(state, token) {
    state.token = token
    setToken(token)
  },
  setClientToken(state, token) {
    state.clientToken = token
    setClientToken(token)
  },
  setRedirectUrl(state, url) {
    state.redirectUrl = url
  },
  /**
   * @description 设置用户名
   * @param {*} state
   * @param {*} username
   */
  setUsername(state, username) {
    state.username = username
  },
  setInfomation(state, userInfo) {
    state.userInfo = userInfo
  },
  /**
   * @description 设置头像
   * @param {*} state
   * @param {*} avatar
   */
  setAvatar(state, avatar) {
    state.avatar = avatar
  },
  setStaff(state, isStaff) {
    state.isStaff = isStaff
  },
  setFileSortType(state, fileSortType) {
    state.fileSortType = fileSortType
  },

  setIsExpiration(state, isExpiration) {
    state.isExpiration = isExpiration
  },
  setLoginUserId(state, loginUserId) {
    state.loginUserId = loginUserId
  },
}
const actions = {
  /**
   * @description 登录拦截放行时，设置虚拟角色
   * @param {*} { commit, dispatch }
   */
  setVirtualRoles({ commit, dispatch }) {
    dispatch('acl/setFull', true, { root: true })
    commit('setAvatar', 'https://i.gtimg.cn/club/item/face/img/2/15922_100.gif')
    commit('setUsername', 'admin(未开启登录拦截)')
  },
  /**
   * @description 登录
   * @param {*} { commit }
   * @param {*} userInfo
   */
  async login({ commit }, userInfo) {
    const {
      data: { [tokenName]: token, isExpiration: isExpiration, userId: userId },
    } = await login(userInfo)
    if (token) {
      // console.log(isExpiration,'token')
      commit('setToken', token)
      commit('setIsExpiration', isExpiration)
      const hour = new Date().getHours()
      const thisTime =
        hour < 8
          ? '早上好'
          : hour <= 11
          ? '上午好'
          : hour <= 13
          ? '中午好'
          : hour < 18
          ? '下午好'
          : '晚上好'
      Vue.prototype.$baseNotify(`欢迎登录${title}`, `${thisTime}！`)

      router.push('/user-management')
    } else {
      commit('setIsExpiration', isExpiration)
      commit('setLoginUserId', userId)
      const err = `登录接口异常，未正确返回${tokenName}...`
      Vue.prototype.$baseMessage(err, 'error', 'vab-hey-message-error')
      throw err
    }
  },
  /**
   * @description 第三方登录
   * @param {*} {}
   * @param {*} tokenData
   */
  async socialLogin({ commit }, tokenData) {
    const {
      data: { [tokenName]: token },
    } = await socialLogin(tokenData)
    if (token) {
      commit('setToken', token)
      const hour = new Date().getHours()
      const thisTime =
        hour < 8
          ? '早上好'
          : hour <= 11
          ? '上午好'
          : hour <= 13
          ? '中午好'
          : hour < 18
          ? '下午好'
          : '晚上好'
      Vue.prototype.$baseNotify(`欢迎登录${title}`, `${thisTime}！`)
    } else {
      const err = `login核心接口异常，请检查返回JSON格式是否正确，是否正确返回${tokenName}...`
      Vue.prototype.$baseMessage(err, 'error', 'vab-hey-message-error')
      throw err
    }
  },
  /**
   * @description 获取用户信息接口 这个接口非常非常重要，如果没有明确底层前逻辑禁止修改此方法，错误的修改可能造成整个框架无法正常使用
   * @param {*} { commit, dispatch, state }
   * @returns
   */
  async getUserInfo({ commit }) {
    // const {
    //   data: { username, avatar, roles, permissions },
    // } = await getUserInfo()
    const { data } = await getUserInfo()
    let username = data.username
    let avatar = data.avatar
    let roles = data.roles
    let permissions = data.permissions
    /**
     * 检验返回数据是否正常，无对应参数，将使用默认用户名,头像,Roles和Permissions
     * username {String}
     * avatar {String}
     * roles {List}
     * ability {List}
     */
    if (
      (username && !isString(username)) ||
      (avatar && !isString(avatar)) ||
      (roles && !isArray(roles)) ||
      (permissions && !isArray(permissions))
    ) {
      const err = 'getUserInfo核心接口异常，请检查返回JSON格式是否正确'
      Vue.prototype.$baseMessage(err, 'error', 'vab-hey-message-error')
      throw err
    } else {
      // 如不使用username用户名,可删除以下代码
      if (username) commit('setUsername', username)
      // 如不使用avatar头像,可删除以下代码
      if (avatar) commit('setAvatar', avatar)
      commit('setInfomation', data)
      const { result } = await roleDetail({ id: data.roleId })
      commit('acl/setPermission', result.powerCodeList, { root: true })
      // 如不使用roles权限控制,可删除以下代码
      // if (roles) dispatch('acl/setRole', roles, { root: true })
      // 如不使用permissions权限控制,可删除以下代码
      //if (permissions)
      // dispatch('acl/setPermission', permissions, { root: true })
    }
  },
  /**
   * @description 退出登录
   * @param {*} { dispatch }
   */
  async logout({ dispatch }) {
    await logout()
    await dispatch('resetAll')
  },
  /**
   * @description 重置token、roles、permission、router、tabsBar等
   * @param {*} { commit, dispatch }
   */
  async resetAll({ commit, dispatch }) {
    commit('setUsername', '游客')
    commit('setAvatar', 'https://i.gtimg.cn/club/item/face/img/2/15922_100.gif')
    commit('routes/setRoutes', [], { root: true })
    await dispatch('setToken', '')
    await dispatch('acl/setFull', false, { root: true })
    await dispatch('acl/setRole', [], { root: true })
    await dispatch('acl/setPermission', [], { root: true })
    await dispatch('tabs/delAllVisitedRoutes', null, { root: true })
    await resetRouter()
    removeToken()
  },
  /**
   * @description 设置token
   * @param {*} { commit }
   * @param {*} token
   */
  setToken({ commit }, token) {
    commit('setToken', token)
  },
  /**
   * @description 设置clientToken
   * @param {*} { commit }
   * @param {*} 设置clientToken
   */
  setClientToken({ commit }, token) {
    commit('setClientToken', token)
  },
  /**
   * @description 设置头像
   * @param {*} { commit }
   * @param {*} avatar
   */
  setAvatar({ commit }, avatar) {
    commit('setAvatar', avatar)
  },
}
export default { state, getters, mutations, actions }
