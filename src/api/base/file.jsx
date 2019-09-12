import { postAction, getAction, putAction, deleteAction } from '@/api/manage'

/**
 * 文件
 */


const list = params => getAction(`/sysFile/listPage/${params.current}/${params.pageSize}/${params.fileType}`, params)
const save = params => postAction(`/sysFile/save`, params)
const batchDelete = params => deleteAction(`/sysFile/batchDelete/${params.ids}`)

export {
  list,
  save,
  batchDelete
}

