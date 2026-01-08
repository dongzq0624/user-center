import request from '@/utils/request'
import * as config from '@/config'
export function getClientToken({ appId, appSecret }) {
  return request({
    url: '/manager/usercenter/getClientToken',
    method: 'post',
    data: {
      appId: appId ? appId : config.appId,
      appSecret: appSecret ? appSecret : config.appSecret,
    },
  })
}
