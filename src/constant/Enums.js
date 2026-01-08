/** 通过key寻找枚举 */
export const findByKey = (enumSet, key) => {
  let _enum = toList(enumSet).find((e) => e.key == key)
  return _enum ? _enum : {}
}

/** 转成列表 */
export const toList = (enumSet) => {
  let list = []
  Object.keys(enumSet).forEach(function (key) {
    list.push(enumSet[key])
  })
  return list
}

export const USER_STATUS = {
  ON: { key: 'valid', value: '在岗' },
  OFF: { key: 'invalid', value: '离职' },
}

export const DELEGATE_STATUS = {
  ON_DUTY: { key: 'onDuty', value: '在岗' },
  LEAVE_OFFICE: { key: 'leaveOffice', value: '离职' },
}

export const USER_GENDER = {
  MALE: { key: 'male', value: '男' },
  FEMALE: { key: 'female', value: '女' },
  UNKNOWN: { key: 'unknown', value: '未知' },
}
//类型(目录: catalog,菜单: menu,按钮: button)
export const MENU_TYPE = {
  CATALOG: { key: 'catalog', value: '目录' },
  MENU: { key: 'menu', value: '菜单' },
  BUTTON: { key: 'button', value: '按钮' },
  QUICK_ENTRY: { key: 'quickEntry', value: '快捷入口' },
}

// 应用状态
export const APP_STATUS = {
  AVAILABLE: { key: 'AVAILABLE', value: '可用' },
  UNAVAILABLE: { key: 'UNAVAILABLE', value: '禁用' },
}

// 浙政钉用户状态
export const DING_USER_STATUS = {
  YES: { key: 'yes', value: '已绑定' },
  NO: { key: 'no', value: '未绑定' },
}

export const LEVEL_STATUS = {
  YES: { key: 'yes', value: '只展示本级' },
  NO: { key: 'no', value: '展示包含下级' },
}
//短信业务类型
export const SMS_BUSI_TYPE = {
  LOGIN: { key: 'login', value: '登录' },
  UPDATE: { key: 'update', value: '修改密码' },
  REGISTER: { key: 'register', value: '注册' },
  BUSI_MSG: { key: 'busiMsg', value: '业务消息' },
}
//消息通知类型
export const MESSAGE_NOTICE_TYPE = {
  ALL: { key: 'all', value: '全员' },
  SINGLE: { key: 'single', value: '单一' },
}
//消息推送方式
export const MESSAGE_PUSH_MODEL = {
  MOBILE_MSG: { key: 'mobileMsg', value: '短信' },
  ZZD: { key: 'zzd', value: '浙政钉' },
}

export const YES_OR_NO = {
  NO: { key: 'no', value: '否' },
  YES: { key: 'yes', value: '是' },
}
