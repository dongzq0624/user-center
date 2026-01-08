<template>
  <div class="system-log-container">
    <vab-query-form>
      <vab-query-form-top-panel>
        <el-form
          :inline="true"
          label-width="60px"
          :model="queryForm"
          @submit.prevent
        >
          <el-form-item label="账号">
            <el-input
              v-model.trim="queryForm.account"
              clearable
              placeholder="请输入账号"
            />
          </el-form-item>
          <el-form-item label="周期">
            <el-date-picker
              v-model="queryForm.searchDate"
              end-placeholder="结束日期"
              start-placeholder="开始日期"
              type="daterange"
            />
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" @click="queryData">
              查询
            </el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-top-panel>
    </vab-query-form>

    <el-table v-loading="listLoading" :data="list">
      <el-table-column type="expand">
        <template #default="{ row }">
          <div class="vab-table-expand">
            <p>
              <span class="vab-table-expand-title">日志类型:</span>
              {{ row.type }}
            </p>
            <p>
              <span class="vab-table-expand-title">账号:</span>
              {{ row.account }}
            </p>
            <p>
              <span class="vab-table-expand-title">执行结果:</span>
              <span v-if="row.executeResult === '登录成功'">
                <span class="vab-dot vab-dot-success"><span></span></span>
                {{ row.executeResult }}
              </span>
              <span v-else>
                <span class="vab-dot vab-dot-error"><span></span></span>
                {{ row.executeResult }}
              </span>
            </p>
            <p>
              <span class="vab-table-expand-title">登录IP:</span>
              {{ row.ip }}
            </p>
            <p>
              <span class="vab-table-expand-title">访问时间:</span>
              {{ row.datetime }}
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="日志类型"
        prop="type"
        show-overflow-tooltip
        width="230px"
      />
      <el-table-column label="账号" prop="account" show-overflow-tooltip />
      <el-table-column
        label="执行结果"
        prop="executeResult"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          <span v-if="row.executeResult === '登录成功'">
            <span class="vab-dot vab-dot-success"><span></span></span>
            {{ row.executeResult }}
          </span>
          <span v-else>
            <span class="vab-dot vab-dot-error"><span></span></span>
            {{ row.executeResult }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="登录IP" prop="ip" />
      <el-table-column label="访问时间" prop="datetime" show-overflow-tooltip />
      <template #empty>
        <el-empty class="vab-data-empty" description="暂无数据" />
      </template>
    </el-table>
    <el-pagination
      background
      :current-page="queryForm.pageNo"
      :layout="layout"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
  </div>
</template>

<script>
  import { getList } from '@/api/systemLog'

  export default {
    name: 'SystemLog',
    data() {
      return {
        list: [],
        listLoading: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        queryForm: {
          account: '',
          searchDate: '',
          pageNo: 1,
          pageSize: 20,
        },
      }
    },
    mounted() {
      this.fetchData()
    },
    methods: {
      async fetchData() {
        this.listLoading = true
        const {
          data: { list },
        } = await getList(this.queryForm)
        this.list = list
        this.listLoading = false
      },
      handleSizeChange(val) {
        this.$set(this.queryForm, 'pageSize', val)
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.$set(this.queryForm, 'pageNo', val)
        this.fetchData()
      },
      queryData() {
        this.$set(this.queryForm, 'pageNo', 1)
        this.fetchData()
      },
    },
  }
</script>
