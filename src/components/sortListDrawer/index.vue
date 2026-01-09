<template>
  <el-drawer
    direction="rtl"
    size="45%"
    title="调整排序"
    :visible.sync="visible"
  >
    <div v-loading="listLoading" class="container">
      <div class="tip_container">
        <span>通过拖拽进行排序</span>
        <div class="btn_box">
          <span @click="save">保存</span>
          <span>|</span>
          <span @click="reset">撤销</span>
        </div>
      </div>

      <el-table ref="dragTable" border :data="gridData" stripe>
        <template v-for="(item, index) in columns">
          <el-table-column
            v-if="index === 0"
            :key="index"
            :label="item.label"
            :property="item.prop"
            :width="item.width"
          >
            <template slot-scope="scope">
              <img class="sort_icon" src="../../assets/img/icon_sort.png" />
              <span style="margin-left: 15px">{{ scope.row[item.prop] }}</span>
            </template>
          </el-table-column>

          <el-table-column
            v-if="index !== 0"
            :key="index"
            :label="item.label"
            :property="item.prop"
            :width="item.width"
          />
        </template>
      </el-table>
    </div>
  </el-drawer>
</template>

<script>
  import { USER_GENDER } from '@/constant/Enums.js'
  import Sortable from 'sortablejs'
  export default {
    name: 'SortUser',
    props: {
      method: {
        type: Function,
        default: () => {},
      },
      listName: {
        type: String,
        default: '',
      },
      transData: {
        type: Function,
        default: () => {},
      },
      params: {
        type: Object,
        default() {
          return {}
        },
      },
      columns: {
        type: Array,
        default() {
          return []
        },
      },
    },
    data() {
      return {
        USER_GENDER,
        listLoading: true,
        visible: false,
        oldList: [], //原始数据
        sortList: [], //排序后的数据
        gridData: [], //用于渲染的数据
      }
    },
    computed: {},
    mounted() {
      document.body.ondrop = function (event) {
        event.preventDefault()
        event.stopPropagation()
      }
    },
    methods: {
      show() {
        this.visible = true
        this.queryList()
      },
      hide() {
        this.visible = false
      },
      hideLoading() {
        this.listLoading = false
      },
      queryList() {
        let requestParams = {
          pageNo: 1,
          pageSize: 999999,
          ...this.params,
        }
        this.listLoading = true
        this.method(requestParams).then((resp) => {
          let list = resp.result[this.listName]
          list.forEach((data, index) => {
            data.index = index
          })
          if (this.transData) {
            this.transData(list)
          }
          this.gridData = []
          setTimeout(() => {
            this.gridData = [...list]
          })
          this.oldList = [...list]
          this.sortList = [...list]
          this.listLoading = false

          this.$nextTick(() => {
            this.initSortable()
          })
        })
      },
      initSortable() {
        // 获取表格row的父节点
        const ele = this.$refs.dragTable.$el.querySelector(
          '.el-table__body > tbody'
        )
        // 创建拖拽实例
        this.dragTable = Sortable.create(ele, {
          animation: 150, //动画
          disabled: false, // 拖拽不可用? false 启用（刚刚渲染表格的时候起作用，后面不起作用）
          handle: '.el-table__row', //指定拖拽目标，点击此目标才可拖拽元素(此例中设置操作按钮拖拽)
          // filter: '.disabled', //指定不可拖动的类名（el-table中可通过row-class-name设置行的class）
          dragClass: 'dragClass', //设置拖拽样式类名
          ghostClass: 'ghostClass', //设置拖拽停靠样式类名
          chosenClass: 'chosenClass', //设置选中样式类名
          // 开始拖动事件
          onStart: () => {
            // console.log('开始拖动')
          },

          // 结束拖动事件
          onEnd: ({ newIndex, oldIndex }) => {
            if (oldIndex === newIndex) return

            if (oldIndex < newIndex) {
              for (let i = oldIndex + 1; i <= newIndex; i++) {
                this.sortList[i].index--
              }
            } else if (newIndex < oldIndex) {
              for (let i = newIndex; i <= oldIndex - 1; i++) {
                this.sortList[i].index++
              }
            }
            this.sortList[oldIndex].index = newIndex

            this.sortList = this.sortList.sort((a, b) => {
              return a.index - b.index
            })
          },
        })
      },
      save() {
        this.listLoading = true
        this.$emit('onSave', this.sortList)
      },
      reset() {
        this.gridData = []
        setTimeout(() => {
          this.gridData = [...this.oldList]
        })
      },
    },
  }
</script>
<style lang="less" scoped>
  .container {
    margin: 0 20px 0 20px;
  }
  .tip_container {
    background-color: #edf7ff;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 15px;
    padding: 8px 0;
    color: #314659;
  }
  .btn_box {
    margin-left: 40px;
    color: #1890ff;
  }

  .sort_icon {
    width: 15px;
    height: 15px;
  }
</style>
