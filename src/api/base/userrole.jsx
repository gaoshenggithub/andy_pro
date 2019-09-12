import { postAction, getAction, putAction, deleteAction } from '@/api/manage'

/**
 *  角色用户Request
 */

const save = params => postAction(`/sysUserRole/save`, params)
const update = params => putAction(`/sysUserRole/update`, params)
export { save, update }
