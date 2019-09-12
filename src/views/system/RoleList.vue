<template>
  <div>
    <a-card :bordered="false">
      <div>
        <!-- 操作按钮区域 -->
        <div class="table-operator" style="border-top: 5px">
          <a-button @click="handleAdd" type="primary" v-if="!hasPermissions('ROLE:LIST:ADD')" icon="plus">添加角色
          </a-button>
          <a-dropdown v-if="selectedRowKeys.length > 0">
            <a-menu slot="overlay">
              <a-menu-item key="1" @click="batchDelete">
                <a href="javascript:;">
                  <a-icon type="delete"/>
                  删除</a>
              </a-menu-item>
            </a-menu>
            <a-button style="margin-left: 8px">
              批量操作
              <a-icon type="down"/>
            </a-button>
          </a-dropdown>
        </div>
        <!--列表-->
        <div>
          <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;" v-if="!hasPermissions('ROLE:LIST:CLEAR')">
            <i class="anticon anticon-info-circle ant-alert-icon"></i>已选择&nbsp;<a style="font-weight: 600">{{selectedRowKeys.length
            }}</a>项&nbsp;&nbsp;
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
              <span slot="action" slot-scope="text, record">
              <a href="javascript:;" v-if="!hasPermissions('ROLE:LIST:EDIT')"
                 @click="handleEdit(record)">编辑</a>
              <a-divider type="vertical"/>
              <a-dropdown>
              <a class="ant-dropdown-link" href="#">更多
                <a-icon type="down"/>
              </a>
               <a-menu slot="overlay">
              <a-menu-item>
                <a href="javascript:;" v-if="!hasPermissions('ROLE:LIST:DELETE')"
                   @click="handleDelete(record.id)">删除</a>
              </a-menu-item>
              <a-menu-item>
                <a href="javascript:;" v-if="!hasPermissions('ROLE:LIST:DETAIL')"
                   @click="handleDetail(record)">详细</a>
              </a-menu-item>
              <a-menu-item>
                <a href="javascript:;" v-if="!hasPermissions('ROLE:LIST:MENUGRANT')"
                   @click="handleMenuAuthorization(record.id)">菜单授权</a>
              </a-menu-item>
              <a-menu-item>
                <a href="javascript:;" v-if="!hasPermissions('ROLE:LIST:BUTTONGRANT')"
                   @click="handleButtonAuthorization(record.id)">按钮授权</a>
              </a-menu-item>
              </a-menu>
              </a-dropdown>
            </span>
            </a-table>
          </div>

        </div>
      </div>
      <RoleModel ref="roleModel" @ok="roleModelOK"></RoleModel>
      <RoleAuthorizationDrawer ref="roleAuthorizationDrawer" @ok="roleAuthorizationDrawerOK"></RoleAuthorizationDrawer>
    </a-card>
  </div>
</template>

<script>
  import { listPage, batchDelete, deleteById } from '@/api/base/role'
  import { filterObj, hasPermissions } from '../../utils/util'
  import RoleModel from './modal/RoleModel'
  import RoleAuthorizationDrawer from './modal/RoleAuthorizationDrawer'
  import moment from 'moment'

  export default {
    components: { RoleModel, RoleAuthorizationDrawer },
    name: 'RoleList',
    data() {
      return {
        selectedRowKeys: [],
        columns: [
          {
            title: '角色名称',
            align: 'center',
            dataIndex: 'roleName'
          },
          {
            title: '授权编码',
            align: 'center',
            dataIndex: 'roleCode'
          },
          {
            title: '描述',
            align: 'center',
            dataIndex: 'description'
          },
          {
            title: '创建时间',
            align: 'center',
            dataIndex: 'createTime',
            customRender: text => moment(text).format('YYYY-MM-DD')
            //customRender: text => moment(moment.unix(text)._d).format('YYYY-MM-DD')
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
        loading: false
      }
    },
    created() {
      this.loadData()
    },
    methods: {
      hasPermissions(value) {
        return hasPermissions(value)
      },
      handleMenuAuthorization(id) {
        this.$refs.roleAuthorizationDrawer.authorization(id, 1)
        this.$refs.roleAuthorizationDrawer.title = '菜单授权'
      },
      handleButtonAuthorization(id) {
        this.$refs.roleAuthorizationDrawer.authorization(id, 2)
        this.$refs.roleAuthorizationDrawer.title = '按钮授权'
      },
      moment,
      handleEdit(record) {
        this.$refs.roleModel.edit(record)
        this.$refs.roleModel.title = '修改角色'
      },
      handleDelete(id) {
        deleteById({ id }).then(res => {
          if (res.code === '200') {
            this.$message.success('成功')
          } else {
            this.$message.error('失败')
          }
          this.loadData()
        })
      },
      handleDetail(record) {
        this.$refs.roleModel.edit(record)
        this.$refs.roleModel.title = '角色详细'
        this.$refs.roleModel.disabledSubmit.props.disabled = true
      },
      handleAdd() {
        this.$refs.roleModel.add()
        this.$refs.roleModel.title = '添加角色'
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
      roleModelOK() {
        this.loadData()
      },
      roleAuthorizationDrawerOK() {
        this.loadData()
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