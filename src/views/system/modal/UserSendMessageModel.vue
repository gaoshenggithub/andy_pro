<template>
  <div>
    <a-modal
      :visible="visible"
      @ok="handleOk"
      @cancel="handleCancel"
      :maskClosable="false"
      :closable="false">
      <a-input size="large" placeholder="请输入消息" v-model="message"/>
    </a-modal>
  </div>
</template>

<script>
  import { USER_NAME, USER_ID } from '@/store/mutation-types'
  import Vue from 'vue'

  export default {
    name: 'UserSendMessageModel',
    data() {
      return {
        visible: false,
        message: '',
        _id: '',
        websock: null
      }
    },
    create() {

    },
    destroyed: function() {
      this.websocketclose()
    },
    methods: {
      show(id) {
        this.visible = true
        this._id = id
        this.initWebSocket()
      },
      handleOk() {
        this.websocketSend()
      },

      handleCancel() {
        this.visible = false
        this.message = ''
      },
      initWebSocket: function() {
        this.websock = new WebSocket(`ws://localhost:9988/andy_pro/websocket/${Vue.ls.get(USER_ID)}`)
        this.websock.onopen = this.websocketonopen
        this.websock.onerror = this.websocketonerror
        this.websock.onmessage = this.websocketonmessage
        this.websock.onclose = this.websocketclose
      },
      websocketonopen: function() {
        console.log('WebSocket连接成功')
      },
      websocketonerror: function() {
        console.log('WebSocket连接发生错误')
      },
      websocketSend: function() {
        this.websock.send('{"toUserId":"' + this._id + '","toMessage":"' + this.message + '","toUserName":"' + Vue.ls.get(USER_NAME) + '"}')
      },
      websocketonmessage: function(event) {
        const data = JSON.parse(event.data)
        if (data.code === '2000') {
          this.$notification.open({
            message: `来自  ${data.data.username}  用户的消息通知!`,
            description: data.data.message
          })
        } else if (data.code === '-2000') {
          this.$message.error('用户不在线')
        }

      },
      websocketclose: function() {
        this.websock.close()
      }
    }
  }
</script>

<style scoped>

</style>