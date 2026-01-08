<template>
  <div class="role-management-container">
    <vab-query-form>
      <vab-query-form-left-panel :span="12">
        <el-button
          v-permissions="['system_roleManager_add']"
          icon="el-icon-plus"
          type="primary"
          @click="handleEdit($event)"
        >
          新增
        </el-button>
        <el-button
          v-permissions="['system_roleManager_delete']"
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
              placeholder="请输入角色名称"
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
      <el-col :lg="5" :md="8" :sm="24" :xl="4" :xs="24">
        <el-card :body-style="{ minHeight: '450px' }" shadow="hover">
          <application-tree @node-click="handleNodeClick" />
        </el-card>
      </el-col>
      <el-col :lg="19" :md="16" :sm="24" :xl="20" :xs="24">
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
            label="备注"
            prop="remark"
            show-overflow-tooltip
          />

          <el-table-column
            align="center"
            label="操作"
            show-overflow-tooltip
            width="180"
          >
            <template #default="{ row }">
              <member-select
                multiple
                style="display: inline-block; width: auto; margin-right: 10px"
                :value="userList"
                @onChange="(value) => memberListOnChange(value, row.id)"
              >
                <el-button
                  slot="result"
                  v-permissions="['system_roleManager_edit']"
                  type="text"
                  @click="getUserListByRole(row.id)"
                >
                  设置成员
                </el-button>
              </member-select>
              <el-button
                v-permissions="['system_roleManager_edit']"
                type="text"
                @click="handleEdit(row)"
              >
                编辑
              </el-button>
              <el-button
                v-permissions="['system_roleManager_delete']"
                type="text"
                @click="handleDelete(row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
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
      </el-col>
    </el-row>
    <edit
      ref="editRef"
      :application-id="queryForm.applicationId"
      @fetch-data="fetchData"
    />
  </div>
</template>

<script>
  import {
    doDelete,
    getList,
    roleDetail,
    userRoleInit,
    userRoleSave,
  } from '@/api/systemManage/roleManagement'

  export default {
    name: 'RoleManagement',
    components: {
      Edit: () => import('./components/RoleManagementEdit'),
      ApplicationTree: () => import('@/components/applicationTree'),
    },
    data() {
      return {
        editRef: null,
        list: [],
        listLoading: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        selectRows: '',
        userList: [],
        queryForm: {
          pageNo: 1,
          pageSize: 10,
          name: '',
        },
        selectTreeNode: {},
        treeData: [],
      }
    },
    mounted() {
      this.$set(this.queryForm, 'pageNo', 1)
    },
    methods: {
      setSelectRows(val) {
        this.selectRows = val
      },
      handleEdit(row) {
        if (row.id) {
          this.getRoleDetail(row)
        } else {
          this.$refs.editRef.showEdit()
        }
      },
      memberListOnChange(val, roleId) {
        const params = {
          roleId,
          applicationId: this.queryForm.applicationId,
          userIds: val.map((item) => item.userId),
        }
        userRoleSave(params).then(() => {
          this.getUserListByRole(roleId)
        })
      },
      getUserListByRole(roleId) {
        userRoleInit({
          applicationId: this.queryForm.applicationId,
          roleId,
        }).then((res) => {
          this.userList = res.result.roleUserList
            ? res.result.roleUserList.map((item) => {
                if (item) {
                  return {
                    userId: item.id,
                    userName: item.realname,
                  }
                }
              })
            : []

          console.log('this.userList', JSON.stringify(this.userList))
        })
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
          result: { roleList, total },
        } = await getList(this.queryForm)
        this.list = roleList
        this.total = total
        this.listLoading = false
      },
      async getRoleDetail(params) {
        const result = await roleDetail({ id: params.id })
        console.log(result, 'result')
        let row = result.result
        row.id = params.id
        this.$refs.editRef.showEdit(row)
      },
      handleNodeClick(val) {
        this.queryForm.applicationId = val.applicationId
        this.fetchData()
      },
    },
  }
</script>
