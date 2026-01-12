<template>
    <svg
      class="svg-icon"
      :style="{
        fontSize: size + 'px',
        width: width + 'px',
        height: height + 'px',
        color: color,
      }"
    >
      <use :xlink:href="iconName" />
    </svg>
  </template>
  
  <script>
    export default {
      name: 'SvgIcon',
      props: {
        icon: {
          //svg图标名称
          type: String,
          required: true,
        },
        color: {
          type: String,
          default: 'rgba(0,0,0,0.65)',
        },
        size: {
          //svg尺寸
          type: [Number, String],
        },
        width: {
          //svg宽度
          type: [Number, String],
        },
        height: {
          //svg高度
          type: [Number, String],
        },
      },
  
      data() {
        return {}
      },
      computed: {
        iconName() {
          return `#icon-${this.icon}`
        },
      },
    }
  </script>
  
  <style lang="scss" scoped>
    .svg-icon {
      width: 16px;
      height: 16px;
      fill: currentColor;
      overflow: hidden;
    }
  </style>
  