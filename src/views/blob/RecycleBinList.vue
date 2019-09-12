<template>
  <a-card :bordered="false">
    <div>
      <!-- 操作按钮区域 -->
      <div class="table-operator" style="border-top: 5px">

      </div>
      <!--列表-->
      <div class="table-operator">
        <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
          <i class="anticon anticon-info-circle ant-alert-icon"></i>已选择&nbsp;<a style="font-weight: 600">{{
          selectedRowKeys.length }}</a>项&nbsp;&nbsp;
          <a style="margin-left: 24px" @click="onClearSelected">清空</a>
          <a-dropdown v-if="selectedRowKeys.length > 0">
            <a-menu slot="overlay">
              <a-menu-item key="1">
                <a href="javascript:;" @click="handleBatchThoroughDelete">
                  <a-icon type="delete"/>
                  彻底删除</a>
              </a-menu-item>
              <a-menu-item key="2">
                <a href="javascript:;" @click="handleBatchRecovery">
                  <a-icon type="sync" spin/>
                  恢复</a>
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
            @change="handleTableChange"
          >

            <template slot="labelnameslots" slot-scope="text, record">
              <div>
                <a-tag color="blue" v-for="(label,index) in record.labelName.split(',')" :key='index' :index='index'>
                  {{label}}
                </a-tag>
              </div>
            </template>
            <span slot="action" slot-scope="text, record">
              <a @click="handleThoroughDelete(record.id)"><a-icon type="delete"/>彻底删除</a>
              <a-divider type="vertical"/>
              <a @click="handleRecovery(record.id)"><a-icon type="sync" spin/>恢复</a>
            </span>
          </a-table>
        </div>
      </div>
    </div>
  </a-card>
</template>

<script>
  import { recycleBinListPage, recovery, thoroughDelete, batchThoroughDelete, batchRecovery } from '@/api/base/blob'
  import { filterObj } from '../../utils/util'

  export default {
    name: 'RecycleBinList',
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
            title: '标题',
            center: 'center',
            dataIndex: 'title'
          },
          {
            title: '标签名称',
            center: 'center',
            dataIndex: 'labelName',
            scopedSlots: { customRender: 'labelnameslots' }

          },
          {
            title: '创建时间',
            center: 'center',
            dataIndex: 'createTime'
          },
          {
            title: '操作',
            dataIndex: 'action',
            scopedSlots: { customRender: 'action' },
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
      onSelectChange(selectedRowKeys) {
        this.selectedRowKeys = selectedRowKeys
      },
      loadData(arg) {
        console.log()
        this.loading = true
        if (arg === 1) {
          this.ipagination.current = 1
        }
        let params = this.getQueryParams()//查询条件
        recycleBinListPage(params).then((res) => {
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
      handleBatchThoroughDelete() {
        batchThoroughDelete({ ids: this.selectedRowKeys }).then(res => this.handleCommon(res))
      },
      handleBatchRecovery() {
        batchRecovery({ ids: this.selectedRowKeys }).then(res => this.handleCommon(res))
      },

      handleThoroughDelete(id) {
        thoroughDelete({ id }).then(res => this.handleCommon(res))
      },
      handleRecovery(id) {
        recovery({ id }).then(res => this.handleCommon(res))
      },
      handleCommon(res) {
        let messageType = ''
        if (res.code === '200') {
          messageType = 'success'
        } else {
          messageType = 'error'
        }
        this.loadData()
        this.$message[messageType](res.message)
        return 1
      }
    }
  }
</script>

<style scoped>

</style>