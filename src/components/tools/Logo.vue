<template>
  <div class="logo">
    <router-link :to="{name:'dashboard'}">
      <!--<LogoSvg alt="logo" />-->
      <img src="@/assets/uugai.com_1563789399204.png" alt="logo">
      <h1 v-if="showTitle">{{ title }}</h1>
    </router-link>
  </div>
</template>

<script>
  import LogoSvg from '@/assets/logo.svg?inline'

  export default {
    name: 'Logo',
    components: {
      LogoSvg
    },
    props: {
      title: {
        type: String,
        default: 'Andy Pro',
        required: false
      },
      showTitle: {
        type: Boolean,
        default: true,
        required: false
      }
    }
  }
</script>
