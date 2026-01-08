<template>
  <div class="no_content" :style="{ height: height + 'px' }">
    <img alt="" src="../assets/public/none.png" />
  </div>
</template>

<script>
  export default {
    name: 'NoContent',
    components: {},
    props: {
      height: {
        type: Number,
        default: 270,
      },
    },
    data() {
      return {}
    },
    computed: {},
    watch: {},
    created() {},
    mounted() {},
    methods: {},
  }
</script>
<style lang="scss" scoped>
  .no_content {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 208px;
      height: 185px;
    }
  }
</style>
