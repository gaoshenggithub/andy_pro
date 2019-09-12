import { postAction, getAction, putAction, deleteAction } from '@/api/manage'

/**
 * 日志request
 */


const list = (params) => getAction(`/sysLog/listPage/${params.current}/${params.pageSize}`, params)

const detail = (params) => getAction(`/sysLog/detail/${params.id}`)
export {
  list,
  detail
}

