<template>
  <div>
    <a-drawer
      :title='title'
      :placement='placement'
      :height='height'
      :closable='false'
      @close='close'
      :visible='visible'
    >
      <div>
        <a-form :form="form">
          <a-form-item
            label="邮箱"
            :labelCol='labelCol'
            :wrapperCol='wrapperCol'>
            <a-input size="large" type="text" placeholder="邮箱"
                     v-decorator="['email',validatorRules.email]">
              <a-icon slot="prefix" type="mail"
                      :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input>

          </a-form-item>
          <a-form-item
            label="验证码"

            :labelCol='labelCol'
            :wrapperCol='wrapperCol'>
            <a-input
              size="large"
              v-decorator="[
            'code',validatorRules.code
          ]"
              placeholder="验证码"/>
          </a-form-item>
          <a-form-item
            v-show="showPassword"
            label="密码"
            :labelCol='labelCol'
            :wrapperCol='wrapperCol'>
            <a-input size="large" type="password" placeholder="密码"
                     v-decorator="['password',validatorRules.password]">
              <a-icon slot="prefix" type="lock"
                      :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input>

          </a-form-item>
        </a-form>
      </div>
      <div
        class='butSubmit'
      >
        <a-button
          style="margin-right: 8px"
          @click="sendValCode"
          type='primary'
          :loading="loading"
        >
          {{content}}
        </a-button>
        <a-button
          style="margin-right: 8px"
          @click="close"
        >
          退出
        </a-button>
        <a-button @click="handleSubmit" type="primary">
          确认修改
        </a-button>
      </div>
    </a-drawer>
  </div>
</template>

<script>
  import { sendEmail } from '@/api/base/email'
  import { forwardPassword } from '@/api/base/user'

  export default {
    name: 'RecoverPassword',
    data() {
      return {
        content: '发送验证码',
        totalTime: 5,
        showPassword: false,
        height: 320,
        loading: false,
        validatorRules: {
          email: {
            rules: [
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入正确格式邮箱' }],
            validateTrigger: 'blur'
          },
          code: {
            rules: [{ required: true, message: '请输入标题' }]
          },
          password: {
            rules: [{ required: true, message: '请输入密码' }]
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
        form: this.$form.createForm(this)
      }
    },
    methods: {
      handleSecond() {
        this.content = this.totalTime + 's后重新发送'
        let clock = window.setInterval(() => {
          this.totalTime--
          this.content = this.totalTime + 's后重新发送'
          if (this.totalTime < 0) {
            window.clearInterval(clock)
            this.content = '重新发送验证码'
            this.totalTime = 5
            this.loading = false
          }
        }, 1000)
      },
      handleSubmit() {
        this.form.validateFields((err, values) => {
          if (!err) {
            forwardPassword(Object.assign(values)).then(res => {
              let type = ''
              console.log(res)
              if (res.code === '200') {
                type = 'success'
                this.showPassword = true
              } else {
                type = 'error'
              }
              this.$notification[type]({
                placement: 'topRight',
                message: type === 'success' ? '修改成功' : '修改失败',
                description: res.message
              })
            })
          }
        })
      },

      sendValCode() {
        this.form.validateFields(['email'], { force: true }, (err, values) => {
          const { email } = values
          if (!err) {
            sendEmail(email).then(res => {
              let type = ''
              console.log(res)
              if (res.code === '200') {
                type = 'success'
                this.handleSecond()
                this.showPassword = true
                this.loading = true
              } else {
                type = 'error'
              }
              this.$notification[type]({
                placement: 'topRight',
                message: type === 'success' ? '邮件发送成功' : '邮件发送失败',
                description: res.message
              })
            })
          }
        })
      },
      handlePass() {
        this.visible = true
      },
      close() {
        this.showPassword = false
        this.visible = false
        this.form.resetFields()
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