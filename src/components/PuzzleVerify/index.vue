<template>
  <div class="verify">
    <div class="cover_bg"></div>
    <div class="verify_frame">
      <div class="verify_title">
        请完成下方验证
        <div class="close" @click="hideVerify">
          <img alt="icon_close" :src="img" />
        </div>
      </div>
      <SlideCode
        ref="slideblock"
        @again="onAgain"
        @fail="onFail"
        @fulfilled="onFulfilled"
        @refresh="onRefresh"
        @success="onSuccess"
      />
    </div>
  </div>
</template>

<script>
  import img0 from './assets/img.jpg'
  import img1 from './assets/img1.jpg'
  import img2 from './assets/img2.jpg'
  import img3 from './assets/img3.jpg'
  import img4 from './assets/img4.jpg'
  import img5 from './assets/img5.jpg'
  import closeUrl from '../../assets/img/icon_close.png'
  import SlideCode from './slideCode'
  export default {
    name: 'PuzzleVerify',
    components: { SlideCode },
    props: {},
    data() {
      return {
        img: closeUrl,
        text: '向右滑动滑块完成拼图',
        imgs: [img0, img1, img2, img3, img4, img5],
        accuracy: 10, // 精确度小，可允许的误差范围小；为1时，则表示滑块要与凹槽完全重叠，才能验证成功。默认值为5
      }
    },
    computed: {},
    mounted() {},
    methods: {
      onSuccess(params) {
        console.log('验证通过', params)
        this.$emit('onSuccess', params)
      },
      onFail() {
        console.log('验证不通过')
      },
      onRefresh() {
        console.log('点击了刷新小图标')
      },
      onFulfilled() {
        console.log('刷新成功啦！')
      },
      onAgain() {
        console.log('检测到非人为操作的哦！')
        // 刷新
        this.handleClick()
      },
      handleClick() {
        this.$refs.slideblock.reset()
      },
      hideVerify() {
        this.$emit('hideVerify')
      },
    },
  }
</script>
<style lang="less" scoped>
  .verify {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 99999;
    .cover_bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 99;
      background: rgba(0, 0, 0, 0.3);
      backdrop-filter: blur(1px);
    }
  }
  .verify_frame {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    height: 300px;
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
    z-index: 9999;
    padding: 0 20px;
    .verify_title {
      height: 50px;
      line-height: 50px;
      position: relative;
      font-size: 16px;
      color: #333333;
      .close {
        position: absolute;
        right: 0;
        top: 16px;
        cursor: pointer;
        img {
          display: block;
        }
      }
    }
  }
</style>
