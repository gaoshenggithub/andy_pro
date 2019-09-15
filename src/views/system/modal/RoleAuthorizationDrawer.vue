<template>
  <a-drawer
    :title='title'
    :width='500'
    @close='onClose'
    :visible='visible'
    :wrapStyle='wrapStyle'
  >
    <div>
      <a-spin :spinning='confirmLoading'>
        <a-form>
          <a-form-item label='所拥有的权限'>
            <a-tree
              checkable
              :defaultExpandAll="true"
              :checkedKeys="checkedKeys"
              :treeData="treeData"
              @check="onCheck"
              :selectedKeys="selectedKeys"
              :checkStrictly="checkStrictly"
            />
          </a-form-item>
        </a-form>
      </a-spin>
    </div>
    <div
      :style="{
              position: 'absolute',
              left: 0,
              bottom: 0,
              width: '100%',
              borderTop: '1px solid #e9e9e9',
              padding: '10px 16px',
              background: '#fff',
              textAlign: 'right',
            }"
    >

      <a-popconfirm title="确认放弃编辑吗?" okText="确定" @confirm="onClose" cancelText="取消">
        <a-button
          :style="{marginRight: '8px'}"
        >
          取消
        </a-button>
      </a-popconfirm>

      <a-button @click="handleOK" type="primary">确认</a-button>
    </div>
  </a-drawer>
</template>

<script>
  import { listPermission, batchSave } from '@/api/base/permission'

  export default {
    name: 'RoleAuthorizationDrawer',
    data() {
      return {
        expandedKeys: [],
        checkedKeys: [],
        selectedKeys: [],
        confirmLoading: false,
        wrapStyle: {
          height: 'calc(100% - 108px)',
          overflow: 'auto',
          paddingBottom: '108px'
        },
        title: '',
        visible: false,
        treeData: [],
        autoExpandParent: true,
        type: 1,
        checkStrictly: true
      }
    },
    watch: {

    },

    methods: {

      onClose() {
        this.$emit('close')
        this.visible = false
        this.checkedKeys = []
        this.model = {}
      },
      authorization(id, type) {
        this.model = { id }
        this.type = type
        let obj
        if (type === 1) {
          this.confirmLoading = true
          obj = listPermission({ roleId: id, type: '2' })//菜单
        } else {
          obj = listPermission({ roleId: id, type: '0' })//按钮

        }
        obj.then(res => {
          if (res.code === '200') {
            console.log(res.data)
            this.treeData = res.data.permission
            const permissionIds = res.data.permissionVOList.map(e => e.permissionId)
            this.checkedKeys = permissionIds
            this.visible = true
          }
          this.confirmLoading = false
        })

      },
      onCheck(o) {
        if (this.checkStrictly) {
          this.checkedKeys = o.checked
        } else {
          this.checkedKeys = o
        }
        console.log('---')
        console.log(this.checkedKeys)
      },
      onSelect(selectedKeys, info) {
        console.log('onSelect', info)
        this.selectedKeys = selectedKeys
      },
      onExpand(expandedKeys) {
        console.log('onExpand', expandedKeys)
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        this.expandedKeys = expandedKeys
      },
      handleOK() {
        if (this.checkedKeys.length <= 0) {
          this.$notification({
            placement: 'topRight',
            message: '授权',
            description: '请选择授权'
          })
          return
        }
        this.confirmLoading = true
        batchSave(Object.assign({
          ids: this.checkedKeys.toString(),
          roleId: this.model.id,
          permissionType: this.type
        })).then(res => {
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
    }
  }
</script>

<style scoped>

</style>