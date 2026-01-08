<template>
  <div class="dictionary-management-container">
    <vab-query-form>
      <vab-query-form-left-panel :span="12">
        <el-button
          v-permissions="['system_dictionaryManager_add']"
          icon="el-icon-plus"
          type="primary"
          @click="handleEdit($event)"
        >
          新增
        </el-button>
        <el-button
          v-permissions="['system_dictionaryManager_delete']"
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
              placeholder="请输入字典名称"
              style="margin-right: 10px"
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

    <el-row :gutter="20">
      <el-col :lg="6" :md="8" :sm="24" :xl="4" :xs="24">
        <el-card shadow="hover">
          <el-tree
            ref="selectTree"
            :data="treeData"
            :default-expand-all="false"
            :highlight-current="true"
            node-key="id"
            :props="defaultProps"
            @node-click="handleNodeClick"
          />
        </el-card>
      </el-col>
      <el-col :lg="18" :md="16" :sm="24" :xl="20" :xs="24">
        <el-table
          v-loading="listLoading"
          border
          :data="list"
          stripe
          @selection-change="setSelectRows"
        >
          <el-table-column
            align="center"
            show-overflow-tooltip
            type="selection"
          />
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
            label="值"
            prop="value"
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
                v-permissions="['system_dictionaryManager_edit']"
                type="text"
                @click="handleEdit(row)"
              >
                编辑
              </el-button>
              <el-button
                v-permissions="['system_dictionaryManager_delete']"
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
      </el-col>
    </el-row>
    <edit ref="editRef" @fetch-data="refreshData" />
  </div>
</template>

<script>
  import {
    doDelete,
    getList,
    dictionaryDetail,
    dictTree,
  } from '@/api/systemManage/dictionaryManagement'

  export default {
    name: 'DictionaryManagement',
    components: {
      Edit: () => import('./components/edit.vue'),
    },
    data() {
      return {
        editRef: null,
        list: [],
        listLoading: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        selectRows: [],
        defaultProps: {
          children: 'dictChildrenTree',
          label: 'name',
        },
        queryForm: {
          pageNo: 1,
          pageSize: 10,
          name: '',
          code: '',
          parentId: '',
        },
        treeData: [],
      }
    },
    mounted() {
      this.fetchData()
      this.getDictionaryType()
    },
    methods: {
      setSelectRows(val) {
        this.selectRows = val
      },
      handleEdit(row) {
        if (row.id) {
          this.getDictionaryDetail(row.id)
        } else {
          if (this.queryForm.parentId !== '') {
            let form = {
              parentId: this.queryForm.parentId,
              parentName: this.queryForm.parentName,
            }
            this.$refs.editRef.showEdit(form)
          } else {
            this.$refs.editRef.showEdit()
          }
        }
      },
      handleDelete(row) {
        if (row.id) {
          this.$baseConfirm('你确定要删除当前项吗', null, async () => {
            const { message } = await doDelete({ ids: row.id })
            this.$baseMessage(message, 'success', 'vab-hey-message-success')
            await this.fetchData()
            this.getDictionaryType()
          })
        } else {
          if (this.selectRows.length > 0) {
            const ids = this.selectRows.map((item) => item.id).join()
            this.$baseConfirm('你确定要删除选中项吗', null, async () => {
              const { message } = await doDelete({ ids })
              this.$baseMessage(message, 'success', 'vab-hey-message-success')
              await this.fetchData()
              this.getDictionaryType()
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
          result: { dictList, total },
        } = await getList(this.queryForm)
        this.list = dictList
        this.total = total
        this.listLoading = false
      },
      async getDictionaryDetail(id) {
        const result = await dictionaryDetail({ id })
        let row = result.result
        row.id = id
        this.$refs.editRef.showEdit(row)
      },

      getDictionaryType() {
        dictTree().then((resp) => {
          this.treeData = resp.result.dictTree
        })
      },

      handleNodeClick(val) {
        console.log(val)
        if (this.queryForm.parentId === val.id) {
          this.queryForm.parentId = ''
          this.queryForm.parentName = ''
          this.$refs.selectTree.setCurrentKey(null)
        } else {
          this.queryForm.parentId = val.id
          this.queryForm.parentName = val.name
        }
        this.fetchData()
      },
      refreshData() {
        this.fetchData()
        this.getDictionaryType()
      },
    },
  }
</script>
