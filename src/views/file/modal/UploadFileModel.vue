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
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label='文件名称' :labelCol='labelCol' :wrapperCol='wrapperCol'>
          <a-input placeholder="请输入文件名称" v-decorator="['fileName', validatorRules.fileName]"
          ></a-input>
        </a-form-item>
        <a-form-item v-if="fileType==='1'" label='上传图片' :labelCol='labelCol' :wrapperCol='wrapperCol'>
          <a-upload
            listType="picture-card"
            class="avatar-uploader"
            :showUploadList="false"
            :action="upload"
            :beforeUpload="beforeUpload"
            @change="handleChange"
            :headers='headers'
          >
            <img v-if="imageUrl" :src="imageUrl" alt="file" class='ant-images-avatar'/>
            <div v-else>
              <a-icon :type="loading ? 'loading' : 'plus'"/>
              <div class="ant-upload-text">Upload</div>
            </div>
          </a-upload>
        </a-form-item>
        <a-form-item v-else="fileType==='2'" label='上传视频' :labelCol='labelCol' :wrapperCol='wrapperCol'>
          <a-upload
            name="file"
            :action="upload"
            :headers="headers"
            :beforeUpload="beforeUpload"
            @change="handleChange"
          >
            <a-button>
              <a-icon type="upload"/>
              上传
            </a-button>
          </a-upload>
        </a-form-item>
        <a-form-item v-else="fileType==='3'" label='上传音频' :labelCol='labelCol' :wrapperCol='wrapperCol'>
          <a-upload
            name="file"
            :action="upload"
            :headers="headers"
            :beforeUpload="beforeUpload"
            @change="handleChange"
          >
            <a-button>
              <a-icon type="upload"/>
              上传
            </a-button>
          </a-upload>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { save } from '@/api/base/file'
  import { uploadFile } from '@/api/base/upload'
  import pick from 'lodash.pick'
  import { ACCESS_TOKEN } from '../../../store/mutation-types'
  import Vue from 'vue'
  import { getServerImage } from '../../../utils/util'

  export default {
    name: 'UploadFileModel',
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
          fileName: {
            rules: [
              { required: true, message: '请填写文件名称' }
            ]
          }
        },
        fileType: '1',
        loading: false,
        imageUrl: '',
        headers: {},
        uploadFileUrl: uploadFile,
        url: '',
        videoUrl: '',
        audioUrl: '',
        fileTypes: [['image/jpeg', 'image/png'], ['video/mp4'], ['audio/mp3']]
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


      handleChange(info) {
        console.log(info)
        if (info.file.status === 'uploading') {
          this.loading = true
          return
        }
        if (info.file.status === 'done') {
          if (info.file.response.code === '200') {
            this.$message.success('成功')
            this.url = info.file.response.data
            if (this.fileType === '1') {
              this.imageUrl = getServerImage(info.file.response.data)
            }
            this.loading = false
          } else {
            this.$message.error('失败')
          }
        }
      },
      beforeUpload(file) {
        const { fileType } = this
        let is = this.fileTypes[parseInt(fileType) - 1].indexOf(file.type) !== -1
        if (!is) {
          this.$notification.error({
            placement: 'topRight',
            message: '错误',
            description: `只能上传${this.fileTypes[(parseInt(fileType) - 1)]}格式`
          })
          return false
        }
        let isLt2M
        if (fileType === '1') {
          isLt2M = file.size / 1024 / 1024 < 2
          if (!isLt2M) {
            this.$notification.error({
              placement: 'topRight',
              message: '错误',
              description: `图片大小不能大于2MB`
            })
            return false
          }
        }
        return true
      },

      handleSubmit() {
        this.form.validateFields((error, values) => {
          if (!this.url) {
            this.$message.error('请上传图片之后进行提交')
            return
          }
          const params = Object.assign({ fileUrl: this.url, fileType: this.fileType }, values)
          if (!error) {
            this.confirmLoading = true
            save(params).then(res => {
              if (res.code === '200') {
                this.$message.success('成功')
                this.$emit('ok')
              } else {
                this.$message.error('失败')
              }
            }).finally(() => {
              this.close()
              this.confirmLoading = false
            })
          }
        })
      },
      add(value) {
        this.form.resetFields()
        this.visible = true
        this.fileType = value
      },
      close() {
        this.visible = false
        this.imageUrl = ''
        this.url = ''
        this.videoUrl = ''
        this.audioUrl = ''
      }

    }
  }
</script>

<style lang="less" scoped>
  .ant-images-avatar {
    width: 128px;
    height: 128px;
  }

  .avatar-uploader > .ant-upload {
    width: 128px;
    height: 128px;
  }

  .ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
  }

  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }
</style>