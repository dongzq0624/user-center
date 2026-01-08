<template>
  <el-dialog
    :close-on-click-modal="false"
    :title="title + '用户'"
    :visible="dialogFormVisible"
    width="1100px"
    class="user-edit-dialog"
    @close="close"
  >
    <div class="dialog-content">
      <el-form
        ref="formRef"
        label-width="110px"
        :model="form"
        :rules="rules"
        class="user-form"
      >
        <!-- 基本信息区域 -->
        <div class="form-section">
          <div class="section-header">
            <i class="el-icon-user"></i>
            <span>基本信息</span>
          </div>

          <div class="form-content">
            <!-- 头像上传区域 -->
            <div class="avatar-section">
              <div class="avatar-upload-wrapper">
                <div class="avatar-label">头像照片</div>
                <el-upload
                  :action="UPLOAD_URL"
                  class="avatar-uploader"
                  :on-success="handleAvatarSuccess"
                  :show-file-list="false"
                  :before-upload="beforeAvatarUpload"
                >
                  <div class="avatar-container">
                    <img v-if="imageUrl" :src="imageUrl" class="avatar-image" />
                    <div v-else class="avatar-placeholder">
                      <i class="el-icon-camera"></i>
                      <span>点击上传</span>
                    </div>
                  </div>
                </el-upload>
                <div class="avatar-tips">
                  <small>支持 JPG、PNG 格式，大小不超过 2MB</small>
                </div>
              </div>
            </div>

            <!-- 表单信息区域 -->
            <div class="info-section">
              <el-row :gutter="20">
                <el-col :lg="8" :md="12" :sm="24">
                  <el-form-item label="姓名" prop="username" class="form-item">
                    <el-input
                      v-model.trim="form.username"
                      placeholder="请输入真实姓名"
                      clearable
                      prefix-icon="el-icon-user"
                    >
                      <i slot="prefix" class="el-input__icon el-icon-user"></i>
                    </el-input>
                  </el-form-item>
                </el-col>

                <el-col :lg="8" :md="12" :sm="24">
                  <el-form-item
                    label="手机号码"
                    prop="phoneNo"
                    class="form-item"
                  >
                    <el-input
                      v-model.trim="form.phoneNo"
                      :maxlength="11"
                      placeholder="请输入手机号码"
                      clearable
                      prefix-icon="el-icon-mobile-phone"
                      @change="onPhoneNoChange"
                    />
                  </el-form-item>
                </el-col>

                <el-col :lg="8" :md="12" :sm="24">
                  <el-form-item label="邮箱" prop="mail" class="form-item">
                    <el-input
                      v-model.trim="form.mail"
                      :maxlength="50"
                      placeholder="请输入邮箱地址"
                      clearable
                      prefix-icon="el-icon-message"
                      type="email"
                    />
                  </el-form-item>
                </el-col>

                <el-col :lg="8" :md="12" :sm="24">
                  <el-form-item
                    label="性别"
                    prop="genderCode"
                    class="form-item"
                  >
                    <el-select
                      v-model="form.genderCode"
                      placeholder="请选择性别"
                      clearable
                    >
                      <el-option
                        :key="USER_GENDER.MALE.key"
                        :label="USER_GENDER.MALE.value"
                        :value="USER_GENDER.MALE.key"
                      >
                        <div class="option-content">
                          <i class="el-icon-male"></i>
                          <span>{{ USER_GENDER.MALE.value }}</span>
                        </div>
                      </el-option>
                      <el-option
                        :key="USER_GENDER.FEMALE.key"
                        :label="USER_GENDER.FEMALE.value"
                        :value="USER_GENDER.FEMALE.key"
                      >
                        <div class="option-content">
                          <i class="el-icon-female"></i>
                          <span>{{ USER_GENDER.FEMALE.value }}</span>
                        </div>
                      </el-option>
                      <el-option
                        :key="USER_GENDER.UNKNOWN.key"
                        :label="USER_GENDER.UNKNOWN.value"
                        :value="USER_GENDER.UNKNOWN.key"
                      >
                        <div class="option-content">
                          <i class="el-icon-question"></i>
                          <span>{{ USER_GENDER.UNKNOWN.value }}</span>
                        </div>
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :lg="8" :md="12" :sm="24">
                  <el-form-item
                    label="所属机构"
                    prop="organizationId"
                    class="form-item"
                  >
                    <el-select
                      ref="selectTree"
                      placeholder="请选择所属机构"
                      clearable
                      filterable
                      :value="form.organizationId"
                    >
                      <el-option
                        :label="form.organizationName"
                        style="height: auto; padding: 0"
                        :value="form.organizationId"
                      >
                        <depart-lazy-tree
                          :handle-node-click="(node) => handleNodeClick(node)"
                        />
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :lg="8" :md="12" :sm="24">
                  <el-form-item
                    label="有效期"
                    prop="endUseTime"
                    class="form-item"
                  >
                    <el-date-picker
                      v-model="form.endUseTime"
                      placeholder="选择有效期日期"
                      type="date"
                      value-format="yyyy-MM-dd"
                      clearable
                      style="width: 100%"
                    />
                  </el-form-item>
                </el-col>
              </el-row>

              <!-- 备注区域 -->
              <el-row :gutter="20">
                <el-col :span="24">
                  <el-form-item
                    label="备注信息"
                    prop="remark"
                    class="form-item"
                  >
                    <el-input
                      v-model.trim="form.remark"
                      placeholder="请输入备注信息（可选）"
                      type="textarea"
                      :rows="3"
                      clearable
                    />
                  </el-form-item>
                </el-col>
              </el-row>

              <!-- 新用户密码提示 -->
              <el-row v-if="!isEdit" :gutter="20">
                <el-col :span="24">
                  <div class="password-notice">
                    <i class="el-icon-info"></i>
                    <div class="notice-content">
                      <strong>新用户默认密码：</strong>
                      <span class="password-text">123456</span>
                      <p class="notice-tip">创建成功后请尽快修改密码</p>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
      </el-form>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="close" class="cancel-btn">
          <i class="el-icon-close"></i>
          取消
        </el-button>
        <el-button
          :loading="loading"
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
  import { doEdit, roleList } from '@/api/systemManage/userManagement'
  import { organTree } from '@/api/systemManage/departmentManagement'
  import { USER_STATUS, USER_GENDER } from '@/constant/Enums'
  import { isNumber } from '@/utils/validate'
  import { upload_url } from '@/api/project-management/file-list'
  import { baseURL } from '@/config'

  export default {
    name: 'UserManagementEdit',
    components: {
      DepartLazyTree: () => import('@/components/departLazyTree'),
    },
    data() {
      const checkNumber = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('电话不能为空'))
        }
        callback()
      }
      const checkEmail = (rule, value, callback) => {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if (!regex.test(value)) {
          callback(new Error('请输入有效的邮箱'))
        } else {
          callback()
        }
      }
      return {
        UPLOAD_URL: baseURL + upload_url,
        USER_STATUS,
        USER_GENDER,
        selectTree: null,
        formRef: null,
        form: {
          status: USER_STATUS.ON.key,
          parentName: '',
          dutyList: [],
        },
        roleList: [],
        rules: {
          username: [
            { required: true, trigger: 'blur', message: '请输入用户名' },
          ],
          genderCode: [
            { required: true, trigger: 'change', message: '请选择性别' },
          ],
          phoneNo: [
            { required: true, trigger: 'change', message: '请输入手机号' },
            { validator: checkNumber, trigger: 'blur' },
          ],
          mail: [
            { required: true, trigger: 'change', message: '请输入邮箱' },
            { validator: checkEmail, trigger: 'blur' },
          ],
          organizationId: [
            { required: true, trigger: 'change', message: '请所属机构' },
          ],
        },
        imageUrl: '',
        params: {
          pageNo: 1,
          type: 'department',
          pageSize: 999,
        },
        title: '',
        isEdit: false,
        dialogFormVisible: false,
        stationList: [],
        defaultProps: {
          children: 'children',
          label: 'name',
        },
        loading: false,
      }
    },
    computed: {},
    mounted() {
      this.getRoleList()
    },
    methods: {
      dutyOnAdd() {
        this.form.dutyList.push({})
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
        const isLt2M = file.size / 1024 / 1024 < 2

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG/PNG 格式!')
          return false
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!')
          return false
        }
        return true
      },
      handleAvatarSuccess(res) {
        console.log(res)
        this.imageUrl = res.result.path
        this.$set(this.form, 'avatar', res.result.path)
        this.$message.success('头像上传成功')
      },
      showEdit(row) {
        if (!row) {
          this.title = '新增'
          this.form.dutyList.push({})
        } else {
          this.title = '编辑'
          this.isEdit = true
          this.form = Object.assign({}, row)
          this.imageUrl = row.avatar
          this.organs = row.organList.map((data) => data.organId)
        }
        this.dialogFormVisible = true
      },
      close() {
        this.$refs.formRef.resetFields()
        this.imageUrl = ''
        this.form = {
          dutyList: [],
        }
        this.dialogFormVisible = false
        this.organs = []
      },
      save() {
        this.$refs.formRef.validate(async (valid) => {
          if (valid) {
            this.loading = true
            let params = {
              ...this.form,
            }
            const { message } = await doEdit(params)
            this.loading = false
            this.$baseMessage(message, 'success', 'vab-hey-message-success')
            this.close()
            this.$emit('fetch-data')
          }
        })
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

      async getRoleList() {
        const data = await roleList(this.params)
        this.roleList = data.result.roleList
      },

      handleNodeClick(node) {
        this.$set(this.form, 'organizationName', node.name)
        this.$set(this.form, 'organizationId', node.id)
      },
      onPhoneNoChange(value) {
        if (this.isEdit && value.length == 11) {
          this.$emit('onPhoneNoChange', value)
        }
      },
    },
  }
</script>
<style lang="scss" scoped>
  .user-edit-dialog {
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
    .user-form {
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
          display: flex;
          gap: 24px;

          .avatar-section {
            flex-shrink: 0;

            .avatar-upload-wrapper {
              .avatar-label {
                font-weight: 500;
                color: #303133;
                margin-bottom: 12px;
                display: block;
              }

              .avatar-uploader {
                ::v-deep .el-upload {
                  border: none;
                  border-radius: 8px;
                  cursor: pointer;
                  position: relative;
                  overflow: hidden;
                  transition: all 0.3s ease;

                  &:hover {
                    transform: scale(1.02);
                  }
                }

                .avatar-container {
                  width: 120px;
                  height: 120px;
                  border-radius: 8px;
                  background: #f8f9fa;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  border: 2px dashed #e9ecef;
                  transition: all 0.3s ease;

                  &:hover {
                    border-color: #667eea;
                    background: rgba(102, 126, 234, 0.02);
                  }

                  .avatar-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    border-radius: 6px;
                  }

                  .avatar-placeholder {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 8px;
                    color: #909399;

                    i {
                      font-size: 24px;
                    }

                    span {
                      font-size: 12px;
                    }
                  }
                }
              }

              .avatar-tips {
                margin-top: 8px;
                text-align: center;

                small {
                  color: #909399;
                  font-size: 11px;
                }
              }
            }
          }

          .info-section {
            flex: 1;
            min-width: 0;

            .form-item {
              ::v-deep .el-form-item__label {
                font-weight: 500;
                color: #495057;
                font-size: 14px;
                padding-right: 12px;
              }

              ::v-deep .el-input__inner,
              ::v-deep .el-textarea__inner,
              ::v-deep .el-select .el-input__inner,
              ::v-deep .el-date-editor .el-input__inner {
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
            }

            .password-notice {
              display: flex;
              align-items: flex-start;
              gap: 12px;
              padding: 16px;
              background: linear-gradient(135deg, #fff7e6 0%, #fff1b8 100%);
              border: 1px solid #ffd666;
              border-radius: 8px;
              margin-top: 16px;

              i {
                color: #faad14;
                font-size: 20px;
                margin-top: 2px;
                flex-shrink: 0;
              }

              .notice-content {
                flex: 1;

                strong {
                  color: #d46b08;
                  display: block;
                  margin-bottom: 4px;
                  font-weight: 600;
                }

                .password-text {
                  background: #fff;
                  padding: 4px 8px;
                  border-radius: 4px;
                  border: 1px solid #ffd666;
                  color: #d46b08;
                  font-weight: 600;
                  font-family: 'Courier New', monospace;
                  font-size: 14px;
                }

                .notice-tip {
                  margin: 8px 0 0 0;
                  color: #d48806;
                  font-size: 13px;
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

  // 选项样式
  .option-content {
    display: flex;
    align-items: center;
    gap: 8px;

    i {
      color: #909399;
      font-size: 14px;
    }

    span {
      font-size: 14px;
      color: #495057;
    }
  }

  // 响应式设计
  @media (max-width: 768px) {
    .user-edit-dialog {
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
      .user-form {
        .form-section {
          .form-content {
            flex-direction: column;
            gap: 20px;

            .avatar-section {
              align-self: center;

              .avatar-upload-wrapper {
                .avatar-container {
                  width: 100px;
                  height: 100px;
                }
              }
            }

            .info-section {
              .form-item {
                ::v-deep .el-form-item__label {
                  font-size: 14px;
                }
              }
            }
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
      .user-form {
        .form-section {
          .form-content {
            .info-section {
              .password-notice {
                flex-direction: column;
                text-align: center;
                gap: 8px;

                .notice-content {
                  text-align: center;
                }
              }
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

  .user-edit-dialog {
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
