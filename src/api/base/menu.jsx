import { postAction, getAction, putAction, deleteAction } from '@/api/manage'

/**
 * 菜单request
 */

const sysMenuAdd = (params) => postAction('/sysMenu/save', params)

const list = (params) => getAction('/sysMenu/list', params)

const sysMenuList = (params) => getAction('/sysMenu/menuList', params)

const detail = (params) => getAction(`/sysMenu/detail/${params.id}`)

const update = params => putAction(`/sysMenu/update`, params)

const deleteById = (id) => deleteAction(`/sysMenu/delete/${id}`)
export {
  deleteById,
  detail,
  list,
  sysMenuAdd,
  sysMenuList,
  update
}
