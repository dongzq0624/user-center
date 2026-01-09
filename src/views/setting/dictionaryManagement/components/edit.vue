<template>
  <el-dialog
    class="dictionary-edit-dialog"
    :close-on-click-modal="false"
    :title="title"
    :visible="dialogFormVisible"
    width="600px"
    @close="close"
  >
    <div class="dialog-content">
      <el-form
        ref="formRef"
        class="dictionary-form"
        label-width="120px"
        :model="form"
        :rules="rules"
      >
        <!-- 基本信息区域 -->
        <div class="form-section">
          <div class="section-header">
            <i class="el-icon-document-copy"></i>
            <span>字典信息</span>
          </div>

          <div class="form-content">
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item class="form-item" label="父级字典" prop="parentId">
                  <el-select
                    ref="selectTree"
                    v-model="form.parentId"
                    clearable
                    placeholder="请选择父节点"
                    prefix-icon="el-icon-share"
                    style="width: 100%"
                    @clear="selectOnClear('parentId')"
                  >
                    <el-option
                      :label="form.parentName"
                      style="height: auto; padding: 0"
                      :value="form.parentId"
                    >
                      <el-tree
                        ref="treeRef"
                        :data="treeData"
                        :props="defaultProps"
                        @node-click="handleNodeClick"
                      />
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item class="form-item" label="字典名称" prop="name">
                  <el-input
                    v-model="form.name"
                    clearable
                    placeholder="请输入字典名称"
                    prefix-icon="el-icon-document-copy"
                  />
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item class="form-item" label="字典代码" prop="code">
                  <el-input
                    v-model="form.code"
                    clearable
                    placeholder="请输入字典代码"
                    prefix-icon="el-icon-price-tag"
                  />
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item class="form-item" label="字典值" prop="value">
                  <el-input
                    v-model="form.value"
                    clearable
                    placeholder="请输入字典值"
                    prefix-icon="el-icon-magic-stick"
                  />
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item class="form-item" label="备注" prop="remark">
                  <el-input
                    v-model="form.remark"
                    clearable
                    maxlength="500"
                    placeholder="请输入备注信息（可选）"
                    :rows="3"
                    show-word-limit
                    type="textarea"
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
        <el-button class="cancel-btn" @click="close">
          <i class="el-icon-close"></i>
          取消
        </el-button>
        <el-button class="confirm-btn" type="primary" @click="save">
          <i class="el-icon-check"></i>
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
  import { doEdit, dictTree } from '@/api/systemManage/dictionaryManagement'

  export default {
    name: 'RoleManagementEdit',
    emits: ['fetch-data'],
    data() {
      return {
        formRef: null,
        treeRef: null,
        selectTree: null,
        form: {
          powerId: '',
          parentName: '',
        },
        rules: {
          code: [
            { required: true, trigger: 'blur', message: '请输入字典代码' },
          ],
          name: [
            { required: true, trigger: 'blur', message: '请输入字典名称' },
          ],
          remark: [
            { required: false, trigger: 'blur', message: '请输入字典备注' },
          ],
          value: [{ required: true, trigger: 'blur', message: '请输入字典值' }],
        },
        title: '',
        dialogFormVisible: false,
        list: [],
        params: {
          pageNo: 1,
          pageSize: 9999,
        },
        treeData: [],
        defaultProps: {
          children: 'dictChildrenTree',
          label: 'name',
        },
      }
    },
    mounted() {
      this.getDictionaryType()
      // getPowerList()
    },
    methods: {
      showEdit(row) {
        if (!row) {
          this.title = '新增'
        } else if (!row.id) {
          this.title = '新增'
          this.form = Object.assign({}, row)
        } else {
          this.title = '编辑'
          this.form = Object.assign({}, row)
        }
        this.dialogFormVisible = true
      },
      close() {
        this.$refs['formRef'].resetFields()
        this.form = {
          btnRolesCheckedList: [],
        }
        this.dialogFormVisible = false
      },
      save() {
        this.$refs['formRef'].validate(async (valid) => {
          if (valid) {
            // const tree = this['treeRef'].getCheckedKeys()
            // const treeObject = { 'treeArray:': tree }
            const { message } = await doEdit({
              ...this.form,
            })
            this.$baseMessage(message, 'success', 'vab-hey-message-success')
            this.$emit('fetch-data')
            this.getDictionaryType()
            this.close()
          }
        })
      },
      handleNodeClick(node) {
        this.$set(this.form, 'parentName', node.name)
        this.$set(this.form, 'parentId', node.id)
        this.$refs['selectTree'].blur()
      },
      selectOnClear() {
        this.$set(this.form, 'parentName', '')
        this.$set(this.form, 'parentId', '')
      },
      getDictionaryType() {
        dictTree().then((resp) => {
          this.treeData = resp.result.dictTree
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
  // 自定义字典编辑弹窗样式
  .dictionary-edit-dialog {
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
    .dictionary-form {
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

            ::v-deep .el-select {
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
    .dictionary-edit-dialog {
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
      .dictionary-form {
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
    .dictionary-edit-dialog {
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
      .dictionary-form {
        ::v-deep .el-form-item__label {
          font-size: 13px;
        }
      }
    }
  }

  // 动画效果
  .dictionary-edit-dialog {
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

  // 保留原有样式
  .vab-tree-border {
    height: 200px;
    padding: $base-padding;
    overflow-y: auto;
    border: 1px solid #dcdfe6;
    border-radius: $base-border-radius;
  }
</style>
