import request from '@/utils/request'
/** 项目管理-项目列表 */
export function managerProjectList(data) {
  return request({
    url: '/manager/usercenter/project/managerProjectList',
    method: 'post',
    data,
  })
}
//项目管理-新增项目类型列表
export function projectTypeList(data) {
  return request({
    url: '/manager/usercenter/project/projectTypeList',
    method: 'post',
    data,
  })
}
//项目管理-新建项目
export function createProject(data) {
  return request({
    url: '/manager/usercenter/project/createProject',
    method: 'post',
    data,
  })
}

/** 项目管理-监理日志列表 */
export function getSuperviseLogs(data) {
  return request({
    url: '/manager/usercenter/supervise/superviseLogs',
    method: 'post',
    data,
  })
}

/** 项目管理-监理日志删除 */
export function deleteSuperviseLogs(data) {
  return request({
    url: '/manager/usercenter/supervise/deleteSuperviseLogs',
    method: 'post',
    data,
  })
}

/** 项目管理-监理日志保存 */
export function saveSuperviseLogs(data) {
  return request({
    url: '/manager/usercenter/supervise/saveSuperviseLogs',
    method: 'post',
    data,
  })
}

/** 项目管理-监理联系单列表 */
export function getSuperviseContractList(data) {
  return request({
    url: '/manager/usercenter/supervise/superviseContractList',
    method: 'post',
    data,
  })
}

/** 项目管理-监理联系单保存 */
export function saveSuperviseContractList(data) {
  return request({
    url: '/manager/usercenter/supervise/saveSuperviseContractList',
    method: 'post',
    data,
  })
}

/** 项目管理-监理联系单回复 */
export function answerSuperviseContractList(data) {
  return request({
    url: '/manager/usercenter/supervise/answerSuperviseContractList',
    method: 'post',
    data,
  })
}

/** 项目管理-监理联系单撤销 */
export function consoleSuperviseContractList(data) {
  return request({
    url: '/manager/usercenter/supervise/consoleSuperviseContractList',
    method: 'post',
    data,
  })
}

/** 项目管理-监理联系单详情 */
export function superviseContractDetail(data) {
  return request({
    url: '/manager/usercenter/supervise/superviseContractDetail',
    method: 'post',
    data,
  })
}

//工作包
//工作包-活动表格
export function activityGrid(data) {
  return request({
    url: '/manager/usercenter/workPackage/activityGrid',
    method: 'post',
    data,
  })
}
//工作包-新增工作包
export function createWorkPackage(data) {
  return request({
    url: '/manager/usercenter/workPackage/createWorkPackage',
    method: 'post',
    data,
  })
}
//工作包-详情
export function workPackageDetail(data) {
  return request({
    url: '/manager/usercenter/workPackage/workPackageDetail',
    method: 'post',
    data,
  })
}
//工作包-更新工作包
export function updateWorkPackage(data) {
  return request({
    url: '/manager/usercenter/workPackage/updateWorkPackage',
    method: 'post',
    data,
  })
}
//工作包-移动
export function moveWorkPackage(data) {
  return request({
    url: '/manager/usercenter/workPackage/move',
    method: 'post',
    data,
  })
}

//工作包-子任务列表
export function subPackageSummaryList(data) {
  return request({
    url: '/manager/usercenter/workPackage/subPackageSummaryList',
    method: 'post',
    data,
  })
}
//工作包-删除
export function deletePackage(data) {
  return request({
    url: '/manager/usercenter/workPackage/deletePackage',
    method: 'post',
    data,
  })
}
//项目/工作包-进度情况
export function processList(data) {
  return request({
    url: '/manager/usercenter/workPackage/processList',
    method: 'post',
    data,
  })
}
//项目/工作包-进度更新
export function updateProcess(data) {
  return request({
    url: '/manager/usercenter/workPackage/updateProcess',
    method: 'post',
    data,
  })
}
//项目/工作包-进度删除
export function delProcess(data) {
  return request({
    url: '/manager/usercenter/workPackage/delProcess',
    method: 'post',
    data,
  })
}
//工作包-依赖关系
export function dependencyWork(data) {
  return request({
    url: '/manager/usercenter/workPackage/dependencyWork',
    method: 'post',
    data,
  })
}
//工作包-设置前置后置任务
export function setAfterBeforeTask(data) {
  return request({
    url: '/manager/usercenter/workPackageRelate/setAfterBeforeTask',
    method: 'post',
    data,
  })
}

//工作包-设置里程碑
export function setMilepost(data) {
  return request({
    url: '/manager/usercenter/workPackage/setMilepost',
    method: 'post',
    data,
  })
}
//工作包分组-保存工作包分组
export function createWorkGroup(data) {
  return request({
    url: '/manager/usercenter/workGroup/createWorkGroup',
    method: 'post',
    data,
  })
}
//工作包分组-删除工作包分组
export function delWorkGroup(data) {
  return request({
    url: '/manager/usercenter/workGroup/delWorkGroup',
    method: 'post',
    data,
  })
}
//工作包-查询新增前置后置活动列表
export function createPreOrPostActivityList(data) {
  return request({
    url: '/manager/usercenter/workPackage/createPreOrPostActivityList',
    method: 'post',
    data,
  })
}

//项目/工作包-活动看板
export function getActivityBoard(data) {
  return request({
    url: '/manager/usercenter/workPackage/activityBoard',
    method: 'post',
    data,
  })
}

//项目/工作包-项目摘要列表
export function projectSummaryList(data) {
  return request({
    url: '/manager/usercenter/project/projectSummaryList',
    method: 'post',
    data,
  })
}
//工作包-工作包归档
export function workPackageArchived(data) {
  return request({
    url: '/manager/usercenter/workPackage/archived',
    method: 'post',
    data,
  })
}
//工作包-依赖关系-解除依赖关系
export function removeDependency(data) {
  return request({
    url: '/manager/usercenter/workPackage/removeDependency',
    method: 'post',
    data,
  })
}

//工作包-甘特图
export function getGanttChart(data) {
  return request({
    url: '/manager/usercenter/workPackage/ganttChart',
    method: 'post',
    data,
  })
}
//项目管理-项目概要
export function projectOverview(data) {
  return request({
    url: '/manager/usercenter/project/projectOverview',
    method: 'post',
    data,
  })
}
//工作包-会议参与人接口
export function meetParticipantList(data) {
  return request({
    url: '/manager/usercenter/workPackage/meetParticipantList',
    method: 'post',
    data,
  })
}
//工作包-移除工作包参与人
export function delWorkParticipant(data) {
  return request({
    url: '/manager/usercenter/workPackage/delWorkParticipant',
    method: 'post',
    data,
  })
}

//项目管理-获得人员在项目中所拥有的组件（用于项目上面的菜单展示）
export function projectMemberComponents(data) {
  return request({
    url: '/manager/usercenter/project/projectMemberComponents',
    method: 'post',
    data,
  })
}
//工作包文件列表
export function workPackageFileList(data) {
  return request({
    url: '/manager/usercenter/fileManager/workPackageFileList',
    method: 'post',
    data,
  })
}

//投诉反馈列表
export function getFeedBackList(data) {
  return request({
    url: '/manager/usercenter/complainFeedback/feedBackList',
    method: 'post',
    data,
  })
}
//反馈详情
export function feedBackDetail(data) {
  return request({
    url: '/manager/usercenter/complainFeedback/feedBackDetail',
    method: 'post',
    data,
  })
}

//回复反馈
export function replyFeedBack(data) {
  return request({
    url: '/manager/usercenter/complainFeedback/replyFeedBack',
    method: 'post',
    data,
  })
}

//甲供材料-计划单列表
export function getMaterialsPlanList(data) {
  return request({
    url: '/manager/usercenter/project/materialsPlanList',
    method: 'post',
    data,
  })
}

//甲供材料-计划单保存
export function materialsPlanSave(data) {
  return request({
    url: '/manager/usercenter/project/materialsPlanSave',
    method: 'post',
    data,
  })
}

//甲供材料-计划单删除
export function materialsPlanDel(data) {
  return request({
    url: '/manager/usercenter/project/materialsPlanDel',
    method: 'post',
    data,
  })
}
