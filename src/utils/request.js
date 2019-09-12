import Vue from 'vue'
import axios from 'axios'
import store from '@/store'
import {
  VueAxios
} from './axios'
import notification from 'ant-design-vue/es/notification'
import {
  ACCESS_TOKEN
} from '@/store/mutation-types'

// 创建 axios 实例
const service = axios.create({
  baseURL: '/andy_pro', // api base_url
  timeout: 6000 // 请求超时时间
})

const sign_outs = ['-1', '0002', '1006', '0001', '0000']

const exception = res => {
  if (sign_outs.indexOf(res.code) !== -1) {
    signout()
  } else if (res.code === '200') {
    //success()
  } else if (res.code === '500') {
    error()
  } else {
    warn(res.message)
  }
}
const error = () =>
  notification.error({
    message: '错误',
    description: '系统出现异常,请联系管理员'
  })

const success = () =>
  notification.success({
    message: '成功',
    description: '数据加载成功'
  })

const warn = (value) =>
  notification.warning({
    message: '操作',
    description: `${value}`
  })


const signout = () => store.dispatch('SignOut').then(() => {
})
const err = (error) => {
  if (error.response) {
    const data = error.response.data
    const token = Vue.ls.get(ACCESS_TOKEN)
    console.log(error, '----------------------')
    if (error.response.status === 403) {
      notification.error({
        message: 'Forbidden',
        description: data.message
      })
    }
    if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
      notification.error({
        message: 'Unauthorized',
        description: 'Authorization verification failed'
      })
      if (token) {
        store.dispatch('Logout').then(() => {
          setTimeout(() => {
            window.location.reload()
          }, 1500)
        })
      }
    }
  }
  return Promise.reject(error)
}

// request interceptor
service.interceptors.request.use(config => {
  const token = Vue.ls.get(ACCESS_TOKEN)
  if (token) {
    config.headers['Auth_Token'] = token // 让每个请求携带自定义 token 请根据实际情况自行修改
  }
  return config
}, err)

// response interceptor
service.interceptors.response.use((response) => {
  exception(response.data)
  return response.data
}, err)

const installer = {
  vm: {},
  install(Vue) {
    Vue.use(VueAxios, service)
  }
}

export {
  installer as VueAxios,
  service as axios
}
