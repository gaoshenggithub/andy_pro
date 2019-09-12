import { postAction, getAction, putAction, deleteAction } from '@/api/manage'

const list = params => getAction(`/sysDanger/listPage/${params.current}/${params.pageSize}`, params)
const count = () => getAction(`/sysDanger/getCount`)
const update = id => putAction(`/sysDanger/update/${id}`)
const deleteById = id => deleteAction(`/sysDanger/delete/${id}`)
const detail = id => getAction(`/sysDanger/detail/${id}`)
const getPointLineData = () => getAction(`/sysDanger/getPointLineData`)
const batchDelete = ids => deleteAction(`/sysDanger/batchDelete/${ids}`)
export {
  list, count, update, deleteById, detail, getPointLineData
}