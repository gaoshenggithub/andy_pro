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
        <a-form-item
          label='分配角色' :labelCol='labelCol' :wrapperCol='wrapperCol'
        >
          <template>
            <a-select mode="multiple" style="width: 100%" v-model="roleIds"
                      placeholder="请选择角色">
              <a-select-option v-for="(role,index) in roleList" :key="role.id" :index="index">{{role.roleName}}
              </a-select-option>
            </a-select>
          </template>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { update } from '@/api/base/userrole'
  import { list } from '@/api/base/role'

  export default {
    name: 'UserRoleModel',
    data() {
      return {
        roleIds: [],
        roleList: [],
        confirmLoading: false,
        visible: false,
        width: 700,
        title: '',
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        },
        form: this.$form.createForm(this),
        _userId: ''
      }
    },
    methods: {
      initRole() {
        this.confirmLoading = true
        const userId = this._userId
        list({ userId }).then((res => {
          if (res.code === '200') {
            this.roleList = res.data.list
            console.log(res.data.list)
            console.log(res.data.sysUserRoleVOS)
            this.roleIds = res.data.sysUserRoleVOS.map(e => e.roleId)
            this.confirmLoading = false
          }
          this.confirmLoading = false
        }))
      },
      close() {
        this.$emit('close')
        this.visible = false
        this.roleList = []
        this.roleIds = []
      },

      handleOk() {
        this.form.validateFields((err, values) => {
          if (this.roleIds.length === 0) {
            this.$notification.error({
              placement: 'topRight',
              message: '角色分配',
              description: '请选择角色'
            })
            return
          }
          this.confirmLoading = true
          update({ userId: this._userId, roleId: this.roleIds.toString() })
            .then(res => {
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
        })
      },
      handleCancel() {
        this.close()
      },
      edit(id) {
        this.roleList = []
        this.roleIds = []
        this._userId = id
        this.visible = true
        this.initRole()
      }
    }
  }
</script>

<style scoped>

</style>