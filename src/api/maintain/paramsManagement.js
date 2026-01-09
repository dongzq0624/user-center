import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/manager/usercenter/configManager/configList',
    method: 'post',
    data,
  })
}

export function doEdit(data) {
  return request({
    url: '/manager/usercenter/configManager/saveConfig',
    method: 'post',
    data,
  })
}

export function paramsDetail(data) {
  return request({
    url: '/manager/usercenter/configManager/configInfo',
    method: 'post',
    data,
  })
}

export function doDelete(data) {
  return request({
    url: '/manager/usercenter/configManager/delConfig',
    method: 'post',
    data,
  })
}
