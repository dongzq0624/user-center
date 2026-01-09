<template>
  <div v-loading="loading" class="slideCode">
    <div>
      <div class="slide_pic">
        <img class="slide_bg" :src="slidePic" />
        <div class="slide-verify-refresh-icon" @click="refresh"></div>
        <div
          ref="block"
          class="block"
          :style="{ top: block_y + 'px', left: positionX + 'px' }"
        >
          <img alt="blockPic" :src="blockPic" />
        </div>
      </div>
      <div
        class="slide-verify-slider"
        :class="{
          'container-active': containerActive,
          'container-success': containerSuccess,
          'container-fail': containerFail,
        }"
      >
        <div
          class="slide-verify-slider-mask"
          :style="{ width: sliderMaskWidth }"
        >
          <!-- slider -->
          <div
            class="slide-verify-slider-mask-item"
            :style="{ left: sliderLeft }"
            @mousedown="sliderDown"
            @touchend="touchEndEvent"
            @touchmove="touchMoveEvent"
            @touchstart="touchStartEvent"
          >
            <div class="slide-verify-slider-mask-item-icon"></div>
          </div>
        </div>
        <span class="slide-verify-slider-text">{{ sliderText }}</span>
      </div>
    </div>
  </div>
</template>
<script>
  import { getSlideInfo, checkSlideCode } from '@/api/common/httpRequestAPI'

  function sum(x, y) {
    return x + y
  }

  function square(x) {
    return x * x
  }
  export default {
    name: 'SlideCode',
    props: {
      l: {
        type: Number,
        default: 42,
      },
      // block radius
      r: {
        type: Number,
        default: 10,
      },
      // canvas width
      w: {
        type: Number,
        default: 360,
      },
      // canvas height
      h: {
        type: Number,
        default: 168,
      },
      sliderText: {
        type: String,
        default: '向右滑动滑块完成拼图',
      },
      accuracy: {
        type: Number,
        default: 5, // 若为 -1 则不进行机器判断
      },
    },
    data() {
      return {
        slidePic: '',
        blockPic: '',
        imageToken: '',
        containerActive: false, // container active class
        containerSuccess: false, // container success class
        containerFail: false, // container fail class
        canvasCtx: null,
        blockCtx: null,
        block: null,
        block_x: undefined, // container random position
        block_y: undefined,
        positionX: 0,
        L: this.l + this.r * 2 + 3, // block real lenght
        img: undefined,
        originX: undefined,
        originY: undefined,
        isMouseDown: false,
        trail: [],
        sliderLeft: 0, // block right offset
        sliderMaskWidth: 0, // mask width
        loading: false,
      }
    },
    methods: {
      reset() {
        this.block = this.$refs.block
        this.containerActive = false
        this.containerSuccess = false
        this.containerFail = false
        this.sliderLeft = 0
        this.block.style.left = 0
        this.sliderMaskWidth = 0
        this.$emit('fulfilled')
        this.positionX = 0
        this.init()
      },
      init() {
        this.AjaxGetSlideInfo()
        this.bindEvents()
      },
      refresh() {
        this.reset()
        this.$emit('refresh')
      },
      AjaxGetSlideInfo() {
        this.loading = true
        getSlideInfo({})
          .then((res) => {
            this.loading = false
            this.slidePic = 'data:image/png;base64,' + res.result.backImage
            this.blockPic = 'data:image/png;base64,' + res.result.slideImage
            this.block_y = res.result.y
            this.imageToken = res.result.imageToken
          })
          .catch(() => {
            this.loading = false
          })
      },
      sliderDown(event) {
        this.originX = event.clientX
        this.originY = event.clientY
        this.isMouseDown = true
      },
      touchStartEvent(e) {
        this.originX = e.changedTouches[0].pageX
        this.originY = e.changedTouches[0].pageY
        this.isMouseDown = true
      },
      bindEvents() {
        document.addEventListener('mousemove', (e) => {
          if (!this.isMouseDown) return false
          const moveX = e.clientX - this.originX
          const moveY = e.clientY - this.originY
          if (moveX < 0 || moveX + 44 >= this.w) return false
          this.sliderLeft = moveX + 'px'
          let blockLeft = ((this.w - 40) / (this.w - 40)) * moveX
          this.positionX = blockLeft
          this.containerActive = true // add active
          this.sliderMaskWidth = moveX + 'px'
          this.trail.push(moveY)
        })
        document.addEventListener('mouseup', (e) => {
          if (!this.isMouseDown) return false
          this.isMouseDown = false
          if (e.clientX === this.originX) return false
          this.containerActive = false // remove active

          this.verify()
        })
      },
      touchMoveEvent(e) {
        if (!this.isMouseDown) return false
        const moveX = e.changedTouches[0].pageX - this.originX
        const moveY = e.changedTouches[0].pageY - this.originY
        if (moveX < 0 || moveX + 38 >= this.w) return false
        this.sliderLeft = moveX + 'px'
        let blockLeft = ((this.w - 40) / (this.w - 40)) * moveX
        this.positionX = blockLeft

        this.containerActive = true
        this.sliderMaskWidth = moveX + 'px'
        this.trail.push(moveY)
      },
      touchEndEvent(e) {
        if (!this.isMouseDown) return false
        this.isMouseDown = false
        if (e.changedTouches[0].pageX === this.originX) return false
        this.containerActive = false

        const { spliced, TuringTest } = this.verify()
        if (spliced) {
          if (this.accuracy === -1) {
            this.containerSuccess = true
            this.$emit('success')
            return
          }
          if (TuringTest) {
            // succ
            this.containerSuccess = true
            this.$emit('success')
          } else {
            this.containerFail = true
            this.$emit('again')
          }
        } else {
          this.containerFail = true
          this.$emit('fail')
          setTimeout(() => {
            this.reset()
          }, 1000)
        }
      },
      verify() {
        const arr = this.trail // drag y move distance
        const average = arr.reduce(sum) / arr.length // average
        const deviations = arr.map((x) => x - average) // deviation array
        const stddev = Math.sqrt(
          deviations.map(square).reduce(sum) / arr.length
        ) // standard deviation
        const left = parseInt(this.positionX)
        const params = {
          imageToken: this.imageToken,
          x: left,
          y: this.block_y,
        }
        checkSlideCode(params).then((res) => {
          let spliced = res.result.result,
            TuringTest = average !== stddev // equal => not person operate
          if (spliced) {
            if (this.accuracy === -1) {
              this.containerSuccess = true
              this.$emit('success', params)
              return
            }
            if (TuringTest) {
              // succ
              this.containerSuccess = true
              this.$emit('success', params)
            } else {
              this.containerFail = true
              this.$emit('again')
            }
          } else {
            this.containerFail = true
            this.$emit('fail')
            setTimeout(() => {
              this.reset()
            }, 1000)
          }
        })
      },
    },
  }
</script>

<style lang="less">
  .slideCode {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    height: calc(100% - 75px);
    img {
      display: block;
    }
    .slide_bg {
      position: absolute;
      top: 0;
      left: 0;
    }
    .slide_pic {
      width: 360px;
      height: 168px;
    }
    .block {
      position: absolute;
    }
    .slide-verify-refresh-icon {
      position: absolute;
      right: 0;
      top: 0;
      width: 34px;
      height: 34px;
      cursor: pointer;
      background: url('./assets/icon_light.png') 0 -437px;
      background-size: 34px 471px;
    }
    .demo-spin-icon-load {
      animation: ani-demo-spin 1s linear infinite;
    }
    .slide-verify-slider {
      position: relative;
      text-align: center;
      width: 360px;
      height: 48px;
      line-height: 46px;
      margin-top: 10px;
      background: #f7f9fa;
      color: #45494c;
      border: 1px solid #e4e7eb;
    }

    .slide-verify-slider-mask {
      position: absolute;
      left: 0;
      top: 0;
      height: 48px;
      border: 0 solid #1991fa;
      background: #d1e9fe;
    }

    .slide-verify-slider-mask-item {
      position: absolute;
      top: 0;
      left: 0;
      width: 44px;
      height: 46px;
      background: #fff;
      box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
      cursor: pointer;
      transition: background 0.2s linear;
    }

    .slide-verify-slider-mask-item:hover {
      background: #1991fa;
    }

    .slide-verify-slider-mask-item:hover .slide-verify-slider-mask-item-icon {
      background-position: 0 -13px;
    }

    .slide-verify-slider-mask-item-icon {
      position: absolute;
      top: 18px;
      left: 14px;
      width: 14px;
      height: 12px;
      background: url('./assets/icon_light.png') 0 -26px;
      background-size: 34px 471px;
    }
    .container-active .slide-verify-slider-mask-item {
      height: 46px;
      top: -1px;
      border: 1px solid #1991fa;
    }

    .container-active .slide-verify-slider-mask {
      height: 46px;
      border-width: 1px;
    }

    .container-success .slide-verify-slider-mask-item {
      height: 46px;
      top: -1px;
      border: 1px solid #52ccba;
      background-color: #52ccba !important;
    }

    .container-success .slide-verify-slider-mask {
      height: 46px;
      border: 1px solid #52ccba;
      background-color: #d2f4ef;
    }

    .container-success .slide-verify-slider-mask-item-icon {
      background-position: 0 0 !important;
    }

    .container-fail .slide-verify-slider-mask-item {
      height: 46px;
      top: -1px;
      border: 1px solid #f57a7a;
      background-color: #f57a7a !important;
    }

    .container-fail .slide-verify-slider-mask {
      height: 46px;
      border: 1px solid #f57a7a;
      background-color: #fce1e1;
    }

    .container-fail .slide-verify-slider-mask-item-icon {
      top: 14px;
      background-position: 0 -82px !important;
    }

    .container-active .slide-verify-slider-text,
    .container-success .slide-verify-slider-text,
    .container-fail .slide-verify-slider-text {
      display: none;
    }
    @keyframes ani-demo-spin {
      from {
        transform: rotate(0deg);
      }
      50% {
        transform: rotate(180deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  }
</style>
