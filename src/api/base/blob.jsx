import { postAction, getAction, putAction, deleteAction } from '@/api/manage'

/**
 * blob 博客管理
 */

const save = params => postAction(`/sysBlob/save`, params)

const list = params => getAction(`/sysBlob/userBlobListPage`, params)

const batchDelete = params => deleteAction(`/sysBlob/batchDelete/${params.ids}`)
/**
 * 恢复(批量)
 * @param params
 * @returns {*}
 */
const batchRecovery = params => putAction(`/sysBlob/batchRecovery/${params.ids}`)
/**
 * 彻底删除(批量)
 * @param params
 * @returns {*}
 */
const batchThoroughDelete = params => deleteAction(`/sysBlob/batchThoroughDelete/${params.ids}`)
/**
 * 恢复
 * @param params
 * @returns {*}
 */
const recovery = params => putAction(`/sysBlob/recovery/${params.id}`)
/**
 * 彻底删除
 * @param params
 * @returns {*}
 */
const thoroughDelete = params => deleteAction(`/sysBlob/thoroughDelete/${params.id}`)
/**
 *
 * @param params
 * @returns {*}
 */
const recycleBinListPage = params => getAction(`/sysBlob/recycleBinListPage/${params.current}/${params.pageSize}`, params)
export { save, list, batchDelete, recovery, thoroughDelete, batchThoroughDelete, batchRecovery, recycleBinListPage }