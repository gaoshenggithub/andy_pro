<template>
  <div>
    <a-card :bordered="false">
      <div>
        <!-- 操作按钮区域 -->
        <div class="table-operator" style="border-top: 5px">
          <a-button @click="handleAdd" type="primary" v-if="!hasPermissions('USER:LIST:ADD')" icon="plus">添加用户
          </a-button>

          <a-dropdown v-if="selectedRowKeys.length > 0">
            <a-menu slot="overlay">
              <a-menu-item key="1" @click="batchDelete">
                <a href="javascript:;">
                  <a-icon type="delete"/>
                  删除</a>
              </a-menu-item>
              <a-menu-item key="2" @click="batchFrozen('1')">
                <a href="javascript:;">
                  <a-icon type="lock"/>
                  冻结</a>
              </a-menu-item>
              <a-menu-item key="3" @click="batchFrozen('2')">
                <a href="javascript:;">
                  <a-icon type="unlock"/>
                  解冻</a>
              </a-menu-item>
            </a-menu>
            <a-button style="margin-left: 8px">
              批量操作
              <a-icon type="down"/>
            </a-button>
          </a-dropdown>
        </div>
        <!--列表-->
        <div class="table-operator">
          <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;" v-if="!hasPermissions('ROLE:LIST:CLEAR')">
            <i class="anticon anticon-info-circle ant-alert-icon"></i>已选择&nbsp;<a style="font-weight: 600">{{
            selectedRowKeys.length }}</a>项&nbsp;&nbsp;
            <a style="margin-left: 24px" @click="onClearSelected">清空</a>
          </div>
          <div>
            <a-table
              ref="table"
              size="middle"
              bordered
              rowKey="id"
              :columns="columns"
              :dataSource="dataSource"
              :pagination="ipagination"
              :loading="loading"
              :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
              @change="handleTableChange"
            >
              <template slot="avatarslots" slot-scope="text, record">
                <div class="anty-img-wrap">
                  <a-avatar shape="square" :src="getImage(record.avatar)" @click="showImage(record.avatar)"
                            icon="user"/>
                </div>
              </template>
              <template slot="statusslots" slot-scope="text, record">
                <div>
                  <a-tag :color="record.status==='1'?'green':'red'">
                    {{record.status==='1'?'正常':'禁用'}}
                  </a-tag>
                </div>
              </template>
             <!-- <template slot="allowsingleslots" slot-scope="text, record">
                <div>
                  <a-tag :color="record.allowSingle==='1'?'green':'red'">
                    {{record.allowSingle==='1'?'单点':'多点'}}
                  </a-tag>
                </div>
              </template>-->
              <span slot="action" slot-scope="text, record">
              <a @click="handleEdit(record)" v-if="!hasPermissions('USER:LIST:EDIT')">编辑</a>
              <a-divider type="vertical"/>
              <a-dropdown>
              <a class="ant-dropdown-link" href="#">更多
                <a-icon type="down"/>
              </a>
               <a-menu slot="overlay">
              <a-menu-item>
                <a href="javascript:;" v-if="!hasPermissions('USER:LIST:DELETE')"
                   @click="handleDelete(record.id)">删除</a>
              </a-menu-item>
              <a-menu-item>
                <a href="javascript:;" v-if="!hasPermissions('USER:LIST:DETAIL')" @click="handleDetail(record)">详细</a>
              </a-menu-item>
                 <a-menu-item>
                <a href="javascript:;" v-if="!hasPermissions('USER:LIST:FROZEN')"
                   @click="handleStatus(record.id,record.status==='1'?'1':'2')">
                  {{record.status==='1'?'冻结':'解冻'}}</a>
              </a-menu-item>
              <a-menu-item>
                <a href="javascript:;" v-if="!hasPermissions('USER:LIST:MODIFYPASSWORD')"
                   @click="handlePassword(record.id)">修改密码</a>
              </a-menu-item>
              <a-menu-item>
                <a href="javascript:;" v-if="!hasPermissions('USER:LIST:GRANTROLE')"
                   @click="handleRoleAssignment(record.id)">角色分配</a>
              </a-menu-item>
             <!-- <a-menu-item>
                <a href="javascript:;" @click="handleOpenMessage(record.id)">发送消息</a>
              </a-menu-item>-->
              </a-menu>
              </a-dropdown>
            </span>
            </a-table>
          </div>
        </div>
      </div>
      <AvatarLayout ref="avatarLayout"></AvatarLayout>
      <ModifyPasswordModel ref="modifyPasswordModel" @ok="modifyPasswordModelOK"></ModifyPasswordModel>
      <UserModel ref="userModel" @ok="userModelOK"></UserModel>
      <UserRoleModel ref="userRoleModel" @ok="userRoleModelOK"></UserRoleModel>
    </a-card>
  </div>
</template>

<script>
  import { filterObj, getServerImage, hasPermissions } from '../../utils/util'
  import { listPage, batchDelete, batchFrozen } from '../../api/base/user'

  import moment from 'moment'
  import AvatarLayout from '@/components/Avatar/AvatarLayout'
  import ModifyPasswordModel from './modal/ModifyPasswordModel'
  import UserRoleModel from './modal/UserRoleModel'
  import UserModel from './modal/UserModel'
  import { deleteById, modifyStatus } from '@/api/base/user'

  export default {
    components: { AvatarLayout, ModifyPasswordModel, UserModel, UserRoleModel, },
    name: 'UserList',
    data() {
      return {
        moment,
        selectedRowKeys: [],
        ipagination: {
          current: 1,
          pageSize: 10,
          pageSizeOptions: ['10', '20', '30'],
          showTotal: (total, range) => {
            return range[0] + '-' + range[1] + ' 共' + total + '条'
          },
          showQuickJumper: true,
          showSizeChanger: true,
          total: 0
        },
        isorter: {
          column: 'createTime',
          order: 'desc'
        },
        dataSource: [],
        columns: [
          {
            title: '昵称',
            align: 'center',
            dataIndex: 'name'
          },
          {
            title: '用户名',
            align: 'center',
            dataIndex: 'username'
          },
          {
            title: '用户头像',
            align: 'center',
            dataIndex: 'avatar',
            scopedSlots: { customRender: 'avatarslots' }
          },
          {
            title: '用户状态',
            align: 'center',
            dataIndex: 'status',
            scopedSlots: { customRender: 'statusslots' }
          },
/*          {
            title: '是否单点',
            align: 'center',
            dataIndex: 'allowSingle',
            scopedSlots: { customRender: 'allowsingleslots' }
          },*/
          {
            title: '最后登录时间',
            align: 'center',
            dataIndex: 'lastLoginTime',
            customRender: text => moment(text).format('YYYY-MM-DD')
          },
          {
            title: '最后登录IP',
            align: 'center',
            dataIndex: 'lastLoginIp'
          },
          {
            title: '创建时间',
            align: 'center',
            dataIndex: 'createTime',
            customRender: text => moment(text).format('YYYY-MM-DD')
          },
          {
            title: '操作',
            dataIndex: 'action',
            scopedSlots: { customRender: 'action' },
            fixed: 'right',
            align: 'center',
            width: 150
          }
        ],
        loading: false
      }
    },
    created() {
      this.loadData()
    },
    methods: {
      handleOpenMessage(id) {
        this.$refs.userSendMessageModel.show(id)
      },
      hasPermissions(value) {
        return hasPermissions(value)
      },
      handleRoleAssignment(id) {
        this.$refs.userRoleModel.edit(id)
        this.$refs.userRoleModel.title = '分配角色'
      },
      userModelOK() {
        this.loadData()
      },
      userRoleModelOK() {
        this.loadData()
      },
      handleDetail(record) {
        this.$refs.userModel.edit(record)
        this.$refs.userModel.title = '详细'
        this.$refs.userModel.disabledSubmit.props.disabled = true
      },
      handleEdit(record) {
        this.$refs.userModel.edit(record)
        this.$refs.userModel.title = '修改'
      },
      handleDelete(id) {
        const params = Object.assign({ userId: id })
        deleteById(params).then(res => {
          if (res.code === '200') {
            this.$message.success('成功')
          } else {
            this.$message.error('失败')
          }
          this.loadData()
        })
      },
      handleStatus(id, status) {
        const params = Object.assign({ userId: id, status: status })
        modifyStatus(params).then(res => {
          if (res.code === '200') {
            this.$message.success('成功')
          } else {
            this.$message.error('失败')
          }
          this.loadData()
        })
      },
      getImage(value) {
        return getServerImage(value)
      },
      handleAdd() {
        this.$refs.userModel.add()
        this.$refs.userModel.title = '添加'
      },
      handlePassword(id) {
        this.$refs.modifyPasswordModel.show(id)
      },
      modifyPasswordModelOK() {
        this.loadData()
      },
      onSelectChange(selectedRowKeys) {
        this.selectedRowKeys = selectedRowKeys
      },
      getQueryParams() {
        let param = Object.assign({}, this.queryParam, this.isorter)
        param.field = this.getQueryField()
        param.current = this.ipagination.current
        param.pageSize = this.ipagination.pageSize
        return filterObj(param)
      },
      getQueryField() {
        let str = 'id'
        for (let a = 0; a < this.columns.length; a++) {
          str += ',' + this.columns[a].dataIndex
        }
        return str
      },
      showImage(value) {
        this.$refs.avatarLayout.show(value)
        this.$refs.avatarLayout.title = '用户头像'
      },
      loadData(arg) {
        this.loading = true
        if (arg === 1) {
          this.ipagination.current = 1
        }
        let params = this.getQueryParams()//查询条件
        listPage(params).then((res) => {
          if (res.code === '200') {
            console.log(res.data)
            this.dataSource = res.data.records
            this.ipagination.total = res.data.total
          }
          this.loading = false
        })
      },
      handleTableChange(pagination, filters, sorter) {
        console.log(pagination)
        //TODO 筛选
        if (Object.keys(sorter).length > 0) {
          this.isorter.column = sorter.field
          this.isorter.order = 'ascend' === sorter.order ? 'asc' : 'desc'
        }
        console.log(pagination)
        this.ipagination = pagination
        this.loadData()
      },
      onClearSelected() {
        this.selectedRowKeys = []
      },
      batchDelete() {
        if (this.selectedRowKeys.length <= 0) {
          this.$message.warning('请选择一条记录！')
          return
        } else {
          let ids = ''
          this.selectedRowKeys.forEach(val =>
            ids += val + ','
          )
          batchDelete({ ids }).then(res => {
            if (res.code === '200') {
              this.$message.success('成功')
            } else {
              this.$message.error('失败')
            }
            this.loadData()

          })
        }
      },
      batchFrozen(status) {
        if (this.selectedRowKeys.length <= 0) {
          this.$message.warning('请选择一条记录！')
          return
        } else {
          let ids = ''
          this.selectedRowKeys.forEach(val =>
            ids += val + ','
          )
          batchFrozen({ ids, status }).then(res => {
            if (res.code === '200') {
              this.$message.success('成功')
            } else {
              this.$message.error('失败')
            }
            this.loadData()
          })
        }
      },
      handleMenuClick(e) {
        if (e.key == 1) {
        } else if (e.key == 2) {
          this.batchFrozen(2)
        } else if (e.key == 3) {
          this.batchFrozen(1)
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  /** Button按钮间距 */
  .ant-btn {
    margin-left: 3px
  }

  .ant-card-body .table-operator {
    margin-bottom: 18px;
  }

  .ant-table-tbody .ant-table-row td {
    padding-top: 15px;
    padding-bottom: 15px;
  }

  .anty-row-operator button {
    margin: 0 5px
  }

  .ant-btn-danger {
    background-color: #ffffff
  }

  .ant-modal-cust-warp {
    height: 100%
  }

  .ant-modal-cust-warp .ant-modal-body {
    height: calc(100% - 110px) !important;
    overflow-y: auto
  }

  .ant-modal-cust-warp .ant-modal-content {
    height: 90% !important;
    overflow-y: hidden
  }

  /*头像*/
  .anty-img-wrap {
    height: 25px;
    position: relative;
  }

  .anty-img-wrap > img {
    max-height: 100%;
  }
</style>