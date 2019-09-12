<template>
  <div>
    <div class='table-operator'>
      <a-button
        type='primary'
        icon='upload'
        @click="handleAdd">上传图片
      </a-button>
      <a-divider
        type='vertical'
        v-show='fileList.length>0'/>
      <a-button
        type='primary'
        @click='handleSelectAll'
        v-show='fileList.length>0'>
        {{pictureList.length===fileList.length?'全不选':'全选'}}
      </a-button>
      <a-divider
        type='vertical'
        v-show='pictureList.length>0'/>
      <a-button type='danger'
                ghost
                v-show='pictureList.length>0'
                @click='handleDelete'>
        删除
      </a-button>
      <p
        style='float: right;margin-right: 200px'>
        已经选中{{checkedSum}}
      </p>
    </div>
    <a-divider></a-divider>
    <a-card style="box-shadow: #cccccc 0 0 10px;margin:0 8px 8px 0" :bordered="false">
      <a-spin :tip='tipName' :spinning='spinningConfig'>
        <div>
          <a-row
            type="flex" justify="space-between">
            <a-checkbox-group
              @change='handleChange'
              :value='pictureList'>
              <a-col
                :span="fileList.length<=2?6:4"
                v-for='(file,index) in fileList'
                :key='file.id'
                :index='index'>
                <img
                  class='images-list-inline'
                  :class="{'images-select':pictureList.indexOf(file.id)!==-1}"
                  @click="handleLoadImage(file.fileUrl,file.fileName)"
                  :src="getServerImage(file.fileUrl)"
                  :alt="file.fileName"/>
                <a-checkbox
                  :value='file.id'
                  class='ant-checkbox-body'
                  style='margin-left: 80px'>
                  <span>{{file.fileName}}</span>
                </a-checkbox>
              </a-col>
            </a-checkbox-group>
          </a-row>
        </div>
      </a-spin>
      <a-pagination
        :pageSize.sync="ipagination.pageSize"
        showQuickJumper
        :total="total"
        @change="handleQuickJumper"/>
    </a-card>
    <UploadFileModel ref="uploadFileModel" @ok="uploadFileModelOK"></UploadFileModel>
    <AvatarLayout ref="avatarLayout"></AvatarLayout>
  </div>
</template>

<script>
  import UploadFileModel from './modal/UploadFileModel'
  import { list, batchDelete } from '@/api/base/file'
  import { getServerImage } from '../../utils/util'
  import AvatarLayout from '@/components/Avatar/AvatarLayout'
  import Mongolia from '@/components/Mongolia/Mongolia'

  export default {
    components: { UploadFileModel, AvatarLayout, Mongolia },
    name: 'PictureList',
    data() {
      return {
        ipagination: {
          current: 1,
          pageSize: 18
        },
        spinningConfig: false,
        tipName: 'Loading...',
        pictureList: [],
        fileList: [],
        total: 0,
        checkedSum: ''
      }
    },
    created() {
      this.getWidthHeight()
      this.loadData()
    },
    methods: {
      getWidthHeight(){
        console.log(document.body.scrollWidth)
      },
      handleLoadImage(url, name) {
        this.$copyText(url)
        this.$message.success(`${name}复制完毕`)
        this.$refs.avatarLayout.show(url)
        this.$refs.avatarLayout.title = name
      },
      getServerImage(value) {
        return getServerImage(value)
      },
      handleAdd() {
        this.$refs.uploadFileModel.add('1')
        this.$refs.uploadFileModel.title = '添加图片'
      },
      handleChange(value) {
        this.pictureList = value
        this.checkedSum = `${this.pictureList.length}/${this.fileList.length}`
      },
      handleSelectAll() {
        const { pictureList, fileList } = this
        if (pictureList.length === fileList.length && fileList.length > 0) {
          this.pictureList = []
        } else {
          this.pictureList = this.fileList.map(e => e.id)
        }
        this.checkedSum = `${this.pictureList.length}/${this.fileList.length}`
      },
      handleDelete() {
        batchDelete({ ids: this.pictureList.toString() }).then(res => {
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
          this.pictureList = []
        })
      },
      test() {
        console.log('----------')
      },
      loadData() {
        const params = { ...this.ipagination }
        this.spinningConfig = true
        list(Object.assign(params, { fileType: '1' })).then(res => {
          if (res.code === '200') {
            console.log(res.data)
            this.fileList = res.data.records
            console.log(res.data.total)
            this.total = res.data.total
          } else {
            this.$notification.error({
              placement: 'topRight',
              message: '错误',
              description: res.message
            })
          }
          this.spinningConfig = false
          this.pictureList = []
          this.checkedSum = `${this.pictureList.length}/${this.fileList.length}`
        })
      },
      handleQuickJumper(value) {
        this.ipagination.current = value
        this.loadData()
      },
      uploadFileModelOK() {
        this.loadData()
      }
    }
  }
</script>

<style lang="less" scoped>
  /* tile uploaded pictures */
  .images-list-inline {
    width: 200px;
    height: 120px;
    margin-right: 150px;
    box-shadow: rgba(0, 0, 0, 0.7) 0px 0px 10px; //将颜色提到前面，且将h-shadow,v-shadow设为0px,实现四周阴影
  }

  a-col {
    content: "";
    position: absolute;
    width: 100%;
    height: 100px;
    left: 0;
    bottom: -100px;
    z-index: -1;
    background: rgba(0, 0, 0, 0.7);
    filter: blur(10px);
    border-radius: 50%;
    /* 设置投影动画 */
    animation: shadow 3s ease infinite;
  }

  .images-select {
    box-shadow: red 0px 0px 10px; //将颜色提到前面，且将h-shadow,v-shadow设为0px,实现四周阴影
    animation: images-select 3s ease infinite;
  }

  @keyframes images-select {
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

  @keyframes shadow {
    0% {
      transform: scale(1);
      opacity: 1;
      filter: blur(10px);
    }
    /* 投影缩放+虚化 */
    50% {
      transform: scale(0.8);
      opacity: 0.7;
      filter: blur(20px);
    }
    100% {
      transform: scale(1);
      opacity: 1;
      filter: blur(10px);
    }
  }

  .ant-checkbox-body {
    margin-bottom: 20px;
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
</style>