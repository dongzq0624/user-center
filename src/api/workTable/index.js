import request from '@/utils/request'
//工作台-保存当前用户的工作台
export function saveWorkbench(data) {
  return request({
    url: '/manager/usercenter/workBench/saveWorkbench',
    method: 'post',
    data,
  })
}

//工作台-查询当前用户的工作台
export function currentWorkbench(data) {
  return request({
    url: '/manager/usercenter/workBench/currentWorkbench',
    method: 'post',
    data,
  })
}

//工作台-查询当前用户所拥有的工作台组件权限
export function systemCompAuths(data) {
  return request({
    url: '/manager/usercenter/workBench/systemCompAuths',
    method: 'post',
    data,
  })
}

//工作台-项目信息
export function workBenchProjcetInfos(data) {
  return request({
    url: '/manager/usercenter/workBench/workBenchProjcetInfos',
    method: 'post',
    data,
  })
}

//工作台-我负责、我参与的工作包
export function myWorkPackageList(data) {
  return request({
    url: '/manager/usercenter/workBench/myWorkPackageList',
    method: 'post',
    data,
  })
}

//工作台-我的待更新的工作包
export function myWaitUpdateWorkPackageList(data) {
  return request({
    url: '/manager/usercenter/workBench/myWaitUpdateWorkPackageList',
    method: 'post',
    data,
  })
}

//工作台-采购合同预警
export function contractEarlyWarningList(data) {
  return request({
    url: '/manager/usercenter/workBench/contractEarlyWarningList',
    method: 'post',
    data,
  })
}

//工作台-采购单
export function workBenchPurchaseOrderList(data) {
  return request({
    url: '/manager/usercenter/workBench/workBenchPurchaseOrderList',
    method: 'post',
    data,
  })
}

//工作台-最新发货单
export function newestPurchaseDeliverList(data) {
  return request({
    url: '/manager/usercenter/workBench/newestPurchaseDeliverList',
    method: 'post',
    data,
  })
}

//工作台-库存预警
export function InventoryWarningList(data) {
  return request({
    url: '/manager/usercenter/workBench/InventoryWarningList',
    method: 'post',
    data,
  })
}

//工作台-每月的采购次数、申领次数统计
export function monthStatics(data) {
  return request({
    url: '/manager/usercenter/workBench/monthStatics',
    method: 'post',
    data,
  })
}

//工作台-待出库记录
export function waitOutboundRecordList(data) {
  return request({
    url: '/manager/usercenter/workBench/waitOutboundRecordList',
    method: 'post',
    data,
  })
}

//工作台-仓库申领记录
export function warehouseGoodsApplyRecordList(data) {
  return request({
    url: '/manager/usercenter/workBench/warehouseGoodsApplyRecordList',
    method: 'post',
    data,
  })
}

//工作台-越库申领记录
export function crossLibraryGoodsApplyRecordList(data) {
  return request({
    url: '/manager/usercenter/workBench/crossLibraryGoodsApplyRecordList',
    method: 'post',
    data,
  })
}

//工作台-工程检查-待整改单
export function rectifiedSheetList(data) {
  return request({
    url: '/manager/usercenter/workBench/rectifiedSheetList',
    method: 'post',
    data,
  })
}

//工作台-工程检查-待回复单
export function reviewedSheetList(data) {
  return request({
    url: '/manager/usercenter/workBench/reviewedSheetList',
    method: 'post',
    data,
  })
}

//工作台-监理联系单待回复
export function waitReplySuperviseContractList(data) {
  return request({
    url: '/manager/usercenter/workBench/waitReplySuperviseContractList',
    method: 'post',
    data,
  })
}

//工作台-最新民情反馈
export function newestFeedbackList(data) {
  return request({
    url: '/manager/usercenter/workBench/newestFeedbackList',
    method: 'post',
    data,
  })
}
