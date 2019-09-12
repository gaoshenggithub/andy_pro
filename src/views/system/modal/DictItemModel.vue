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
        <a-form-item label='字典项key' :labelCol='labelCol' :wrapperCol='wrapperCol'>
          <a-input placeholder='请输入字典项Key' v-decorator="['itemText', validatorRules.itemText]"
          ></a-input>
        </a-form-item>
        <a-form-item label='字典项值Value' :labelCol='labelCol' :wrapperCol='wrapperCol'>
          <a-input placeholder='请输入字典项值' v-decorator="['itemValue', validatorRules.itemValue]"></a-input>
        </a-form-item>
        <a-form-item label='描述' :labelCol='labelCol' :wrapperCol='wrapperCol'>
          <a-textarea :rows='4' v-decorator="['description',{}]"></a-textarea>
        </a-form-item>
        <a-form-item label='是否启用' :labelCol='labelCol' :wrapperCol='wrapperCol'>
          <a-switch checkedChildren="启用" unCheckedChildren="禁用" v-model='status'/>
        </a-form-item>
        <a-form-item label='排序号' :labelCol='labelCol' :wrapperCol='wrapperCol'>
          <a-input-number :min="1" :max="100000" decimalSeparator='0' :precision='0' v-model='sortValue'
                          @change="handleSortChange"/>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { update, add, detail } from '@/api/base/dictitem'
  import pick from 'lodash.pick'

  export default {
    name: 'DictItemModel',
    data() {
      return {
        sortValue: 1,
        status: true,
        form: this.$form.createForm(this),
        confirmLoading: false,
        visible: false,
        title: '',
        width: 800,
        model: {},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        },
        validatorRules: {
          itemText: {
            rules: [
              { required: true, message: '字典项key不能为空' }
            ]
          },
          itemValue: {
            rules: [
              { required: true, message: '字典项值不能为空' }
            ]
          }
        }
      }
    },
    methods: {
      handleSortChange(value) {
        this.sortValue = value
      },
      handleSubmit() {
        this.form.validateFields((err, values) => {
          if (!err) {
            this.confirmLoading = true
            let params = Object.assign(values, {
              dictId: this.model.itemId,
              status: this.status ? '1' : '0',
              sortOrder: this.sortValue
            })
            let obj
            if (!this.model.id) {
              obj = add(params)
            } else {
              params = Object.assign(params, { id: this.model.id })
              obj = update(params)
            }
            let messageType = 'success'
            obj.then(res => {
              if (res.code === '200') {
                messageType = 'success'
                this.$emit('ok')
              } else {
                messageType = 'error'
              }
              this.$message[messageType](res.message)
            }).finally(() => {
              this.confirmLoading = false
              this.visible = false
            })
          }
        })
      },
      close() {
        this.visible = false
        this.form.resetFields()
        this.sortValue = 1
        this.status = true
      },
      add(itemId) {
        this.edit({ itemId })
      },
      edit(value) {
        this.model = value
        this.visible = true
        this.confirmLoading = true
        if (!this.model.id) {
          this.confirmLoading = false
        } else {
          detail({ id: this.model.id }).then(res => {
            this.model = res.data
            this.$nextTick(() =>
              this.form.setFieldsValue(pick(this.model, 'itemText', 'itemValue', 'description'))
            )
            this.status = this.model.status === '1'
            this.sortValue = this.model.sortOrder
            this.confirmLoading = false
          })
        }

      }
    }
  }
</script>

<style scoped>

</style>