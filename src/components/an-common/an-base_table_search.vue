<template>
  <div>
    <el-form :inline="true" :model="searchInfo" @submit.prevent>
      <template v-for="(option, index) in options">
        <el-form-item
          :key="'search' + index"
          :label="!hideLabel ? option.label : ''"
        >
          <template v-if="option.type == 'slot' && !isHide(option)">
            <slot :data="searchInfo" :name="option.key"></slot>
          </template>

          <el-select
            v-else-if="option.type == 'select'"
            v-model="searchInfo[option.key]"
            clearable
            :multiple="option.multiple"
            :placeholder="
              option.placeholder ? option.placeholder : '请选择' + option.label
            "
            style="width: 100%"
          >
            <el-option
              v-for="(item, index) in option.optionList
                ? option.optionList
                : []"
              :key="'option' + index"
              :label="item[option.valueName ? option.valueName : 'value']"
              :value="item[option.keyName ? option.keyName : 'key']"
            />
          </el-select>

          <el-date-picker
            v-else-if="option.type == 'daterange'"
            v-model="searchInfo[option.key + option.key2]"
            end-placeholder="结束日期"
            range-separator="至"
            start-placeholder="开始日期"
            type="daterange"
            value-format="yyyy-MM-dd"
            @change="
              (value) => {
                dataOnChange(value, option)
              }
            "
          />

          <el-input
            v-else-if="!isHide(option)"
            v-model.trim="searchInfo[option.key]"
            clearable
            :placeholder="`请输入${option.label}`"
          />
        </el-form-item>
      </template>

      <el-form-item v-if="options.length > 0">
        <el-button icon="el-icon-search" type="primary" @click="search">
          查询
        </el-button>
        <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
        <slot name="buttons"></slot>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: 'XcBaseTableSearch',
    props: [
      'options', // 数据
      'onSearch', // 搜索回调
      'hideLabel',
    ],
    data() {
      return {
        searchInfo: {},
      }
    },
    computed: {},
    methods: {
      isHide(option) {
        return option.hideRule ? option.hideRule(this.searchInfo) : false
      },
      search() {
        this.$emit('onSearch', this.searchInfo)
      },
      reset() {
        this.searchInfo = {}
        this.$emit('onSearch', this.searchInfo)
      },
      dataOnChange(value, option) {
        if (option.type === 'daterange') {
          if (value) {
            this.$set(this.searchInfo, option.key, value[0])
            this.$set(this.searchInfo, option.key2, value[1])
          } else {
            this.$set(this.searchInfo, option.key, '')
            this.$set(this.searchInfo, option.key2, '')
          }
        }
      },
      //更新配置数据
      refreshOptions(formOptions, key, propName, value) {
        let option = formOptions.find((e) => e.key == key)
        if (option) {
          this.$set(option, propName, value)
        }
      },
    },
  }
</script>

<style lang="less" scoped></style>
