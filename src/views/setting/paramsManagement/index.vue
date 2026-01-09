<template>
  <div class="params-management-container">
    <!-- 查询表单区域 -->
    <div class="query-section">
      <div class="query-form">
        <div class="action-buttons">
          <el-button
            v-permissions="['system_paramsManager_add']"
            class="action-btn add-btn"
            icon="el-icon-plus"
            type="primary"
            @click="handleEdit($event)"
          >
            新增参数
          </el-button>
          <el-button
            v-permissions="['system_paramsManager_delete']"
            class="action-btn delete-btn"
            icon="el-icon-delete"
            type="danger"
            @click="handleDelete($event)"
          >
            批量删除
          </el-button>
        </div>
        <div class="search-form">
          <el-form :inline="true" :model="queryForm" @submit.prevent>
            <el-form-item>
              <el-input
                v-model.trim="queryForm.name"
                class="search-input"
                clearable
                placeholder="请输入参数名称"
                prefix-icon="el-icon-search"
              />
            </el-form-item>
            <el-form-item>
              <el-input
                v-model.trim="queryForm.code"
                class="search-input"
                clearable
                placeholder="请输入参数代码"
                prefix-icon="el-icon-price-tag"
              />
            </el-form-item>
            <el-form-item>
              <el-button
                class="search-btn"
                icon="el-icon-search"
                type="primary"
                @click="queryData"
              >
                查询
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>

    <!-- 主内容区域 -->
    <div class="main-content">
      <el-card class="table-card" shadow="never">
        <template #header>
          <div class="table-header">
            <i class="el-icon-setting"></i>
            <span>参数管理</span>
            <div class="table-stats">
              <span class="total-count">共 {{ total }} 条记录</span>
            </div>
          </div>
        </template>
            <el-table
          v-loading="listLoading"
          border
          class="params-table"
          :data="list"
          stripe
          @selection-change="setSelectRows"
        >
          <el-table-column align="center" show-overflow-tooltip type="selection" />
          <el-table-column align="center" label="序号" width="80">
            <template #default="{ $index }">
              <span class="index-number">{{ ($index + 1) + (queryForm.pageNo - 1) * queryForm.pageSize }}</span>
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
        label="备注"
        prop="remark"
        show-overflow-tooltip
      />

          <el-table-column
            align="center"
            class="operation-column"
            label="操作"
            show-overflow-tooltip
            width="150"
          >
            <template #default="{ row }">
              <div class="operation-buttons">
                <el-button
                  v-permissions="['system_paramsManager_edit']"
                  class="op-btn edit-btn"
                  size="small"
                  type="text"
                  @click="handleEdit(row)"
                >
                  <i class="el-icon-edit"></i>
                  编辑
                </el-button>
                <el-button
                  v-permissions="['system_paramsManager_delete']"
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
        <!--  <el-image
          class="vab-data-empty"
          :src="require('@/assets/empty_images/data_empty.png')"
        /> -->
        <el-empty class="vab-data-empty" description="暂无数据" />
      </template>
        </el-table>
        </el-card>
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
    <edit ref="editRef" @fetch-data="fetchData" />
  </div>
</template>

<script>
  import { doDelete, getList } from '@/api/systemManage/paramsManagement.js'

  export default {
    name: 'DictionaryManagement',
    components: {
      Edit: () => import('./components/edit'),
    },
    data() {
      return {
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
          result: { configList, total },
        } = await getList(this.queryForm)
        this.list = configList
        this.total = total
        this.listLoading = false
      },
    },
  }
</script>

<style lang="scss" scoped>
  $base: '.params-management';

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
        justify-content: space-between;
        align-items: center;
        gap: 20px;
        flex-wrap: wrap;

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

            &.delete-btn {
              background: linear-gradient(45deg, #f56c6c, #f78989);
              border: none;
              color: white;

              &:hover {
                background: linear-gradient(45deg, #f78989, #f56c6c);
              }
            }
          }
        }

        .search-form {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;

          .search-input {
            width: 200px;

            ::v-deep .el-input__inner {
              border-radius: 20px;
              border: 2px solid #e9ecef;
              transition: all 0.3s ease;

              &:focus {
                border-color: #409eff;
                box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
              }
            }
          }

          .search-btn {
            border-radius: 20px;
            font-weight: 500;
            transition: all 0.3s ease;

            &:hover {
              transform: translateY(-1px);
              box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
            }
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

      .params-table {
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
        align-items: stretch;

        .action-buttons {
          justify-content: center;
          flex-wrap: wrap;
        }

        .search-form {
          justify-content: center;
          flex-wrap: wrap;

          .search-input {
            width: 180px;
          }
        }
      }
    }

    .main-content {
      .params-table {
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
    .params-table {
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
