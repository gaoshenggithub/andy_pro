import { axios } from '@/utils/request'

export  const api = {
  user: '/user',
  role: '/role',
  service: '/service',
  permission: '/permission',
  permissionNoPager: '/permission/no-pager',
  orgTree: '/org/tree',
  domain: '/andy/sys', // 公共请求前缀
  imgUrl: 'http://47.105.177.77:9999/' //图片服务服务器(FDFS)前缀
}

export default api

export function getUserList(parameter) {
  return axios({
    url: api.user,
    method: 'get',
    params: parameter
  })
}

export function getRoleList(parameter) {
  return axios({
    url: api.role,
    method: 'get',
    params: parameter
  })
}

export function getServiceList(parameter) {
  return axios({
    url: api.service,
    method: 'get',
    params: parameter
  })
}

export function getPermissions(parameter) {
  return axios({
    url: api.permissionNoPager,
    method: 'get',
    params: parameter
  })
}

export function getOrgTree(parameter) {
  return axios({
    url: api.orgTree,
    method: 'get',
    params: parameter
  })
}

// id == 0 add     post
// id != 0 update  put
export function saveService(parameter) {
  return axios({
    url: api.service,
    method: parameter.id === 0 ? 'post' : 'put',
    data: parameter
  })
}


//post
export function postAction(url, parameter) {
  return axios({
    url: api.domain + url,
    method: 'post',
    data: parameter
  })
}

//post method= {post | put}
export function httpAction(url, parameter, method) {
  return axios({
    url: api.domain + url,
    method: method,
    data: parameter
  })
}

//put
export function putAction(url, parameter) {
  return axios({
    url: api.domain + url,
    method: 'put',
    data: parameter
  })
}

//get
export function getAction(url, parameter) {
  return axios({
    url: api.domain + url,
    method: 'get',
    params: parameter
  })
}

//delete
export function deleteAction(url, parameter) {
  return axios({
    url: api.domain + url,
    method: 'delete',
    params: parameter
  })
}