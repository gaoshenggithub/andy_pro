<template>
  <div>
    <a-card :bordered="false">
      <div>
        <!--列表-->
        <div class="table-operator">
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
              @change="handleTableChange"
            >
              <template slot="logcontentslots" slot-scope="text, record">
                <div @click="handleDetail(record.id)">
                  <a-tag color="blue">{{record.logContent.split(':')[0]}}</a-tag>
                  <a-tag color="cyan">{{record.logContent.split(':')[1]}}</a-tag>
                  <a-tag color="green">{{record.logContent.split(':')[2]}}</a-tag>
                </div>
              </template>
            </a-table>
          </div>
        </div>
        <LogModel ref="logModel" @ok="logModelOK"></LogModel>
      </div>
    </a-card>
  </div>
</template>

<script>
  import { list } from '@/api/base/log'
  import { filterObj } from '../../utils/util'
  import moment from 'moment'
  import LogModel from './modal/LogModel'

  export default {
    components: { LogModel },
    name: 'LogList',
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
            title: '序号',
            width: 80,
            center: 'center',
            customRender: (text, record, index) => `${index + 1}`
          },
          {
            title: '操作内容',
            align: 'center',
            dataIndex: 'logContent',
            scopedSlots: { customRender: 'logcontentslots' }
          },
          {
            title: '日志类型',
            align: 'center',
            dataIndex: 'logType',
            customRender: text => text === '1' ? '登录日志' : '操作日志'
          },
          {
            title: '操作类型',
            align: 'center',
            dataIndex: 'operateType',
            customRender: text =>
              text === 'GET' ? '查询' :
                text === 'POST' ? '添加/登录' :
                  text === 'DELETE' ? '删除' : '更新'
          },
          {
            title: '用户名',
            align: 'center',
            dataIndex: 'username'
          },
          {
            title: '请求方法',
            align: 'center',
            dataIndex: 'method'
          },
          {
            title: '请求类型',
            align: 'center',
            dataIndex: 'requestType'
          },
          {
            title: '耗时',
            align: 'center',
            dataIndex: 'costTime'
          },
          {
            title: '创建时间',
            align: 'center',
            dataIndex: 'createTime',
            customRender: text => moment(text).format('YYYY-MM-DD')
          }
        ],
        loading: false
      }
    },
    created() {
      this.loadData()
    },
    methods: {
      moment,
      handleDetail(id) {
        this.$refs.logModel.show(id)
        this.$refs.logModel.title = '详细'
      },
      loadData(arg) {
        console.log()
        this.loading = true
        if (arg === 1) {
          this.ipagination.current = 1
        }
        let params = this.getQueryParams()//查询条件
        list(params).then((res) => {
          if (res.code === '200') {
            this.dataSource = res.data.records
            console.log(this.dataSource)
            this.ipagination.total = res.data.total
          }
          this.loading = false
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
      logModelOK() {
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