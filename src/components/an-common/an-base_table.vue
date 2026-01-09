<template>
  <div>
    <el-table
      v-loading="loading"
      :border="hideBorder ? false : true"
      :data="dataList"
      :row-key="rowKey"
      :stripe="hideStripe ? false : true"
      :tree-props="treeProps"
      @selection-change="setSelectRows"
    >
      <template v-for="(column, index) in tableColumns">
        <el-table-column
          v-if="column.type == 'selection'"
          :key="'column' + index"
          :align="column.align ? column.align : 'center'"
          :reserve-selection="reserveSelection"
          show-overflow-tooltip
          type="selection"
          :width="column.width"
        />
        <el-table-column
          v-else
          :key="'column' + index"
          :align="column.align ? column.align : 'center'"
          :label="column.title"
          :prop="column.key"
          show-overflow-tooltip
          :type="column.type"
          :width="column.width"
        >
          <template #default="{ row, $index }" v-if="column.type == 'slot'">
            <slot :index="$index" :name="column.key" :row="row"></slot>
          </template>

          <template #default="{ row }" v-else>
            <span>{{ row[column.key] }}</span>
          </template>
        </el-table-column>
      </template>

      <template #empty>
        <el-empty class="vab-data-empty" description="暂无数据" />
      </template>
    </el-table>
    <el-pagination
      v-if="isPage"
      background
      :current-page="curIndex"
      :layout="layout"
      :page-size="pageSize"
      :total="totalRows"
      @current-change="onChangePage"
      @size-change="onPageSizeChange"
    />
  </div>
</template>

<script>
  export default {
    name: 'XcBaseTable',
    props: [
      'tableColumns', // 搜索回调
      'asyncFunc', // 请求方法
      'noPage', // 不分页
      'searchParams', //请求参数
      'listName', //返回列表字段名
      'rowKey',
      'reserveSelection', //是否数据更新之后保留之前选中的数据（需指定 row-key）
      'treeProps',
      'hideBorder',
      'hideStripe',
    ],
    data() {
      return {
        layout: 'total, sizes, prev, pager, next, jumper',
        dataList: [],
        curIndex: 1, // 当前页
        pageSize: 10, //一页的数量
        totalRows: 0, //数据总条数
        loading: false,

        selectRows: '',
      }
    },
    computed: {
      isPage() {
        return this.noPage ? false : true
      },
    },
    methods: {
      getParams() {
        let params = {}
        if (this.isPage) {
          params = {
            pageNum: this.curIndex, //页码
            pageNo: this.curIndex, //页码
            pageSize: this.pageSize, //每页大小
          }
        }
        if (this.searchParams) {
          params = {
            ...params,
            ...this.searchParams,
          }
        }
        return params
      },
      async fetchData(index) {
        setTimeout(() => {
          if (this.asyncFunc) {
            if (index) {
              this.curIndex = index ? index : 1
            }
            let params = this.getParams()
            this.loading = true
            this.asyncFunc(params).then((data) => {
              let detail = data.result
              this.dataList = detail[this.listName] ? detail[this.listName] : []
              if (this.curIndex > 1 && this.dataList.length == 0) {
                this.fetchData(this.curIndex - 1)
              } else {
                this.totalRows = detail.totalRows ? detail.totalRows : 0
                if (this.totalRows == 0 && detail.total) {
                  this.totalRows = detail.total ? detail.total : 0
                }

                this.loading = false
              }
            })
          }
        })
      },
      setSelectRows(val) {
        this.selectRows = val
      },
      getSelection() {
        return this.selectRows ? this.selectRows : []
      },
      //点击页码时回调
      onChangePage(index) {
        this.curIndex = index
        this.fetchData(this.curIndex)
      },
      //切换每页条数时的回调
      onPageSizeChange(pageSize) {
        this.pageSize = pageSize
        this.curIndex = 1
        this.fetchData(this.curIndex)
      },
    },
  }
</script>

<style lang="less" scoped></style>
