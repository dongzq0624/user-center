<template>
  <div id="app">
    <router-view />
    <!-- SVG sprite container -->
    <div id="svg-sprite" style="display: none;"></div>
  </div>
</template>

<script>
  export default {
    name: 'App',
    created() {},
    methods: {},
  }
</script>
<style>
  /* 重置列表元素 */
  ul,
  ol {
    list-style: none;
  }
  .el-carousel__container {
    position: inherit !important;
    height: 100% !important;
  }
  /* chrome */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  input[type='number'] {
    -moz-appearance: textfield;
  }
</style>
