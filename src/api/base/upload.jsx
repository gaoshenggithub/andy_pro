import { postAction, getAction, putAction, deleteAction } from '@/api/manage'

const uploadFile = '/andy_pro/andy/sys/fileUpload/uploadRequest'
const uploadFtp = '/andy_pro/andy/sys/fileUpload/uploadFtp'
const tinymceEditorUpLoad = params => postAction(`/fileUpload/uploadRequest`, params)
const base64Upload = params => postAction('/fileUpload/uploadBase64', params)
const base64UploadFtp = params => postAction('/fileUpload/uploadBase64Ftp', params)
export { uploadFile, tinymceEditorUpLoad, base64Upload, uploadFtp, base64UploadFtp }