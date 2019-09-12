import { postAction, getAction, putAction, deleteAction } from '@/api/manage'

/**
 * 验证码request
 */



const sendEmail = email => getAction(`/email/sendEmail/${email}`)
const sendPhone = phone => getAction(`/email/sendPhone/${phone}`)
const invalidPhone = params => getAction(`/email/invalidPhone/${params.phone}/${params.code}`)
export { sendEmail,invalidPhone,sendPhone }
