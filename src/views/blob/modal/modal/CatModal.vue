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
        <a-form-item label='分类' :labelCol='labelCol' :wrapperCol='wrapperCol'>
          <a-input placeholder="请输入分类" v-decorator="['catName', validatorRules.catName]"></a-input>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { save, update, detail } from '@/api/base/classification'
  import pick from 'lodash.pick'

  export default {
    name: 'CatModal',
    data() {
      return {
        title: '',
        width: 800,
        visible: false,
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
          catName: {
            rules: [
              { required: true, message: '请输入分类' }
            ]
          }
        },
        model: {}
      }
    },
    methods: {
      handleOk() {
        this.form.validateFields((err, values) => {
          if (!err) {
            this.confirmLoading = true
            let params
            let obj
            if (!this.model.id) {
              params = Object.assign(values)
              obj = save(params)
            } else {
              params = Object.assign(values, { id: this.model.id })
              obj = update(params)
            }
            obj.then(res => {
              console.log(res.code)
              if (res.code === '200') {
                this.$message.success('成功')
              } else {
                this.$message.error('失败')
              }
            }).finally(() => {
              this.confirmLoading = false
              this.close()
            })
          }
        })
      },
      close() {
        this.visible = false
        this.form.resetFields()
      },
      handleCancel() {
        this.close()
      },
      add() {
        this.edit({})
      },
      edit(value) {
        this.model = value
        this.visible = true
        this.confirmLoading = true
        if (this.model.id) {
          detail({ id: this.model.id }).then(res => {
            if (res.code === '200') {
              this.model = res.data
            }
            this.$nextTick(() => {
              this.form.setFieldsValue(pick(this.model, 'catName'))
            })
            this.confirmLoading = false
          })
        } else {
          this.confirmLoading = false
        }
      }
    }
  }
</script>

<style scoped>

</style>