import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/manager/usercenter/dictManager/dictList',
    method: 'post',
    data,
  })
}

export function doEdit(data) {
  return request({
    url: '/manager/usercenter/dictManager/saveDict',
    method: 'post',
    data,
  })
}

export function dictionaryDetail(data) {
  return request({
    url: '/manager/usercenter/dictManager/dictInfo',
    method: 'post',
    data,
  })
}

export function doDelete(data) {
  return request({
    url: '/manager/usercenter/dictManager/delDict',
    method: 'post',
    data,
  })
}
//字典类型列表
export function dictTypeList() {
  return request({
    url: '/manager/usercenter/dictManager/dictTypeList',
    method: 'post',
    data: {},
  })
}
//字典树
export function dictTree() {
  return request({
    url: '/manager/usercenter/dictManager/dictTree',
    method: 'post',
    data: {},
  })
}

export function dictListByCode(data) {
  return request({
    url: '/manager/usercenter/dictManager/dictListByCode',
    method: 'post',
    data,
  })
}
