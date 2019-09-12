import { postAction, getAction, putAction, deleteAction } from '@/api/manage'

const list = params => getAction(`/sysDictItem/listPage/${params.current}/${params.pageSize}`, params)

const update = params => putAction(`/sysDictItem/update`, params)

const add = params => postAction(`/sysDictItem/save`, params)

const deleteById = params => deleteAction(`/sysDictItem/delete/${params.id}`)

const detail = params => getAction(`/sysDictItem/detail/${params.id}`)
export {
  list, update, add, deleteById, detail
}