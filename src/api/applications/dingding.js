import request from '@/utils/request'
/* 浙政钉机构树*/
export function getOrganTree(data) {
  return request({
    url: '/manager/usercenter/zzdOrganManager/zzdOrganTree',
    method: 'post',
    data,
  })
}
/* 根据机构查询用户列表*/
export function getUserList(data) {
  return request({
    url: '/manager/usercenter/zzdUserManager/zzdUserList',
    method: 'post',
    data,
  })
}
/* 用户解除绑定*/
export function unbindUser(data) {
  return request({
    url: '/manager/usercenter/zzdUserManager/unbindUser',
    method: 'post',
    data,
  })
}
/* 同步用户*/
export function synchUser(data) {
  return request({
    url: '/manager/usercenter/userManager/synchUser',
    method: 'post',
    data,
  })
}
//同步浙政钉用户
export function syncZzdUser(data) {
  return request({
    url: '/manager/usercenter/zzdOrganManager/syncZzdUser',
    method: 'post',
    data,
  })
}
//同步浙政钉机构
export function syncZzdOrgan(data) {
  return request({
    url: '/manager/usercenter/zzdOrganManager/syncZzdOrgan',
    method: 'post',
    data,
  })
}
