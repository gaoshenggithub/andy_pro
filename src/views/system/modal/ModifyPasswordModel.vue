<template>
  <div>
    <a-drawer
      :title='title'
      :placement='placement'
      :closable='false'
      @close='close'
      :visible='visible'
    >
      <div>
        <a-spin :spinning="configLoad">
          <a-form :form="form">
            <a-form-item
              label="密码"
              :labelCol='labelCol'
              :wrapperCol='wrapperCol'>
              <a-input size="large" type="password" placeholder="密码"
                       v-decorator="['password',validatorRules.password]">
                <a-icon slot="prefix" type="lock"
                        :style="{ color: 'rgba(0,0,0,.25)' }"/>
              </a-input>

            </a-form-item>
            <a-form-item
              label="再次确认密码"
              :labelCol='labelCol'
              :wrapperCol='wrapperCol'>
              <a-input
                type="password"
                size="large"
                v-decorator="['confirmPassword',validatorRules.confirmPassword]"
                placeholder="确认密码">
                <a-icon slot="prefix" type="lock"
                        :style="{ color: 'rgba(0,0,0,.25)' }"/>
              </a-input>
            </a-form-item>
            <a-form-item
              label="加密方式"
              :labelCol='labelCol'
              :wrapperCol='wrapperCol'
            >
              <a-select v-model="encryption" style="width: 300px" size="large" @change="handleChange">
                <a-select-option value="MD5">MD5</a-select-option>
                <a-select-option value="SHA1">SHA1</a-select-option>
                <a-select-option value="SHA256">SHA256</a-select-option>
                <a-select-option value="SHA384">SHA384</a-select-option>
                <a-select-option value="SHA512">SHA512</a-select-option>
              </a-select>
            </a-form-item>
          </a-form>
        </a-spin>
      </div>
      <div
        class='butSubmit'
      >
        <a-button
          style="margin-right: 8px"
          @click="close"
        >
          退出
        </a-button>
        <a-button @click="modify" type="primary">
          确认修改
        </a-button>
      </div>
    </a-drawer>
  </div>
</template>

<script>
  import { modifyPassword } from '@/api/base/user'

  export default {
    name: 'ModifyPasswordModel',
    data() {
      return {
        configLoad: false,
        encryption: 'MD5',
        validatorRules: {
          password: {
            rules: [{ required: true, message: '请输入密码' }],
            validateTrigger: 'blur'
          },
          confirmPassword: {
            rules: [{ required: true, message: '请再次输入密码' }]
          }
        },

        state: {
          time: 60,
          smsSendBtn: false,
          passwordLevel: 0,
          passwordLevelChecked: false,
          percent: 10,
          progressColor: '#FF0000'
        },
        labelCol: { lg: { span: 7 }, sm: { span: 7 } },
        wrapperCol: { lg: { span: 7 }, sm: { span: 17 } },
        title: '',
        visible: false,
        placement: 'top',
        placements: ['bottom', 'left', 'right', 'top'],
        form: this.$form.createForm(this),
        _id: ''
      }
    },
    methods: {
      handleChange(value) {
        this.$message.info(`选中${value}加密方式`)
      },
      modify() {
        this.form.validateFields((err, values) => {
          const { confirmPassword, password } = values
          if (!(password === confirmPassword)) {
            console.log('---')
            this.$notification.error({
              placement: 'topRight',
              message: '修改错误',
              description: '两次密码不一致'
            })
            return
          }
          this.configLoad = true
          if (!err) {
            const params = Object.assign(values, { encryption: this.encryption, id: this._id })
            modifyPassword(params).then(res => {
              let type
              if (res.code === '200') {
                type = 'success'
              } else {
                type = 'error'
              }
              this.$notification[type]({
                placement: 'topRight',
                message: type === 'error' ? '错误' : '正确',
                description: type === 'error' ? '修改失败' : '修改成功'
              })
            }).finally(() => {
              this.configLoad = false
              this.visible = false
              this.close()
            })
          }
        })
      },
      show(id) {
        this._id = id
        this.visible = true
      },
      close() {
        this.visible = false
        this.form.resetFields()
        this._id = ''
      }
    }
  }
</script>

<style scoped>
  .butSubmit {
    position: absolute;
    bottom: 0;
    width: 100%;
    border-top: 1px solid #e8e8e8;
    padding: 10px 16px;
    text-align: right;
    left: 0;
    background: #fff;
    border-radius: 0 0 4px 4px;
  }

</style>