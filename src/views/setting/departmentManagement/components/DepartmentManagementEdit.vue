<template>
  <el-dialog
    :close-on-click-modal="false"
    :title="title"
    :visible="dialogFormVisible"
    width="600px"
    class="department-edit-dialog"
    @close="close"
  >
    <div class="dialog-content">
      <el-form
        ref="formRef"
        label-width="100px"
        :model="form"
        :rules="rules"
        class="edit-form"
      >
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="组织父节点" prop="parentId" class="form-item">
              <el-select
                ref="treeSelect"
                v-model="form.parentId"
                placeholder="请选择父节点"
                class="tree-select"
                filterable
                clearable
              >
                <el-option
                  :label="form.parentName"
                  style="height: auto; padding: 0"
                  :value="form.parentId"
                >
                  <el-tree
                    :data="treeData"
                    :props="defaultProps"
                    :expand-on-click-node="false"
                    class="department-tree"
                    @node-click="handleNodeClick"
                  />
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="组织类型" prop="type" class="form-item">
              <dictionary-select
                v-model="form.type"
                code="organization_type"
                class="type-select"
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="组织名称" prop="name" class="form-item">
              <el-input
                v-model="form.name"
                placeholder="请输入组织名称"
                class="name-input"
                clearable
              >
                <template #prefix>
                  <i class="el-input__icon el-icon-office-building"></i>
                </template>
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="组织负责人" prop="directorIds" class="form-item">
              <member-select
                multiple
                type="list"
                :value="form.directors"
                class="member-select"
                @onChange="directorOnChange"
              />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="备注" prop="remark" class="form-item">
              <el-input
                v-model="form.remark"
                :rows="4"
                type="textarea"
                placeholder="请输入备注信息（可选）"
                class="remark-textarea"
                maxlength="500"
                show-word-limit
                resize="vertical"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button
          class="cancel-btn"
          @click="close"
        >
          <i class="el-icon-close"></i>
          取消
        </el-button>
        <el-button
          type="primary"
          class="confirm-btn"
          @click="save"
        >
          <i class="el-icon-check"></i>
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
  import { doEdit, getList } from '@/api/systemManage/departmentManagement'
  import { getOrganTree } from '@/api/applications/dingding'
  export default {
    components: {
      DictionarySelect: () => import('@/components/dictionarySelect'),
    },
    data() {
      return {
        formRef: null,
        treeSelect: null,
        treeData: [],
        defaultProps: {
          children: 'children',
          label: 'name',
        },
        form: {
          parentName: '',
          parentId: '',
          type: '',
          directors: [],
          directorIds: '',
        },
        rules: {
          parentId: [
            { required: true, trigger: 'change', message: '请选择组织父节点' },
          ],
          name: [
            { required: true, trigger: 'blur', message: '请输入组织名称' },
          ],
          type: [
            { required: true, trigger: 'blur', message: '请选择组织类型' },
          ],
          remark: [{ required: false, trigger: 'blur', message: '请输入备注' }],
        },
        title: '',
        dialogFormVisible: false,
      }
    },
    mounted() {
      this.fetchData()
      this.fetchZzdData()
    },
    methods: {
      directorOnChange(value) {
        console.log('value', JSON.stringify(value))
        this.$set(this.form, 'directors', value)
        this.$set(
          this.form,
          'directorIds',
          value.map((item) => item.userId).join(',')
        )
        //  this.$refs['formRef'].clearValidate('directors')
      },
      async fetchData() {
        const {
          result: { organTreeList },
        } = await getList({
          pageNo: 1,
          pageSize: 9999,
          type: 'department',
        })
        this.treeData = organTreeList
      },
      async fetchZzdData() {
        const data = await getOrganTree({})
        this.zzdTreeData = data.result.zzdOrganTreeList
      },
      handleNodeClick(node) {
        this.$set(this.form, 'parentName', node.name)
        this.$set(this.form, 'parentId', node.id)
        this.$refs.treeSelect.blur()
      },
      handleZzdNodeClick(node) {
        this.$set(this.form, 'zzdOrganizationName', node.name)
        this.$set(this.form, 'zzdOrganizationCode', node.id)
        this.$refs.zzdTreeSelect.blur()
      },
      showEdit(row) {
        if (!row) {
          this.title = '新增'
        } else {
          this.title = '编辑'
          console.log('row', JSON.stringify(row))
          this.form = Object.assign({}, row)

          if (row.directors) {
            this.$set(
              this.form,
              'directorIds',
              row.directors.map((item) => item.userId).join(',')
            )
            this.$set(this.form, 'directors', row.directors)
          }
        }
        this.dialogFormVisible = true
      },
      close() {
        this.$refs.formRef.resetFields()
        this.form = {
          parentName: '',
          parentId: '',
          directors: [],
        }
        this.dialogFormVisible = false
      },
      save() {
        this.$refs.formRef.validate(async (valid) => {
          if (valid) {
            const { message } = await doEdit(this.form)
            this.$baseMessage(message, 'success', 'vab-hey-message-success')
            this.$emit('fetch-data', this.form)
            this.fetchData()
            this.close()
          }
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
  .department-edit-dialog {
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
          font-weight: 600;
          font-size: 18px;
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
    .edit-form {
      .form-item {
        margin-bottom: 20px;

        ::v-deep .el-form-item__label {
          color: #495057;
          font-weight: 500;
          font-size: 14px;
          padding-right: 12px;
        }

        ::v-deep .el-form-item__content {
          line-height: normal;
        }
      }

      .tree-select {
        width: 100%;

        ::v-deep .el-input__inner {
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
        }

        .department-tree {
          ::v-deep .el-tree-node__content {
            height: 36px;
            border-radius: 6px;
            margin: 2px 0;
            transition: all 0.2s ease;

            &:hover {
              background: rgba(102, 126, 234, 0.1);
            }
          }

          ::v-deep .el-tree-node__expand-icon {
            color: #909399;
            font-size: 14px;
          }

          ::v-deep .el-tree-node__label {
            font-size: 14px;
            color: #495057;
          }
        }
      }

      .type-select {
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
        }
      }

      .name-input {
        ::v-deep .el-input__inner {
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
        }

        ::v-deep .el-input__prefix {
          .el-input__icon {
            color: #909399;
          }
        }
      }

      .member-select {
        ::v-deep .el-select {
          width: 100%;

          .el-input__inner {
            border-radius: 8px;
            border: 2px solid #e9ecef;
            transition: all 0.3s ease;
            min-height: 40px;

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

      .remark-textarea {
        ::v-deep .el-textarea__inner {
          border-radius: 8px;
          border: 2px solid #e9ecef;
          transition: all 0.3s ease;
          font-size: 14px;
          resize: vertical;

          &:focus {
            border-color: #667eea;
            box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
          }

          &:hover {
            border-color: #667eea;
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
    .department-edit-dialog {
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

    .edit-form {
      .el-row {
        .el-col {
          &:not(:last-child) {
            margin-bottom: 16px;
          }

          &.el-col-12 {
            &:nth-child(odd) {
              padding-right: 8px;
            }

            &:nth-child(even) {
              padding-left: 8px;
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
    .department-edit-dialog {
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

    .edit-form {
      ::v-deep .el-form-item__label {
        font-size: 13px;
      }

      .el-row .el-col {
        padding: 0 !important;
      }
    }
  }

  // 动画效果
  .dialog-enter-active,
  .dialog-leave-active {
    transition: all 0.3s ease;
  }

  .dialog-enter-from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }

  .dialog-leave-to {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }

  // 表单项动画
  .form-item-enter-active {
    animation: slideInUp 0.4s ease-out;
  }

  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
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
