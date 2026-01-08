<template>
  <div v-show="messageShowModel" class="messageBox">
    <div
      class="message_box"
      :style="{ width: `${width}px`, minHeight: `${height}px` }"
    >
      <div class="title">
        <h3>{{ title }}</h3>
        <i class="el-icon-close close" @click="closeShowModel"></i>
      </div>
      <div :style="{ height: `${height}px`, overflow: 'auto' }">
        <slot name="form"></slot>
      </div>
      <div v-if="bottomShow" class="bottom" :style="{ width: `${width}px` }">
        <slot name="button"></slot>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      width: {
        type: Number,
        default: 600,
      },
      height: {
        type: Number,
        default: 400,
      },
      messageShowModel: {
        type: Boolean,
        default: false,
      },
      title: {
        type: String,
        default: '新增',
      },
      bottomShow: {
        type: Boolean,
        default: true,
      },
    },
    data() {
      return {
        showModal: false,
      }
    },

    mounted() {
      this.showModal = this.messageShowModel
    },
    methods: {
      closeShowModel(e) {
        this.$emit('click', e)
      },
    },
  }
</script>

<style lang="scss" scoped>
  .messageBox {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    position: fixed;
    z-index: 1999;
    top: 0px;
    left: 0px;
    .message_box {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #fff;
      padding-bottom: 56px;
      .title {
        padding-left: 20px;
        height: 48px;
        padding-right: 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #f5f7f8;
        // position: absolute;
        // top: 0px;
        // left: 0px;
        h3 {
          font-size: 18px;
          font-family: 'Microsoft YaHei';
          font-weight: 400;
          color: #191f25;
          line-height: 48px;
          margin-bottom: 0px;
        }
        .close {
          color: #676b74;
          font-size: 20px;
          cursor: pointer;
        }
      }
      .bottom {
        width: 100%;
        height: 56px;
        border-top: 1px solid #e6e6e6;
        position: absolute;
        left: 0px;
        bottom: 0px;
      }
    }
  }
</style>
