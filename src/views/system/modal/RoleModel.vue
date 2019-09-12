<template>
  <a-modal
    :title="title"
    :width="width"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    :okButtonProps="disabledSubmit"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label='角色名称' :labelCol='labelCol' :wrapperCol='wrapperCol'>
          <a-input placeholder="请输入角色名称" v-decorator="['roleName', validatorRules.roleName]"></a-input>
        </a-form-item>
        <a-form-item label='角色编码' :labelCol='labelCol' :wrapperCol='wrapperCol'>
          <a-input placeholder="请输入角色编码" v-decorator="['roleCode', validatorRules.roleCode]"></a-input>
        </a-form-item>
        <a-form-item label='描述' :labelCol='labelCol' :wrapperCol='wrapperCol'>
          <a-textarea placeholder="请输入描述" :rows="4" v-decorator="['description',{}]"/>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { save, detail, update } from '@/api/base/role'
  import pick from 'lodash.pick'

  export default {
    name: 'RoleModel',
    data() {
      return {
        disabledSubmit: { props: { disabled: false } },
        title: '',
        form: this.$form.createForm(this),
        visible: false,
        width: 800,
        model: {},
        confirmLoading: false,
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        },
        validatorRules: {
          roleName: {
            rules: [{ required: true, message: '请输入角色名称' }]
          },
          roleCode: {
            rules: [{ required: true, message: '请输入角色编码' }]
          }
        }
      }
    },
    methods: {
      add() {
        this.edit({})
      },
      edit(record) {
        this.model = record
        this.confirmLoading = true
        this.visible = true
        if (this.model.id) {
          detail(Object.assign(this.model)).then(res => {
            if (res.code === '200') {
              this.$message.success('成功')
              this.model = res.data
            } else {
              this.$message.error('失败')
            }
            this.confirmLoading = false
          })
          this.$nextTick(() => {
            this.form.setFieldsValue(pick(this.model, 'roleName', 'roleCode', 'description'))
          })
        } else {
          this.confirmLoading = false
        }
      },
      close() {
        this.$emit('close')
        this.visible = false
        this.form.resetFields()
        this.model = {}
        this.disabledSubmit.props.disabled = false
      },
      handleOk() {
        this.form.validateFields((err, values) => {
          if (!err) {
            this.confirmLoading = true
            const params = Object.assign(values, { id: this.model.id })
            let obj
            if (!this.model.id) {
              obj = save(params)
            } else {
              obj = update(params)
            }
            obj.then(res => {
              if (res.code === '200') {
                this.$message.success('成功')
                this.$emit('ok')
              } else {
                this.$message.error('失败')
              }
            }).finally(() => {
              this.confirmLoading = false
              this.visible = false
            })
          }
        })
      },
      handleCancel() {
        this.close()
      }
    }
  }
</script>

<style scoped>

</style>