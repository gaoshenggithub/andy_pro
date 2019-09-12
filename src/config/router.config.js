// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView, BlankLayout, PageView, IntroduceLayout } from '@/layouts'
import { bxAnaalyse } from '@/core/icons'

export const asyncRouterMap = [

  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '首页' },
    redirect: '/dashboard/workplace',
    children: [
      // dashboard
      {
        path: '/dashboard',
        name: 'dashboard',
        redirect: '/dashboard/workplace',
        component: RouteView,
        meta: { title: '首页', keepAlive: true, icon: bxAnaalyse, permission: ['dashboard'] },
        children: [
          {
            path: '/dashboard/analysis',
            name: 'Analysis',
            component: () => import('@/views/dashboard/Analysis'),
            meta: { title: '分析页', keepAlive: false, permission: ['dashboard'] }
          },
          {
            path: '/dashboard/workplace',
            name: 'Workplace',
            component: () => import('@/views/dashboard/Workplace'),
            meta: { title: '工作台', keepAlive: true, permission: ['dashboard'] }
          }
        ]
      },
      //file
      // system
      {
        path: '/system',
        redirect: '/system/menu-list',
        component: RouteView,
        meta: { title: '系统管理', icon: 'setting', permission: ['system'] },
        children: [
          {
            path: '/system/menu-list',
            name: 'MenuList',
            component: () => import('@/views/system/MenuList'),
            meta: { title: '菜单管理', keepAlive: true, permission: ['menuList'] }
          },
          {
            path: '/system/user-list',
            name: 'UserList',
            component: () => import('@/views/system/UserList'),
            meta: { title: '用户管理', keepAlive: true, permission: ['userList'] }
          }, {
            path: '/system/role-list',
            name: 'RoleList',
            component: () => import('@/views/system/RoleList'),
            meta: { title: '角色管理', keepAlive: true, permission: ['roleList'] }
          }, {
            path: '/system/log-list',
            name: 'LogList',
            component: () => import('@/views/system/LogList'),
            meta: { title: '日志管理', keepAlive: true, permission: ['logList'] }
          }, {
            path: '/system/dict-list',
            name: 'DictList',
            component: () => import('@/views/system/DictList'),
            meta: { title: '数据字典', keepAlive: true, permission: ['dictList'] }
          }
        ]
      },
      {
        path: '/result',
        name: 'result',
        component: PageView,
        redirect: '/result/success',
        meta: { title: '结果页', icon: 'check-circle-o', permission: ['result'] },
        children: [
          {
            path: '/result/success',
            name: 'ResultSuccess',
            component: () => import(/* webpackChunkName: "result" */ '@/views/result/Success'),
            meta: { title: '成功', keepAlive: false, hiddenHeaderContent: true, permission: ['result'] }
          },
          {
            path: '/result/fail',
            name: 'ResultFail',
            component: () => import(/* webpackChunkName: "result" */ '@/views/result/Error'),
            meta: { title: '失败', keepAlive: false, hiddenHeaderContent: true, permission: ['result'] }
          }
        ]
      },
      // Exception
      {
        path: '/exception',
        name: 'exception',
        component: RouteView,
        redirect: '/exception/403',
        meta: { title: '异常页', icon: 'warning', permission: ['exception'] },
        children: [
          {
            path: '/exception/403',
            name: 'Exception403',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/403'),
            meta: { title: '403', permission: ['exception'] }
          },
          {
            path: '/exception/404',
            name: 'Exception404',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404'),
            meta: { title: '404', permission: ['exception'] }
          },
          {
            path: '/exception/500',
            name: 'Exception500',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/500'),
            meta: { title: '500', permission: ['exception'] }
          }
        ]
      },
      // account
      // other

      //blob
    ]
  },
  {
    path: '*', redirect: '/404', hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/introduce',
    component: IntroduceLayout,
    redirect: '/introduce/introduce',
    hidden: true,
    children: [
      {
        path: 'introduce',
        name: 'SelfIntroduce',
        component: () => import('@/views/SelfIntroduce')
      }
    ]
  },
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
      },
      {
        path: 'register-password',
        name: 'recoverPassword',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/RecoverPassword')
      }
    ]
  },

  {
    path: '/test',
    component: BlankLayout,
    redirect: '/test/home',
    children: [
      {
        path: 'home',
        name: 'TestHome',
        component: () => import('@/views/Home')
      }
    ]
  },

  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }

]
