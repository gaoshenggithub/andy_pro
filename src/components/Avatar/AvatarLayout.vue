<template>
  <a-modal :visible="previewVisible"  style="top: 20px;" :footer="null" @cancel="handleCancel">
    <template slot="title">
      <div style="width: 100%;">
        <span>{{ title }}</span>
        <span
          style="display:inline-block;width:calc(100% - 56px);padding-top: 2px;padding-right:10px;text-align: right">
          <a-button
            style="height:18px;width:18px;padding: 0;border-width: 2px">&nbsp;&nbsp;
          </a-button>
        </span>
      </div>
    </template>
    <img alt="example" style="width: 100%" :src="previewImage"/>
  </a-modal>
</template>

<script>
  import { getServerImage } from '../../utils/util'
  /*头像放大公共组件*/
  export default {
    name: 'AvatarLayout',
    data() {
      return {
        previewVisible: false,
        previewImage: '',
        title: 'LOGO'
      }
    },
    methods: {
      handleCancel() {
        this.previewVisible = false
      },
      show(value) {
        this.previewVisible = true
        this.previewImage = getServerImage(value)
      }
    }
  }
</script>

<style scoped>

</style>