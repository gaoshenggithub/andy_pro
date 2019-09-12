<template>
  <div>
    <a-drawer
      :title="title"
      :placement="placement"
      :closable="false"
      @close="close"
      :visible="visible"
      height="500"
      width='200'
    >
      <div class='outerDiv'>
        <a-spin :spinning='confirmLoading'>
          <div>
            <div class="table-operator">
              <a-button type="primary" v-if="!hasPermissions('DICT_ITEM:LIST:ADD')" @click='handleAdd' icon="plus">
                新增字典
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
              <a @click='handleEdit(record)' v-if="!hasPermissions('DICT_ITEM:LIST:EDIT')"><a-icon type="edit"/>编辑</a>
              <a-divider type="vertical"/>
              <a @click='handleDelete(record.id)' v-if="!hasPermissions('DICT_ITEM:LIST:DELETE')"><a-icon type="delete"/>删除</a>
            </span>
              </a-table>
            </div>
          </div>
        </a-spin>
      </div>
      <a-row :style="{textAlign:'right'}">
        <a-button :style="{marginRight: '8px'}" @click="handleCancel">
          关闭
        </a-button>
        <a-button type="primary" @click="handleCancel">确定</a-button>
      </a-row>
    </a-drawer>
    <DictItemModel ref='dictItemModel' @ok="dictItemModelOK"></DictItemModel>
  </div>
</template>

<script>
  import { list, deleteById } from '@/api/base/dictitem'
  import { filterObj, hasPermissions } from '@/utils/util'
  import DictItemModel from './DictItemModel'

  export default {
    components: { DictItemModel },
    name: 'DictItemDrawer',
    data() {
      return {
        placement: 'top',
        visible: false,
        title: '',
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
          menuName: {
            rules: [
              { required: true, message: 'qn' }
            ]
          }
        },
        loading: false,
        columns: [
          {
            title: '序号',
            align: 'center',
            customRender: (text, record, index) => `${index + 1}`
          },
          {
            title: '字典项key',
            dataIndex: 'itemText',
            align: 'center'
          },
          {
            title: '文本值value',
            dataIndex: 'itemValue',
            align: 'center'
          },
          {
            title: '描述',
            dataIndex: 'description',
            align: 'center'
          },
          {
            title: '排序号',
            dataIndex: 'sortOrder',
            align: 'center'
          },
          {
            title: '创建时间',
            dataIndex: 'createTime',
            align: 'center'
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
        dataSource: [],
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
        model: {}
      }
    },

    methods: {
      handleAdd() {
        const { model } = this
        this.$refs.dictItemModel.add(model.id)
        this.$refs.dictItemModel.title = '新增'
      },
      handleDelete(id) {
        deleteById({ id }).then(res => {
          let messageType
          if (res.code === '200') {
            messageType = 'success'
          } else {
            messageType = 'error'
          }
          this.$message[messageType](res.message)
          this.loadData()
        })
      },
      handleEdit(value) {
        this.$refs.dictItemModel.edit(value)
        this.$refs.dictItemModel.title = '编辑'
      },
      dictItemModelOK() {
        this.loadData()
      },
      hasPermissions(value) {
        return hasPermissions(value)
      },
      handleCancel() {
        this.close()
      },
      close() {
        this.visible = false
        this.model = {}
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
        list(Object.assign(params, { dictId: this.model.id })).then((res) => {
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
      edit(value) {
        console.log(value)
        this.model = value
        this.visible = true
        this.loading = true
        this.confirmLoading = true
        this.loadData()
        this.confirmLoading = false
      }
    }
  }
</script>

<style scoped lang="less">
  .outerDiv {
    width: 100%;
    border: 1px solid #e9e9e9;
    padding: 2px 2px;
    background: #fff
  }

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


  .ant-modal-cust-warp .ant-modal-body {
    height: calc(100% - 110px) !important;
    overflow-y: auto
  }

  .ant-modal-cust-warp .ant-modal-content {
    height: 90% !important;
    overflow-y: hidden
  }
</style>