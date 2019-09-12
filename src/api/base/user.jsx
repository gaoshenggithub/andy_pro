import { postAction, getAction, putAction, deleteAction } from '@/api/manage'

/**
 * 系统用户
 */

const listPage = params =>
  getAction(`/sysUser/listPage/${params.current}/${params.pageSize}`, params)

const deleteById = params =>
  putAction(`/sysUser/delete/${params.userId}`)

const modifyStatus = params =>
  putAction(`/sysUser/modifyStatus/${params.userId}/${params.status}`)

const modifyPassword = params =>
  putAction(`/sysUser/modifyPassword`, params)

const detail = params => getAction(`/sysUser/detail/${params.userId}`)

const save = params => postAction(`/sysUser/save`, params)

const update = params => putAction(`/sysUser/update`, params)

const batchDelete = params => deleteAction(`/sysUser/batchDelete/${params.ids}`)

const batchFrozen = params => putAction(`/sysUser/batchFrozen/${params.ids}/${params.status}`)

const forwardPassword = params => putAction(`/sysUser/forwardPassword`, params)

const validateUsername = params => getAction(`/sysUser/validateUsername/${params.username}`)

const validateEmail = params => getAction(`/sysUser/validateEmail/${params.email}`)

const validatePhone = params => getAction(`/sysUser/validatePhone/${params.phone}`)

const findBasicInfo = params => getAction(`/sysUser/findBasicInfo/${params.userId}`)
const updateBasicSetting = params => putAction(`/sysUser/updateBasicSetting`, params)
export {
  listPage,
  findBasicInfo,
  updateBasicSetting,
  forwardPassword,
  deleteById,
  modifyStatus,
  modifyPassword,
  detail,
  update,
  save,
  batchDelete,
  batchFrozen,
  validateUsername,
  validateEmail,
  validatePhone
}
