import { postAction, getAction, putAction, deleteAction } from '@/api/manage'

const list = params => getAction(`/sysDict/listPage/${params.current}/${params.pageSize}`, params)

const save = params => postAction(`/sysDict/save`, params)

const edit = params => putAction(`/sysDict/update`, params)

const detail = params => getAction(`/sysDict/detail/${params.id}`)

const deleteById = params => deleteAction(`/sysDict/delete/${params.id}`)
export {
  list,
  deleteById,
  detail,
  edit,
  save
}