<template>
  <el-select
    :disabled="fixValue"
    style="width: 100%"
    :value="value"
    @change="valueOnChange"
  >
    <el-option
      v-for="item in list"
      :key="item.code"
      :label="item.name"
      :value="item.code"
    />
  </el-select>
</template>
<script>
  import { dictListByCode } from '@/api/components'
  export default {
    name: 'DictSelect',
    props: {
      value: {
        type: String,
      },
      code: {
        type: String,
      },
      fixValue: {
        type: Boolean,
        default: false,
      },
      fixedIndex: {
        type: Number,
      },
    },
    data() {
      return {
        list: [],
      }
    },
    mounted() {
      this.getListByCode()
    },
    methods: {
      getListByCode() {
        dictListByCode({
          code: this.code,
        }).then((res) => {
          this.list = res.result.dictList
          if (this.fixValue && res.result.dictList.length > 0) {
            this.valueOnChange(this.list[0].code)
          }
        })
      },
      valueOnChange(val) {
        console.log(val)
        this.$emit('input', val)
      },
    },
  }
</script>
