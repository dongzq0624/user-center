<template>
  <el-dialog
    :close-on-click-modal="false"
    :title="modalTitle"
    :visible="isShowModal"
    :width="width ? width : '700px'"
    @close="close"
  >
    <el-form
      ref="formRef"
      label-position="top"
      :label-width="labelWidth ? labelWidth : '80px'"
      :model="dataInfo"
      :rules="rules"
    >
      <el-row :style="`height:${height ? height : null}`">
        <template v-for="(option, optionIndex) in options">
          <el-col
            v-if="!isHide(option)"
            :key="optionIndex"
            :span="option.span ? option.span : 24"
          >
            <slot
              v-if="option.type == 'itemSlot'"
              :data="dataInfo"
              :name="option.key"
            />

            <el-form-item v-else :label="option.label" :prop="option.key">
              <slot
                v-if="option.type == 'slot'"
                :data="dataInfo"
                :name="option.key"
              />

              <el-slider
                v-else-if="option.type == 'slider'"
                v-model="dataInfo[option.key]"
                :disabled="option.disabled"
                show-input
              />

              <template v-else-if="option.type == 'switch'">
                {{ option.switchText }}
                <el-switch
                  v-model="dataInfo[option.key]"
                  :active-value="option.activeValue"
                  :disabled="option.disabled"
                  :inactive-value="option.inactiveValue"
                />
              </template>

              <el-select
                v-else-if="option.type == 'select'"
                v-model="dataInfo[option.key]"
                :disabled="option.disabled"
                :multiple="option.multiple"
                :placeholder="
                  option.placeholder
                    ? option.placeholder
                    : `请选择${option.label}`
                "
                style="width: 100%"
                @change="
                  (value) => {
                    dataOnChange(value, option)
                  }
                "
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

              <el-radio-group
                v-else-if="option.type == 'radio'"
                v-model="dataInfo[option.key]"
                :disabled="option.disabled"
                @change="
                  (value) => {
                    dataOnChange(value, option)
                  }
                "
              >
                <el-radio
                  v-for="(item, index) in option.optionList"
                  :key="'radio' + index"
                  v-model="dataInfo[option.key]"
                  :label="item[option.keyName ? option.keyName : 'key']"
                >
                  {{ item[option.valueName ? option.valueName : 'value'] }}
                </el-radio>
              </el-radio-group>

              <el-date-picker
                v-else-if="option.type == 'daterange'"
                v-model="dataInfo[option.key + option.key2]"
                :disabled="option.disabled"
                end-placeholder="结束日期"
                range-separator="至"
                start-placeholder="开始日期"
                style="width: 100%"
                type="daterange"
                value-format="yyyy-MM-dd"
                @change="
                  (value) => {
                    dataOnChange(value, option)
                  }
                "
              />

              <el-date-picker
                v-else-if="option.type == 'date'"
                v-model="dataInfo[option.key]"
                :disabled="option.disabled"
                :placeholder="`请选择${option.label}`"
                style="width: 100%"
                :type="option.dateType"
                :value-format="option.valueFormat"
              />

              <el-input
                v-else-if="option.type == 'number'"
                v-model.number="dataInfo[option.key]"
                :disabled="option.disabled"
                :maxlength="option.maxlength ? option.maxlength : 20"
                :placeholder="`请输入${option.label}`"
              />

              <el-input
                v-else-if="option.type == 'textarea'"
                v-model="dataInfo[option.key]"
                :disabled="option.disabled"
                :maxlength="option.maxlength ? option.maxlength : 500"
                :placeholder="`请输入${option.label}`"
                :rows="option.rows ? option.rows : 2"
                type="textarea"
              />

              <el-input
                v-else
                v-model="dataInfo[option.key]"
                :disabled="option.disabled"
                :maxlength="option.maxlength ? option.maxlength : 50"
                :placeholder="
                  option.placeholder
                    ? option.placeholder
                    : `请输入${option.label}`
                "
              />
            </el-form-item>
          </el-col>
        </template>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="close">取 消</el-button>
      <el-button :loading="loading" type="primary" @click="save">
        确 定
      </el-button>
    </template>
  </el-dialog>
</template>

<script>
  export default {
    name: 'XcBaseFormDialog',
    props: [
      'options', // 数据
      'width', //弹窗宽度
      'height', //弹窗高度
      'labelWidth',
      'showTitlePrefix',
      'title',
      'addFunc', //新增请求方法
      'editFunc', //编辑请求方法
      'detailFunc', //详情请求方法
      'handleDetailData', //处理详情数据
      'handleSubmitData', //处理提交数据
      'handleQueryDetailParams', //处理查询详情的参数
      'onChange', //数据改变回调
    ],
    data() {
      return {
        modalTitle: '',
        isShowModal: false,
        loading: false,
        dataInfo: {},
      }
    },
    computed: {
      rules() {
        let rules = {}

        this.options.forEach((option) => {
          if (option.required) {
            if (
              option.type == 'daterange' ||
              option.type == 'date' ||
              option.type == 'radio' ||
              (option.type == 'select' && !option.multiple) ||
              option.trigger == 'change'
            ) {
              rules[option.key] = [
                {
                  required: true,
                  trigger: 'change',
                  message: `请选择${option.label}`,
                },
              ]
            } else {
              rules[option.key] = [
                {
                  required: true,
                  trigger: 'blur',
                  message: `请输入${option.label}`,
                },
              ]
            }
            if (option.type == 'number') {
              rules[option.key].push({
                validator: (rule, value, callback) => {
                  if (!value) {
                    return callback(new Error(`请输入${option.label}`))
                  }
                  let numReg = /^[0-9]*$/
                  if (!numReg.test(value)) {
                    callback(new Error(`${option.label}必须为数字`))
                  } else {
                    callback()
                  }
                },
                trigger: 'blur',
              })
            }
          }
          if (option.rules && option.rules.length > 0) {
            rules[option.key] = [rules[option.key], ...option.rules]
          }
        })
        return rules
      },
    },
    created() {},
    methods: {
      isHide(option) {
        return option.hideRule ? option.hideRule(this.dataInfo) : false
      },
      dataOnChange(value, option) {
        if (option.type === 'daterange') {
          this.$set(this.dataInfo, option.key, value[0])
          this.$set(this.dataInfo, option.key2, value[1])
        }
        this.onChange && this.onChange(option.key, value, this.dataInfo)
      },
      initData() {
        this.options.forEach((option) => {
          if (option.type == 'daterange') {
            let value = this.dataInfo[option.key]
              ? [this.dataInfo[option.key], this.dataInfo[option.key2]]
              : []
            this.$set(this.dataInfo, option.key + option.key2, value)
          }
        })

        this.handleDetailData && this.handleDetailData(this.dataInfo)
      },
      //编辑或新增
      show(data) {
        this.dataInfo = {}
        if (data) {
          if (data instanceof Object) {
            //穿的是数据
            this.dataInfo = { ...data }
            this.initData()
          } else if (this.detailFunc) {
            //传的是id
            let params = {
              id: data,
            }
            this.handleQueryDetailParams && this.handleQueryDetailParams(params)
            this.detailFunc(params).then((res) => {
              this.dataInfo = {
                id: data,
                ...res.result,
              }
              this.initData()
            })
          }
        } else {
          //新增
          this.options.forEach((option) => {
            if (option.defaultValue) {
              this.$set(this.dataInfo, option.key, option.defaultValue)
            }
          })
        }

        this.modalTitle = this.showTitlePrefix
          ? `${data ? '编辑' : '新增'}${this.title}`
          : this.title
        this.isShowModal = true
      },
      close() {
        this.dataInfo = {}
        this.$refs.formRef.resetFields()
        this.isShowModal = false
      },
      save() {
        this.$refs['formRef'].validate(async (valid) => {
          if (valid) {
            let requestMethod
            if (this.dataInfo.id) {
              //编辑
              requestMethod = this.editFunc ? this.editFunc : this.addFunc //编辑和新增共用一个方法，只用传新增方法
            } else {
              //新增
              requestMethod = this.addFunc
            }

            this.handleSubmitData && this.handleSubmitData(this.dataInfo)
            this.loading = true
            requestMethod(this.dataInfo)
              .then((res) => {
                this.loading = false
                if (res.code === 200) {
                  this.$baseMessage(
                    res.message,
                    'success',
                    'vab-hey-message-success'
                  )
                  this.close()
                  this.$emit('ok')
                }
              })
              .catch(() => {
                this.loading = false
              })
          }
        })
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

<style lang="less" scoped>
  /deep/ .el-dialog__body {
    padding-right: 0 !important;
    .el-col {
      padding-right: 20px;
    }
  }
</style>
