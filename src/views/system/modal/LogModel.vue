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
          <a-input placeholder="请输入请求路径" v-decorator="['requestUrl', {}]"
                   :readOnly="true"
          ></a-input>
        </a-form-item>
        <a-form-item label='请求参数' :labelCol='labelCol' :wrapperCol='wrapperCol'>
          <a-textarea placeholder="请求参数" :rows="10" v-decorator="['requestParam',{}]"></a-textarea>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { detail } from '@/api/base/log'
  import pick from 'lodash.pick'

  export default {
    name: 'LogModel',
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
      },
      handleOk() {
        this.handleCancel()
      },
      show(id) {
        this.visible = true
        this.confirmLoading = true
        detail({ id }).then(res => {
          this.model = res.data
          this.$nextTick(() => {
            this.form.setFieldsValue(pick(this.model, 'requestParam', 'requestUrl'))
          })
          this.confirmLoading = false
        })
      }
    }
  }
</script>

<style scoped>

</style>