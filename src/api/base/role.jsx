import { postAction, getAction, putAction, deleteAction } from '@/api/manage'

/**
 * 角色request
 */

const listPage = params => getAction(`/sysRole/listPage/${params.current}/${params.pageSize}`, params)

const save = params => postAction(`/sysRole/save`, params)

const detail = params => getAction(`/sysRole/detail/${params.id}`)

const deleteById = params => deleteAction(`/sysRole/delete/${params.id}`)

const batchDelete = params => deleteAction(`/sysRole/batchDelete/${params.ids}`)
const update = params => putAction(`/sysRole/update`, params)

const list = params => getAction(`/sysRole/list/${params.userId}`)
export {
  listPage, save, detail, deleteById, batchDelete, update, list
}

