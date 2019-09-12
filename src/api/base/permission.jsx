import { postAction, getAction, putAction, deleteAction } from '@/api/manage'

/**
 * 角色request
 */

const listPermission = params => getAction(`/sysRolePermission/listPermission/${params.roleId}/${params.type}`)
const batchSave = params => postAction(`/sysRolePermission/batchSave/${params.ids}/${params.roleId}/${params.permissionType}`)
export {
  listPermission, batchSave
}
