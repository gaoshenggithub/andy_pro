<template>
  <a-modal
    :title='title'
    style='top: 100px;right: 100px'
    :width='width'
    :visible='visible'
    :confirmLoading='confirmLoading'
    @ok='handleSubmit'
    @cancel='close'
  >
    <a-spin :spinning='confirmLoading'>
      <a-form :form='form'>
        <a-form-item label='字典名称' :labelCol='labelCol' :wrapperCol='wrapperCol'>
          <a-input placeholder='请输入字典名称' v-decorator="['dictName', validatorRules.dictName]"
          ></a-input>
        </a-form-item>
        <a-form-item label='字典编码' :labelCol='labelCol' :wrapperCol='wrapperCol'>
          <a-input placeholder='请输入字典编码' v-decorator="['dictCode', validatorRules.dictCode]"
          ></a-input>
        </a-form-item>
        <a-form-item label='描述' :labelCol='labelCol' :wrapperCol='wrapperCol'>
          <a-textarea :rows='4' placeholder='...' v-decorator="['description',validatorRules.description]"></a-textarea>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { save, edit, detail } from '@/api/base/dict'
  import pick from 'lodash.pick'

  export default {
    name: 'DictModel',
    data() {
      return {
        visible: false,
        title: '',
        width: 800,
        confirmLoading: false,
        form: this.$form.createForm(this),
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        },
        validatorRules: {
          dictName: {
            rules: [
              { required: true, message: '字典名称不能为空' }
            ]
          },
          dictCode: {
            rules: [
              { required: true, message: '字典编码不能为空' }
            ]
          },
          description: {
            rules: [
              { required: true, message: '描述不能为空' }
            ]
          }
        },
        model: {}
      }
    },

    methods: {
      close() {
        this.visible = false
        this.model = {}
        this.form.resetFields()
      },
      handleSubmit() {
        this.form.validateFields((err, values) => {
          if (!err) {
            let obj
            if (!this.model.id) {
              const params = Object.assign(values)
              obj = save(params)
            } else {
              const params = Object.assign(values, { id: this.model.id })
              obj = edit(params)
            }
            obj.then(res => {
              if (res.code === '200') {
                this.$message.success('成功')
                this.$emit('ok')
                this.close()
              } else {
                this.$notification.error({
                  placement: 'topRight',
                  message: '错误',
                  description: res.message
                })
              }
            }).finally(() => {
              this.confirmLoading = false
              this.visible = false

            })
          }
        })
      },
      add() {
        this.edit({})
      },
      edit(value) {
        this.model = value
        console.log(this.model)
        this.visible = true
        if (this.model.id) {
          this.confirmLoading = true
          detail({ id: this.model.id }).then(res => {
            if (res.code === '200') {
              this.model = res.data
              console.log(res.data)
              let fieldsVal = pick(this.model, 'dictName', 'dictCode', 'description')
              this.$nextTick(() => {
                this.form.setFieldsValue(fieldsVal)
              })
              this.confirmLoading = false
            } else {
              this.$notification.error({
                placement: 'topRight',
                message: '消息提示',
                description: res.message
              })
              this.visible = false
            }
          })
        }
      }
    }
  }
</script>

<style scoped>

</style>