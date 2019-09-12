import Vue from 'vue'
import { login, getInfo, logout } from '@/api/login'
import { ACCESS_TOKEN, USER_ID, USER_NAME, PERMISSION } from '@/store/mutation-types'
import { welcome } from '@/utils/util'
import notification from 'ant-design-vue/es/notification'
import routerConfig from '@/config/router.config'

const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    info: {}
  },
  
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    },
    USER_ID: (state, userId) => {
      state.userId = userId
    }
  },
  
  actions: {
    // 登录
    Login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          if (response.code === '200') {
            const result = response.data
            Vue.ls.set(ACCESS_TOKEN, result.token, 7 * 24 * 60 * 60 * 1000)
            Vue.ls.set(USER_ID, result.id, 7 * 24 * 60 * 60 * 1000)
            commit('SET_TOKEN', result.token)
            commit('SET_AVATAR', result.avatar)
            commit('USER_ID', result.id)
            resolve(response)
          } else {
            reject(response)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    
    // 获取用户信息
    GetInfo({ commit }) {
      return new Promise((resolve, reject) => {
        const userId = Vue.ls.get(USER_ID)
        getInfo({ id: userId }).then(response => {
          const result = response.data
          if (result && result.permissions.length > 0) {
            const role = result
            /*role.permissions.map(per => {
              if (per.actionEntitySet != null && per.actionEntitySet.length > 0) {
                const action = per.actionEntitySet.map(action => { return action.action })
                per.actionList = action
              }
            })*/
            role.permissionList = role.permissions.map(permission => {
              return permission
            })
            commit('SET_ROLES', role)
            commit('SET_INFO', result)
            let permission = role.permissionList.map(e => {
              if (e.indexOf(':LIST:') !== -1) {
                return e
              }
            })
            permission = permission.filter(e => e)
            Vue.ls.set(PERMISSION, permission, 7 * 24 * 60 * 60 * 1000)
          } else {
            reject(new Error('getInfo: roles must be a non-null array !'))
          }
          commit('SET_NAME', { name: result.name, welcome: welcome() })
          commit('SET_AVATAR', result.avatar)
          Vue.ls.set(USER_NAME, result.name, 7 * 24 * 60 * 60 * 1000)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    
    // 登出
    Logout({ commit, state }, next, to) {
      return new Promise((resolve) => {
        logout(state.token).then(response => {
          if (response.code === '200') {
            delInfo()
            commit('SET_TOKEN', '')
            commit('SET_ROLES', [])
            resolve(response)
          } else {
            delInfo()
            commit('SET_TOKEN', '')
            commit('SET_ROLES', [])
            notification.error({
              message: 'token',
              description: response.message
            })
            next({ path: '/user/login', query: { redirect: to.fullPath } })
          }
        })/*.catch(error => {
          resolve(error)
        })*/
      })
    },
    SignOut({ commit, state }, next, to) {
      return new Promise((resolve) => {
        delInfo()
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        notification.warn({
          message: '退出',
          description: '退出系统'
        })
      })
    }
  }
}
const delInfo = () => {
  Vue.ls.remove(ACCESS_TOKEN)
  Vue.ls.remove(USER_ID)
  Vue.ls.remove(USER_NAME)
  Vue.ls.remove(PERMISSION)
}

export default user
