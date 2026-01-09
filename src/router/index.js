/**
 * @description router全局配置，如有必要可分文件抽离，其中asyncRoutes只有在intelligence模式下才会用到，pro版只支持remixIcon图标，具体配置请查看vip群文档
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
//import Layout from '@/vab/layouts'
import projectLayout from '@/vab/layouts/projectLayout'
import { publicPath, routerMode } from '@/config'

Vue.use(VueRouter)
export const constantRoutes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login'),
    meta: {
      hidden: true,
    },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/register'),
    meta: {
      hidden: true,
    },
  },

  {
    path: '/403',
    name: '403',
    component: () => import('@/views/403'),
    meta: {
      hidden: true,
    },
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404'),
    meta: {
      hidden: true,
    },
  },
]

export const asyncRoutes = [
  {
    path: '/user-center',
    name: 'userCenter',
    component: projectLayout,
    meta: {
      title: '个人中心',
      hidden: true,
    },
    children: [
      {
        path: 'personal-center',
        name: 'PersonalCenter',
        component: () => import('@/views/setting/personalCenter'),
        meta: {
          title: '个人信息',
          icon: 'map-pin-user-line',
          hidden: true,
          noColumn: true,
        },
      },
    ],
  },
  //配置
  {
    path: '/application',
    name: 'application',
    component: projectLayout,
    meta: {
      title: '应用',
      icon: 'app-store-fill',
      permissionId: 'application',
    },
    children: [
      {
        path: 'application-management',
        name: 'application-management',
        component: () => import('@/views/setting/applicationManagement'),
        meta: {
          title: '应用管理',
          icon: 'app-store-fill',
          permissionId: 'system_applicationManager_read',
        },
      },
      {
        path: 'menu-management',
        name: 'menu-management',
        component: () => import('@/views/setting/menuManagement'),
        meta: {
          title: '菜单管理',
          icon: 'menu-2-fill',
          permissionId: 'system_menuManager_read',
        },
      },
      {
        path: 'role-management',
        name: 'role-management',
        component: () => import('@/views/setting/roleManagement'),
        meta: {
          title: '角色管理',
          icon: 'admin-line',
          permissionId: 'system_roleManager_read',
        },
      },
    ],
  },
  
  {
    path: '/department-management',
    name: 'DepartmentManagement',
    component: projectLayout,
    meta: {
      title: '组织',
      icon: 'organization-chart',
      permissionId: 'system_organManager_read',
    },
    children: [
      {
        path: '',
        name: 'DepartmentManagementIndex',
        component: () => import('@/views/setting/departmentManagement'),
        meta: {
          noColumn: true,
        },
      },
    ],
  },
  {
    path: '/user-management',
    name: 'Index',
    component: projectLayout,
    meta: {
      title: '用户',
      icon: 'user-3-line',
      permissionId: 'system_userManager_read',
    },
    children: [
      {
        path: '',
        name: 'UserManagementIndex',
        component: () => import('@/views/setting/userManagement'),
        // component: () => import('@/views/rule/components/easy-flow/panel'),
        meta: {
          noColumn: true,
        },
      },
    ],
  },

  {
    path: '/maintain',
    name: 'maintain',
    component: projectLayout,
    meta: {
      title: '运维',
      icon: 'settings-3-line',
      permissionId: 'maintain',
    },
    children: [
      // {
      //   path: 'message-template',
      //   name: 'message-template',
      //   component: () => import('@/views/message/message-template'),
      //   meta: {
      //     title: '消息模板',
      //     icon: 'file-list-2-line',
      //     permissionId: 'system_message_template',
      //   },
      // },
      // {
      //   path: 'sms-list',
      //   name: 'sms-list',
      //   component: () => import('@/views/message/sms-list'),
      //   meta: {
      //     title: '短信记录',
      //     icon: 'message-line',
      //     permissionId: 'system_sms_list',
      //   },
      // },
      {
        path: 'dictionary-management',
        name: 'dictionary-management',
        component: () => import('@/views/setting/dictionaryManagement'),
        meta: {
          title: '字典管理',
          icon: 'settings-6-line',
          permissionId: 'system_dictionaryManager_read',
        },
      },
      {
        path: 'params-management',
        name: 'params-management',
        component: () => import('@/views/setting/paramsManagement'),
        meta: {
          title: '参数管理',
          icon: 'apps-line',
          permissionId: 'system_paramsManager_read',
        },
      },
    ],
  },
  {
    path: '/',
    redirect: '/user-management',
    name: 'NotFound',
    meta: {
      hidden: true,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    name: 'NotFound',
    meta: {
      hidden: true,
    },
  },
]

const router = createRouter()

function fatteningRoutes(routes) {
  return routes.flatMap((route) => {
    return route.children ? fatteningRoutes(route.children) : route
  })
}

export function resetRouter(routes = constantRoutes) {
  routes.map((route) => {
    if (route.children) {
      route.children = fatteningRoutes(route.children)
    }
  })
  router.matcher = createRouter(routes).matcher
}

function createRouter(routes = constantRoutes) {
  return new VueRouter({
    base: publicPath,
    mode: routerMode,
    scrollBehavior: () => ({
      y: 0,
    }),
    routes: routes,
  })
}

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err)
}

export default router
