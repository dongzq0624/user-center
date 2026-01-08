import request from '@/utils/request'
/* 事项用户通讯录*/
export function memberList(data) {
  return request({
    url: '/manager/usercenter/userManager/memberList',
    method: 'post',
    data,
  })
}

/* 用户群组-用户树*/
export function memberGroupTree(data) {
  return request({
    url: '/manager/usercenter/userGroup/memberTree',
    method: 'post',
    data,
  })
}

/* 组织机构-用户树*/
export function memberOrganTree(data) {
  return request({
    url: '/manager/usercenter/organManager/memberTree',
    method: 'post',
    data,
  })
}

/* 用户群组-群组列表*/
export function userGroupList(data) {
  return request({
    url: '/manager/usercenter/userGroup/userGroupList',
    method: 'post',
    data,
  })
}

/* 用户群组-保存群组*/
export function saveUserGroup(data) {
  return request({
    url: '/manager/usercenter/userGroup/saveUserGroup',
    method: 'post',
    data,
  })
}

/* 用户群组-删除群组*/
export function deleteUserGroup(data) {
  return request({
    url: '/manager/usercenter/userGroup/deleteUserGroup',
    method: 'post',
    data,
  })
}

/* 用户群组-加入成员*/
export function joinMember(data) {
  return request({
    url: '/manager/usercenter/userGroup/joinMember',
    method: 'post',
    data,
  })
}

/* 用户群组-用户列表*/
export function groupMemberList(data) {
  return request({
    url: '/manager/usercenter/userGroup/groupMemberList',
    method: 'post',
    data,
  })
}

/* 用户群组-剔除成员*/
export function eliminateMember(data) {
  return request({
    url: '/manager/usercenter/userGroup/eliminateMember',
    method: 'post',
    data,
  })
}

//字典类型列表
export function dictListByCode(data) {
  return request({
    url: '/manager/usercenter/dictManager/dictListByCode',
    method: 'post',
    data,
  })
}

/* 组织机构-机构列表*/
export function organSummaryList(data) {
  return request({
    url: '/manager/usercenter/organManager/organSummaryList',
    method: 'post',
    data,
  })
}

/* 组织机构-机构用户摘要*/
export function organUserSummaryList(data) {
  return request({
    url: '/manager/usercenter/organManager/organUserSummaryList',
    method: 'post',
    data,
  })
}
