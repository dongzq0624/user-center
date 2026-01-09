import request from '@/utils/request'
/** 文件列表 */
export function getFileList(data) {
  return request({
    url: '/manager/usercenter/fileManager/fileList',
    method: 'post',
    data,
  })
}
//创建文件夹
export function mkdirs(data) {
  return request({
    url: '/manager/usercenter/fileManager/mkdirs',
    method: 'post',
    data,
  })
}
//上传文件-多个
export function uploadFiles(data) {
  return request({
    url: '/manager/usercenter/fileManager/uploadFiles',
    method: 'post',
    data,
  })
}
//上传文件-单个
export function upload(data) {
  return request({
    url: '/common/file/upload',
    method: 'post',
    data,
  })
}
//删除文件
export function delFiles(data) {
  return request({
    url: '/manager/usercenter/fileManager/delFiles',
    method: 'post',
    data,
  })
}
//修改文件名
export function modifyFileName(data) {
  return request({
    url: '/manager/usercenter/fileManager/modifyFileName',
    method: 'post',
    data,
  })
}

//下载文件
export function changeDownloadFile(data) {
  return request({
    url: '/manager/usercenter/fileManager/downloadFile',
    method: 'post',
    data,
  })
}
//移动文件
export function mvFiles(data) {
  return request({
    url: '/manager/usercenter/fileManager/mvFiles',
    method: 'post',
    data,
  })
}

//复制文件
export function cpFiles(data) {
  return request({
    url: '/manager/usercenter/fileManager/cpFiles',
    method: 'post',
    data,
  })
}

//更新文件版本
export function refreshVersionFile(data) {
  return request({
    url: '/manager/usercenter/fileManager/refreshVersionFile',
    method: 'post',
    data,
  })
}
//历史更新记录
export function fileHistoryList(data) {
  return request({
    url: '/manager/usercenter/attachmentHistory/fileHistoryList',
    method: 'post',
    data,
  })
}

//文件处理日志列表
export function getAttachmentLogList(data) {
  return request({
    url: '/manager/usercenter/attachmentLog/attachmentLogList',
    method: 'post',
    data,
  })
}
//通用-附件列表
export function getOrdinaryAttachList(data) {
  return request({
    url: '/manager/usercenter/fileManager/ordinaryAttachList',
    method: 'post',
    data,
  })
}

export const upload_url = '/common/uploadFile'
export const uploadFiles_url = '/manager/usercenter/fileManager/uploadFiles'
