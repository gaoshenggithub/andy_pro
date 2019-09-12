<template>
  <div>
    <a-card :bordered="false">
      <div>
        <!-- 操作按钮区域 -->
        <div class="table-operator">
          <a-button @click="handleAdd" v-if="!hasPermissions('MENU:LIST:ADD')" type="primary" icon="plus">新增
          </a-button>
        </div>
        <div class="table-operator">
          <a-table
            ref="table"
            size="middle"
            bordered
            rowKey="id"
            :columns="columns"
            :dataSource="dataSource"
            :pagination="false"
            :loading="loading"
            :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}">
            <template slot="typeslots" slot-scope="text, record">
              <div>
                <a-tag color="blue" v-show="record.menuType==='0'">目录</a-tag>
                <a-tag color="cyan" v-show="record.menuType==='1'">子菜单</a-tag>
                <a-tag color="green" v-show="record.menuType==='2'">按钮</a-tag>
              </div>
            </template>
            <span slot="action" slot-scope="text, record">
              <a @click="handleEdit(record)" v-if="!hasPermissions('MENU:LIST:EDIT')">编辑</a>
              <a-divider type="vertical"/>
              <a-dropdown>
              <a class="ant-dropdown-link" href="#">更多
                <a-icon type="down"/>
              </a>
               <a-menu slot="overlay">
              <a-menu-item>
                <a href="javascript:;" v-if="!hasPermissions('MENU:LIST:DELETE')"
                   @click="handleDelete(record.id)">删除</a>
              </a-menu-item>
              <a-menu-item>
                <a href="javascript:;" v-if="!hasPermissions('MENU:LIST:DETAIL')" @click="handleDetail(record)">详细</a>
              </a-menu-item>
              </a-menu>
              </a-dropdown>
            </span>
          </a-table>
        </div>
        <MenuAddModel ref="menuAddModel" @ok="menuAddModelOK"></MenuAddModel>
      </div>
    </a-card>
  </div>
</template>

<script>
  import MenuAddModel from './modal/MenuAddModel'
  import { list, deleteById } from '@/api/base/menu.jsx'
  import moment from 'moment'
  import { filterObj, hasPermissions } from '../../utils/util'

  export default {
    components: {
      MenuAddModel
    },
    name: 'MenuList',
    data() {
      return {
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
        selectedRowKeys: [],
        dataSource: [],
        columns: [
          {
            title: '菜单名称',
            align: 'center',
            dataIndex: 'menuName'
          },
          {
            title: '菜单类型',
            align: 'center',
            dataIndex: 'menuType',
            scopedSlots: { customRender: 'typeslots' }
          },
          {
            title: '菜单路径',
            align: 'center',
            dataIndex: 'menuUrl'
          },
          {
            title: '授权标识',
            align: 'center',
            dataIndex: 'authorization'
          },
          {
            title: '前端组件',
            align: 'center',
            dataIndex: 'menuAssembly'
          },
          {
            title: '菜单图标',
            align: 'center',
            dataIndex: 'menuIcon'
          },
          {
            title: '跳转地址',
            align: 'center',
            dataIndex: 'jumpUrl'
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
      hasPermissions(value) {
        return hasPermissions(value)
      },
      handleEdit(record) {
        this.$refs.menuAddModel.edit(record)
        this.$refs.menuAddModel.title = '修改'
      },
      handleDetail(record) {
        this.$refs.menuAddModel.edit(record)
        this.$refs.menuAddModel.title = '详细'
        this.$refs.menuAddModel.disableSubmit = true
      },
      handleDelete(id) {
        if (!id) {
          return
        }
        deleteById(id).then(res => {
          if (res.code === '200') {
            this.$message.success('成功!')
          } else {
            this.$message.error('失败')
          }
          this.loadData()
        })
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
        //TODO 筛选
        if (Object.keys(sorter).length > 0) {
          this.isorter.column = sorter.field
          this.isorter.order = 'ascend' === sorter.order ? 'asc' : 'desc'
        }
        this.ipagination = pagination
        this.loadData()
      },
      moment,
      loadData() {
        this.loading = true
        list({}).then(res => {
          if (res.code === '200') {
            console.log(res.data)
            this.dataSource = res.data
          }
          this.loading = false
        })
      },
      //添加
      handleAdd() {
        this.$refs.menuAddModel.add()
        this.$refs.menuAddModel.title = '新增'
      },
      //选中
      onSelectChange(selectedRowKeys) {
        this.selectedRowKeys = selectedRowKeys
      },
      menuAddModelOK() {
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
</style>