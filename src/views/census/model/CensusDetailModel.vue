<template>
  <a-modal
    :title="title"
    :width="width"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label='请求路径' :labelCol='labelCol' :wrapperCol='wrapperCol'>
          <a-input placeholder="请求路径" v-decorator="['requestUrl', {}]"
                   :readOnly="true"></a-input>
          <a style='color: lawngreen' @click="handleCopy('requestUrl')">复制</a>
        </a-form-item>
        <a-form-item label='栈信息' :labelCol='labelCol' :wrapperCol='wrapperCol'>
          <a-input placeholder="栈信息" v-decorator="['stack', {}]"
                   :readOnly="true"></a-input>
          <a style='color: lawngreen' @click="handleCopy('stack')">复制</a>
        </a-form-item>
        <a-form-item label='异常信息' :labelCol='labelCol' :wrapperCol='wrapperCol'>
          <a-textarea placeholder="异常信息" :rows="20" v-decorator="['message',{}]" :readOnly="true"></a-textarea>
          <a style='color: lawngreen' @click='handleCopy("message")'>复制</a>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import pick from 'lodash.pick'
  import { detail } from '@/api/base/sysdanger'

  export default {
    name: 'CensusDetailModel',
    data() {
      return {
        form: this.$form.createForm(this),
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        },
        width: 1200,
        title: '',
        visible: false,
        confirmLoading: false,
        disabledSubmit: false,
        model: {}
      }
    },
    methods: {
      handleCancel() {
        this.visible = false
        this.form.resetFields()
        this.$emit('ok')
      },
      handleOk() {
        this.handleCancel()
      },
      show(id) {
        this.visible = true
        this.confirmLoading = true
        detail(id).then(res => {
          this.model = res.data
          this.$nextTick(() => {
            this.form.setFieldsValue(pick(this.model, 'stack', 'message', 'requestUrl'))
          })
          this.confirmLoading = false
        })
      },
      handleCopy(value) {
        this.$copyText(this.getCopyValue(value)).then(message => this.$message.success(`复制成功`)).catch(err => this.$message.error(`复制失败`))
      },
      getCopyValue(value) {
        return value === 'message' ? this.model.message :
          value === 'stack' ? this.model.stack :
            value === 'requestUrl' ? this.model.requestUrl : ''
      }
    }
  }
</script>

<style scoped>

</style>