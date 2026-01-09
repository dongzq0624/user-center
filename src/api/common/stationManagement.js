import request from '@/utils/request'

export function getPostList(data) {
  return request({
    url: '/manager/usercenter/postManager/postList',
    method: 'post',
    data,
  })
}

export function doEdit(data) {
  return request({
    url: '/manager/usercenter/postManager/savePost',
    method: 'post',
    data,
  })
}

export function doDelete(data) {
  return request({
    url: '/manager/usercenter/postManager/delPost',
    method: 'post',
    data,
  })
}
