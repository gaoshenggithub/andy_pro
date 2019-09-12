<template>
  <a-drawer
    :title='title'
    :width='700'
    @close='onClose'
    :visible='visible'
    :wrapStyle='wrapStyle'
  >
    <div class='outerDiv'>
      <a-spin :spinning='confirmLoading'>
        <a-form :form='form'>
          <a-form-item label='菜单类型' :labelCol='labelCol' :wrapperCol='wrapperCol'>
            <a-radio-group @change="onChangeMenuType" v-decorator="['menuType', {'initialValue':0}]">
              <a-radio :value='0'>一级菜单</a-radio>
              <a-radio :value='1'>子菜单</a-radio>
              <a-radio :value='2'>按钮/权限</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item :label='menuLabel' :labelCol='labelCol' :wrapperCol='wrapperCol'>
            <a-input
              placeholder='请输入菜单名称'
              v-decorator="['menuName',validatorRules.menuName]"
            >
            </a-input>
          </a-form-item>
          <a-form-item
            v-if="localMenuType!==0"
            label="上级菜单"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol">
            <a-tree-select
              slots="selectslot"
              style="width:100%"
              :dropdownStyle="{ maxHeight: '200px', overflow: 'auto' }"
              :treeData="treeData"
              v-model="model.parentId"
              placeholder="请选择父级菜单"
              @change="changeParent()"
              :disabled="disableSubmit">
            </a-tree-select>
          </a-form-item>
          <a-form-item
            v-if="localMenuType!==2"
            label='菜单路径' :labelCol='labelCol' :wrapperCol='wrapperCol'>
            <a-input
              placeholder='请输入菜单路径'
              v-decorator="['menuUrl',validatorRules.menuUrl]">
            </a-input>
          </a-form-item>
          <a-form-item
            v-show='show'
            label='前端组件' :labelCol='labelCol' :wrapperCol='wrapperCol'>
            <a-input
              placeholder='请输入前端组件'
              v-decorator="['menuAssembly',{}]">
            </a-input>
          </a-form-item>
          <a-form-item v-show="localMenuType===0"
                       label='默认跳转地址' :labelCol='labelCol' :wrapperCol='wrapperCol'>
            <a-input
              placeholder='请输入默认跳转地址'
              v-decorator="['jumpUrl',{}]">
            </a-input>
          </a-form-item>
          <a-form-item v-show="show" label='菜单图标' :labelCol='labelCol' :wrapperCol='wrapperCol'>
            <a-input
              placeholder='请输入菜单图标' v-model='model.menuIcon'>
              <a-icon slot="addonAfter" type="setting" @click="selectIcons"/>
            </a-input>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="授权标识">
            <a-input placeholder="请输入用户授权标识" v-decorator="[ 'authorization', validatorRules.authorization]"/>
          </a-form-item>
          <a-form-item
            v-if="show"
            label='隐藏路由' :labelCol='labelCol' :wrapperCol='wrapperCol'>
            <a-switch checkedChildren="是" unCheckedChildren="否" v-model='status' @change='changeStatus'/>
          </a-form-item>
          <!-- 选择图标 -->
          <icons @choose="handleIconChoose" @close="handleIconCancel" :iconChooseVisible="iconChooseVisible"></icons>
        </a-form>
      </a-spin>
    </div>
    <a-row :style="{textAlign:'right'}">
      <a-button :style="{marginRight: '8px'}" @click="handleCancel">
        关闭
      </a-button>
      <a-button @click="handleOk" type="primary" :disabled="disableSubmit">确定</a-button>
    </a-row>
  </a-drawer>
</template>

<script>
  import Icons from '../icon/Icons'
  import pick from 'lodash.pick'
  import { sysMenuAdd, sysMenuList, detail, update } from '@/api/base/menu.jsx'

  export default {
    components: { Icons },
    name: 'MenuAddModel',
    data() {
      return {
        value: [],
        disableSubmit: false,
        treeData: [],
        iconChooseVisible: false,
        validatorRules: {
          menuName: {
            rules: [
              {
                required: true,
                message: '请输入菜单名称'
              }
            ]
          },
          menuUrl: {
            rules: [
              {
                required: true,
                message: '请输入菜单路径'
              }
            ]
          },
          authorization: {
            rules: [
              {
                required: true,
                message: '请输入用户授权标识'
              }
            ]
          }
        },
        confirmLoading: false,
        form: this.$form.createForm(this),
        width: '700px',
        localMenuType: '1',
        title: '',
        visible: false,
        show: true,
        menuLabel: '菜单名称',
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        },
        wrapStyle: {
          height: 'calc(100% - 108px)',
          overflow: 'auto',
          paddingBottom: '108px'
        },
        model: {},
        status: true
      }
    },
    methods: {
      initParentMenu() {
        sysMenuList({}).then(res => {
          if (res.code === '200') {
            console.log(res.data)
            this.treeData = res.data
          }
        })
      },
      changeStatus(status) {
        this.status = status
      },
      changeParent() {
        console.log(this.model)
      },
      selectIcons() {
        this.iconChooseVisible = true
      },
      handleIconCancel() {
        this.iconChooseVisible = false
      },
      handleIconChoose(value) {
        console.log(value)
        this.model.menuIcon = value
        this.form.menuIcon = value
        this.iconChooseVisible = false
      },
      onClose() {
        this.$emit('close')
        this.visible = false
        this.disableSubmit = false
        this.model = {}
        this.value = []
      },
      add() {
        this.edit({})
      },
      edit(value) {
        this.show = false
        this.form.resetFields()
        this.confirmLoading = true
        this.model = Object.assign({}, value)
        if (this.model.menuType === '0') {
          this.localMenuType = 0
          this.show = true
        } else if (this.model.menuType === '1') {
          this.localMenuType = 1
          this.show = true
        } else {
          console.log('---------')
          this.localMenuType = 2

        }
        this.initParentMenu()
        if (this.model.id) {
          detail(value).then(res => {
            this.model = res.data
            this.model.menuType = parseInt(this.model.menuType)
            console.log(this.model)
            this.status = this.model.hidden !== '2'
            let fieldsVal = pick(this.model, 'menuType', 'authorization', 'menuName', 'menuUrl', 'menuAssembly', 'jumpUrl')
            this.$nextTick(() => {
              this.form.setFieldsValue(fieldsVal)
            })
            this.confirmLoading = false
            this.visible = true
          })
        } else {
          this.show = true
          this.menuLabel = '菜单名称'
          this.localMenuType = 0
          this.visible = true
        }

        this.confirmLoading = false
      },
      handleCancel() {
        this.onClose()
      },
      handleOk() {
        this.form.validateFields((err, values) => {
          if (!this.model.menuIcon && this.localMenuType !== 2) {
            this.$message.error('图标不能为空')
            return
          }
          if (!err) {
            this.confirmLoading = true
            let params = Object.assign(values, { hidden: this.status })
            console.log(params)
            let obj
            if (!this.model.id) {
              params = Object.assign(params, { parentId: this.model.parentId,menuIcon:this.model.menuIcon })
              obj = sysMenuAdd(params)
            } else {
              params = Object.assign(params, { id: this.model.id,
                parentId: this.model.parentId ,menuIcon:this.model.menuIcon})
              obj = update(params)
            }
            obj.then((res) => {
              if (res.code === '200') {
                this.$message.success(res.message)
                this.$emit('ok')
              } else {
                this.$message.error(res.message)
              }
            }).finally(() => {
              this.confirmLoading = false
              this.onClose()
            })
          }
        })
      },
      onChangeMenuType(e) {
        this.localMenuType = e.target.value
        if (e.target.value === 2) {
          this.show = false
          this.menuLabel = '按钮/权限'
        } else {
          this.show = true
          this.menuLabel = '菜单名称'
        }
      },
      // 根据屏幕变化,设置抽屉尺寸
      resetScreenSize() {
        let screenWidth = document.body.clientWidth
        if (screenWidth < 500) {
          this.drawerWidth = screenWidth
        } else {
          this.drawerWidth = 700
        }
      }
    }
  }
</script>

<style scoped>
  .outerDiv {
    width: 100%;
    border: 1px solid #e9e9e9;
    padding: 10px 16px;
    background: #fff
  }
</style>