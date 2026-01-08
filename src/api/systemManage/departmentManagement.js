import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/manager/usercenter/organManager/organTree',
    method: 'post',
    data,
  })
}

export function doEdit(data) {
  return request({
    url: '/manager/usercenter/organManager/saveOrgan',
    method: 'post',
    data,
  })
}

export function doDelete(data) {
  return request({
    url: '/manager/usercenter/organManager/doDelete',
    method: 'post',
    data,
  })
}

export function organInfo(data) {
  return request({
    url: '/manager/usercenter/organManager/organInfo',
    method: 'post',
    data,
  })
}

export function organTree(data) {
  return request({
    url: '/manager/usercenter/organManager/organTree',
    method: 'post',
    data,
  })
}

export function organLazyTreeList(data) {
  return request({
    url: '/manager/usercenter/organManager/organLazyTreeList',
    method: 'post',
    data,
  })
}

export function dragSort(data) {
  return request({
    url: '/manager/usercenter/organManager/dragSort',
    method: 'post',
    data,
  })
}

export function syncZzdOrganToSystem(data) {
  return request({
    url: '/manager/usercenter/organManager/syncZzdOrganToSystem',
    method: 'post',
    data,
  })
}
