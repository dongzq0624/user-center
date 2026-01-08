const state = () => ({
  admin: false,
  role: [],
  permission: [],
  projectPermission: [],
})
const getters = {
  admin: (state) => state.admin,
  role: (state) => state.role,
  permission: (state) => state.permission,
  projectPermission: (state) => state.projectPermission,
}
const mutations = {
  setFull(state, admin) {
    state.admin = admin
  },
  setRole(state, role) {
    state.role = role
  },
  setPermission(state, permission) {
    state.permission = permission
  },
  setProjectPermission(state, projectPermission) {
    state.projectPermission = projectPermission
  },
}
const actions = {
  setFull({ commit }, admin) {
    commit('setFull', admin)
  },
  setRole({ commit }, role) {
    commit('setRole', role)
  },
  setPermission({ commit }, permission) {
    commit('setPermission', permission)
  },
  setProjectPermission({ commit }, projectPermission) {
    commit('setProjectPermission', projectPermission)
  },
}
export default { state, getters, mutations, actions }
