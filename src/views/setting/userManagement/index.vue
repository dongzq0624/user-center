<template>
  <div class="user-management-container">
    <!-- 查询表单 -->
    <div class="query-section">
      <el-form
        class="query-form"
        :inline="true"
        :model="queryForm"
        @submit.prevent
      >
        <el-form-item class="query-item" label="用户名">
          <el-input
            v-model.trim="queryForm.username"
            class="query-input"
            clearable
            placeholder="请输入用户名"
            prefix-icon="el-icon-user"
          />
        </el-form-item>

        <el-form-item class="query-item" label="手机号码">
          <el-input
            v-model.trim="queryForm.phoneNo"
            class="query-input"
            clearable
            placeholder="请输入手机号码"
            prefix-icon="el-icon-mobile-phone"
          />
        </el-form-item>

        <el-form-item class="query-item" label="状态">
          <el-select
            v-model="queryForm.status"
            class="query-select"
            placeholder="选择状态"
          >
            <el-option
              v-for="item in statusList"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </el-form-item>

        <el-form-item class="query-item">
          <el-button
            class="query-btn"
            icon="el-icon-search"
            type="primary"
            @click="fetchData"
          >
            查询
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 顶部操作栏 -->
    <div class="action-header">
      <div class="action-buttons">
        <el-button
          v-permissions="['system_userManager_add']"
          class="action-btn add-btn"
          icon="el-icon-plus"
          type="primary"
          @click="handleEdit($event)"
        >
          新增用户
        </el-button>
        <el-button
          v-permissions="['system_userManager_delete']"
          class="action-btn delete-btn"
          icon="el-icon-delete"
          type="danger"
          @click="handleDelete($event)"
        >
          批量删除
        </el-button>
      </div>
    </div>
    <!-- 主内容区域 -->
    <div class="main-content">
      <!-- 部门树侧边栏 -->
      <div class="tree-sidebar">
        <el-card
          :body-style="{ padding: '16px' }"
          class="tree-card"
          shadow="hover"
        >
          <template #header>
            <div class="tree-header">
              <i class="el-icon-office-building"></i>
              <span>组织架构</span>
            </div>
          </template>
          <div class="tree-container">
            <depart-lazy-tree
              ref="selectTree"
              :handle-node-click="handleNodeClick"
              :selected-root="true"
            />
          </div>
        </el-card>
      </div>

      <!-- 用户列表主体 -->
      <div class="table-container">
        <el-card class="table-card" shadow="never">
          <template #header>
            <div class="table-header">
              <i class="el-icon-user"></i>
              <span>用户列表</span>
              <div class="table-stats">
                <span class="total-count">共 {{ total }} 条记录</span>
              </div>
            </div>
          </template>

          <el-table
            v-loading="listLoading"
            border
            class="user-table"
            :data="list"
            :header-cell-style="headerCellStyle"
            row-key="id"
            :row-style="rowStyle"
            stripe
            @selection-change="setSelectRows"
          >
            <el-table-column
              align="center"
              show-overflow-tooltip
              type="selection"
              width="50"
            />
            <el-table-column
              align="center"
              class-name="index-column"
              label="序号"
              width="60"
            >
              <template #default="{ $index }">
                <span class="index-number">{{ $index + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="用户名"
              prop="username"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <div class="username-cell">
                  <i class="el-icon-user"></i>
                  <span>{{ row.username }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="性别"
              show-overflow-tooltip
              width="80"
            >
              <template #default="{ row }">
                <el-tag
                  class="gender-tag"
                  size="small"
                  :type="getGenderTagType(row.gender)"
                >
                  <i :class="getGenderIcon(row.gender)"></i>
                  {{ getGenderText(row.gender) }}
                </el-tag>
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              label="手机号码"
              prop="phoneNo"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <div class="phone-cell">
                  <i class="el-icon-mobile-phone"></i>
                  <span>{{ row.phoneNo || '-' }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="邮箱"
              prop="mail"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <div class="email-cell">
                  <i class="el-icon-message"></i>
                  <span>{{ row.mail || '-' }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="所属机构"
              prop="organizationName"
              show-overflow-tooltip
            />

            <el-table-column
              align="center"
              label="状态"
              show-overflow-tooltip
              width="100"
            >
              <template #default="{ row }">
                <el-tag
                  class="status-tag"
                  size="small"
                  :type="
                    row.status == USER_STATUS.ON.key ? 'success' : 'danger'
                  "
                >
                  <i
                    :class="
                      row.status == USER_STATUS.ON.key
                        ? 'el-icon-check'
                        : 'el-icon-close'
                    "
                  ></i>
                  {{
                    row.status == USER_STATUS.ON.key
                      ? USER_STATUS.ON.value
                      : USER_STATUS.OFF.value
                  }}
                </el-tag>
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              class-name="operation-column"
              label="操作"
              width="300"
            >
              <template #default="{ row }">
                <div class="operation-buttons">
                  <el-button
                    v-if="row.status === USER_STATUS.ON.key"
                    v-permissions="['system_userManager_edit']"
                    class="op-btn freeze-btn"
                    size="small"
                    type="text"
                    @click="frozenOnClick(row)"
                  >
                    <i class="el-icon-lock"></i>
                    冻结
                  </el-button>
                  <el-button
                    v-if="row.status === USER_STATUS.OFF.key"
                    v-permissions="['system_userManager_edit']"
                    class="op-btn activate-btn"
                    size="small"
                    type="text"
                    @click="freeOnClick(row)"
                  >
                    <i class="el-icon-unlock"></i>
                    解冻
                  </el-button>
                  <el-button
                    v-permissions="['system_userManager_edit']"
                    class="op-btn role-btn"
                    size="small"
                    type="text"
                    @click="roleEditOnClick(row)"
                  >
                    <i class="el-icon-setting"></i>
                    角色
                  </el-button>
                  <el-button
                    v-permissions="['system_userManager_edit']"
                    class="op-btn edit-btn"
                    size="small"
                    type="text"
                    @click="handleEdit(row)"
                  >
                    <i class="el-icon-edit"></i>
                    编辑
                  </el-button>
                  <el-button
                    v-permissions="['system_userManager_delete']"
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
                description="暂无用户数据"
                image="https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png"
              >
                <el-button type="primary" @click="handleEdit()">
                  新增用户
                </el-button>
              </el-empty>
            </template>
          </el-table>

          <!-- 分页组件 -->
          <div v-if="total > 0" class="pagination-wrapper">
            <el-pagination
              background
              class="custom-pagination"
              :current-page="queryForm.pageNo"
              :layout="layout"
              :page-size="queryForm.pageSize"
              :page-sizes="[10, 20, 50, 100]"
              :total="total"
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
            />
          </div>
        </el-card>
      </div>
    </div>
    <edit
      ref="editRef"
      @fetch-data="fetchData"
      @onPhoneNoChange="onPhoneNoChange"
    />
    <role-edit ref="roleEditRef" @fetch-data="fetchData" />
    <sort-list-drawer
      ref="sortListRef"
      :columns="sortColumns"
      list-name="userList"
      :method="getSortListMethod"
      :params="{ organizationId: queryForm.organizationId }"
      :trans-data="transData"
      @onSave="onSortSave"
    />

    <merge-tip
      ref="mergeTip"
      :old-user-info="oldUserInfo"
      type="department"
      @ok="onMerge"
    />
  </div>
</template>

<script>
  import {
    doDelete,
    getList,
    userDetail,
    activationUser,
    freezeUser,
    dragSort,
  } from '@/api/common/userManagement'
  import {
    USER_STATUS,
    USER_GENDER,
    LEVEL_STATUS,
    toList,
  } from '@/constant/Enums.js'

  export default {
    name: 'UserManagement',
    components: {
      Edit: () => import('./components/UserManagementEdit'),
      RoleEdit: () => import('./components/userRoleEdit'),
      MergeTip: () => import('./components/mergeTip'),
      SortListDrawer: () => import('@/components/sortListDrawer'),
      DepartLazyTree: () => import('@/components/departLazyTree'),
    },
    data() {
      return {
        USER_STATUS,
        USER_GENDER,
        statusList: toList(USER_STATUS),
        levelStatusList: toList(LEVEL_STATUS),
        editRef: null,
        list: [],
        listLoading: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        showSortBtn: false, //展示调整排序按钮
        selectRows: '',
        queryForm: {
          pageNo: 1,
          pageSize: 10,
          username: '',
          phoneNo: '',
          status: USER_STATUS.ON.key,
          isThisLevel: LEVEL_STATUS.YES.key,
        },
        roleList: [],

        getSortListMethod: getList,
        sortColumns: [
          { prop: 'username', label: '姓名', width: '200' },
          { prop: 'gender', label: '性别', width: '60' },
          { prop: 'phoneNo', label: '手机号', width: '200' },
          { prop: 'organizationName', label: '所属机构' },
        ],
        oldUserInfo: {},
      }
    },
    mounted() {
      this.queryData()
    },
    methods: {
      transData(dataList) {
        dataList.forEach((data) => {
          if (data.gender == this.USER_GENDER.MALE.key) {
            data.gender = this.USER_GENDER.MALE.value
          } else if (data.gender == this.USER_GENDER.FEMALE.key) {
            data.gender = this.USER_GENDER.FEMALE.value
          } else if (data.gender == this.USER_GENDER.UNKNOWN.key) {
            data.gender = this.USER_GENDER.UNKNOWN.value
          }
        })
        return dataList
      },
      onSortSave(dataList) {
        let userOrderList = dataList.map((data) => {
          return {
            index: data.index,
            userId: data.id,
          }
        })
        let params = {
          type: 'user',
          userOrderList,
        }
        dragSort(params)
          .then(() => {
            this.$message.success('保存成功')
            this.$refs.sortListRef.hide()
            this.fetchData()
          })
          .catch(() => {
            this.$refs.sortListRef.hideLoading()
          })
      },
      roleEditOnClick(row) {
        this.$refs.roleEditRef.showEdit(row)
      },
      frozenOnClick(row) {
        this.$baseConfirm('你确定要冻结当用户吗', null, () => {
          freezeUser({ userId: row.id }).then((res) => {
            this.$baseMessage(res.message, 'success', 'vab-hey-message-success')
            this.fetchData()
          })
        })
      },
      freeOnClick(row) {
        this.$baseConfirm('你确定要激活当前用户吗', null, () => {
          activationUser({ userId: row.id }).then((res) => {
            this.$baseMessage(res.message, 'success', 'vab-hey-message-success')
            this.fetchData()
          })
        })
      },
      onPhoneNoChange(value) {
        if (value != this.oldUserInfo.phoneNo) {
          this.$refs.mergeTip.check(value)
        }
      },
      cleardepartForm() {
        this.$set(this.queryForm, 'organizationName', '')
        this.$set(this.queryForm, 'organizationId', '')
      },
      handleNodeClick(node) {
        this.$set(this.queryForm, 'organizationId', node.id)
        this.$set(this.queryForm, 'parentName', node.name)
        this.showSortBtn = node.leaf
        this.fetchData()
      },
      setSelectRows(val) {
        this.selectRows = val
      },
      handleEdit(row) {
        if (row.id) {
          this.getUserDetail(row.id)
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
        this.queryForm.pageNo = val
        this.fetchData()
      },
      queryData() {
        this.queryForm.pageNo = 1
      },
      onMerge() {
        this.$refs.editRef.close()
        this.fetchData()
      },
      async fetchData() {
        this.listLoading = true
        let {
          result: { userList, total },
        } = await getList(this.queryForm)

        this.list = userList
        this.total = total
        this.listLoading = false
      },
      async getUserDetail(id) {
        const data = await userDetail({ id })
        let form = data.result
        this.oldUserInfo = { ...data.result }
        form.id = id
        form.parentName = form.organizationName
        this.$refs.editRef.showEdit(form)
      },
      // 获取性别文本
      getGenderText(gender) {
        if (gender == this.USER_GENDER.MALE.key)
          return this.USER_GENDER.MALE.value
        if (gender == this.USER_GENDER.FEMALE.key)
          return this.USER_GENDER.FEMALE.value
        return this.USER_GENDER.UNKNOWN.value
      },
      // 获取性别图标
      getGenderIcon(gender) {
        if (gender == this.USER_GENDER.MALE.key) return 'el-icon-male'
        if (gender == this.USER_GENDER.FEMALE.key) return 'el-icon-female'
        return 'el-icon-question'
      },
      // 获取性别标签类型
      getGenderTagType(gender) {
        if (gender == this.USER_GENDER.MALE.key) return 'primary'
        if (gender == this.USER_GENDER.FEMALE.key) return 'danger'
        return ''
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
  .user-management-container {
    padding: 20px;
    background-color: #f5f7fa;
    min-height: calc(100vh - 84px);
  }

  // 顶部操作栏
  .action-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

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

      &.sort-btn {
        background: linear-gradient(45deg, #e6a23c, #ebb563);
        border: none;
      }
    }

    .mobile-tree-toggle {
      color: #fff;
      font-weight: 500;

      &:hover {
        color: #e6e6e6;
      }
    }
  }

  // 查询表单区域
  .query-section {
    margin-bottom: 20px;
    padding: 20px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

    .query-form {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      align-items: center;
    }

    .query-item {
      margin-bottom: 0;
    }

    .query-input {
      width: 200px;

      ::v-deep .el-input__inner {
        border-radius: 6px;
        border: 2px solid #e4e7ed;
        transition: border-color 0.3s ease;

        &:focus {
          border-color: #409eff;
          box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
        }
      }
    }

    .query-select {
      width: 120px;

      ::v-deep .el-input__inner {
        border-radius: 6px;
      }
    }

    .query-btn {
      border-radius: 20px;
      font-weight: 500;
      background: linear-gradient(45deg, #409eff, #66b1ff);
      border: none;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(64, 158, 255, 0.3);
      }
    }
  }

  // 主内容区域
  .main-content {
    display: flex;
    gap: 20px;
    min-height: 600px;

    .tree-sidebar {
      width: 320px;
      transition: all 0.3s ease;

      &.tree-collapsed {
        width: 0;
        overflow: hidden;
        margin-right: 0;
      }

      .tree-card {
        height: 100%;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

        ::v-deep .el-card__header {
          border-radius: 8px 8px 0 0;

          .tree-header {
            display: flex;
            align-items: center;
            gap: 8px;
            font-weight: 500;
          }
        }
      }

      .tree-container {
        max-height: 500px;
        overflow-y: auto;

        &::-webkit-scrollbar {
          width: 6px;
        }

        &::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }

        &::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 3px;

          &:hover {
            background: #a8a8a8;
          }
        }
      }
    }

    .table-container {
      flex: 1;
      min-width: 0;

      .table-card {
        height: 100%;
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

      .user-table {
        ::v-deep .el-table__header {
          th {
            background-color: #f8f9fa !important;
            color: #495057;
            font-weight: 600;
            border-bottom: 2px solid #dee2e6;
          }
        }

        .index-column {
          .index-number {
            display: inline-block;
            width: 24px;
            height: 24px;
            line-height: 24px;
            text-align: center;
            background: linear-gradient(45deg, #409eff, #66b1ff);
            color: white;
            border-radius: 50%;
            font-size: 12px;
            font-weight: 500;
          }
        }

        .username-cell,
        .phone-cell,
        .email-cell {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;

          i {
            color: #909399;
            font-size: 14px;
          }
        }

        .gender-tag {
          font-size: 12px;
          width: 60px;
          display: flex;
          align-items: center;
          justify-content: center;

          i {
            margin-right: 4px;
          }
        }

        .status-tag {
          font-size: 12px;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: center;

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
            align-items: center;
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

            /* 冻结（警示/橙色） */
            &.freeze-btn {
              color: #c46a00;
            }
            &.freeze-btn:hover {
              background: rgba(230, 162, 60, 0.08);
              color: #e6a23c;
            }

            /* 激活（成功/绿色） */
            &.activate-btn {
              color: #237804;
            }
            &.activate-btn:hover {
              background: rgba(103, 194, 58, 0.08);
              color: #67c23a;
            }

            /* 角色（信息/蓝色） */
            &.role-btn {
              color: #096dd9;
            }
            &.role-btn:hover {
              background: rgba(64, 158, 255, 0.08);
              color: #409eff;
            }

            /* 编辑（次要/灰色） */
            &.edit-btn {
              color: #606266;
            }
            &.edit-btn:hover {
              background: rgba(144, 147, 153, 0.06);
              color: #909399;
            }

            /* 删除（危险/红色） */
            &.delete-btn {
              color: #a61d24;
            }
            &.delete-btn:hover {
              background: rgba(245, 108, 108, 0.08);
              color: #f56c6c;
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

      .pagination-wrapper {
        margin-top: 20px;
        display: flex;
        justify-content: center;

        .custom-pagination {
          ::v-deep .el-pagination__total {
            color: #606266;
            font-weight: 500;
          }

          ::v-deep .el-pagination__jump {
            margin-left: 16px;
          }
        }
      }
    }
  }

  // 响应式布局
  @media (max-width: 768px) {
    .user-management-container {
      padding: 10px;
    }

    .action-header {
      flex-direction: column;
      gap: 12px;
      text-align: center;

      .action-buttons {
        justify-content: center;
      }

      .mobile-tree-toggle {
        order: -1;
      }
    }

    .query-section {
      padding: 16px;

      .query-form {
        flex-direction: column;
        align-items: stretch;

        .query-item {
          width: 100%;

          .query-input,
          .query-select {
            width: 100%;
          }
        }

        .query-btn {
          align-self: center;
          width: 120px;
        }
      }
    }

    .main-content {
      flex-direction: column;

      .tree-sidebar {
        width: 100%;
        margin-bottom: 20px;

        &.tree-collapsed {
          width: 100%;
          height: 0;
          margin-bottom: 0;
        }

        .tree-card {
          min-height: 200px;
        }
      }

      .table-container {
        .table-card {
          .user-table {
            ::v-deep .el-table__row {
              &:hover {
                transform: none;
              }
            }

            .operation-column {
              width: 200px;

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
  }

  @media (max-width: 480px) {
    .user-table {
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
