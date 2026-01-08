import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/manager/usercenter/userGroup/userGroupList',
    method: 'post',
    data,
  })
}

export function getMemberList(data) {
  return request({
    url: '/manager/usercenter/userGroup/groupMemberList',
    method: 'post',
    data,
  })
}

export function doEdit(data) {
  return request({
    url: '/manager/usercenter/userGroup/saveUserGroup',
    method: 'post',
    data,
  })
}

export function doDelete(data) {
  return request({
    url: '/manager/usercenter/userGroup/deleteUserGroup',
    method: 'post',
    data,
  })
}

export function joinMember(data) {
  return request({
    url: '/manager/usercenter/userGroup/joinMember',
    method: 'post',
    data,
  })
}

export function eliminateMember(data) {
  //用户群组-剔除成员
  return request({
    url: '/manager/usercenter/userGroup/eliminateMember',
    method: 'post',
    data,
  })
}
