<template>
  <a-card>
    <div>
      <a-spin :spinning="confirmLoading">
        <a-form :form="form" v-if="isActive">
          <a-row class="form-row">
            <a-col :span="24">
              <a-form-item
                label="标题">
                <a-input size="large"
                         placeholder="输入标题"
                         :addonAfter="wordNumber"
                         @change='handleChangeInput'
                         v-decorator="['title',validatorRules.title]"/>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24">
              <a-form-item
                label="内容">
                <tinymce-editor
                  :disabled="disableSubmit"
                  ref="editor"
                  v-model="content">
                </tinymce-editor>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row class="form-row">
            <a-col :span="24">
              <a-form-item
                label="标签">
                <template v-for="(tag, index) in tags">
                  <a-tag :key="tag" :closable="index !== 0" :afterClose="() => handleClose(tag)">
                    {{tag}}
                  </a-tag>
                </template>
                <a-input
                  v-if="inputVisible && tags.length<8"
                  ref="input"
                  type="text"
                  size="small"
                  :style="{ width: '78px' }"
                  :value="inputValue"
                  @change="handleInputChange"
                  @blur="handleInputConfirm"
                  @keyup.enter="handleInputConfirm"
                />
                <a-tag v-if='!inputVisible && tags.length<8' @click="showInput"
                       style="background: #fff; borderStyle: dashed;">
                  <a-icon type="plus"/>
                </a-tag>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-form-item style='float: left;' label='分类名称'>
              <a-col :span="3">
                <a-button
                  html-type="submit"
                  style='box-shadow: red 0 0 10px;margin-right: 500px;'
                  @click='handleSelectCatName'>选择分类
                </a-button>
              </a-col>
              <a-col :span="8">
                <a-input size="large"
                         placeholder="分类名称"
                         :readOnly="true"
                         v-model="selectCat.catName"
                />
              </a-col>
            </a-form-item>
          </a-row>
          <a-row>
            <a-form-item style='float: right;'>
              <a-button
                type="dashed"
                html-type="submit"
                style='margin-right: 30px;box-shadow: green 0 0 10px'
                @click='handleSubmit("1")'>保存
              </a-button>
              <a-button
                type="primary"
                html-type="submit"
                style='box-shadow: darkblue 0 0 10px'
                @click='handleSubmit("2")'>提交
              </a-button>
            </a-form-item>
          </a-row>
        </a-form>
      </a-spin>
    </div>
    <BlobModal ref='blobModal' @ok='blobModalOK'></BlobModal>
  </a-card>
</template>

<script>
  import TinymceEditor from '@/components/tinymceEditor/TinymceEditor'
  import BlobModal from './modal/BlobModal'
  import { save } from '@/api/base/blob'
  import { USER_ID } from '@/store/mutation-types'
  import Vue from 'vue'

  export default {
    components: { TinymceEditor, BlobModal },
    name: 'IndexList',
    data() {
      return {
        isActive: true,
        wordNumber: '0/50',
        content: '',
        disableSubmit: false,
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules: {
          title: {
            rules: [
              { required: true, message: '标题不能为空' },
              { max: 50, message: `字符数量已经超额` }
            ]
          }
        },
        tags: [],
        inputVisible: false,
        inputValue: '',
        selectValue: {},
        catName: '',
        selectCat: {},
        labelName: [],
        model: {},
        userId: ''
      }
    },
    created() {
      this.userId = Vue.ls.get(USER_ID)
      this.loadData()
    },
    methods: {
      loadData() {
        this.confirmLoading = true
        this.isActive = false
        window.setTimeout(() => {
          this.confirmLoading = false
          this.isActive = true
        }, 600)
      },
      handleChangeInput(e) {
        this.wordNumber = `${e.target.value.length}/50`
      },
      handleSubmit(type) {
        this.form.validateFields((err, values) => {
          console.log(this.content)
          if (!this.content) {
            this.$notification.error({
              message: '错误',
              description: `请填写内容`
            })
            return
          }
          if (this.labelName.length === 0) {
            this.$notification.error({
              message: '错误',
              description: `请填写标签`
            })
            return
          }
          if (!this.selectCat.id) {
            this.$notification.error({
              message: '错误',
              description: `请选择分类`
            })
            return
          }

          if (!err) {
            this.confirmLoading = true
            let params = {
              context: this.content,
              catId: this.selectCat.id,
              userId: this.userId,
              labelName: this.labelName.toString()
            }
            params = Object.assign(values, params)
            let obj
            if (!this.model.id) {
              obj = save(params)
            } else {

            }
            obj.then(res => {
              if (res.code === '200') {
                this.$message.success(res.message)
              } else {
                this.$notification.error({
                  message: '错误',
                  description: `${res.message}`
                })
              }

            }).finally(() => {
              this.labelName = []
              this.tags = []
              this.context = ''
              this.content = ''
              this.selectCat = {}
              this.wordNumber = '0/50'
              this.form.resetFields()
              this.confirmLoading = false
            })
          }
        })
      },
      handleClose(removedTag) {
        const tags = this.tags.filter(tag => tag !== removedTag)
        console.log(tags)
        this.tags = tags
      },

      showInput() {
        this.inputVisible = true
        this.$nextTick(function() {
          this.$refs.input.focus()
        })
      },

      handleInputChange(e) {
        this.inputValue = e.target.value
      },

      handleInputConfirm() {
        const inputValue = this.inputValue
        let tags = this.tags
        if (inputValue && tags.indexOf(inputValue) === -1) {
          tags = [...tags, inputValue]
        }
        this.labelName = tags
        console.log(inputValue)
        console.log(tags)
        Object.assign(this, {
          tags,
          inputVisible: false,
          inputValue: ''
        })
      },
      handleSelectCatName() {
        this.$refs.blobModal.add()
        this.$refs.blobModal.title = '选择分类'
      },
      blobModalOK(value) {
        this.selectCat = value
        this.catName = value.catName
      }
    }
  }
</script>

<style scoped>

</style>