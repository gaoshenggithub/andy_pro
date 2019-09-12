<template>
  <div class='info'>
       <span class="actions">
           <Icon type='eye'/>
           <Icon type='delete'/>
         </span>
  </div>
</template>

<script>
  export default {
    name: 'Mongolia',
  }
</script>

<style lang="less" scoped>
  .info {
    box-sizing: content-box;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0px;
    right: 0px;
    overflow: hidden;

    &:before {
      content: ' ';
      position: absolute;
      z-index: 1;
      background-color: fade(#000, 50%);
      transition: all 0.3s;
      width: 100%;
      height: 100%;
      opacity: 0;
    }
  }

  .actions {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;
    white-space: nowrap;
    opacity: 0;
    transition: all 0.3s;

    i {
      z-index: 10;
      transition: all 0.3s;
      cursor: pointer;
      font-size: 16px;
      width: 16px;
      color: rgba(255, 255, 255, 0.7);
      margin: 0 4px;

      &:hover {
        color: rgba(255, 255, 255, 1);
      }
    }
  }

  .info:hover {
    &:before {
      opacity: 1;
    }

    .actions {
      opacity: 1;
    }
  }

  .info:hover + .actions,
  .actions:hover {
    opacity: 1;
  }
</style>