import request from '@/utils/request'
// 动态-公告列表
export function noticeList(data) {
  return request({
    url: '/manager/usercenter/message/noticeList',
    method: 'post',
    data,
  })
}

//动态-公告保存
export function noticeSave(data) {
  return request({
    url: '/manager/usercenter/message/noticeSave',
    method: 'post',
    data,
  })
}

//动态-公告删除
export function noticeDelete(data) {
  return request({
    url: '/manager/usercenter/message/noticeDelete',
    method: 'post',
    data,
  })
}

//动态-消息列表
export function myMessageList(data) {
  return request({
    url: '/manager/usercenter/message/myMessageList',
    method: 'post',
    data,
  })
}
//动态-消息详情
export function messageDetail(data) {
  return request({
    url: '/manager/usercenter/message/messageDetail',
    method: 'post',
    data,
  })
}
//动态-消息删除
export function messageDelete(data) {
  return request({
    url: '/manager/usercenter/message/messageDelete',
    method: 'post',
    data,
  })
}
//动态-消息全部设为已读
export function messageAllRead(data) {
  return request({
    url: '/manager/usercenter/message/messageAllRead',
    method: 'post',
    data,
  })
}
//动态-公告详情
export function noticeDetail(data) {
  return request({
    url: '/manager/usercenter/message/noticeDetail',
    method: 'post',
    data,
  })
}
//根据code码查询字典列表
export function getDictListByCode(data) {
  return request({
    url: '/manager/usercenter/dictManager/dictListByCode',
    method: 'post',
    data,
  })
}
//回答记录列表
export function answerRecordList(data) {
  let url = '/manager/usercenter/answerRecordManager/answerRecordList'
  return request({ url, method: 'post', data })
}
//短信发送记录
export function sendMessageReceiveList(data) {
  let url = '/manager/usercenter/message/sendMessageReceiveList'
  return request({ url, method: 'post', data })
}
//消息模板列表
export function messageTemplateList(data) {
  let url = '/manager/usercenter/messaeTemplateManager/messageTemplateList'
  return request({ url, method: 'post', data })
}
//消息模板保存
export function saveMessageTemplate(data) {
  let url = '/manager/usercenter/messaeTemplateManager/saveMessageTemplate'
  return request({ url, method: 'post', data })
}
//消息模板详情
export function messageTemplateDetail(data) {
  let url = '/manager/usercenter/messaeTemplateManager/messageTemplateDetail'
  return request({ url, method: 'post', data })
}
//消息模板删除
export function messageTemplateDelete(data) {
  let url = '/manager/usercenter/messaeTemplateManager/messageTemplateDelete'
  return request({ url, method: 'post', data })
}
