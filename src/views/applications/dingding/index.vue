<template>
  <div class="user-management-container">
    <vab-query-form>
      <vab-query-form-top-panel :span="12">
        <el-button
          :disabled="!queryForm.organId"
          icon="el-icon-refresh-left"
          :loading="syncZzdOrganLoading"
          type="primary"
          @click="handleSyncZzdOrgan"
        >
          刷新机构
        </el-button>

        <el-button
          :disabled="!queryForm.organId"
          icon="el-icon-refresh-left"
          :loading="syncZzdUserLoading"
          type="primary"
          @click="handleSyncZzdUser"
        >
          刷新用户
        </el-button>
      </vab-query-form-top-panel>
    </vab-query-form>
    <el-row :gutter="24">
      <el-col :lg="6" :md="8" :sm="24" :xl="4" :xs="24">
        <el-card :body-style="{ minHeight: '450px' }" shadow="hover">
          <el-tree
            ref="selectTree"
            :data="departList"
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
            label="系统用户名"
            prop="sysUserName"
            show-overflow-tooltip
          />
          <el-table-column
            align="center"
            label="浙政钉编号"
            prop="zzdUserId"
            show-overflow-tooltip
          />
          <el-table-column
            align="center"
            label="浙政钉用户名"
            prop="zzdUserName"
            show-overflow-tooltip
          />
          <el-table-column align="center" label="状态" show-overflow-tooltip>
            <template #default="{ row }">
              <el-tag v-if="row.status == DING_USER_STATUS.YES.key">
                {{ DING_USER_STATUS.YES.value }}
              </el-tag>
              <el-tag
                v-if="row.status == DING_USER_STATUS.NO.key"
                type="danger"
              >
                {{ DING_USER_STATUS.NO.value }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
            show-overflow-tooltip
            width="200"
          >
            <template #default="{ row }">
              <el-button
                v-if="row.status === DING_USER_STATUS.YES.key"
                v-permissions="['system_userManager_edit']"
                type="text"
                @click="unbindOnClick(row)"
              >
                解绑
              </el-button>
            </template>
          </el-table-column>
          <template #empty>
            <el-empty class="vab-data-empty" description="暂无数据" />
          </template>
        </el-table>
        <el-pagination
          background
          :current-page="queryForm.pageNum"
          :layout="layout"
          :page-size="queryForm.pageSize"
          :total="total"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {
    getOrganTree,
    getUserList,
    unbindUser,
    syncZzdOrgan,
    syncZzdUser,
  } from '@/api/application/dingding'
  import { DING_USER_STATUS } from '@/constant/Enums.js'
  export default {
    name: 'UserManagement',
    components: {},
    data() {
      return {
        DING_USER_STATUS,
        editRef: null,
        list: [],
        listLoading: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        selectRows: '',
        queryForm: {
          pageNum: 1,
          pageSize: 10,
          username: '',
          phoneNo: '',
        },
        defaultProps: {
          children: 'children',
          label: 'name',
        },
        departList: [],
        roleList: [],
        syncZzdOrganLoading: false,
        syncZzdUserLoading: false,
      }
    },
    mounted() {
      this.queryData()
    },
    methods: {
      unbindOnClick(row) {
        this.$baseConfirm('你确定要解绑当前用户吗', null, () => {
          unbindUser({
            sysUserId: row.sysUserId,
            zzdUserId: row.zzdUserId,
          }).then((res) => {
            this.$baseMessage(res.message, 'success', 'vab-hey-message-success')
            this.fetchData()
          })
        })
      },
      cleardepartForm() {
        this.$set(this.queryForm, 'organName', '')
        this.$set(this.queryForm, 'organId', '')
      },
      async getDepartList() {
        const data = await getOrganTree({})
        this.departList = data.result.zzdOrganTreeList
        this.syncZzdOrganLoading = false
      },
      handleNodeClick(node) {
        console.log(node)
        if (this.queryForm.organId === node.id) {
          this.queryForm.organId = ''
          this.queryForm.organName = ''
          this.$refs.selectTree.setCurrentKey(null)
        } else {
          this.$set(this.queryForm, 'organId', node.id)
          this.$set(this.queryForm, 'organName', node.name)
        }
        this.fetchData()
      },
      setSelectRows(val) {
        this.selectRows = val
      },
      handleSizeChange(val) {
        this.$set(this.queryForm, 'pageSize', val)
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.queryForm.pageNum = val
        this.fetchData()
      },
      queryData() {
        this.queryForm.pageNum = 1
        this.getDepartList()
        this.fetchData()
      },
      async fetchData() {
        this.listLoading = true
        const {
          result: { zzdUserList, totalRows },
        } = await getUserList(this.queryForm)
        this.list = zzdUserList
        this.total = totalRows
        this.listLoading = false
        this.syncZzdUserLoading = false
      },
      handleSyncZzdOrgan() {
        this.syncZzdOrganLoading = true
        let params = {
          organizationCodes: [this.queryForm.organId],
        }
        syncZzdOrgan(params).then(
          () => {
            this.$message.success('同步成功')
            this.getDepartList()
          },
          () => {
            this.syncZzdOrganLoading = false
          }
        )
      },
      handleSyncZzdUser() {
        this.syncZzdUserLoading = true
        let params = {
          organizationCodes: [this.queryForm.organId],
        }
        syncZzdUser(params).then(
          () => {
            this.$message.success('同步成功')
            this.fetchData()
          },
          () => {
            this.syncZzdUserLoading = false
          }
        )
      },
    },
  }
</script>
