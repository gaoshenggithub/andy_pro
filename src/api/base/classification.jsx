import { postAction, getAction, putAction, deleteAction } from '@/api/manage'

const list = params => getAction(`/sysClassification/listPage/${params.current}/${params.pageSize}`, params)

const save = params => postAction(`/sysClassification/save`, params)

const deleteById = params => deleteAction(`/sysClassification/delete/${params.id}`)

const update = params => putAction(`/sysClassification/update`, params)

const detail = params => getAction(`/sysClassification/detail/${params.id}`)
export {
  list, save, deleteById, update, detail
}