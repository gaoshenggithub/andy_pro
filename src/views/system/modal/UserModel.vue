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
        <a-form-item label='用户昵称' :labelCol='labelCol' :wrapperCol='wrapperCol'>
          <a-input placeholder="请输入用户昵称" v-decorator="['name', validatorRules.name]"></a-input>
        </a-form-item>
        <a-form-item label='用户名' :labelCol='labelCol' :wrapperCol='wrapperCol'>
          <a-input placeholder="请输入用户名" v-decorator="['username', validatorRules.username]"></a-input>
        </a-form-item>
        <a-form-item label='电话' :labelCol='labelCol' :wrapperCol='wrapperCol'>
          <a-input placeholder="请输入电话" v-decorator="['telephone', validatorRules.telephone]"></a-input>
        </a-form-item>
        <a-form-item
          label='密码' :labelCol='labelCol' :wrapperCol='wrapperCol'
          v-if="!model.id"
        >
          <a-input placeholder="请输入密码" type="password" v-decorator="['password', validatorRules.password]"></a-input>
        </a-form-item>
        <a-form-item
          label="加密方式"
          :labelCol='labelCol'
          :wrapperCol='wrapperCol'
          v-if="!model.id"
        >
          <a-select v-model="encryption" style="width: 300px" size="large">
            <a-select-option value="MD5">MD5</a-select-option>
            <a-select-option value="SHA1">SHA1</a-select-option>
            <a-select-option value="SHA256">SHA256</a-select-option>
            <a-select-option value="SHA384">SHA384</a-select-option>
            <a-select-option value="SHA512">SHA512</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label='邮箱' :labelCol='labelCol' :wrapperCol='wrapperCol'>
          <a-auto-complete
            :dataSource="dataSource"
            placeholder="请输入邮箱" v-decorator="['email', validatorRules.email]"
            @change="handleEmailChange"/>
        </a-form-item>
        <a-form-item label='头像' :labelCol='labelCol' :wrapperCol='wrapperCol'>
          <a-upload
            :action="upload"
            listType="picture-card"
            :fileList="fileList"
            :headers="headers"
            @preview="handlePreview"
            @change="handleImageChange"
          >
            <div v-if="fileList.length <= 0">
              <a-icon type="plus"/>
              <div class="ant-upload-text">Upload</div>
            </div>
          </a-upload>
          <a-modal :visible="previewVisible" :footer="null" @cancel="handleImageCancel">
            <img alt="example" style="width: 100%" :src="previewImage"/>
          </a-modal>
        </a-form-item>
        <a-form-item label='用户状态' :labelCol='labelCol' :wrapperCol='wrapperCol'>
          <a-switch checkedChildren="正常" v-model="selectStatus" unCheckedChildren="禁用" defaultChecked/>
       </a-form-item>
        <!--  <a-form-item label='是否单点' :labelCol='labelCol' :wrapperCol='wrapperCol'>
           <a-switch checkedChildren="单点" v-model="selectSingle" unCheckedChildren="多点" defaultChecked/>
         </a-form-item>-->
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { uploadFile } from '../../../api/base/upload'
  import { detail, update, save, validateUsername, validateEmail, validatePhone } from '../../../api/base/user'
  import pick from 'lodash.pick'
  import { getServerImage } from '../../../utils/util'
  import { ACCESS_TOKEN } from '../../../store/mutation-types'
  import Vue from 'vue'


  export default {
    name: 'UserModel',
    data() {
      return {

        encryption: 'MD5',
        headers: {},
        dataSource: [],
        selectStatus: true,
        selectSingle: true,
        previewVisible: false,
        previewImage: '',
        fileList: [],
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        },
        validatorRules: {
          name: {
            rules: [{ required: true, message: '请输入用户昵称' }]
          },
          username: {
            rules: [
              { required: true, message: '请输入用户名' },{ validator: this.validateUsername}]
          },
          email: {
            rules: [
              { required: true, message: '请输入邮箱!' }, {
                type: 'email',
                message: '请输入正确邮箱格式!'
              }]
          },
          password: {
            rules: [
              { required: true, message: '请输入密码!' }
            ]
          },
          telephone: {
            rules: [
              { required: true, message: '输入电话号码!' }]
          }
        },
        visible: false,
        width: 800,
        confirmLoading: false,
        disabledSubmit: { props: { disabled: false } },
        title: '',
        form: this.$form.createForm(this),
        uploadFileUrl: uploadFile,
        model: {}
      }
    },
    computed: {
      upload: function() {
        const token = Vue.ls.get(ACCESS_TOKEN)
        this.headers = { Auth_Token: token }
        return this.uploadFileUrl
      }
    },
    methods: {
      validateUsername(rule, value, callback) {
        if (!value) {
          return
        }
        validateUsername({ username: value }).then(res => {
          if (res.code === '200') {
            callback()
          } else {
            callback('用户名已经被使用')
          }
        })
      },
      validateEmail(rule, value, callback) {
        if (!value) {
          return
        }
        validateEmail({ email: value }).then(res => {
          if (res.code === '200') {
            callback()
          } else {
            callback('邮箱已经被使用')
          }
        })
      },
      validatePhone(rule, value, callback) {
        if (!value) {
          return
        }
        validatePhone({ phone: value }).then(res => {
          if (res.code === '200') {
            callback()
          } else {
            callback('电话号码已经被使用')
          }
        })
      },
      handleEmailChange(value) {

        this.dataSource = !value || value.indexOf('@') >= 0 ? [] : [
          `${value}@gmail.com`,
          `${value}@163.com`,
          `${value}@qq.com`
        ]
      },

      close() {
        this.$emit('close')
        this.visible = false
        this.form.resetFields()
        this.model = {}
        this.fileList = []
        this.selectStatus = true
        this.selectSingle = true
        this.disabledSubmit.props.disabled = false
      },

      handleOk() {
        this.form.validateFields((err, values) => {
          const { phone, username, email } = values
          if (!err) {
            this.confirmLoading = true
            const params = Object.assign(values, {
              id: this.model.id,
              //allowSingle: this.selectSingle ? '1' : '2',
              status: this.selectStatus ? '1' : '2',
              avatar: this.fileList[0].response === undefined ? this.fileList[0].uploadUrl : this.fileList[0].response.data,
              encryption: this.encryption
            })
            console.log(params)
            let obj
            if (!this.model.id) {
              //添加
              obj = save(params)
            } else {
              //更新
              obj = update(params)
            }
            obj.then(res => {
              if (res.code === '200') {
                this.$message.success('成功')
              } else {
                this.$message.error('成功')
              }
            }).finally(() => {
              this.$emit('ok')
              this.confirmLoading = false
              this.visible = false
            })
          }
        })
      },
      handleCancel() {
        this.close()
      },
      add() {
        this.encryption = 'MD5'
        this.edit({})
      },
      edit(record) {
        this.confirmLoading = true
        this.model = record
        this.fileList = []
        this.form.resetFields()
        this.visible = true
        if (this.model.id) {

          const param = { userId: this.model.id }
          detail(param).then(res => {
            if (res.code === '200') {
              this.model = res.data
            }
            this.$nextTick(() => {
              this.form.setFieldsValue(pick(this.model, 'name', 'username', 'email', 'telephone'))
            })
            //this.selectSingle = this.model.allowSingle === '1'
            this.selectStatus = this.model.status === '1'
            this.fileList = [
              {
                uid: '1',
                status: 'done',
                name: 'logo.jpg',
                url: getServerImage(this.model.avatar),
                uploadUrl: this.model.avatar
              }
            ]
            this.confirmLoading = false
          })
        } else {
          this.confirmLoading = false
        }
      },
      handleImageCancel() {
        this.previewVisible = false
      },
      handlePreview(file) {
        this.previewImage = file.url || file.thumbUrl
        this.previewVisible = true
      },
      handleImageChange({ file, fileList }) {

        let pos = file.name.lastIndexOf('.')
        let lastName = file.name.substring(pos, file.name.length)
        let supportTypes = ['.gif', '.jpeg', '.png', '.bmp', '.jpg'] // gif、 jpeg、 png、 bmp
        if (supportTypes.indexOf(lastName.toLowerCase()) === -1) {
          this.$notification.error({
            placement: 'topRight',
            message: '修改错误',
            description: `图片 gif、 jpeg、 png、 bmp、jpg、  ${supportTypes.length}种格式！`
          })
          return
        }
        if (file.size / (1024 * 1024) > 3) {
          this.$notification.error({
            placement: 'topRight',
            message: '上传大小限制',
            description: `图片小于3MB`
          })
          return
        }
        this.fileList = fileList
      }
    }
  }
</script>

<style scoped>

</style>