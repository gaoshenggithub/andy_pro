import moment from 'moment'
import { api } from '@/api/manage'
import { PERMISSION } from '@/store/mutation-types'
import Vue from 'vue'

const weekDays = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
export const extType = ['image/jpeg', 'image/png']
const type = ['jpg', 'png']

export function timeFix(val) {
  const time = new Date()
  const hour = time.getHours()
  return (val === undefined ? 'Hello ' : val) +
    (hour < 9 ? '早上好' : hour <= 11 ? '上午好' : hour <= 13 ? '中午好' : hour < 20 ? '下午好' : '晚上好')
}

export function welcome() {
  const arr = ['休息一会儿吧', '准备吃什么呢?', '要不要打一把 DOTA', '我猜你可能累了', '星期五下班,起飞!!!永不加班!']
  console.log(arr[4])
  const weekDay = moment(new Date()).format('llll')
  console.log(weekDay)
  const index = Math.floor(Math.random() * arr.length - 1)
  return weekDay.indexOf('星期五') === -1 ? arr[index] : arr[4]
}

/**
 * 触发 window.resize
 */
export function triggerWindowResizeEvent() {
  const event = document.createEvent('HTMLEvents')
  event.initEvent('resize', true, true)
  event.eventType = 'message'
  window.dispatchEvent(event)
}


/**
 * 过滤对象中为空的属性
 * @param obj
 * @returns {*}
 */
export function filterObj(obj) {
  if (!(typeof obj == 'object')) {
    return
  }

  for (let key in obj) {
    if (obj.hasOwnProperty(key)
      && (obj[key] == null || obj[key] == undefined || obj[key] == '')) {
      delete obj[key]
    }
  }
  return obj
}

export function handleScrollHeader(callback) {
  let timer = 0

  let beforeScrollTop = window.pageYOffset
  callback = callback || function() {
  }
  window.addEventListener(
    'scroll',
    event => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        let direction = 'up'
        const afterScrollTop = window.pageYOffset
        const delta = afterScrollTop - beforeScrollTop
        if (delta === 0) {
          return false
        }
        direction = delta > 0 ? 'down' : 'up'
        callback(direction)
        beforeScrollTop = afterScrollTop
      }, 50)
    },
    false
  )
}

/**
 * Remove loading animate
 * @param id parent element id or class
 * @param timeout
 */
export function removeLoadingAnimate(id = '', timeout = 1500) {
  if (id === '') {
    return
  }
  setTimeout(() => document.body.removeChild(document.getElementById(id)), timeout)
}

/**
 * 将秒转换为时间
 * @param value
 * @param format
 * @returns {string}
 * 具体参照:http://momentjs.cn/docs/
 */
export const formatTime = (value, format) => moment(moment.unix(value)).format(!format ? 'YYYY-MM-DD' : format)

/**
 * 图片
 * @param value用于hdfs
 * @returns {string}
 */
export const getServerImage = value => value.startsWith('http://') ? value : api.imgUrl + value

/**
 * 图片
 */

//export const getFtpServerImage = value =>

/**
 * 权限处理
 * @param value
 * @returns {boolean}
 */
export const hasPermissions = value => Vue.ls.get(PERMISSION).indexOf(value) === -1

/**
 * 将blob转换为base64位
 * @param value
 * @param callback
 */
export const getBase64 = (value, callback) => {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(value)
}

/**
 * 获取扩展名和base64位数据
 * @param value
 * @returns {{extName: *, base64Str: *}}
 */
export const splitBase64 = value => ({
  extName: getExtName(value.split('base64,')[0]),
  base64Str: value.split('base64,')[1]
})

export const getExtName = value => value.indexOf('image/jpeg') !== -1 ? type[0] : value.indexOf('image/png') !== -1 ? type[1] : ''


