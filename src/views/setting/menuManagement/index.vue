<template>
  <div class="menu-management-container">
    <vab-query-form>
      <vab-query-form-top-panel :span="12">
        <el-button
          v-permissions="['system_menuManager_add']"
          icon="el-icon-plus"
          type="primary"
          @click="handleEdit($event)"
        >
          新增
        </el-button>
      </vab-query-form-top-panel>
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
          :default-expand-all="false"
          row-key="powerId"
          stripe
          :tree-props="{ children: 'childrenList' }"
        >
          <el-table-column label="名称" prop="name" show-overflow-tooltip />
          <!-- <el-table-column
          label="父类编号"
          prop="parentId"
          show-overflow-tooltip
        /> -->
          <el-table-column label="类型" prop="type" show-overflow-tooltip>
            <template #default="{ row }">
              <el-tag v-if="row.type == MENU_TYPE.CATALOG.key" type="success">
                {{ MENU_TYPE.CATALOG.value }}
              </el-tag>
              <el-tag v-if="row.type == MENU_TYPE.MENU.key" type="warning">
                {{ MENU_TYPE.MENU.value }}
              </el-tag>
              <el-tag v-if="row.type == MENU_TYPE.BUTTON.key">
                {{ MENU_TYPE.BUTTON.value }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="代码" prop="code" show-overflow-tooltip />
          <el-table-column
            label="排序代码"
            prop="sortindex"
            show-overflow-tooltip
          />

          <el-table-column label="操作" show-overflow-tooltip width="150">
            <template #default="{ row }">
              <el-button
                v-permissions="['system_menuManager_add']"
                type="text"
                @click="handleEdit(row, 'add')"
              >
                新增
              </el-button>
              <el-button
                v-permissions="['system_menuManager_edit']"
                type="text"
                @click="handleEdit(row, 'edit')"
              >
                编辑
              </el-button>
              <el-button
                v-permissions="['system_menuManager_delete']"
                type="text"
                @click="handleDelete(row)"
              >
                <!-- <vab-icon icon="delete-bin-6-line" /> -->
                删除
              </el-button>
            </template>
          </el-table-column>
          <template #empty>
            <!-- <el-image
              class="vab-data-empty"
              :src="require('@/assets/empty_images/data_empty.png')"
            /> -->
            <el-empty class="vab-data-empty" description="暂无数据" />
          </template>
        </el-table>
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
    menuEdit,
  } from '@/api/systemManage/menuManagement.js'
  import { MENU_TYPE } from '@/constant/Enums'

  export default {
    name: 'MenuManagement',
    components: {
      Edit: () => import('./components/MenuManagementEdit'),
      ApplicationTree: () => import('@/components/applicationTree'),
    },
    data() {
      return {
        queryForm: {},
        MENU_TYPE,
        editRef: null,
        data: [],
        list: [],
        listLoading: true,
        selectTreeNode: {},
        treeData: [],
      }
    },
    mounted() {},
    methods: {
      handleEdit(row, type) {
        if (row.parentId && type == 'edit') {
          menuEdit({ powerId: row.powerId }).then((res) => {
            let { result } = res
            if (result.parentId == '-1') {
              result.parentName = 'root'
            }
            this.$refs.editRef.showEdit(result)
          })
        } else if (row.powerId && type == 'add') {
          let data = {
            parentId: row.powerId,
            parentName: row.name,
          }
          this.$refs.editRef.showEdit(data)
        } else {
          this.$refs.editRef.showEdit()
        }
      },
      handleDelete(row) {
        if (row.powerId) {
          this.$baseConfirm('你确定要删除当前项吗', null, async () => {
            const { message } = await doDelete({ ids: row.powerId })
            this.$baseMessage(message, 'success', 'vab-hey-message-success')
            await this.fetchData()
          })
        }
      },
      async fetchData() {
        this.listLoading = true
        console.log(this.queryForm)
        const {
          result: { powerList },
        } = await getList(this.queryForm)
        this.list = powerList
        this.listLoading = false
      },
      handleNodeClick(val) {
        this.queryForm.applicationId = val.applicationId
        this.fetchData()
      },
    },
  }
</script>

<style lang="scss" scoped>
  $base: '.menu-management';
  #{$base}-container {
    // padding: 0 !important;
    // background: $base-color-background !important;
  }
</style>
