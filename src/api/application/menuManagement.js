import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/manager/usercenter/powerManager/powerList',
    method: 'post',
    data,
  })
}

export function doEdit(data) {
  return request({
    url: '/manager/usercenter/powerManager/saveOrUpdate',
    method: 'post',
    data,
  })
}

export function doDelete(data) {
  return request({
    url: '/manager/usercenter/powerManager/delPower',
    method: 'post',
    data,
  })
}

export function menuEdit(data) {
  return request({
    url: '/manager/usercenter/powerManager/powerInfo',
    method: 'post',
    data,
  })
}
