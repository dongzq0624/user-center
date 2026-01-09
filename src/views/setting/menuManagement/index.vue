<template>
  <div class="menu-management-container">
    <!-- 查询表单区域 -->
    <div class="query-section">
      <div class="query-form">
        <div class="action-buttons">
          <el-button
            v-permissions="['system_menuManager_add']"
            class="action-btn add-btn"
            icon="el-icon-plus"
            type="primary"
            @click="handleEdit($event)"
          >
            新增菜单
          </el-button>
        </div>
      </div>
    </div>
    <!-- 主内容区域 -->
    <div class="main-content">
      <el-row :gutter="20">
        <el-col :lg="5" :md="8" :sm="24" :xl="4" :xs="24">
          <el-card
            :body-style="{ minHeight: '450px' }"
            class="tree-card"
            shadow="never"
          >
            <template #header>
              <div class="card-header">
                <i class="el-icon-share"></i>
                <span>应用列表</span>
              </div>
            </template>
            <application-tree @node-click="handleNodeClick" />
          </el-card>
        </el-col>
        <el-col :lg="19" :md="16" :sm="24" :xl="20" :xs="24">
          <el-card class="table-card" shadow="never">
            <template #header>
              <div class="table-header">
                <i class="el-icon-menu"></i>
                <span>菜单管理</span>
                <div class="table-stats">
                  <span class="total-count">共 {{ list.length }} 条记录</span>
                </div>
              </div>
            </template>
            <el-table
              v-loading="listLoading"
              border
              class="menu-table"
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
              <el-table-column
                class="type-column"
                label="类型"
                prop="type"
                show-overflow-tooltip
              >
                <template #default="{ row }">
                  <el-tag
                    v-if="row.type == MENU_TYPE.CATALOG.key"
                    type="success"
                  >
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

              <el-table-column
                class="operation-column"
                label="操作"
                show-overflow-tooltip
              >
                <template #default="{ row }">
                  <div class="operation-buttons">
                    <el-button
                      v-permissions="['system_menuManager_add']"
                      class="op-btn add-btn"
                      size="small"
                      type="text"
                      @click="handleEdit(row, 'add')"
                    >
                      <i class="el-icon-plus"></i>
                      新增
                    </el-button>
                    <el-button
                      v-permissions="['system_menuManager_edit']"
                      class="op-btn edit-btn"
                      size="small"
                      type="text"
                      @click="handleEdit(row, 'edit')"
                    >
                      <i class="el-icon-edit"></i>
                      编辑
                    </el-button>
                    <el-button
                      v-permissions="['system_menuManager_delete']"
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
                <div class="empty-state">
                  <!-- <el-image
                class="vab-data-empty"
                :src="require('@/assets/img/data_empty.png')"
              /> -->
                  <el-empty class="vab-data-empty" description="暂无数据" />
                </div>
              </template>
            </el-table>
          </el-card>
        </el-col>
      </el-row>
    </div>
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
  } from '@/api/application/menuManagement.js'
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
    padding: 20px;
    background-color: #f5f7fa;
    min-height: calc(100vh - 84px);

    // 查询表单区域
    .query-section {
      margin-bottom: 20px;
      padding: 20px;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

      .query-form {
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .action-buttons {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;

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
              color: white;

              &:hover {
                background: linear-gradient(45deg, #52c41a, #67c23a);
              }
            }
          }
        }
      }
    }

    // 主内容区域
    .main-content {
      .tree-card {
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

        ::v-deep .el-card__header {
          border-radius: 8px 8px 0 0;
          background: #fff;
          border-bottom: 1px solid #e4e7ed;
          padding: 16px 20px;

          .card-header {
            display: flex;
            align-items: center;
            gap: 8px;
            font-weight: 500;
            color: #303133;

            i {
              font-size: 16px;
              color: #409eff;
            }
          }
        }

        ::v-deep .el-card__body {
          padding: 20px;
        }
      }

      .table-card {
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

        ::v-deep .el-card__header {
          border-radius: 8px 8px 0 0;
          background: #fff;
          border-bottom: 1px solid #e4e7ed;

          .table-header {
            display: flex;
            align-items: center;
            gap: 8px;
            font-weight: 500;
            color: #303133;

            i {
              font-size: 16px;
              color: #409eff;
            }

            .table-stats {
              margin-left: auto;

              .total-count {
                font-size: 14px;
                opacity: 0.9;
                color: #909399;
              }
            }
          }
        }
      }

      .menu-table {
        ::v-deep .el-table {
          border-radius: 8px;
          overflow: hidden;

          &::before {
            display: none;
          }
        }

        ::v-deep .el-table__header {
          th {
            background-color: #f8f9fa !important;
            color: #495057;
            font-weight: 600;
            border-bottom: 2px solid #dee2e6;
            padding: 12px 8px;
          }
        }

        ::v-deep .el-table__row {
          transition: all 0.2s ease;

          &:hover {
            background-color: #f5f7fa;
          }
        }

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

          /* 新增（绿色） */
          &.add-btn {
            color: #67c23a;

            &:hover {
              background: rgba(103, 194, 58, 0.06);
              color: #67c23a;
            }
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

        ::v-deep .el-table__expand-icon {
          margin-right: 8px;
          color: #909399;
          font-size: 12px;
        }

        .type-column {
          .el-tag {
            border-radius: 12px;
            font-weight: 500;
            padding: 2px 8px;
          }
        }

        .operation-column {
          .el-button {
            padding: 4px 6px;
            border-radius: 4px;
            font-size: 12px;
            transition: all 0.18s ease;
            margin: 0 2px;

            &--text {
              &:hover {
                background-color: rgba(64, 158, 255, 0.1);
                color: #409eff;
              }
            }

            &.delete-btn {
              &:hover {
                background-color: rgba(245, 108, 108, 0.1);
                color: #f56c6c;
              }
            }
          }
        }

        .empty-state {
          ::v-deep .el-empty {
            padding: 40px 20px;

            .el-empty__image {
              width: 120px;
              height: 120px;
              margin-bottom: 16px;
            }

            .el-empty__description {
              margin-top: 0;
              color: #909399;
              font-size: 14px;
            }
          }
        }
      }
    }
  }

  // 响应式设计
  @media (max-width: 768px) {
    #{$base}-container {
      padding: 10px;
    }

    .query-section {
      padding: 16px;

      .query-form {
        flex-direction: column;
        gap: 16px;

        .action-buttons {
          justify-content: center;
        }
      }
    }

    .main-content {
      .el-row {
        .el-col {
          margin-bottom: 16px;

          &:last-child {
            margin-bottom: 0;
          }
        }
      }

      .tree-card {
        ::v-deep .el-card__body {
          min-height: 250px;
        }
      }

      .menu-table {
        ::v-deep .el-table {
          font-size: 12px;
        }

        ::v-deep .el-table__header th,
        ::v-deep .el-table__body td {
          padding: 8px 4px;
        }

        .operation-buttons {
          flex-direction: column;
          align-items: center;

          .op-btn {
            width: 100%;
            margin: 2px 0;
            justify-content: center;
          }
        }
      }
    }
  }

  @media (max-width: 480px) {
    .menu-table {
      ::v-deep .el-table {
        font-size: 12px;
      }

      .operation-buttons {
        .op-btn {
          padding: 3px 6px;
          font-size: 11px;
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
    transition: transform 0.3s ease, opacity 0.3s ease;
  }

  .slide-enter-from {
    transform: translateX(-20px);
    opacity: 0;
  }

  .slide-leave-to {
    transform: translateX(20px);
    opacity: 0;
  }
</style>
