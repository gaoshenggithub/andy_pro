<template>
  <div>
    <div>
      <page-view :title="false">
        <div slot="headerContent">
          <div class="table-operator">
            <a-button type="primary" @click="handleSelectAll" v-show='dataList.length>0'>
              {{cardList.length===dataList.length?'全不选':'全选'}}
            </a-button>
            <a-divider type="vertical"/>
            <a-button type="primary" @click='()=>$router.push("/introduce/introduce")'>
              个人博客
            </a-button>
            <a-divider type="vertical" v-show='cardList.length>0'/>
            <a-popconfirm :title="cardList.length===dataList.length?'确定删除所有吗?':'确定删除选中的吗?'"
                          @confirm="handleDelete"
                          @cancel="()=>this.$message.success(`取消删除`)"
                          okText="确定"
                          cancelText="取消">
              <a-button v-show='cardList.length>0' style='box-shadow: red 0 0 10px'>删除</a-button>
            </a-popconfirm>
          </div>
          <div style='padding: 10px'>

          </div>
        </div>
      </page-view>
    </div>
    <a-spin :tip='tipName' :spinning='spinningConfig'>
      <div>
        <a-row
          :gutter="32"
        >
          <a-checkbox-group
            @change='handleChange'
            :value='cardList'>
            <a-col
              :span="dataList.length <=3 ?8:6"
              v-for='(item,index) in dataList'
              :key='item.id'
              :index='index'>
              <a-card :title="item.title"
                      class='card-list-inline'
                      :class="{'card-select':cardList.indexOf(item.id)!==-1}">
								 <span slot="extra">
									 <a-checkbox
                     :value="item.id"
                   ></a-checkbox>
								 </span>
                <div>
                  <p>分类名称: <span>{{item.catName}}</span></p>
                  <p>创建时间: <span>{{item.createTime}}</span></p>
                </div>
              </a-card>
            </a-col>
          </a-checkbox-group>
        </a-row>
      </div>
    </a-spin>
    <div class='footer'>
      <div style='margin:20px 0 0 20px'>
        <a-pagination
          :pageSize.sync="ipagination.pageSize"
          showQuickJumper
          :total="total"
          @change="handleQuickJumper"/>
      </div>
    </div>
  </div>
</template>

<script>
  import { PageView } from '@/layouts'
  import { list, batchDelete } from '@/api/base/blob'

  export default {
    components: { PageView },
    name: 'ArticleList',
    data() {
      return {
        form: this.$form.createForm(this),
        dataList: [],
        selectValue: '',
        cardList: [],
        tipName: '',
        spinningConfig: false,
        total: 0,
        ipagination: {
          current: 1,
          pageSize: 12
        }
      }
    },
    created() {
      this.loadData()
    },
    methods: {
      handleDelete() {

      },
      handleChange(value) {
        this.cardList = value
      },
      handleQuickJumper(value) {
        this.ipagination.current = value
        this.loadData()
      },
      handleSelectAll() {
        const { cardList, dataList } = this
        if (cardList.length === dataList.length && dataList.length > 0) {
          this.cardList = []
        } else {
          this.cardList = this.dataList.map(e => e.id)
        }
      },
      handleDelete() {
        batchDelete({ ids: this.cardList.toString() }).then(res => {
          if (res.code === '200') {
            this.$message.success('成功')
          } else {
            this.$notification.error({
              placement: 'topRight',
              message: '错误',
              description: res.message
            })
          }
          this.loadData()
          this.cardList = []
        })
      },
      loadData() {
        const params = { ...this.ipagination }
        this.spinningConfig = true
        list(params).then(res => {
          if (res.code === '200') {
            console.log(res)
            this.dataList = res.data.records
            this.total = res.data.total
          }
          this.spinningConfig = false
        })
      }
    }
  }
</script>

<style lang="less" scoped>

  /*  .ant-div-bottom > div {
			margin-bottom: 30px;
		}*/

  .card-list-inline {
    width: 380px;
    height: 180px;
    margin-bottom: 25px;
    box-shadow: rgba(0, 0, 0, 0.7) 0px 0px 10px; //将颜色提到前面，且将h-shadow,v-shadow设为0px,实现四周阴影
  }

  .card-select {
    box-shadow: red 0px 0px 10px; //将颜色提到前面，且将h-shadow,v-shadow设为0px,实现四周阴影
    animation: card-select 3s ease infinite;
  }

  @keyframes card-select {
    0% {
      transform: translateY(0) scale(1, 1);
    }
    /* 中间状态图片位移并且拉伸 */
    50% {
      transform: translateY(-15px) scale(0.97, 1.03);
    }
    100% {
      transform: translateY(0) scale(1, 1);
    }
  }

  /** Button按钮间距 */
  .ant-btn {
    margin-left: 3px
  }

  .ant-card-body .table-operator {
    margin-bottom: 18px;
  }

  .footer {
    height: 100px;
    width: 100%;
    background-color: white;
    position: fixed;
    bottom: 0;
    box-shadow: #666666 0 0 10px;
  }
</style>