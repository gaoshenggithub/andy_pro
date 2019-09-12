<template>
  <div class="account-settings-info-view">
    <a-row :gutter="16">
      <a-col :md="24" :lg="16">
        <a-spin :spinning="spinningLoad" tip="loading...">
          <a-form layout="vertical" :form="form">
            <a-form-item
              label="昵称">
              <a-input placeholder="给自己起个名字" v-decorator="['name',{}]"/>
            </a-form-item>
            <a-form-item
              label="Bio"
            >
              <a-textarea rows="4" placeholder="..." v-decorator="['introduce',{}]"></a-textarea>
            </a-form-item>

            <a-form-item
              label="电子邮件"
            >
              <a-input placeholder="exp@admin.com" v-decorator="['email',validatorRules.email]"/>
            </a-form-item>
            <a-form-item
              label="加密方式"
            >
              <a-select v-model="encryption">
                <a-select-option value="MD5">MD5</a-select-option>
                <a-select-option value="SHA1">SHA1</a-select-option>
                <a-select-option value="SHA256">SHA256</a-select-option>
                <a-select-option value="SHA384">SHA384</a-select-option>
                <a-select-option value="SHA512">SHA512</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item
              label="登录密码"
              :required="false"
            >
              <a-input placeholder="密码" v-decorator="['password',{}]"/>
            </a-form-item>

            <a-form-item>
              <a-button type="primary" @click="handleSubmit">提交</a-button>
              <a-button style="margin-left: 8px" @click="handleSubmit">保存</a-button>
            </a-form-item>
          </a-form>
        </a-spin>
      </a-col>
      <a-col :md="24" :lg="8" :style="{ minHeight: '180px' }">
        <!--@click="$refs.modal.edit(1)"-->
        <div class="ant-upload-preview" >
          <a-icon type="cloud-upload-o" class="upload-icon"/>
          <div class="mask">
            <a-icon type="plus"/>
          </div>
          <img :src="option.img"/>
        </div>
      </a-col>
    </a-row>
    <avatar-modal ref="modal">
    </avatar-modal>
  </div>
</template>

<script>
  import AvatarModal from './AvatarModal'
  import {
    validateEmail, findBasicInfo,
    updateBasicSetting
  } from '@/api/base/user'
  import { USER_ID } from '../../../store/mutation-types'
  import Vue from 'vue'
  import pick from 'lodash.pick'
  import {getServerImage} from '../../../utils/util'

  export default {
    components: {
      AvatarModal
    },
    created() {
      this.userId = Vue.ls.get(USER_ID)
      console.log('----------------------------------------------')
      this.loadData(this.userId)
    },
    data() {
      return {
        spinningLoad: false,
        userId: '',
        form: this.$form.createForm(this),
        encryption: 'MD5',
        validatorRules: {
          email: {
            rules: [
              { required: true, message: '请输入邮箱!' }, {
                type: 'email', message: '请输入正确邮箱格式!'
              }]
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
        preview: {},
        model: {},
        option: {
          img: '',
          info: true,
          size: 1,
          outputType: 'jpeg',
          canScale: false,
          autoCrop: true,
          // 只有自动截图开启 宽度高度才生效
          autoCropWidth: 180,
          autoCropHeight: 180,
          fixedBox: true,
          // 开启宽度和高度比例
          fixed: true,
          fixedNumber: [1, 1]
        }
      }
    },

    methods: {
      loadData(value) {
        this.spinningLoad = true
        console.log(value)
        findBasicInfo({ userId: value }).then(res => {
          if (res.code === '200') {
            console.log(res.data)
            this.model = res.data
            this.option.img=getServerImage(this.model.avatar)
            this.$nextTick(() => {
              this.form.setFieldsValue(pick(this.model, 'name', 'username', 'email', 'introduce', 'password'))
            })
            this.spinningLoad = false

          }
        })
      },
      validateEmail(value, userId) {
        if (!value) {
          return
        }
        validateEmail({ email: value, userId }).then(res => {
          if (res.code === '200') {
          } else {
            this.$notification.error({
              placement: 'topRight',
              message: '邮箱重复',
              description: res.message
            })
            return
          }
        })
      },
      handleSubmit() {
        this.form.validateFields((err, values) => {
          const { email } = values
          this.validateEmail(email, this.userId)
          if (!err) {
            this.spinningLoad = true
            const params = Object.assign(values, { encryption: this.encryption }, { id: this.userId })
            console.log(params)
            updateBasicSetting(params).then(res => {
              if (res.code === '200') {
                this.$notification.success({
                  placement: 'topRight',
                  message: '更新成功',
                  description: res.message
                })
              } else {
                this.$notification.error({
                  placement: 'topRight',
                  message: '邮箱重复',
                  description: res.message
                })
              }
            }).finally(() => {
              this.loadData(this.userId)
              this.spinningLoad = false
            })
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>

  .avatar-upload-wrapper {
    height: 200px;
    width: 100%;
  }

  .ant-upload-preview {
    position: relative;
    margin: 0 auto;
    width: 100%;
    max-width: 180px;
    border-radius: 50%;
    box-shadow: 0 0 4px #ccc;

    .upload-icon {
      position: absolute;
      top: 0;
      right: 10px;
      font-size: 1.4rem;
      padding: 0.5rem;
      background: rgba(222, 221, 221, 0.7);
      border-radius: 50%;
      border: 1px solid rgba(0, 0, 0, 0.2);
    }

    .mask {
      opacity: 0;
      position: absolute;
      background: rgba(0, 0, 0, 0.4);
      cursor: pointer;
      transition: opacity 0.4s;

      &:hover {
        opacity: 1;
      }

      i {
        font-size: 2rem;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -1rem;
        margin-top: -1rem;
        color: #d6d6d6;
      }
    }

    img, .mask {
      width: 100%;
      max-width: 180px;
      height: 100%;
      border-radius: 50%;
      overflow: hidden;
    }
  }
</style>
