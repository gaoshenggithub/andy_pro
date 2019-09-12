<template>
  <a-modal
    :title="title"
    :width="width"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <div>
      <!-- 操作按钮区域 -->
      <div style='margin-bottom: 20px'>
        <a-button @click="handleAdd" type="primary" icon="plus">添加分类
        </a-button>
      </div>
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
             <span slot="action" slot-scope="text, record">
              <a @click="handleEdit(record)">编辑</a>
              <a-divider type="vertical"/>
              <a @click="handleDelete(record.id)">删除</a>
               <a-divider type="vertical"/>
              <a @click="handleSelect(record)" :class='{"ant-select-color":record.id===selectId}'>选择
                  <a-icon type="check-circle" v-show='record.id===selectId' theme="twoTone" twoToneColor="#52c41a"/>
              </a>
             </span>
          </a-table>
        </div>
      </div>
    </div>
    <CatModal ref="catModal" @ok='catModalOK'></CatModal>
  </a-modal>
</template>

<script>
  import CatModal from './modal/CatModal'
  import { list, deleteById } from '@/api/base/classification'
  import { filterObj } from '../../../utils/util'

  export default {
    components: { CatModal },
    name: 'BlobModal',
    data() {
      return {
        width: 1200,
        title: '',
        columns: [
          {
            title: '序号',
            width: 80,
            center: 'center',
            customRender: (text, record, index) => `${index + 1}`
          },
          {
            title: '分类名称',
            align: 'center',
            dataIndex: 'catName',
            width: 150
          },
          {
            title: '创建时间',
            align: 'center',
            dataIndex: 'createTime',
            width: 150
          },
          {
            title: '操作',
            dataIndex: 'action',
            scopedSlots: { customRender: 'action' },
            align: 'center',
            width: 150
          }
        ],
        loading: false,
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
        visible: false,
        content: '',
        disableSubmit: false,
        selectId: '',
        selectValue: {},
        confirmLoading: false,
        form: this.$form.createForm(this)
      }
    },

    methods: {
      catModalOK() {
        this.loadData()
      },
      handleSelect(value) {
        this.selectValue = value
        this.selectId = value.id
      },
      handleAdd() {
        this.$refs.catModal.add()
        this.$refs.catModal.title = '新增'
      },
      handleEdit(value) {
        this.$refs.catModal.edit(value)
        this.$refs.catModal.title = '修改'
      },
      add() {
        this.selectId = ''
        this.loadData()
        this.visible = true
      },
      close() {
        this.visible = false
        this.selectId = ''
      },
      handleCancel() {
        this.close()
      },
      handleOk() {
        this.$emit('ok', this.selectValue)
        this.close()
      },
      handleDelete(id) {
        deleteById({ id }).then(res => {
          if (res.code === '200') {
            this.$message.success('成功')
          } else {
            this.$message.error('失败')
          }
        })
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
      }
    }
  }
</script>


<style lang="less" scoped>
  .clickRowStyl {
    background-color: #00b4ed
  }

  .ant-select-color {
    color: red;
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