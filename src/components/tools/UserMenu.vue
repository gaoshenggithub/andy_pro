<template>
  <div class="user-wrapper">
    <div class="content-box">
      <span class="action" @click="screenfull">
        <icon-font type="icon-expand" v-show="!isFullscreen"/>
        <icon-font type="icon-tuichuquanping" v-show="isFullscreen"/>
      </span>
      <a href="javascript:;" target="_blank">
        <span class="action">
          <a-icon type="question-circle-o"></a-icon>
        </span>
      </a>
      <notice-icon class="action"/>
      <a-dropdown>
        <span class="action ant-dropdown-link user-dropdown-menu">
          <a-avatar class="avatar" size="small" :src="getImages(avatar())"/>
          <span>{{ nickname() }}</span>
        </span>
        <a-menu slot="overlay" class="user-dropdown-menu-wrapper">
         <!-- <a-menu-item key="0">
            <router-link :to="{ name: 'center' }">
              <a-icon type="user"/>
              <span>个人中心</span>
            </router-link>
          </a-menu-item>
          <a-menu-item key="1">
            <router-link :to="{ name: 'settings' }">
              <a-icon type="setting"/>
              <span>账户设置</span>
            </router-link>
          </a-menu-item>-->
          <a-menu-divider/>
          <a-menu-item key="3">
            <a href="javascript:;" @click="handleLogout">
              <a-icon type="logout"/>
              <span>退出登录</span>
            </a>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
  </div>
</template>

<script>
  import NoticeIcon from '@/components/NoticeIcon'
  import { mapActions, mapGetters } from 'vuex'
  import { api } from '@/api/manage'
  import screenfull from 'screenfull'
  import { IconFont } from '../IconFont/iconFont'

  export default {
    name: 'UserMenu',
    components: {
      NoticeIcon, IconFont
    },
    data() {
      return {
        img: api.imgUrl,
        isFullscreen: false,
        isOpen: false
      }
    },
    mounted() {
      window.onresize = () => {
        // 全屏下监控是否按键了ESC
        if (this.checkFull()) {
          this.isFullscreen = this.isFullscreen === false
        }
      }
    },
    methods: {
      ...mapActions(['Logout']),
      ...mapGetters(['nickname', 'avatar']),
      screenfull() {
        if (!screenfull.enabled) {
          this.$message({
            message: 'Your browser does not work',
            type: 'warning'
          })
          return false
        }
        console.log('-----')
        this.isFullscreen = this.isFullscreen === false
        screenfull.toggle()
      },
      /**
       * 是否全屏并按键ESC键的方法
       */
      checkFull() {
        let isFull = document.fullscreenEnabled
        if (isFull === true) {
          return isFull
        }
        return !isFull
      },
      handleLogout() {
        const that = this

        this.$confirm({
          title: '提示',
          content: '真的要注销登录吗 ?',
          onOk() {
            return that.Logout({}).then(response => {
              if (response.code === '200') {
                window.location.reload()
              } else {

              }
            })/*.catch(err => {
              that.$message.error({
                title: '错误',
                description: err.message
              })
            })*/
          },
          onCancel() {
          }
        })
      },
      getImages(images) {
        return this.img + images
      }
    }
  }
</script>
