<template>
  <div class="main">
    <a-form
      id="formLogin"
      class="user-layout-login"
      ref="formLogin"
      :form="form"
      @submit="handleSubmit"
    >
      <a-tabs
        :activeKey="customActiveKey"
        :tabBarStyle="{ textAlign: 'center', borderBottom: 'unset' }"
        @change="handleTabClick"
      >
        <a-tab-pane key="tab1" tab="账号密码登录">
          <a-form-item>
            <a-input
              size="large"
              type="text"
              placeholder="账户:"
              v-decorator="[
                'username',
                {rules: [{ required: true, message: '请输入帐户名' }], validateTrigger: 'change'}
              ]"
            >
              <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input>
          </a-form-item>

          <a-form-item>
            <a-input
              size="large"
              type="password"
              autocomplete="false"
              placeholder="密码:"
              v-decorator="[
                'password',
                {rules: [{ required: true, message: '请输入密码' }], validateTrigger: 'blur'}
              ]"
            >
              <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input>
          </a-form-item>
        </a-tab-pane>
       <!-- <a-tab-pane key="tab2" tab="手机号登录">
          <a-form-item>
            <a-input size="large" type="text" placeholder="手机号"
                     v-decorator="['mobile', {rules: [{ required: true, pattern: /^1[34578]\d{9}$/, message: '请输入正确的手机号' }], validateTrigger: 'change'}]">
              <a-icon slot="prefix" type="mobile" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input>
          </a-form-item>

          <a-row :gutter="16">
            <a-col class="gutter-row" :span="16">
              <a-form-item>
                <a-input size="large" type="text" placeholder="验证码"
                         v-decorator="['captcha', {rules: [{ required: true, message: '请输入验证码' }], validateTrigger: 'blur'}]">
                  <a-icon slot="prefix" type="mail" :style="{ color: 'rgba(0,0,0,.25)' }"/>
                </a-input>
              </a-form-item>
            </a-col>
            <a-col class="gutter-row" :span="8">
              <a-button
                class="getCaptcha"
                tabindex="-1"
                :disabled="state.smsSendBtn"
                @click.stop.prevent="getCaptcha"
                v-text="!state.smsSendBtn && '获取验证码' || (state.time+' s')"
              ></a-button>
            </a-col>
          </a-row>
        </a-tab-pane>-->
       <!-- <a-tab-pane key="tab3" tab="邮箱密码登录">
          <a-form-item>
            <a-input
              size="large"
              type="text"
              placeholder="账户: 891554093@qq.com"
              v-decorator="[
                'email',
                {rules: [{ required: true, message: '请输入邮箱地址' },
                 {type:'email',message:'请输入正确邮箱格式' }]}
              ]"
            >
              <a-icon slot="prefix" type="mail" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input>
          </a-form-item>

          <a-form-item>
            <a-input
              size="large"
              type="password"
              autocomplete="false"
              placeholder="密码: gaosheng"
              v-decorator="[
                'password',
                {rules: [{ required: true, message: '请输入密码' }], validateTrigger: 'blur'}
              ]"
            >
              <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input>
          </a-form-item>
        </a-tab-pane>-->
      </a-tabs>

   <!--   <a-form-item>
        <a-checkbox v-decorator="['rememberMe']">自动登录</a-checkbox>
        <a href="#"
           class="forge-password"
           style="float: right;"
           @click="handlePass"
        >
          忘记密码
        </a>
        &lt;!&ndash;<router-link
          :to="{ name: 'recoverPassword' }"
          class="forge-password"
          style="float: right;"
        >忘记密码
        </router-link>&ndash;&gt;
      </a-form-item>-->

      <a-form-item style="margin-top:24px">
        <a-button
          size="large"
          type="primary"
          htmlType="submit"
          class="login-button"
          :loading="state.loginBtn"
          :disabled="state.loginBtn"
        >确定
        </a-button>
      </a-form-item>

     <!-- <div class="user-login-other">
        <router-link :to="{ name: 'SelfIntroduce' }">个人</router-link>
        &nbsp;&nbsp;&nbsp;
        <router-link class="register" :to="{ name: 'register' }">注册账户</router-link>
      </div>-->
    </a-form>

    <two-step-captcha
      v-if="requiredTwoStepCaptcha"
      :visible="stepCaptchaVisible"
      @success="stepCaptchaSuccess"
      @cancel="stepCaptchaCancel"
    ></two-step-captcha>
    <RecoverPassword ref='recoverPassword'></RecoverPassword>
  </div>
</template>

<script>
  import md5 from 'md5'
  import TwoStepCaptcha from '@/components/tools/TwoStepCaptcha'
  import { mapActions } from 'vuex'
  import { timeFix } from '@/utils/util'
  import { getSmsCaptcha, get2step } from '@/api/login'
  import Vue from 'vue'
  import { USER_NAME, USER_ID } from '@/store/mutation-types'
  import RecoverPassword from './RecoverPassword'
  import { sendPhone, invalidPhone } from '@/api/base/email'

  export default {
    components: {
      TwoStepCaptcha, RecoverPassword
    },
    data() {
      return {
        customActiveKey: 'tab1',
        loginBtn: false,
        // login type: 0 email, 1 username, 2 telephone
        loginType: 0,
        requiredTwoStepCaptcha: false,
        stepCaptchaVisible: false,
        form: this.$form.createForm(this),
        state: {
          time: 60,
          loginBtn: false,
          // login type: 0 email, 1 username, 2 telephone
          loginType: 0,
          smsSendBtn: false
        }
      }
    },
    created() {
    },
    methods: {
      ...mapActions(['Login', 'Logout']),
      // handler
      handlePass() {
        this.$refs.recoverPassword.handlePass()
        this.$refs.recoverPassword.title = '邮箱找回'
      },
      handleUsernameOrEmail(rule, value, callback) {
        const { state } = this
        const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/
        if (regex.test(value)) {
          state.loginType = 0
        } else {
          state.loginType = 1
        }
        callback()
      },
      handleTabClick(key) {
        this.customActiveKey = key
      },
      handleSubmit(e) {
        e.preventDefault()
        const {
          form: { validateFields },
          state,
          customActiveKey,
          Login
        } = this

        state.loginBtn = true
        if (customActiveKey === 'tab1' || customActiveKey === 'tab3') {
          validateFields([customActiveKey === 'tab1' ? 'username' : 'email', 'password'], { force: true }, (err, values) => {
            if (!err) {
              console.log(this.loginType)
              const { password, username, email } = values
              //loginParams.password = md5(values.password)
              let params
              if (customActiveKey === 'tab1') {
                params = { username, password, loginType: '1' }
              } else {
                params = { email, password, loginType: '3' }
              }
              Login(params)
                .then((res) => this.loginSuccess(res))
                .catch(err => this.requestFailed(err))
                .finally(() => {
                  state.loginBtn = false
                })
            } else {
              setTimeout(() => {
                state.loginBtn = false
              }, 600)
            }
          })
        } else {
          validateFields(['mobile', 'captcha'], { force: true }, (err, values) => {
            if (!err) {
              const { mobile, captcha } = values
              Login({ telephone: mobile, captcha, loginType: '2' })
                .then((res) => this.loginSuccess(res))
                .catch(err => this.requestFailed(err))
                .finally(() => {
                  state.loginBtn = false
                })
            } else {
              setTimeout(() => {
                state.loginBtn = false
              }, 600)
            }
          })
        }
      },
      getCaptcha(e) {
        e.preventDefault()
        const { form: { validateFields }, state } = this
        validateFields(['mobile'], { force: true }, (err, values) => {
          if (!err) {
            state.smsSendBtn = true

            const interval = window.setInterval(() => {
              if (state.time-- <= 0) {
                state.time = 60
                state.smsSendBtn = false
                window.clearInterval(interval)
              }
            }, 1000)

            const hide = this.$message.loading('验证码发送中..', 0)
            sendPhone(values.mobile).then(res => {
              console.log(res)
              if (res.code === '200') {
                console.log(res)
                setTimeout(hide, 2500)
                this.$notification['success']({
                  message: '提示',
                  description: '验证码获取成功，您的验证码为：' + res.data,
                  duration: 8
                })
              } else {
                setTimeout(hide, 1)
                clearInterval(interval)
                state.time = 60
                state.smsSendBtn = false
                this.requestFailed(res)
              }
            })
          }
        })
      },
      stepCaptchaSuccess() {
        this.loginSuccess()
      },
      stepCaptchaCancel() {
        this.Logout().then(() => {
          this.loginBtn = false
          this.stepCaptchaVisible = false
        })
      },

      loginSuccess(res) {
        console.log(res)
        this.$router.push({ name: 'dashboard' })
        setTimeout(() => {
          this.$notification.success({
            message: '欢迎',
            description: `${timeFix(Vue.ls.get(USER_NAME))}，欢迎回来`
          })
        }, 2000)
      },
      requestFailed(err) {
        this.$notification['error']({
          message: '错误',
          description: err.message,
          duration: 4
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .user-layout-login {
    label {
      font-size: 14px;
    }

    .getCaptcha {
      display: block;
      width: 100%;
      height: 40px;
    }

    .forge-password {
      font-size: 14px;
    }

    button.login-button {
      padding: 0 15px;
      font-size: 16px;
      height: 40px;
      width: 100%;
    }

    .user-login-other {
      text-align: left;
      margin-top: 24px;
      line-height: 22px;

      .item-icon {
        font-size: 24px;
        color: rgba(0, 0, 0, 0.2);
        margin-left: 16px;
        vertical-align: middle;
        cursor: pointer;
        transition: color 0.3s;

        &:hover {
          color: #1890ff;
        }
      }

      .register {
        float: right;
      }
    }
  }
</style>
