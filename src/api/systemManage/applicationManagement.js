import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/manager/usercenter/applicationManager/appList',
    method: 'post',
    data,
  })
}

export function doEdit(data) {
  return request({
    url: '/manager/usercenter/applicationManager/saveOrUpdate',
    method: 'post',
    data,
  })
}

export function getDetail(data) {
  return request({
    url: '/manager/usercenter/applicationManager/appInfo',
    method: 'post',
    data,
  })
}

export function doDelete(data) {
  return request({
    url: '/manager/usercenter/applicationManager/delete',
    method: 'post',
    data,
  })
}
//摘要
export function getTree() {
  return request({
    url: '/manager/usercenter/applicationManager/appTree',
    method: 'post',
    data: {},
  })
}
//应用菜单列表
export function appMenuList(data) {
  return request({
    url: '/manager/usercenter/applicationManager/appMenuList',
    method: 'post',
    data,
  })
}
