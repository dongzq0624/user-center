import request from '@/utils/request'

//获取滑块验证码
export function getSlideInfo(data = {}) {
  let url = '/manager/usercenter/verification/getSliderCode'
  return request({ url, method: 'post', data })
}

//验证滑动验证码
export function checkSlideCode(data = {}) {
  let url = '/manager/usercenter/verification/checkSlideCode'
  return request({ url, method: 'post', data })
}
