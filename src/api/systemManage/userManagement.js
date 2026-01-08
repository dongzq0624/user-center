import request from '@/utils/request'

export function getList(data) {
  // 获取用户列表
  return request({
    url: '/manager/usercenter/userManager/getList',
    method: 'post',
    data,
  })
}

export function doEdit(data) {
  // 保存用户
  return request({
    url: '/manager/usercenter/userManager/saveOrUpdate',
    method: 'post',
    data,
  })
}

export function doDelete(data) {
  // 删除用户
  return request({
    url: '/manager/usercenter/userManager/doDelete',
    method: 'post',
    data,
  })
}

export function organList(data) {
  // 机构列表
  return request({
    url: '/manager/usercenter/organManager/organList',
    method: 'post',
    data,
  })
}

export function roleList(data) {
  // 角色列表
  return request({
    url: '/manager/usercenter/roleManager/getList',
    method: 'post',
    data,
  })
}

export function userDetail(data) {
  // 用户详情
  return request({
    url: '/manager/usercenter/userManager/getUserInfo',
    method: 'post',
    data,
  })
}

export function freezeUser(data) {
  // 冻结用户
  return request({
    url: '/manager/usercenter/userManager/freezeUser',
    method: 'post',
    data,
  })
}

export function activationUser(data) {
  // 激活用户
  return request({
    url: '/manager/usercenter/userManager/activationUser',
    method: 'post',
    data,
  })
}

export function addJobWithUser(data) {
  // 新增用户职务
  return request({
    url: '/manager/usercenter/userManager/addJobWithUser',
    method: 'post',
    data,
  })
}

export function userRoleList(data) {
  // 用户角色列表
  return request({
    url: '/manager/usercenter/userManager/userRoleList',
    method: 'post',
    data,
  })
}

export function addUserRole(data) {
  // 新增用户角色
  return request({
    url: '/manager/usercenter/userManager/addUserRole',
    method: 'post',
    data,
  })
}

export function querySessionByOrganId(data) {
  // 根据代表团查找届次
  return request({
    url: '/manager/usercenter/rdSession/querySessionByOrganId',
    method: 'post',
    data,
  })
}

export function saveDeputy(data) {
  // 新增或修改代表
  return request({
    url: '/manager/usercenter/userManager/saveDeputy',
    method: 'post',
    data,
  })
}

export function getUserInfoByMobile(data) {
  // 根据手机号回显用户信息
  return request({
    url: '/manager/usercenter/userManager/getUserInfoByMobile',
    method: 'post',
    data,
  })
}

export function getRepresentList(data) {
  // 代表列表
  return request({
    url: '/manager/usercenter/userManager/representList',
    method: 'post',
    data,
  })
}

export function deputyDetail(data) {
  // 代表详情
  return request({
    url: '/manager/usercenter/userManager/deputyDetail',
    method: 'post',
    data,
  })
}

export function dragSort(data) {
  // 拖拽排序
  return request({
    url: '/manager/usercenter/userManager/dragSort',
    method: 'post',
    data,
  })
}

//验证手机号是否存在
export function ensurePhoneNoExist(data) {
  return request({
    url: '/manager/usercenter/userManager/ensurePhoneNoExist',
    method: 'post',
    data,
  })
}

//合并用户
export function mergeUser(data) {
  return request({
    url: '/manager/usercenter/userManager/mergeUser',
    method: 'post',
    data,
  })
}
