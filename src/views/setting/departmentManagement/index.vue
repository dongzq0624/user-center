<template>
  <div class="department-management-container">
    <!-- 查询表单 -->
    <div class="query-section">
      <div class="query-form">
        <div class="action-buttons">
          <el-button
            v-permissions="['system_organManager_add']"
            class="action-btn add-btn"
            icon="el-icon-plus"
            type="primary"
            @click="handleEdit($event)"
          >
            新增部门
          </el-button>
          <!--<el-button-->
          <!--v-permissions="['system_organManager_delete']"-->
          <!--class="action-btn delete-btn"-->
          <!--icon="el-icon-delete"-->
          <!--type="danger"-->
          <!--@click="handleDelete($event)"-->
          <!--&gt;-->
          <!--批量删除-->
          <!--</el-button>-->
        </div>
      </div>
    </div>

    <!-- 主内容区域 -->
    <div class="main-content">
      <el-card class="table-card" shadow="never">
        <template #header>
          <div class="table-header">
            <i class="el-icon-office-building"></i>
            <span>部门管理</span>
          </div>
        </template>

        <el-table
          ref="singleTable"
          v-loading="listLoading"
          border
          class="department-table"
          :data="list"
          :default-expand-all="false"
          lazy
          :load="loadNodes"
          row-key="id"
          :row-style="rowStyle"
          stripe
          style="width: 100%"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          @selection-change="setSelectRows"
        >
          <el-table-column
            align="center"
            show-overflow-tooltip
            type="selection"
            width="50"
          />
          <el-table-column
            align="left"
            label="名称"
            prop="name"
            show-overflow-tooltip
          />
          <el-table-column
            align="center"
            label="组织类型"
            prop="type"
            show-overflow-tooltip
          >
            <template #default="{ row }">
              <el-tag
                class="type-tag"
                size="small"
                :type="getTypeTagType(row.type)"
              >
                <i :class="getTypeIcon(row.type)"></i>
                {{ row.type }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="创建时间"
            prop="inserttime"
            show-overflow-tooltip
          >
            <template #default="{ row }">
              <div class="time-cell">
                <i class="el-icon-time"></i>
                <span>{{ row.inserttime || '-' }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            class-name="operation-column"
            label="操作"
          >
            <template #default="{ row }">
              <div class="operation-buttons">
                <el-button
                  v-permissions="['system_organManager_edit']"
                  class="op-btn edit-btn"
                  size="small"
                  type="text"
                  @click="handleEdit(row)"
                >
                  <i class="el-icon-edit"></i>
                  编辑
                </el-button>
                <el-button
                  v-permissions="['system_organManager_delete']"
                  class="op-btn delete-btn"
                  size="small"
                  type="text"
                  @click="handleDelete(row)"
                >
                  <i class="el-icon-delete"></i>
                  删除
                </el-button>
              </div>
            </template>
          </el-table-column>
          <template #empty>
            <el-empty
              class="empty-state"
              description="暂无部门数据"
              image="https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png"
            >
              <el-button type="primary" @click="handleEdit()">
                新增部门
              </el-button>
            </el-empty>
          </template>
        </el-table>
      </el-card>
    </div>

    <edit ref="editRef" @fetch-data="onAdd" />
    <sort-list-drawer
      ref="sortListRef"
      :columns="sortColumns"
      list-name="organLazyTreeList"
      :method="getSortListMethod"
      :params="{ parentId: sortId, type: 'department' }"
      @onSave="onSortSave"
    />
  </div>
</template>

<script>
  import {
    doDelete,
    organLazyTreeList as getList,
    organInfo,
    dragSort,
  } from '@/api/department/departmentManagement'

  export default {
    name: 'DepartmentManagement',
    components: {
      Edit: () => import('./components/DepartmentManagementEdit'),
      SortListDrawer: () => import('@/components/sortListDrawer'),
    },
    data() {
      return {
        editRef: null,
        list: [],
        listLoading: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        selectRows: '',
        queryForm: {
          pageNo: 1,
          pageSize: 9999,
          name: '',
          parentId: -1,
          type: 'department',
        },
        sortId: '',
        getSortListMethod: getList,
        sortColumns: [
          { prop: 'name', label: '名称' },
          { prop: 'type', label: '组织类型' },
        ],
      }
    },
    mounted() {
      this.fetchData()
    },
    methods: {
      handleSort(row) {
        this.sortId = row.id
        setTimeout(() => {
          this.$refs.sortListRef.show()
        }, 100)
      },
      onSortSave(dataList) {
        let organSortList = dataList.map((data) => {
          return {
            index: data.index,
            id: data.id,
          }
        })
        let params = {
          organSortList,
        }
        dragSort(params)
          .then(() => {
            this.$message.success('保存成功')
            this.$refs.sortListRef.hide()
            this.reloadNode(this.sortId)
          })
          .catch(() => {
            this.$refs.sortListRef.hideLoading()
          })
      },
      setSelectRows(val) {
        this.selectRows = val
      },
      handleEdit(row) {
        if (row.id) {
          this.getOrganDetail(row.id)
        } else {
          this.$refs.editRef.showEdit()
        }
      },
      handleDelete(row) {
        if (row.id) {
          this.$baseConfirm('你确定要删除当前项吗', null, async () => {
            const { message } = await doDelete({ ids: row.id })
            this.$baseMessage(message, 'success', 'vab-hey-message-success')
            this.reloadNode(row.parentId)
            //            await this.fetchData()
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
      onAdd(data) {
        this.reloadNode(data.parentId)
      },
      loadNodes(tree, treeNode, resolve) {
        let params = {
          parentId: tree.id,
          type: 'department',
        }
        getList(params).then((resp) => {
          let list = resp.result.organLazyTreeList
          list.forEach((data) => {
            data.hasChildren = !data.leaf
          })
          resolve(list)
        })
      },
      // 修改数据后重新加载节点
      reloadNode(id) {
        const { lazyTreeNodeMap, treeData } =
          this.$refs.singleTable['store'].states
        this.$set(lazyTreeNodeMap, id, [])
        if (treeData[id]) {
          treeData[id].hasChildren = true

          this.loadNodes({ id: id }, null, (data) => {
            this.$set(treeData[id], 'loading', false)
            this.$set(treeData[id], 'loaded', true)
            this.$set(treeData[id], 'expanded', true)
            if (data.length) {
              this.$set(lazyTreeNodeMap, id, data)
            } else {
              treeData[id].hasChildren = false
            }
          })
        }
      },
      async fetchData() {
        this.listLoading = true
        let params = {
          parentId: -1,
          type: 'department',
        }
        const {
          result: { organLazyTreeList },
        } = await getList(params)
        organLazyTreeList.forEach((data) => {
          data.hasChildren = !data.leaf
        })
        this.$set(this, 'list', organLazyTreeList)
        this.listLoading = false
      },
      async getOrganDetail(id) {
        const result = await organInfo({ id })
        let data = result.result
        data.id = id
        this.$refs.editRef.showEdit(data)
      },
      // 获取组织类型标签类型
      getTypeTagType(type) {
        const typeMap = {
          部门: 'primary',
          公司: 'success',
          分公司: 'warning',
          办事处: 'info',
        }
        return typeMap[type] || 'info'
      },
      // 获取组织类型图标
      getTypeIcon(type) {
        const iconMap = {
          部门: 'el-icon-office-building',
          公司: 'el-icon-suitcase',
          分公司: 'el-icon-suitcase-1',
          办事处: 'el-icon-location',
        }
        return iconMap[type] || 'el-icon-office-building'
      },
      // 表格头部样式
      headerCellStyle() {
        return {
          backgroundColor: '#f5f7fa',
          color: '#606266',
          fontWeight: '500',
          borderBottom: '2px solid #ebeef5',
          textAlign: 'center',
        }
      },
      // 表格行样式
      rowStyle() {
        return {
          height: '50px',
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  .department-management-container {
    padding: 20px;
    background-color: #f5f7fa;
    min-height: calc(100vh - 84px);
  }

  // 查询表单区域
  .query-section {
    margin-bottom: 20px;
    padding: 20px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

    .query-form {
      .action-buttons {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
      }

      .action-btn {
        border-radius: 6px;
        font-weight: 500;
        transition: all 0.3s ease;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }

        &.add-btn {
          background: linear-gradient(45deg, #67c23a, #52c41a);
          border: none;
        }

        &.delete-btn {
          background: linear-gradient(45deg, #f56c6c, #f78989);
          border: none;
        }
      }
    }
  }

  // 主内容区域
  .main-content {
    .table-card {
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

      ::v-deep .el-card__header {
        border-radius: 8px 8px 0 0;

        .table-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 500;

          .table-stats {
            margin-left: auto;

            .total-count {
              font-size: 14px;
              opacity: 0.9;
            }
          }
        }
      }
    }

    .department-table {
      width: 100% !important;
      table-layout: auto;

      ::v-deep .el-table {
        width: 100% !important;
        table-layout: auto;
      }

      ::v-deep .el-table__header-wrapper {
        width: 100%;
      }

      ::v-deep .el-table__body-wrapper {
        width: 100%;
      }

      ::v-deep .el-table__header {
        th {
          background-color: #f8f9fa !important;
          color: #495057;
          font-weight: 600;
          border-bottom: 2px solid #dee2e6;
        }
      }

      // 调整树形表格的展开按钮样式
      ::v-deep .el-table__expand-icon {
        margin-right: 8px;
        color: #909399;
        font-size: 12px;
      }

      .department-name-cell,
      .time-cell {
        display: flex;
        align-items: center;
        gap: 6px;

        i {
          color: #909399;
          font-size: 14px;
        }
      }

      .type-tag {
        font-size: 12px;
        font-weight: 500;

        i {
          margin-right: 4px;
        }
      }

      .operation-column {
        .operation-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 2px;
          justify-content: center;
        }

        .op-btn {
          padding: 4px 6px;
          border-radius: 4px;
          font-size: 12px;
          transition: all 0.18s ease;
          display: inline-flex;
          align-items: center;
          gap: 6px;

          /* 默认透明样式，hover 显示背景 */
          background: transparent;
          color: #606266;

          &:hover {
            transform: translateY(-1px);
          }

          /* 编辑（次要/灰色） */
          &.edit-btn {
            color: #606266;

            &:hover {
              background: rgba(144, 147, 153, 0.06);
              color: #909399;
            }
          }

          /* 删除（危险/红色） */
          &.delete-btn {
            color: #a61d24;

            &:hover {
              background: rgba(245, 108, 108, 0.08);
              color: #f56c6c;
            }
          }
        }
      }
    }

    .empty-state {
      ::v-deep .el-empty__image {
        width: 120px;
        height: 120px;
      }
    }
  }

  // 响应式布局
  @media (max-width: 768px) {
    .department-management-container {
      padding: 10px;
    }

    .query-section {
      padding: 16px;

      .query-form {
        .action-buttons {
          justify-content: center;
        }
      }
    }

    .main-content {
      .table-card {
        .department-table {
          ::v-deep .el-table__row {
            &:hover {
              transform: none;
            }
          }

          .operation-column {
            width: 150px;

            .operation-buttons {
              flex-direction: column;
              align-items: center;

              .op-btn {
                width: 100%;
                margin: 2px 0;
              }
            }
          }
        }
      }
    }
  }

  @media (max-width: 480px) {
    .department-table {
      ::v-deep .el-table {
        font-size: 12px;
      }

      .operation-column {
        .operation-buttons {
          .op-btn {
            padding: 1px 3px;
            font-size: 10px;
          }
        }
      }
    }
  }

  // 动画效果
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  .slide-enter-active,
  .slide-leave-active {
    transition: all 0.3s ease;
  }

  .slide-enter-from {
    transform: translateX(-100%);
    opacity: 0;
  }

  .slide-leave-to {
    transform: translateX(100%);
    opacity: 0;
  }
</style>
