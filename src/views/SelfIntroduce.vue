<template>
  <a-spin :tip='tipName' :spinning='spinningConfig'>
    <div style='background-color: #b4d7ff;'>
      <div class="self">
        <div class="banner">
          <img alt="Vue logo" class='avatar' @click="handleGoBack" :src="img">
        </div>

        <br/>
        <br>
        <!--基本信息-->
        <div>
          <h2>
            <icon-font type="icon-gerenjibenxinxichaxunxiugai"/>
            基本信息
          </h2>
          <a-divider orientation='left'>基本信息</a-divider>
          <a-card
            :class='[{"ant-card-back":!isActive},{"ant-card-back-select":isActive}]'
            @mouseover='handleActive(true,1)'
            @mouseout='handleActive(false,1)'
          >
            <div>
              <a-row :gutter="16">
                <a-col :span="12"
                       v-for='(info,index) in basicInfo' :index="index" :key="index"
                       class='col-margin-bottom'
                >
                  <div style='font-weight: bold'>{{info.key}}&nbsp;:&nbsp;
                    <span v-if="info.key!=='工作天数'">
                {{info.value}}
              </span>
                    <span v-else>
                 <countTo :startVal='startVal' :endVal='info.value' :duration='2000'></countTo>
              </span>
                  </div>
                </a-col>
              </a-row>
            </div>
          </a-card>
        </div>
        <br>
        <!--工作经历-->
        <div>
          <h2>
            <icon-font type="icon-drxx20"/>
            工作经历
          </h2>
          <a-divider orientation='left'>工作经历</a-divider>
          <div>
            <a-card
              :class='[{"ant-card-back":!jobsIsActive},{"ant-card-back-select-job":jobsIsActive}]'
              @mouseover='handleActive(true,2)'
              @mouseout='handleActive(false,2)'
            >
              <template>
                <a-timeline>
                  <a-timeline-item @click='handleJob(1111)'>Create a services site 2015-09-01Create a services site
                    2015-09-01Create a services site 2015-09-01Create a services site 2015-09-01Create a services site
                    2015-09-01Create a services site 2015-09-01Create a services site 2015-09-01Create a services site
                    2015-09-01Create a services site 2015-09-01
                  </a-timeline-item>
                  <a-timeline-item @click='handleJob(2222)'>Solve initial network problems 2015-09-01</a-timeline-item>
                  <a-timeline-item @click='handleJob(3333)'>Technical testing 2015-09-01</a-timeline-item>
                  <a-timeline-item @click='handleJob(4444)'>
                    <a-icon slot="dot" type="clock-circle-o" style="font-size: 16px;"/>
                    Technical testing 2015-09-01
                  </a-timeline-item>
                </a-timeline>
              </template>
            </a-card>
          </div>
        </div>
        <br>
        <!--工作技能-->
        <div>
          <h2>
            <icon-font type="icon-_zhichangjineng"/>
            工作技能
          </h2>
          <a-divider orientation='left'>工作技能</a-divider>
          <a-card
            :class='[{"ant-card-back":!skillIsActive},{"ant-card-back-select-skill":skillIsActive}]'
            @mouseover='handleActive(true,3)'
            @mouseout='handleActive(false,3)'
          >
            <div style="margin-bottom: 30px">
              <span>1</span>
              <a-progress :percent="50" status="active"/>
            </div>
            <div style="margin-bottom: 30px">
              <span>2</span>
              <a-progress :percent="100"/>
            </div>
            <div style="margin-bottom: 30px">
              <span>3</span>
              <a-progress :percent="99" status="active"/>
            </div>
          </a-card>
        </div>
        <br>
        <!--项目经历-->
        <div>
          <h2>
            <icon-font type="icon-drxx39"/>
            项目经历
          </h2>
          <a-divider orientation='left'>项目经历</a-divider>
          <a-card
            :class='[{"ant-card-back":!projectIsActive},{"ant-card-back-select-project":projectIsActive}]'
            @mouseover='handleActive(true,4)'
            @mouseout='handleActive(false,4)'
          >
            <div>
              <a-collapse accordion>
                <a-collapse-panel header="MOC" key="1">
                  <p>{{text}}</p>
                </a-collapse-panel>
                <a-collapse-panel header="MIAO" key="2" :disabled='false'>
                  <p>{{text}}</p>
                </a-collapse-panel>
                <a-collapse-panel header="ORDER" key="3">
                  <p>{{text}}</p>
                </a-collapse-panel>
              </a-collapse>
            </div>
          </a-card>
        </div>
      </div>
    </div>
  </a-spin>
</template>

<script>
  import { IconFont } from '@/components/IconFont/iconFont'
  import CountTo from 'vue-count-to'

  window.addEventListener('popstate', function(e) {
    console.log(e)
  }, false)
  export default {
    components: { IconFont, CountTo },
    name: 'SelfIntroduce',
    data() {
      return {
        spinningConfig: false,
        tipName: '玩命加载中...',
        isActive: false,
        jobsIsActive: false,
        skillIsActive: false,
        projectIsActive: false,
        basicInfo: [
          { id: '1', key: '姓名', value: 'A' },
          { id: '2', key: '年龄', value: '99' },
          { id: '3', key: '电话', value: '135xxxxx' },
          { id: '4', key: '邮箱', value: '891554093@qq.com' },
          { id: '5', key: '工作天数', value: 1000 },
          { id: '6', key: '入职时间', value: 2019 - 1 - 1 }
        ],
        img: 'http://47.105.177.77:9999/group1/M00/00/02/rB8LbV0xKaOALxpZAABGRbVQH6Y388.jpg',
        startVal: 0,
        text: `A dog is a type of domesticated animal.Known for its loyalty and faithfulness,it can be found as a welcome guest in many households across the world.`
      }
    },
    watch: {
      $route: {
        handler: function(val, oldVal) {
          console.log(val)
        },
        // 深度观察监听
        deep: true
      }
    },
    created() {
      this.loadData()
    },

    methods: {
      handleActive(value, key) {
        if (key === 1) {
          this.isActive = value
        } else if (key === 2) {
          this.jobsIsActive = value
        } else if (key === 3) {
          this.skillIsActive = value
        } else if (key === 4) {
          this.projectIsActive = value
        }
      },
      handleJob(value) {
        console.log(value)
      },
      handleGoBack() {
        this.$router.push('/blob/article-list')
      },
      loadData() {
        console.log(window.history)
        this.spinningConfig = true
        setTimeout(() => this.spinningConfig = false, 2000)
      }

    }
  }
  //https://www.cnblogs.com/tuspring/p/9801603.html
</script>

<style scoped>
  .col-margin-bottom {
    margin-bottom: 30px;
  }

  .ant-card-back-select {
    box-shadow: greenyellow 0px 0px 10px;
  }

  .ant-card-back-select-job {
    box-shadow: dodgerblue 0px 0px 10px;
  }

  .ant-card-back-select-skill {
    box-shadow: dodgerblue 0px 0px 10px;
  }

  .ant-card-back-select-project {
    box-shadow: #f44336 0px 0px 10px;
  }

  @keyframes ant-card-back-select {
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

  .self {
    width: 900px;
    margin: 0 auto;
    padding: 25px 0;
  }

  .self > .banner {
    text-align: center;
    padding: 25px 0;
    margin: 25px 0;
  }

  .avatar {
    margin: 0 auto;
    width: 104px;
    height: 104px;
    margin-bottom: 20px;
    border-radius: 50%;
    overflow: hidden;
  }

  img {
    height: 100%;
    width: 100%;
  }

  .ant-card-back {
    box-shadow: #cccccc 0 0 10px;
  }

</style>