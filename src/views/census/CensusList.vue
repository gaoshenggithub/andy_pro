<template>
  <div>
    <a-row>
      <a-col :span='6'>
        <a-card title="消息通知">
          <a-spin :spinning="loadding">
            <a-tabs defaultActiveKey="error" :tabBarGutter='tabBarGutter' @change='callback'>
              <a-tab-pane key="error">
                <span slot="tab"><a-badge :count="errorCount"/>系统危险异常</span>
                <a-list v-show='errorCount>0'>
                  <a-list-item :class="{'ant-color':isCheck}" @mouseenter="handleStyle(true,'error')"
                               @mouseleave="handleStyle(false,'error')">
                    <a slot="actions" @click="handleErrorDetail('error')">详细</a>
                    <a-list-item-meta :title='errorTitle' description="危险消息通知">
                      <a-avatar style="background-color: white" slot="avatar"
                                :src="errorImg"/>
                    </a-list-item-meta>
                  </a-list-item>
                </a-list>
              </a-tab-pane>
              <a-tab-pane key="warning">
                  <span slot="tab"><a-badge :count="warnCount"
                                            :numberStyle="{backgroundColor: '#fadb14'} "/>系统警告异常</span>
                <a-list v-show='warnCount>0'>
                  <a-list-item :class="{'ant-color':isWarnCheck}" @mouseenter="handleStyle(true,'warn')"
                               @mouseleave="handleStyle(false,'warn')">
                    <a slot="actions" @click="handleWarnDetail('warning')">详细</a>
                    <a-list-item-meta :title='warnTitle' description="警告消息通知">
                      <a-avatar style="background-color: white" slot="avatar"
                                :src="warnImg"/>
                    </a-list-item-meta>
                  </a-list-item>
                </a-list>
              </a-tab-pane>
            </a-tabs>
          </a-spin>
        </a-card>
        <a-card title="消息通知列表">
          <a-spin :spinning="loadding">
            <a-list
              itemLayout="horizontal"
              :dataSource="errorData"
            >
              <a-list-item slot="renderItem" slot-scope="item, index">
                <a-list-item-meta
                  :description="item.requestUrl"
                >
                  <a slot="title" href="https://vue.ant.design/">{{tab===''||tab==='error'?item.code:`${item.code} <==>
                    ${item.stack}`}}</a>
                  <a-avatar style="background-color: white" slot="avatar"
                            :src="tab===''||tab==='error'?errorImg:warnImg"/>
                </a-list-item-meta>
              </a-list-item>
            </a-list>
          </a-spin>
        </a-card>
      </a-col>
      <a-col :span='18'>
        <a-card>
          <div>
            <!--列表-->
            <div>
              <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
                <i class="anticon anticon-info-circle ant-alert-icon"></i>已选择&nbsp;<a style="font-weight: 600">{{selectedRowKeys.length
                }}</a>项&nbsp;&nbsp;
                <a style="margin-left: 24px" @click="onClearSelected">清空</a>
                <a-dropdown v-if="selectedRowKeys.length > 0">
                  <a-menu slot="overlay">
                    <a-menu-item key="1">
                      <a href="javascript:;" @click="handleDelete">
                        <a-icon type="delete"/>
                        处理</a>
                    </a-menu-item>
                  </a-menu>
                  <a-button style="margin-left: 8px">
                    批量操作
                    <a-icon type="down"/>
                  </a-button>
                </a-dropdown>
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
                  @change="handleTableChange">
                  <template slot="statusslots" slot-scope="text, record">
                    <div>
                      <a-tag color="red" v-show='record.level==="error"'>{{record.status==='2'?'未处理':'已处理'}}</a-tag>
                      <a-tag color="orange" v-show='record.level==="warning"'>{{record.status==='2'?'未处理':'已处理'}}
                      </a-tag>
                    </div>
                  </template>
                  <template slot="levelslots" slot-scope="text, record">
                    <div>
                      <a-tag color="red" v-show='record.level==="error"'>{{record.level.toUpperCase()}}</a-tag>
                      <a-tag color="orange" v-show='record.level==="warning"'>{{record.level.toUpperCase()}}</a-tag>
                    </div>
                  </template>
                  <span slot="action" slot-scope="text, record">
                  <a href="javascript:;" @click="handleErrorInfo(record.id)">查看</a>
                  <a-divider type="vertical"/>
                  <a href="javascript:;" @click="handleDetail(record.id)">处理</a>
                  <a-divider type="vertical"/>
                  <a href="javascript:;" @click="handleIgnore(record.id)">忽略</a>
            </span>
                </a-table>
              </div>
            </div>
          </div>
        </a-card>
        <a-row>
          <a-col :span='24'>
            <a-card title="月/异常">
              <div>
                <v-chart :forceFit="true" :height="height" :data="data" :scale="scale">
                  <v-tooltip/>
                  <v-axis/>
                  <v-line position="key*value" color="red"/>
                  <v-point position="key*value" shape="circle" color="red"/>
                </v-chart>
              </div>
            </a-card>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
    <CensusDetailModel ref="censusDetailModelRef" @ok="censusDetailModelRefOK"></CensusDetailModel>
  </div>
</template>

<script>
  import DataSet from '@antv/data-set'
  import CensusDetailModel from './model/CensusDetailModel'
  import { list, count, deleteById, update, getPointLineData, batchDelete } from '@/api/base/sysdanger'
  import { filterObj } from '../../utils/util'
  import moment from 'moment'

  export default {
    components: { CensusDetailModel },
    name: 'censusList',
    data() {
      return {
        errorImg: 'http://47.105.177.77:9999/group1/M00/00/03/rB8LbV1WBGiAcFMRAAAZ633M0Lc143.png',
        warnImg: 'http://47.105.177.77:9999/group1/M00/00/03/rB8LbV1WBiiAUwrMAAAZ6zUgEbM458.png',
        loadding: false,
        loading: false,
        tabBarGutter: 133,
        errorCount: 0,
        warnCount: 0,
        current: 0,
        warnTitle: '',
        errorTitle: '',
        isCheck: false,
        isWarnCheck: false,
        ipagination: {
          current: 1,
          pageSize: 16,
          pageSizeOptions: ['16'],
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
            title: '序号',
            width: 80,
            center: 'center',
            customRender: (text, record, index) => `${index + 1}`
          },
          {
            title: '请求方式',
            align: 'center',
            dataIndex: 'method'
          }, {
            title: '错误级别',
            align: 'center',
            dataIndex: 'level',
            scopedSlots: { customRender: 'levelslots' }
          }, {
            title: '处理状态',
            align: 'center',
            dataIndex: 'status',
            scopedSlots: { customRender: 'statusslots' }
          }, {
            title: '请求地址',
            align: 'center',
            dataIndex: 'requestUrl'
          }, {
            title: '创建时间',
            align: 'center',
            dataIndex: 'createTime',
            customRender: text => moment(text).format('YYYY-MM-DD')
          }, {
            title: '操作',
            dataIndex: 'action',
            scopedSlots: { customRender: 'action' },
            fixed: 'right',
            align: 'center',
            width: 150
          }
        ],
        selectedRowKeys: [],
        tab: '',
        scale: [{
          dataKey: 'value'
        }, {
          dataKey: 'key'
        }],
        height: 400,
        data: [],
        errorData: []
      }
    },
    created() {
      this.getCount()
      this.loadData()
      this.loadPoint()
    },
    methods: {
      moment,
      loadPoint() {
        getPointLineData().then(res => {
          console.log(res.data)
          if (res.code === '200') {
            this.data = res.data
          } else {
          }
        })
      },
      loadData(arg) {
        this.loading = true
        if (arg === 1) {
          this.ipagination.current = 1
        }
        let params = this.getQueryParams()//查询条件
        if (this.tab !== '') {
          params = Object.assign(params, { level: this.tab })
          console.log(params)
        }
        list(params).then((res) => {
          if (res.code === '200') {
            console.log(res.data)
            this.dataSource = res.data.content
            this.errorData = res.data.content
            this.ipagination.total = res.data.totalElements
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
      getCount() {
        this.loadding = true
        count().then(res => {
          res.data.forEach(e => {
            if (e.key === 'error') {
              this.errorCount = e.value
              this.errorTitle = `您目前有${this.errorCount}消息需要处理`
            } else if (e.key === 'warning') {
              this.warnCount = e.value
              this.warnTitle = `您目前有${this.warnCount}消息需要处理`
            }
            this.loadding = false
          })
        })
      },
      handleStyle(value, val) {
        if (val === 'error') {
          this.isCheck = value
        } else {
          this.isWarnCheck = value
        }
      },
      handleErrorDetail(value) {
        this.loadData(value)
      },
      handleWarnDetail(value) {
        this.loadData(value)
      },
      callback(value) {
        if (value === 'warning') {
          this.tab = 'warning'
        } else {
          this.tab = ''
        }
        this.getCount()
        this.loadData()
      },
      onSelectChange(selectedRowKeys) {
        this.selectedRowKeys = selectedRowKeys
      },
      onClearSelected() {
        this.selectedRowKeys = []
      },
      handleDelete() {
        if (this.selectedRowKeys.length === 0) {
          this.$message.warn('请选择列表')
          return
        }
        const ids = this.selectedRowKeys.toString()
        batchDelete(ids).then(res => {
          if (res.code === '200') {
            this.$message.success('成功')
            this.selectedRowKeys = []
          } else {
            this.$message.error('失败')
          }
          this.getCount()
          this.loadData()
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
      handleErrorInfo(id) {
        this.$refs.censusDetailModelRef.show(id)
        this.$refs.censusDetailModelRef.title = '异常栈信息'
      },
      censusDetailModelRefOK() {
        this.loadData()
        this.getCount()
      },
      handleIgnore(id) {
        deleteById(id).then(res => {
          if (res.code === '200') {
            this.$message.success('成功')
          } else {
            this.$message.error('失败')
          }
          this.getCount()
          this.loadData()
        })
      },
      handleDetail(id) {
        update(id).then(res => {
          if (res.code === '200') {
            this.$message.success('成功')
          } else {
            this.$message.error('失败')
          }
          this.getCount()
          this.loadData()
        })
      }
    }
  }
</script>

<style scoped>
  .tabs-antd {
    height: 400px;
    width: 400px;
    box-shadow: #cccccc 0px 0px 10px;
  }

  .ant-color {
    background-color: #cccccc
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
