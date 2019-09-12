<template>
  <div>
    <a-card>
      <div class='table-operator'>
        <a-button type='primary' @click='handleChangeMode(mode==="left"?"top":"left")'
                  style="box-shadow: #2eabff 0 0 10px">
          {{mode==='left'?'水平':'垂直'}}
        </a-button>
        <a-button type='primary' style="box-shadow: #2eabff 0 0 10px" @click="handleRefresh()">刷新</a-button>
        <a-divider type='vertical'/>
        状态:
        <a-tag color='green'>
          <span style='padding: 10px 10px 10px 10px'>
            {{mode==='left'?'垂直':'水平'}}
          </span>
        </a-tag>
      </div>
      <a-divider></a-divider>
      <a-tabs defaultActiveKey='1' :tabPosition='mode' @change='handleLoad'>
        <a-tab-pane tab='照片' key='1'>
          <PictureList ref='pictureList'></PictureList>
        </a-tab-pane>
        <a-tab-pane tab='视频' key="2">
          <VideoList ref="videoList"></VideoList>
        </a-tab-pane>
        <a-tab-pane tab='音频' key="3">
          <AudioFrequencyList ref="audioFrequencyList"></AudioFrequencyList>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script>
  import PictureList from './PictureList'
  import VideoList from './VideoList'
  import AudioFrequencyList from './AudioFrequencyList'

  export default {
    components: { PictureList, VideoList, AudioFrequencyList },
    name: 'IndexList',
    data() {
      return {
        mode: 'left',
        tab: '1',
        picValue: 1,
        vidValue: 1,
        audValue: 1
      }
    },
    created() {

    },
    methods: {
      handleChangeMode(value) {
        this.mode = value
      },
      handleLoad(value) {
        this.tab = value
        if (value === 1) {
          //this.$refs.pictureList.loadData()
        } else if (value === 2) {
          //this.$refs.videoList.loadData()
        } else if (value === 3) {
          //this.$refs.audioFrequencyList.loadData()
        }
      },
      handleRefresh() {
        const value = this.tab
        if (value === '1') {
          this.$refs.pictureList.loadData()
        } else if (value === '2') {
          this.$refs.videoList.loadData()
        } else if (value === '3') {
          this.$refs.audioFrequencyList.loadData()
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  /* tile uploaded pictures */
  .images-list-inline {
    width: 200px;
    height: 200px;
  }

  .ant-checkbox-body {
    margin-bottom: 20px;
  }

  /** Button按钮间距 */
  .ant-btn {
    margin-left: 10px
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