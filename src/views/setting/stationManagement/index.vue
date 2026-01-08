<template>
  <div class="role-management-container">
    <vab-query-form>
      <vab-query-form-left-panel :span="12">
        <el-button
          v-permissions="['system_postManager_add']"
          icon="el-icon-plus"
          type="primary"
          @click="handleEdit($event)"
        >
          新增
        </el-button>
        <el-button
          v-permissions="['system_postManager_delete']"
          icon="el-icon-delete"
          type="danger"
          @click="handleDelete($event)"
        >
          批量删除
        </el-button>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel :span="12">
        <el-form :inline="true" :model="queryForm" @submit.prevent>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.name"
              clearable
              placeholder="请输入岗位名称"
              style="margin-right: 10px"
            />
          </el-form-item>

          <el-form-item>
            <el-input
              v-model.trim="queryForm.code"
              clearable
              placeholder="请输入岗位代码"
            />
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" @click="queryData">
              查询
            </el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>

    <el-table
      v-loading="listLoading"
      border
      :data="list"
      stripe
      @selection-change="setSelectRows"
    >
      <el-table-column align="center" show-overflow-tooltip type="selection" />
      <el-table-column align="center" label="序号" width="55">
        <template #default="{ $index }">
          {{ $index + 1 }}
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="名称"
        prop="name"
        show-overflow-tooltip
      />

      <el-table-column
        align="center"
        label="代码"
        prop="code"
        show-overflow-tooltip
      />

      <el-table-column
        align="center"
        label="状态"
        prop="status"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          <el-tag v-if="row.status == USER_STATUS.ON.key">
            {{ USER_STATUS.ON.value }}
          </el-tag>
          <el-tag v-if="row.status == USER_STATUS.OFF.key">
            {{ USER_STATUS.OFF.value }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="创建时间"
        prop="inserttime"
        show-overflow-tooltip
      />

      <el-table-column
        align="center"
        label="操作"
        show-overflow-tooltip
        width="95"
      >
        <template #default="{ row }">
          <el-button
            v-permissions="['system_postManager_edit']"
            type="text"
            @click="handleEdit(row)"
          >
            编辑
          </el-button>
          <el-button
            v-permissions="['system_postManager_delete']"
            type="text"
            @click="handleDelete(row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
      <template #empty>
        <!--  <el-image
          class="vab-data-empty"
          :src="require('@/assets/empty_images/data_empty.png')"
        /> -->
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
    <edit ref="editRef" @fetch-data="fetchData" />
  </div>
</template>

<script>
  import { doDelete, getPostList } from '@/api/systemManage/stationManagement'
  import { USER_STATUS } from '@/constant/Enums.js'

  export default {
    name: 'RoleManagement',
    components: {
      Edit: () => import('./components/edit.vue'),
    },
    data() {
      return {
        USER_STATUS,
        editRef: null,
        list: [],
        listLoading: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        selectRows: '',
        queryForm: {
          pageNo: 1,
          pageSize: 10,
          name: '',
          code: '',
        },
      }
    },
    mounted() {
      this.fetchData()
    },
    methods: {
      setSelectRows(val) {
        this.selectRows = val
      },
      handleEdit(row) {
        if (row.id) {
          this.$refs.editRef.showEdit(row)
        } else {
          this.$refs.editRef.showEdit()
        }
      },
      handleDelete(row) {
        if (row.id) {
          this.$baseConfirm('你确定要删除当前项吗', null, async () => {
            const { message } = await doDelete({ ids: row.id })
            this.$baseMessage(message, 'success', 'vab-hey-message-success')
            await this.fetchData()
          })
        } else {
          if (this.selectRows.length > 0) {
            const ids = this.selectRows.map((item) => item.id).join()
            this.$baseConfirm('你确定要删除选中项吗', null, async () => {
              const { message } = await doDelete({ ids })
              this.$baseMessage(message, 'success', 'vab-hey-message-success')
              await this.fetchData()
            })
          } else {
            this.$baseMessage('未选中任何行', 'error', 'vab-hey-message-error')
          }
        }
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
      async fetchData() {
        this.listLoading = true
        const {
          result: { postList, total },
        } = await getPostList(this.queryForm)
        this.list = postList
        this.total = total
        this.listLoading = false
      },
    },
  }
</script>
