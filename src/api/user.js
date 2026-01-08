import request from '@/utils/request'
import { encryptedData } from '@/utils/encrypt'
import { loginRSA } from '@/config'

export async function login(data) {
  if (loginRSA) {
    data = await encryptedData(data)
  }
  return request({
    url: '/manager/usercenter/userManager/login',
    method: 'post',
    data,
  })
}

export async function socialLogin(data) {
  if (loginRSA) {
    data = await encryptedData(data)
  }
  return request({
    url: '/socialLogin',
    method: 'post',
    data,
  })
}

export function getUserInfo() {
  return request({
    url: '/manager/usercenter/userManager/userInfo',
    method: 'post',
    data: {},
  })
}

export function logout() {
  return request({
    url: '/manager/usercenter/userManager/logout',
    method: 'post',
    data: {},
  })
}

//修改用户信息
export function modifyUserInfo(data) {
  return request({
    url: '/manager/usercenter/userManager/modifyUserInfo',
    method: 'post',
    data,
  })
}
//base64图片上传
export function base64FileUpload(data) {
  return request({
    url: '/manager/usercenter/upload/base64FileUpload',
    method: 'post',
    data,
  })
}

export function register(data) {
  return request({
    url: '/register',
    method: 'post',
    data,
  })
}

//修改密码
export function changePassword(data) {
  return request({
    url: '/manager/usercenter/userManager/changePassword',
    method: 'post',
    data,
  })
}

//管理台解锁功能
export function unlock(data) {
  return request({
    url: '/manager/usercenter/userManager/unlock',
    method: 'post',
    data,
  })
}
//获取应用标识和回调地址
export function getCliendIdAndRedirectUri(data) {
  return request({
    url: '/manager/usercenter/zzdUserManager/getCliendIdAndRedirectUri',
    method: 'post',
    data,
  })
}
//扫码登录
export function scanCodeLogin(data) {
  return request({
    url: '/manager/usercenter/zzdUserManager/scanCodeLogin',
    method: 'post',
    data,
  })
}
//扫码绑定用户
export function scanCodeBind(data) {
  return request({
    url: '/manager/usercenter/zzdUserManager/scanCodeBind',
    method: 'post',
    data,
  })
}
