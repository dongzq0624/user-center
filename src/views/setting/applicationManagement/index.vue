<template>
  <div class="application-management-container">
    <!-- 查询表单 -->
    <div class="query-section">
      <div class="query-form">
        <div class="action-buttons">
          <el-button
            v-permissions="['system_applicationManager_add']"
            class="action-btn add-btn"
            icon="el-icon-plus"
            type="primary"
            @click="handleEdit($event)"
          >
            新增应用
          </el-button>
          <el-button
            v-permissions="['system_applicationManager_delete']"
            class="action-btn delete-btn"
            icon="el-icon-delete"
            type="danger"
            @click="handleDelete($event)"
          >
            批量删除
          </el-button>
        </div>
        <div class="search-form">
          <el-form :inline="true" :model="searchParams" @submit.prevent>
            <el-form-item class="search-item">
              <el-input
                v-model.trim="searchParams.applicationName"
                class="search-input"
                clearable
                placeholder="请输入应用名称"
                prefix-icon="el-icon-search"
              />
            </el-form-item>
            <el-form-item>
              <el-button
                class="search-btn"
                icon="el-icon-search"
                type="primary"
                @click="queryList"
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
            <i class="el-icon-s-grid"></i>
            <span>应用管理</span>
            <div class="table-stats">
              <span class="total-count">共 {{ total }} 条记录</span>
            </div>
          </div>
        </template>

        <xc-base-table
          ref="basicTable"
          class="application-table"
          :async-func="fetchListFunc"
          list-name="applicatioinList"
          :search-params="searchParams"
          :table-columns="tableColumns"
        >
          <template slot="index" slot-scope="{ row, index }">
            <span class="index-number">{{ index + 1 }}</span>
          </template>

          <template slot="appSecret" slot-scope="{ row }">
            <el-button
              class="secret-btn"
              type="text"
              @click="showSecretKey(row)"
            >
              <i class="el-icon-view"></i>
              查看密钥
            </el-button>
          </template>

          <template slot="operation" slot-scope="{ row }">
            <div class="operation-buttons">
              <el-button
                v-permissions="['system_applicationManager_edit']"
                class="op-btn edit-btn"
                size="small"
                type="text"
                @click="handleEdit(row)"
              >
                <i class="el-icon-edit"></i>
                编辑
              </el-button>
              <el-button
                v-permissions="['system_applicationManager_delete']"
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
        </xc-base-table>
      </el-card>
    </div>

    <!-- 自定义应用编辑弹窗 -->
    <el-dialog
      :close-on-click-modal="false"
      :title="dialogTitle"
      :visible="dialogVisible"
      width="700px"
      class="application-edit-dialog"
      @close="handleDialogClose"
    >
      <div class="dialog-content">
        <el-form
          ref="formRef"
          label-width="120px"
          :model="formData"
          :rules="formRules"
          class="application-form"
        >
          <!-- 基本信息区域 -->
          <div class="form-section">
            <div class="section-header">
              <i class="el-icon-s-grid"></i>
              <span>基本信息</span>
            </div>

            <div class="form-content">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item
                    label="应用名称"
                    prop="applicationName"
                    class="form-item"
                  >
                    <el-input
                      v-model="formData.applicationName"
                      placeholder="请输入应用名称"
                      clearable
                      prefix-icon="el-icon-document-copy"
                    />
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="应用编码" prop="appId" class="form-item">
                    <el-input
                      v-model="formData.appId"
                      placeholder="请输入应用编码"
                      clearable
                      prefix-icon="el-icon-price-tag"
                      :disabled="isEdit"
                    />
                  </el-form-item>
                </el-col>

                <el-col :span="24">
                  <el-form-item
                    label="应用IP"
                    prop="accessIps"
                    class="form-item"
                  >
                    <el-input
                      v-model="formData.accessIps"
                      placeholder="如有多个IP，则多个IP以分号（英文分号）隔开"
                      clearable
                      prefix-icon="el-icon-s-home"
                    />
                  </el-form-item>
                </el-col>

                <el-col :span="24">
                  <el-form-item
                    label="有效时间"
                    prop="dateRange"
                    class="form-item"
                  >
                    <el-date-picker
                      v-model="formData.dateRange"
                      type="daterange"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      value-format="yyyy-MM-dd"
                      style="width: 100%"
                    />
                  </el-form-item>
                </el-col>

                <el-col :span="24">
                  <el-form-item
                    label="关联区域"
                    prop="organs"
                    class="form-item"
                  >
                    <TreeSelect
                      v-model="formData.organs"
                      :clearable="true"
                      :limit="5"
                      :multiple="true"
                      :options="organTreeData"
                      placeholder="请选择关联区域"
                      value-consists-of="ALL_WITH_INDETERMINATE"
                      class="tree-select"
                    />
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="状态" prop="status" class="form-item">
                    <el-radio-group v-model="formData.status">
                      <el-radio
                        v-for="item in statusOptions"
                        :key="item.key"
                        :label="item.key"
                      >
                        {{ item.value }}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>

                <el-col :span="24">
                  <el-form-item
                    label="备注"
                    prop="description"
                    class="form-item"
                  >
                    <el-input
                      v-model="formData.description"
                      type="textarea"
                      :rows="3"
                      placeholder="请输入备注信息（可选）"
                      clearable
                      maxlength="500"
                      show-word-limit
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-form>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button class="cancel-btn" @click="handleDialogClose">
            <i class="el-icon-close"></i>
            取消
          </el-button>
          <el-button
            :loading="submitLoading"
            type="primary"
            class="confirm-btn"
            @click="handleSubmit"
          >
            <i class="el-icon-check"></i>
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 保留原有的xc-base-form-dialog作为备用 -->
    <xc-base-form-dialog
      ref="editRef"
      :add-func="addFunc"
      :detail-func="detailFunc"
      :handle-detail-data="handleDetailData"
      :handle-submit-data="handleSubmitData"
      :handle-query-detail-params="handleQueryDetailParams"
      :options="formOptions"
      :show-title-prefix="true"
      title="应用"
      width="600px"
      @ok="onFormSuccess"
      style="display: none"
    >
      <template slot="fileList" slot-scope="{ data }">
        <upload-view v-model="data.fileList" :limit="1" />
      </template>
      <template slot="organs" slot-scope="{ data }">
        <TreeSelect
          v-model="data.organs"
          :clearable="true"
          :limit="5"
          :multiple="true"
          :options="organTreeData"
          placeholder="请选择"
          value-consists-of="ALL_WITH_INDETERMINATE"
        />
      </template>
    </xc-base-form-dialog>
  </div>
</template>

<script>
  import {
    doEdit,
    doDelete,
    getList,
    getDetail,
  } from '@/api/systemManage/applicationManagement'
  import { dictListByCode } from '@/api/systemManage/dictionaryManagement'
  import { organTree } from '@/api/systemManage/departmentManagement'

  import { findByKey, toList, APP_STATUS, YES_OR_NO } from '@/constant/Enums'

  export default {
    name: 'ApplicationManagement',
    components: {
      UploadView: () => import('@/components/upload-view'),
    },
    data() {
      return {
        // 自定义弹窗相关
        dialogVisible: false,
        dialogTitle: '新增应用',
        isEdit: false,
        currentEditId: null,
        submitLoading: false,
        formData: {
          applicationName: '',
          appId: '',
          accessIps: '',
          dateRange: [],
          organs: [],
          status: APP_STATUS.AVAILABLE.key,
          description: '',
        },
        formRules: {
          applicationName: [
            { required: true, message: '请输入应用名称', trigger: 'blur' },
          ],
          appId: [
            { required: true, message: '请输入应用编码', trigger: 'blur' },
          ],
          accessIps: [
            { required: true, message: '请输入应用IP', trigger: 'blur' },
          ],
          dateRange: [
            { required: true, message: '请选择有效时间', trigger: 'change' },
          ],
          status: [
            { required: true, message: '请选择状态', trigger: 'change' },
          ],
        },
        statusOptions: toList(APP_STATUS),

        searchParams: {},
        tableColumns: [
          { type: 'selection', width: 60 },
          { key: 'index', title: '序号', type: 'slot', width: 80 },
          { key: 'applicationName', title: '应用名称', minWidth: 200 },
          { key: 'appId', title: '应用编码', minWidth: 200 },
          { key: 'appSecret', title: '应用密钥', type: 'slot', minWidth: 120 },
          { key: 'redirectUrl', title: '业务跳转地址', minWidth: 250 },
          { key: 'operation', title: '操作', type: 'slot', width: 180 },
        ],
        fetchListFunc: getList,

        formOptions: [
          { key: 'applicationName', label: '应用名称', required: true },
          {
            key: 'accessIps',
            label: '应用ip',
            placeholder: '如有多个ip，则多个ip以分号（英文分号）隔开',
            required: true,
          },
          {
            key: 'startTime',
            key2: 'endTime',
            label: '有效时间',
            type: 'daterange',
            required: true,
            span: 24,
          },
          { key: 'organs', label: '关联区域', type: 'slot', span: 24 },
          {
            key: 'status',
            label: '状态',
            type: 'radio',
            optionList: toList(APP_STATUS),
            defaultValue: APP_STATUS.AVAILABLE.key,
            span: 12,
          },

          { key: 'description', label: '备注', type: 'textarea', span: 24 },
        ],
        addFunc: doEdit, //新增请求方法
        detailFunc: getDetail, //详情请求方法

        organTreeData: [],
        total: 0,
      }
    },
    mounted() {
      this.queryList()
      //      this.asyncGetDictList()
      this.asyncGetOrganList()
      this.updateTotal()
    },
    methods: {
      //请求列表
      queryList() {
        this.$refs.basicTable.fetchData()
        // 同时获取总数
        this.updateTotal()
      },
      // 更新总数
      async updateTotal() {
        try {
          const params = {
            pageNo: 1,
            pageSize: 1, // 只获取第一页，目的是获取总数
            ...this.searchParams,
          }
          const { result } = await getList(params)
          this.total = result?.total || 0
        } catch (error) {
          console.error('获取总数失败:', error)
          this.total = 0
        }
      },
      //搜索回调
      onSearch(searchParams) {
        this.searchParams = searchParams
        this.queryList()
      },
      // 表单操作成功回调
      onFormSuccess() {
        this.queryList()
        this.updateTotal()
      },
      showSecretKey(row) {
        this.$alert(row.appSecret, '应用密钥', {
          confirmButtonText: '确定',
        })
      },
      // 自定义弹窗方法
      handleEdit(row) {
        if (row) {
          // 编辑模式
          this.dialogTitle = '编辑应用'
          this.isEdit = true
          this.currentEditId = row.applicationId
          this.loadApplicationDetail(row.applicationId)
        } else {
          // 新增模式
          this.dialogTitle = '新增应用'
          this.isEdit = false
          this.currentEditId = null
          this.resetForm()
        }
        this.dialogVisible = true
      },

      // 加载应用详情
      async loadApplicationDetail(applicationId) {
        try {
          const { result } = await getDetail({ applicationId })
          const data = result

          this.formData = {
            applicationName: data.applicationName || '',
            appId: data.appId || '',
            accessIps: data.accessIps || '',
            dateRange:
              data.startTime && data.endTime
                ? [data.startTime, data.endTime]
                : [],
            organs: data.organList
              ? data.organList.map((item) => item.organId)
              : [],
            status: data.status || APP_STATUS.AVAILABLE.key,
            description: data.description || '',
          }
        } catch (error) {
          this.$message.error('加载应用详情失败')
          console.error('加载应用详情失败:', error)
        }
      },

      // 重置表单
      resetForm() {
        this.formData = {
          applicationName: '',
          appId: '',
          accessIps: '',
          dateRange: [],
          organs: [],
          status: APP_STATUS.AVAILABLE.key,
          description: '',
        }
        this.$nextTick(() => {
          this.$refs.formRef && this.$refs.formRef.clearValidate()
        })
      },

      // 关闭弹窗
      handleDialogClose() {
        this.dialogVisible = false
        this.resetForm()
      },

      // 提交表单
      async handleSubmit() {
        try {
          await this.$refs.formRef.validate()

          this.submitLoading = true

          // 转换数据格式
          const submitData = {
            applicationName: this.formData.applicationName,
            appId: this.formData.appId,
            accessIps: this.formData.accessIps,
            startTime:
              this.formData.dateRange && this.formData.dateRange[0]
                ? this.formData.dateRange[0]
                : null,
            endTime:
              this.formData.dateRange && this.formData.dateRange[1]
                ? this.formData.dateRange[1]
                : null,
            status: this.formData.status,
            description: this.formData.description,
          }

          // 处理关联区域
          if (this.formData.organs && this.formData.organs.length > 0) {
            submitData.organList = this.formData.organs.map((organId) => ({
              organId,
            }))
          }

          // 如果是编辑模式，添加ID
          if (this.isEdit && this.currentEditId) {
            submitData.id = this.currentEditId
          }

          await doEdit(submitData)

          this.$message.success(`${this.isEdit ? '编辑' : '新增'}应用成功`)
          this.handleDialogClose()
          this.queryList()
          this.updateTotal()
        } catch (error) {
          if (error !== 'validation_failed') {
            this.$message.error(`${this.isEdit ? '编辑' : '新增'}应用失败`)
            console.error('提交失败:', error)
          }
        } finally {
          this.submitLoading = false
        }
      },

      // 原有方法（保持兼容性）
      handleEditOld(row) {
        if (row) {
          this.$refs.editRef.show(row.applicationId)
        } else {
          this.$refs.editRef.show()
        }
      },
      handleSubmitData(dataInfo) {
        if (dataInfo.fileList) {
          dataInfo.icon =
            dataInfo.fileList.length > 0 ? dataInfo.fileList[0].url : ''
        }
        if (dataInfo.organs) {
          let organList = dataInfo.organs.map((organId) => {
            return {
              organId,
            }
          })
          dataInfo.organList = organList
        }
      },
      handleQueryDetailParams(dataInfo) {
        dataInfo.applicationId = dataInfo.id
      },
      handleDetailData(dataInfo) {
        let fileList = dataInfo.icon ? [{ url: dataInfo.icon }] : []
        this.$set(dataInfo, 'fileList', fileList)

        dataInfo.organs = dataInfo.organList.map((data) => data.organId)
      },
      handleDelete(row) {
        if (row.applicationId) {
          this.$baseConfirm('你确定要删除当前项吗', null, async () => {
            const { message } = await doDelete({ ids: row.applicationId })
            this.$baseMessage(message, 'success', 'vab-hey-message-success')
            await this.queryList()
            this.updateTotal()
          })
        } else {
          let selectRows = this.$refs.basicTable.getSelection()
          if (selectRows.length > 0) {
            const ids = selectRows.map((item) => item.applicationId).join(',')
            this.$baseConfirm('你确定要删除选中项吗', null, async () => {
              const { message } = await doDelete({ ids })
              this.$baseMessage(message, 'success', 'vab-hey-message-success')
              await this.queryList()
              this.updateTotal()
            })
          } else {
            this.$baseMessage('未选中任何行', 'error', 'vab-hey-message-error')
          }
        }
      },
      assembleTreeNode: function (dataList) {
        dataList.forEach((data) => {
          data.label = data.name
          if (data.children && data.children.length > 0) {
            this.assembleTreeNode(data.children)
          } else {
            delete data.children
          }
        })
      },
      asyncGetDictList() {
        let params = {
          code: 'application_type',
        }
        dictListByCode(params).then((resp) => {
          let list = resp.result.dictList ? resp.result.dictList : []
          this.$refs.editRef.refreshOptions(
            this.formOptions,
            'type',
            'optionList',
            list
          )
        })
      },
      asyncGetOrganList() {
        let params = {
          type: 'unit',
        }
        organTree(params).then((resp) => {
          let organTreeList = resp.result.organTreeList
            ? resp.result.organTreeList
            : []
          this.assembleTreeNode(organTreeList)
          this.organTreeData = organTreeList
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
  .application-management-container {
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
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;

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

      .search-form {
        .search-item {
          margin-bottom: 0;
        }
        ::v-deep .el-form-item {
          margin-bottom: 0;
        }

        .search-input {
          width: 250px;

          ::v-deep .el-input__inner {
            border-radius: 6px;
            border: 2px solid #e4e7ed;
            transition: border-color 0.3s ease;

            &:focus {
              border-color: #409eff;
              box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
            }

            &:hover {
              border-color: #409eff;
            }
          }
        }

        .search-btn {
          border-radius: 6px;
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

    .application-table {
      ::v-deep .el-table__header {
        th {
          background-color: #f8f9fa !important;
          color: #495057;
          font-weight: 600;
          border-bottom: 2px solid #dee2e6;
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

      .secret-btn {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        color: #409eff;
        transition: all 0.2s ease;

        &:hover {
          background: rgba(64, 158, 255, 0.1);
          color: #66b1ff;
        }

        i {
          margin-right: 4px;
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

  // 响应式设计
  @media (max-width: 768px) {
    .application-management-container {
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

        .search-form {
          width: 100%;

          .search-input {
            width: 100%;
          }

          .search-btn {
            width: 100px;
          }
        }
      }
    }

    .main-content {
      .application-table {
        ::v-deep .el-table__row {
          &:hover {
            transform: none;
          }
        }

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

  @media (max-width: 480px) {
    .application-table {
      ::v-deep .el-table {
        font-size: 12px;
      }

      .operation-buttons {
        .op-btn {
          padding: 1px 3px;
          font-size: 10px;
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

  // 自定义应用编辑弹窗样式
  .application-edit-dialog {
    ::v-deep .el-dialog {
      border-radius: 12px;
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
      overflow: hidden;

      .el-dialog__header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        margin: 0;
        padding: 20px 24px;
        border-bottom: none;

        .el-dialog__title {
          font-size: 18px;
          font-weight: 600;
          color: white;
        }

        .el-dialog__headerbtn {
          top: 16px;
          right: 20px;

          .el-dialog__close {
            color: white;
            font-size: 20px;

            &:hover {
              color: rgba(255, 255, 255, 0.8);
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
    .application-form {
      .form-section {
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        overflow: hidden;
        margin-bottom: 20px;

        .section-header {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 16px 20px;
          background: #ffffff;
          color: #303133;
          font-weight: 600;
          border-bottom: 1px solid #e4e7ed;

          i {
            font-size: 18px;
            color: #667eea;
          }
        }

        .form-content {
          padding: 20px;

          .form-item {
            ::v-deep .el-form-item__label {
              font-weight: 500;
              color: #495057;
              font-size: 14px;
              padding-right: 12px;
            }

            ::v-deep .el-input__inner,
            ::v-deep .el-textarea__inner,
            ::v-deep .el-select .el-input__inner {
              border-radius: 8px;
              border: 2px solid #e9ecef;
              transition: all 0.3s ease;
              font-size: 14px;

              &:focus {
                border-color: #667eea;
                box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
              }

              &:hover {
                border-color: #667eea;
              }

              &::placeholder {
                color: #c0c4cc;
              }
            }

            ::v-deep .el-textarea__inner {
              resize: vertical;
              min-height: 80px;
            }

            ::v-deep .el-input__prefix {
              .el-input__icon {
                color: #909399;
              }
            }

            ::v-deep .el-radio-group {
              .el-radio {
                margin-right: 20px;

                .el-radio__input.is-checked {
                  .el-radio__inner {
                    background: #667eea;
                    border-color: #667eea;
                  }
                }

                .el-radio__input.is-checked + .el-radio__label {
                  color: #667eea;
                }
              }
            }
          }

          .tree-select {
            ::v-deep .el-select {
              width: 100%;

              .el-input__inner {
                border-radius: 8px;
                border: 2px solid #e9ecef;
                transition: all 0.3s ease;

                &:focus {
                  border-color: #667eea;
                  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
                }

                &:hover {
                  border-color: #667eea;
                }
              }

              .el-select__tags {
                .el-tag {
                  border-radius: 12px;
                  margin: 2px 4px 2px 0;
                  background: rgba(102, 126, 234, 0.1);
                  border-color: rgba(102, 126, 234, 0.3);
                  color: #667eea;
                }
              }
            }
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
      border-radius: 8px;
      border: 2px solid #e9ecef;
      background: white;
      color: #6c757d;
      font-weight: 500;
      transition: all 0.3s ease;
      padding: 10px 24px;

      &:hover {
        border-color: #6c757d;
        color: #495057;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      i {
        margin-right: 6px;
      }
    }

    .confirm-btn {
      border-radius: 8px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      font-weight: 500;
      transition: all 0.3s ease;
      padding: 10px 24px;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);

      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
      }

      &:active {
        transform: translateY(0);
      }

      i {
        margin-right: 6px;
      }
    }
  }

  // 响应式设计
  @media (max-width: 768px) {
    .application-edit-dialog {
      ::v-deep .el-dialog {
        width: 95% !important;
        margin: 5vh auto;

        .el-dialog__body {
          padding: 20px 16px;
        }

        .el-dialog__footer {
          padding: 16px;
        }
      }
    }

    .dialog-content {
      .application-form {
        .form-section {
          .form-content {
            padding: 16px;

            .el-row {
              .el-col {
                &:not(:last-child) {
                  margin-bottom: 16px;
                }
              }
            }
          }
        }
      }
    }

    .dialog-footer {
      flex-direction: column-reverse;

      .cancel-btn,
      .confirm-btn {
        width: 100%;
        margin: 0;
      }
    }
  }

  @media (max-width: 480px) {
    .application-edit-dialog {
      ::v-deep .el-dialog {
        width: 98% !important;

        .el-dialog__header {
          padding: 16px 20px;

          .el-dialog__title {
            font-size: 16px;
          }
        }
      }
    }

    .dialog-content {
      .application-form {
        ::v-deep .el-form-item__label {
          font-size: 13px;
        }
      }
    }
  }

  // 动画效果
  .application-edit-dialog {
    ::v-deep .el-dialog__body {
      animation: slideInUp 0.3s ease-out;
    }
  }

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

  // 按钮悬停效果增强
  .cancel-btn,
  .confirm-btn {
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      transform: translate(-50%, -50%);
      transition: width 0.3s ease, height 0.3s ease;
    }

    &:hover::before {
      width: 300px;
      height: 300px;
    }
  }
</style>
