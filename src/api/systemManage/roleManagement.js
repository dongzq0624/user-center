import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/manager/usercenter/roleManager/getList',
    method: 'post',
    data,
  })
}

export function doEdit(data) {
  return request({
    url: '/manager/usercenter/roleManager/saveOrUpdate',
    method: 'post',
    data,
  })
}

export function roleDetail(data) {
  return request({
    url: '/manager/usercenter/roleManager/roleInfo',
    method: 'post',
    data,
  })
}

export function doDelete(data) {
  return request({
    url: '/manager/usercenter/roleManager/doDelete',
    method: 'post',
    data,
  })
}

export function userRoleInit(data) {
  return request({
    url: '/manager/usercenter/roleManager/userRoleInit',
    method: 'post',
    data,
  })
}

export function userRoleSave(data) {
  return request({
    url: '/manager/usercenter/roleManager/userRoleSave',
    method: 'post',
    data,
  })
}

//菜单树列表
export function PowerList(data) {
  return request({
    url: '/manager/usercenter/powerManager/powerList',
    method: 'post',
    data,
  })
}

//查询数据权限编码树
export function getRoleDataPowerTree() {
  return request({
    url: '/manager/usercenter/roleDataPower/roleDataPowerTree',
    method: 'post',
    data: {},
  })
}

//查询所有的工作台组件
export function allSystemWorkComps() {
  return request({
    url: '/manager/usercenter/workBench/allSystemWorkComps',
    method: 'post',
    data: {},
  })
}
