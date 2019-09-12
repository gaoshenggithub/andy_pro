<template>
  <div>
    <a-card :bordered="false">
      <div>
        <div class="table-operator">
          <a-button @click="handleAdd" type="primary" v-if="!hasPermissions('DICT:LIST:ADD')" icon="plus">新增字典
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
            :pagination="ipagination"
            :loading="loading">
            <span slot="action" slot-scope="text, record">
              <a @click="handleEdit(record)" v-if="!hasPermissions('DICT:LIST:EDIT')"><a-icon type="edit"/>编辑</a>
              <a-divider type="vertical"/>
                <a-popconfirm
                  placement="topRight"
                  :title='`确定删除字典名称为 ${record.dictName},该级别下的数据会全部删除`'
                  okText="确定"
                  cancelText="取消"
                  @cancel='()=>$message.info(`取消删除字典名称为:${record.dictName}`)'
                  @confirm="handleDelete(record)">
                      <a v-if="!hasPermissions('DICT:LIST:DELETE')"><a-icon type="delete"/>删除</a>
                </a-popconfirm>
              <a-divider type="vertical"/>
              <a @click='handleEditDict(record)' v-if="!hasPermissions('DICT:LIST:DICTITEM')"><a-icon type="setting"/>编辑字典</a>
            </span>
          </a-table>
        </div>
      </div>
    </a-card>
    <DictModel ref='dictModel' @ok="dictModelOK"></DictModel>
    <DictItemDrawer ref="dictItemDrawer" @ok="dictItemDrawerOK"></DictItemDrawer>
  </div>
</template>

<script>
  import { filterObj, hasPermissions } from '../../utils/util'
  import { list, deleteById } from '@/api/base/dict'
  import moment from 'moment'
  import DictModel from './modal/DictModel'
  import DictItemDrawer from './modal/DictItemDrawer'

  export default {
    components: { DictModel, DictItemDrawer },
    name: 'DictList',
    data() {
      return {
        loading: false,
        dataSource: [],
        columns: [
          {
            title: '序号',
            align: 'center',
            customRender: (text, record, index) => `${index + 1}`
          },
          {
            title: '字典名称',
            dataIndex: 'dictName',
            align: 'center'
          },
          {
            title: '字典编码',
            dataIndex: 'dictCode',
            align: 'center'
          },
          {
            title: '描述',
            dataIndex: 'description',
            align: 'center'
          },
          {
            title: '创建时间',
            dataIndex: 'crateTime',
            customRender: text => moment(text).format('YYYY-MM-DD')
          },
          {
            title: '操作',
            dataIndex: 'action',
            scopedSlots: { customRender: 'action' },
            fixed: 'right',
            align: 'center',
            width: 400
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
        }
      }
    },
    created() {
      this.loadData()
    },
    methods: {
      moment,
      hasPermissions(value) {
        return hasPermissions(value)
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
      loadData(arg) {
        this.loading = true
        if (arg === 1) {
          this.ipagination.current = 1
        }
        let params = this.getQueryParams()//查询条件
        list(params).then((res) => {
          if (res.code === '200') {
            this.dataSource = res.data.records
            this.ipagination.total = res.data.total
          } else {
            this.$notification.error({
              placement: 'topRight',
              message: '消息提示',
              description: res.message
            })
          }
          this.loading = false
        })
      },
      handleAdd() {
        this.$refs.dictModel.add()
        this.$refs.dictModel.title = '添加'
      },
      dictModelOK() {
        this.loadData()
      },
      dictItemDrawerOK() {
        this.loadData()
      },
      handleDelete(value) {
        deleteById({ id: value.id }).then(res => {
          if (res.code === '200') {
            this.loadData()
            this.$message.success(`成功删除字典名称为: ${value.dictName}`)
          } else {
            this.$notification.error({
              placement: 'topRight',
              message: '错误',
              description: res.message
            })
          }
        })
      },
      handleEdit(value) {
        this.$refs.dictModel.edit(value)
        this.$refs.dictModel.title = '编辑'
      },
      handleEditDict(value) {
        this.$refs.dictItemDrawer.edit(value)
        this.$refs.dictItemDrawer.title = '增加字典数据'
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