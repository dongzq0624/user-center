import request from '@/utils/request'

export function getList(data) {
  // 获取届次列表
  return request({
    url: '/manager/usercenter/rdSession/rdSessionList',
    method: 'post',
    data,
  })
}

export function doEdit(data) {
  // 保存届次
  return request({
    url: '/manager/usercenter/rdSession/saveRdSession',
    method: 'post',
    data,
  })
}

export function getDetail(data) {
  // 届次详情
  return request({
    url: '/manager/usercenter/rdSession/rdSessionDetail',
    method: 'post',
    data,
  })
}

export function updateSessionStatus(data) {
  // 届次切换
  return request({
    url: '/manager/usercenter/rdSession/updateSessionStatus',
    method: 'post',
    data,
  })
}
