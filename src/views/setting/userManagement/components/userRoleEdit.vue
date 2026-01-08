<template>
  <el-dialog
    :close-on-click-modal="false"
    :title="title"
    :visible="dialogFormVisible"
    width="1000px"
    class="user-role-edit-dialog"
    @close="close"
  >
    <div class="dialog-content">
      <!-- 操作按钮区域 -->
      <div class="action-section">
        <el-button
          icon="el-icon-plus"
          type="primary"
          class="add-role-btn"
          @click="roleOnAdd"
        >
          新增角色配置
        </el-button>
      </div>

      <!-- 角色表格 -->
      <div class="role-table-container">
        <el-table
          border
          :data="userRoles"
          stripe
          class="role-table"
          :header-cell-style="headerCellStyle"
          :row-style="rowStyle"
          :empty-text="'暂无角色配置'"
        >
          <el-table-column
            align="center"
            label="应用"
            min-width="200"
            class-name="application-column"
          >
            <template #default="{ row, $index }">
              <div class="application-cell">
                <i class="el-icon-s-grid app-icon"></i>
                <el-select
                  v-model="row.applicationId"
                  clearable
                  placeholder="请选择应用"
                  class="app-select"
                  filterable
                  @change="(e) => getRoleList(e, row)"
                  @clear="(e) => appOnClear(e, row)"
                >
                  <el-option
                    v-for="item in appList"
                    :key="item.applicationId"
                    :disabled="joinedApps.includes(item.applicationId)"
                    :label="item.applicationName"
                    :value="item.applicationId"
                  >
                    <div class="option-content">
                      <i class="el-icon-s-grid"></i>
                      <span>{{ item.applicationName }}</span>
                      <span
                        v-if="joinedApps.includes(item.applicationId)"
                        class="disabled-text"
                      >
                        (已选择)
                      </span>
                    </div>
                  </el-option>
                </el-select>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="角色"
            min-width="200"
            class-name="role-column"
          >
            <template #default="{ row }">
              <div class="role-cell">
                <i class="el-icon-user role-icon"></i>
                <el-select
                  v-model="row.roleId"
                  clearable
                  :no-data-text="'请先选择应用'"
                  placeholder="请选择角色"
                  class="role-select"
                  filterable
                >
                  <el-option
                    v-for="item in row.roleList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                    <div class="option-content">
                      <i class="el-icon-user"></i>
                      <span>{{ item.name }}</span>
                    </div>
                  </el-option>
                </el-select>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="操作"
            width="120"
            class-name="operation-column"
          >
            <template #default="{ $index }">
              <div class="operation-cell">
                <el-button
                  type="text"
                  size="small"
                  class="delete-btn"
                  @click="handleDelete($index)"
                >
                  <i class="el-icon-delete"></i>
                  删除
                </el-button>
              </div>
            </template>
          </el-table-column>

          <template #empty>
            <el-empty
              description="暂无角色配置"
              image="https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png"
            >
              <el-button type="primary" @click="roleOnAdd">
                新增角色配置
              </el-button>
            </el-empty>
          </template>
        </el-table>

        <!-- 统计信息 -->
        <div class="role-stats" v-if="userRoles.length > 0">
          <span class="stats-text">
            <i class="el-icon-info"></i>
            已配置 {{ userRoles.filter((item) => item.roleId).length }} 个角色
          </span>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="close" class="cancel-btn">
          <i class="el-icon-close"></i>
          取消
        </el-button>
        <el-button type="primary" class="confirm-btn" @click="save">
          <i class="el-icon-check"></i>
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
  import { userRoleList, addUserRole } from '@/api/systemManage/userManagement'
  import { getList } from '@/api/systemManage/roleManagement'
  import { getTree } from '@/api/systemManage/applicationManagement'
  export default {
    name: 'UserRoleEdit',
    data() {
      return {
        formRef: null,
        appList: [],
        userRoles: [],
        userId: '',
        title: '',
        isEdit: false,
        dialogFormVisible: false,
      }
    },
    computed: {
      joinedApps() {
        return this.userRoles.map((item) => item.applicationId)
      },
    },
    mounted() {
      this.getAppList()
    },
    methods: {
      handleDelete(index) {
        console.log(index)
        this.userRoles.splice(index, 1)
      },
      roleOnAdd() {
        this.userRoles.push({
          roleList: [],
        })
      },
      showEdit(row) {
        this.title = '设置人员角色'
        this.userRoles.push({})
        this.userId = row.id
        this.getUserRoles()
        this.dialogFormVisible = true
      },
      close() {
        this.userRoles = []
        this.dialogFormVisible = false
      },
      getAppList() {
        getTree({}).then((res) => {
          this.appList = res.result.appTreeList || []
        })
      },
      async save() {
        const params = {
          userId: this.userId,
          applicationUserRoles: this.userRoles
            .filter((item) => item.roleId)
            .map((item) => {
              let obj = {
                applicationId: item.applicationId,
                roleId: item.roleId,
              }
              if (item.id) obj.id = item.id
              return obj
            }),
        }
        const { message } = await addUserRole(params)
        this.$baseMessage(message, 'success', 'vab-hey-message-success')
        this.close()
        this.$emit('fetch-data')
      },
      appOnClear(e, row) {
        console.log(e, row)
        this.$set(row, 'roleId', null)
        this.$set(row, 'roleList', [])
      },
      getRoleList(appId, row) {
        console.log(appId, row)
        const params = {
          applicationId: appId,
          pageSize: 9999,
          pageNo: 1,
        }
        getList(params).then((res) => {
          this.$set(row, 'roleList', res.result.roleList)
        })
      },
      async getUserRoles() {
        const data = await userRoleList({ userId: this.userId })
        this.userRoles = data.result.userRoleList.map((item) => {
          this.getRoleList(item.applicationId, item)
          return item
        })
      },
      // 表格头部样式
      headerCellStyle() {
        return {
          backgroundColor: '#f8f9fa',
          color: '#495057',
          fontWeight: '600',
          borderBottom: '2px solid #dee2e6',
          textAlign: 'center',
        }
      },
      // 表格行样式
      rowStyle({ rowIndex }) {
        return {
          height: '60px',
        }
      },
    },
  }
</script>
<style lang="scss" scoped>
  .user-role-edit-dialog {
    ::v-deep .el-dialog {
      border-radius: 12px;
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
      overflow: hidden;

      .el-dialog__header {
        background: #ffffff;
        color: #303133;
        margin: 0;
        padding: 20px 24px;
        border-bottom: 1px solid #e4e7ed;

        .el-dialog__title {
          font-size: 18px;
          font-weight: 600;
          color: #303133;
        }

        .el-dialog__headerbtn {
          top: 16px;
          right: 20px;

          .el-dialog__close {
            color: #909399;
            font-size: 20px;

            &:hover {
              color: #303133;
            }
          }
        }
      }

      .el-dialog__body {
        padding: 24px;
        background: #f8f9fa;
      }

      .el-dialog__footer {
        padding: 16px 24px 24px;
        background: #f8f9fa;
        border-top: 1px solid #e9ecef;
      }
    }
  }

  .dialog-content {
    .action-section {
      margin-bottom: 20px;
      text-align: left;

      .add-role-btn {
        border-radius: 8px;
        font-weight: 500;
        background: linear-gradient(45deg, #67c23a, #52c41a);
        border: none;
        transition: all 0.3s ease;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(103, 194, 58, 0.3);
        }

        i {
          margin-right: 6px;
        }
      }
    }

    .role-table-container {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
      overflow: hidden;

      .role-table {
        ::v-deep .el-table__header {
          th {
            background-color: #f8f9fa !important;
            color: #495057;
            font-weight: 600;
            border-bottom: 2px solid #dee2e6;
          }
        }

        ::v-deep .el-table__row {
          transition: all 0.2s ease;

          &:hover {
            background-color: #f8f9ff;
            transform: scale(1.01);
          }
        }

        .application-column,
        .role-column {
          .application-cell,
          .role-cell {
            display: flex;
            align-items: center;
            gap: 8px;

            .app-icon,
            .role-icon {
              color: #909399;
              font-size: 16px;
              flex-shrink: 0;
            }

            .app-select,
            .role-select {
              flex: 1;

              ::v-deep .el-input__inner {
                border-radius: 6px;
                border: 2px solid #e4e7ed;
                transition: border-color 0.3s ease;

                &:focus {
                  border-color: #409eff;
                  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
                }
              }

              ::v-deep .el-select-dropdown {
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
              }
            }
          }
        }

        .operation-column {
          .operation-cell {
            .delete-btn {
              color: #f56c6c;
              font-weight: 500;
              transition: all 0.2s ease;

              &:hover {
                color: #f78989;
                background-color: rgba(245, 108, 108, 0.1);
                border-radius: 4px;
              }

              i {
                margin-right: 4px;
              }
            }
          }
        }
      }

      .role-stats {
        padding: 12px 20px;
        background: #f0f9ff;
        border-top: 1px solid #e6f7ff;
        text-align: center;

        .stats-text {
          color: #1890ff;
          font-weight: 500;

          i {
            margin-right: 6px;
          }
        }
      }
    }
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;

    .cancel-btn {
      border-radius: 6px;
      font-weight: 500;
      transition: all 0.3s ease;

      &:hover {
        background-color: #f5f5f5;
        border-color: #d9d9d9;
      }

      i {
        margin-right: 6px;
      }
    }

    .confirm-btn {
      border-radius: 6px;
      font-weight: 500;
      background: linear-gradient(45deg, #409eff, #66b1ff);
      border: none;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(64, 158, 255, 0.3);
      }

      i {
        margin-right: 6px;
      }
    }
  }

  // 选项样式
  .option-content {
    display: flex;
    align-items: center;
    gap: 8px;

    i {
      color: #909399;
      font-size: 14px;
    }

    .disabled-text {
      color: #c0c4cc;
      font-size: 12px;
    }
  }

  // 响应式设计
  @media (max-width: 768px) {
    .user-role-edit-dialog {
      ::v-deep .el-dialog {
        width: 95% !important;
        margin: 5vh auto !important;

        .el-dialog__body {
          padding: 16px;
        }

        .el-dialog__footer {
          padding: 12px 16px 16px;
        }
      }
    }

    .dialog-content {
      .role-table-container {
        .role-table {
          ::v-deep .el-table {
            font-size: 12px;
          }

          .application-column,
          .role-column {
            min-width: 150px;
          }

          .operation-column {
            width: 100px;
          }
        }
      }
    }

    .dialog-footer {
      flex-direction: column;

      .cancel-btn,
      .confirm-btn {
        width: 100%;
      }
    }
  }

  @media (max-width: 480px) {
    .dialog-content {
      .action-section {
        text-align: center;

        .add-role-btn {
          width: 100%;
        }
      }

      .role-table-container {
        .role-table {
          ::v-deep .el-table__row {
            &:hover {
              transform: none;
            }
          }
        }
      }
    }
  }

  // 动画效果
  @keyframes slideInUp {
    from {
      transform: translate3d(0, 30px, 0);
      opacity: 0;
    }
    to {
      transform: translate3d(0, 0, 0);
      opacity: 1;
    }
  }

  .user-role-edit-dialog {
    ::v-deep .el-dialog__body {
      animation: slideInUp 0.3s ease-out;
    }
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
