<template>
  <div class="personal-center-container">
    <div class="personal-center-content">
      <el-row :gutter="24">
        <el-col :lg="8" :md="12" :sm="24" :xl="8" :xs="24">
          <el-card class="user-profile-card" shadow="never">
            <template #header>
              <div class="card-header">
                <i class="el-icon-user"></i>
                <span>个人资料</span>
              </div>
            </template>
            <div class="personal-center-user-info">
              <div class="avatar-section">
                <el-avatar
                  class="user-avatar"
                  :size="120"
                  :src="avatar"
                  @click="openDialog"
                />
                <div class="avatar-edit-hint">
                  <i class="el-icon-camera"></i>
                  点击修改头像
                </div>
              </div>
              <div class="personal-center-user-info-full-name">
                {{ username }}
              </div>
              <!-- <div class="personal-center-user-info-description">
              {{ form.description }}
            </div> -->

              <div class="user-info-list">
                <div class="info-item">
                  <div class="info-icon">
                    <i class="el-icon-phone"></i>
                  </div>
                  <div class="info-content">
                    <div class="info-label">电话号码</div>
                    <div class="info-value">{{ userInfo.phoneNo }}</div>
                  </div>
                </div>

                <div class="info-item">
                  <div class="info-icon">
                    <i class="el-icon-s-custom"></i>
                  </div>
                  <div class="info-content">
                    <div class="info-label">性别</div>
                    <div class="info-value">
                      <span v-if="userInfo.gender == USER_GENDER.MALE.key">
                        {{ USER_GENDER.MALE.value }}
                      </span>
                      <span v-if="userInfo.gender == USER_GENDER.FEMALE.key">
                        {{ USER_GENDER.FEMALE.value }}
                      </span>
                      <span v-if="userInfo.gender == USER_GENDER.UNKNOWN.key">
                        {{ USER_GENDER.UNKNOWN.value }}
                      </span>
                    </div>
                  </div>
                </div>

                <div class="info-item">
                  <div class="info-icon">
                    <i class="el-icon-office-building"></i>
                  </div>
                  <div class="info-content">
                    <div class="info-label">所属部门</div>
                    <div class="info-value">
                      {{ userInfo.organizationName }}
                    </div>
                  </div>
                </div>

                <div class="info-item">
                  <div class="info-icon">
                    <i class="el-icon-s-check"></i>
                  </div>
                  <div class="info-content">
                    <div class="info-label">所属角色</div>
                    <div class="info-value">{{ userInfo.roleName }}</div>
                  </div>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :lg="16" :md="12" :sm="24" :xl="16" :xs="24">
          <el-card class="settings-card" shadow="never">
            <template #header>
              <div class="card-header">
                <i class="el-icon-setting"></i>
                <span>账户设置</span>
              </div>
            </template>
            <el-tabs v-model="activeName" class="settings-tabs">
              <el-tab-pane label="基本信息" name="first">
                <div class="tab-content">
                  <div class="form-container">
                    <el-form
                      ref="formRef"
                      class="info-form"
                      label-width="100px"
                      :model="form"
                      :rules="rules"
                    >
                      <div class="form-section">
                        <div class="section-header">
                          <i class="el-icon-edit"></i>
                          <span>基本信息设置</span>
                        </div>
                        <div class="form-content">
                          <el-row :gutter="20">
                            <el-col :span="24">
                              <el-form-item
                                class="form-item"
                                label="姓名"
                                prop="username"
                              >
                                <el-input
                                  v-model="form.username"
                                  clearable
                                  placeholder="请输入您的姓名"
                                  prefix-icon="el-icon-user"
                                />
                              </el-form-item>
                            </el-col>
                            <el-col :span="24">
                              <el-form-item
                                class="form-item"
                                label="性别"
                                prop="gender"
                              >
                                <el-radio-group
                                  v-model="form.gender"
                                  class="gender-radio"
                                >
                                  <el-radio
                                    class="radio-option"
                                    :label="USER_GENDER.MALE.key"
                                  >
                                    <i class="el-icon-male"></i>
                                    {{ USER_GENDER.MALE.value }}
                                  </el-radio>
                                  <el-radio
                                    class="radio-option"
                                    :label="USER_GENDER.FEMALE.key"
                                  >
                                    <i class="el-icon-female"></i>
                                    {{ USER_GENDER.FEMALE.value }}
                                  </el-radio>
                                </el-radio-group>
                              </el-form-item>
                            </el-col>
                            <el-col :span="24">
                              <el-form-item
                                class="form-item"
                                label="手机号码"
                                prop="phoneNo"
                              >
                                <el-input
                                  v-model="form.phoneNo"
                                  clearable
                                  :maxlength="11"
                                  placeholder="请输入手机号码"
                                  prefix-icon="el-icon-phone"
                                />
                              </el-form-item>
                            </el-col>
                          </el-row>
                        </div>
                      </div>

                      <div class="form-actions">
                        <el-button
                          class="save-btn"
                          type="primary"
                          @click="onSubmit"
                        >
                          <i class="el-icon-check"></i>
                          保存修改
                        </el-button>
                      </div>
                    </el-form>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="修改密码" name="second">
                <div class="tab-content">
                  <div class="form-container">
                    <el-form
                      ref="passwordRef"
                      class="password-form"
                      label-width="100px"
                      :model="passform"
                      :rules="passRules"
                    >
                      <div class="form-section">
                        <div class="section-header">
                          <i class="el-icon-lock"></i>
                          <span>密码安全设置</span>
                        </div>
                        <div class="form-content">
                          <el-row :gutter="20">
                            <el-col :span="24">
                              <el-form-item
                                class="form-item"
                                label="旧密码"
                                prop="oldPassword"
                              >
                                <el-input
                                  v-model="passform.oldPassword"
                                  clearable
                                  placeholder="请输入当前密码"
                                  prefix-icon="el-icon-key"
                                  show-password
                                  type="password"
                                />
                              </el-form-item>
                            </el-col>
                            <el-col :span="24">
                              <el-form-item
                                class="form-item"
                                label="新密码"
                                prop="newPassword"
                              >
                                <el-input
                                  v-model="passform.newPassword"
                                  clearable
                                  placeholder="请输入新密码（6-20位字符）"
                                  prefix-icon="el-icon-unlock"
                                  show-password
                                  type="password"
                                />
                              </el-form-item>
                            </el-col>
                            <el-col :span="24">
                              <el-form-item
                                class="form-item"
                                label="确认密码"
                                prop="confirmPassword"
                              >
                                <el-input
                                  v-model="passform.confirmPassword"
                                  clearable
                                  placeholder="请再次输入新密码"
                                  prefix-icon="el-icon-unlock"
                                  show-password
                                  type="password"
                                />
                              </el-form-item>
                            </el-col>
                          </el-row>
                        </div>
                      </div>

                      <div class="form-actions">
                        <el-button
                          class="save-btn"
                          type="primary"
                          @click="onSave"
                        >
                          <i class="el-icon-check"></i>
                          修改密码
                        </el-button>
                      </div>
                    </el-form>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { USER_GENDER } from '@/constant/Enums'
  import {
    modifyUserInfo,
    changePassword,
    getCliendIdAndRedirectUri,
    scanCodeBind,
  } from '@/api/user/user'

  export default {
    name: 'PersonalCenter',
    components: {},
    data() {
      const validatePass = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入新密码'))
        } else {
          if (this.passform.confirmPassword) {
            this.$refs.passwordRef.validateField('confirmPassword')
          }
          callback()
        }
      }
      const validatePass2 = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.passform.newPassword) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      const validateMust = (rule, value, callback) => {
        if (!value) {
          callback(new Error('旧密码不能为空'))
        } else {
          callback()
        }
      }
      return {
        USER_GENDER,
        activeName: 'first',
        formRef: null,
        passwordRef: null,
        form: {},
        passform: {},
        rules: {
          username: [
            { required: true, trigger: 'blur', message: '请输入用户名' },
          ],
          gender: [
            { required: true, trigger: 'change', message: '请选择性别' },
          ],
          phoneNo: [
            { required: true, trigger: 'blur', message: '请输入手机号' },
          ],
          // idCardCode: [
          //   { required: true, trigger: 'blur', message: '请输入身份证号' },
          // ],
        },
        passRules: {
          oldPassword: [
            {
              validator: validateMust,
              trigger: 'blur',
            },
          ],
          newPassword: [
            {
              validator: validatePass,
              trigger: 'blur',
            },
          ],
          confirmPassword: [
            {
              validator: validatePass2,
              trigger: 'blur',
            },
          ],
        },
        url: '',
      }
    },
    computed: {
      ...mapGetters({
        avatar: 'user/avatar',
        username: 'user/username',
        userInfo: 'user/userInfo',
      }),
    },
    created() {
      let { active } = this.$route.query
      if (active && active == 'second') {
        this.activeName = active
      }
      this.getConfig()
    },
    mounted() {
      const form = {
        username: this.userInfo.username,
        gender: this.userInfo.gender,
        phoneNo: this.userInfo.phoneNo,
        // idCardCode: this.userInfo.idCardCode,
      }
      this.form = form
      console.log(this.userInfo, 'userInfo')
      let _this = this
      window.addEventListener('message', function (event) {
        // 这里的event.data 就是登录成功的信息
        // 数据格式：{ "code": "aaaa", "state": "bbbb" }
        if (event.data.code) {
          let code = event.data.code
          scanCodeBind({
            userId: _this.userInfo.id,
            code: code,
          }).then(() => {
            _this.$message.success('账号绑定成功')
          })
        }
      })
    },
    methods: {
      getConfig() {
        getCliendIdAndRedirectUri({}).then((resp) => {
          let data = resp.result
          let cliendId = data.cliendId //应用标识
          let redirectUri = data.redirectUri //回调地址
          //this.url = `https://login-pro.ding.zj.gov.cn/oauth2/auth.htm?response_type=code&client_id=${cliendId}&redirect_uri=${redirectUri}&scope=get_user_info&authType=QRCODE&embedMode=true`;
          this.url = `https://login.dg-work.cn/oauth2/auth.htm?response_type=code&client_id=${cliendId}&redirect_uri=${redirectUri}&scope=get_user_info&authType=QRCODE&embedMode=true`
        })
      },
      openDialog() {
        this.$refs.vabCropperRef.dialogVisible = true
      },

      onSubmit() {
        this.$refs.formRef.validate(async (valid) => {
          if (valid) {
            this.$set(this.form, 'id', this.userInfo.id)
            const { message } = await modifyUserInfo(this.form)
            this.$baseMessage(message, 'success', 'vab-hey-message-success')
          }
        })
      },
      onSave() {
        this.$set(this.passform, 'userId', this.userInfo.id)
        this.$refs.passwordRef.validate(async (valid) => {
          if (valid) {
            const { message } = await changePassword(this.passform)
            if (message) {
              this.$router.push('/login')
            }
            this.$baseMessage(message, 'success', 'vab-hey-message-success')
          }
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
  .personal-center-container {
    padding: 20px;
    background-color: #f5f7fa;
    min-height: calc(100vh - 84px);

    // 主内容区域
    .personal-center-content {
      // 用户资料卡片
      .user-profile-card {
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        overflow: hidden;

        ::v-deep .el-card__header {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          color: white;
          border-bottom: none;
          padding: 20px 24px;

          .card-header {
            display: flex;
            align-items: center;
            gap: 8px;
            font-weight: 600;

            i {
              font-size: 18px;
              opacity: 0.9;
            }
          }
        }

        ::v-deep .el-card__body {
          padding: 24px;
        }

        .personal-center-user-info {
          text-align: center;

          .avatar-section {
            position: relative;
            display: inline-block;
            margin-bottom: 20px;

            .user-avatar {
              border: 4px solid rgba(255, 255, 255, 0.8);
              box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
              transition: all 0.3s ease;

              &:hover {
                transform: scale(1.05);
                box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
              }
            }

            .avatar-edit-hint {
              position: absolute;
              bottom: -5px;
              left: 50%;
              transform: translateX(-50%);
              background: rgba(0, 0, 0, 0.7);
              color: white;
              padding: 4px 8px;
              border-radius: 12px;
              font-size: 12px;
              opacity: 0;
              transition: all 0.3s ease;

              i {
                margin-right: 4px;
              }
            }

            &:hover .avatar-edit-hint {
              opacity: 1;
            }
          }

          .personal-center-user-info-full-name {
            font-size: 24px;
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 20px;
          }

          .user-info-list {
            .info-item {
              display: flex;
              align-items: center;
              padding: 12px 16px;
              margin-bottom: 8px;
              background: #f8f9fa;
              border-radius: 8px;
              transition: all 0.2s ease;

              &:hover {
                background: #e9ecef;
                transform: translateX(4px);
              }

              .info-icon {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: linear-gradient(135deg, #667eea, #764ba2);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                margin-right: 16px;
                font-size: 16px;
              }

              .info-content {
                flex: 1;

                .info-label {
                  font-size: 12px;
                  color: #6c757d;
                  margin-bottom: 2px;
                  font-weight: 500;
                }

                .info-value {
                  font-size: 14px;
                  color: #495057;
                  font-weight: 600;
                }
              }
            }
          }
        }
      }

      // 设置卡片
      .settings-card {
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

        ::v-deep .el-card__header {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          color: white;
          border-bottom: none;
          padding: 20px 24px;

          .card-header {
            display: flex;
            align-items: center;
            gap: 8px;
            font-weight: 600;

            i {
              font-size: 18px;
              opacity: 0.9;
            }
          }
        }

        ::v-deep .el-card__body {
          padding: 0;
        }

        .settings-tabs {
          ::v-deep .el-tabs__header {
            margin: 0;
            background: #f8f9fa;
            border-bottom: 1px solid #e9ecef;

            .el-tabs__nav-wrap::after {
              display: none;
            }

            .el-tabs__item {
              border-bottom: none;
              color: #6c757d;
              font-weight: 500;
              padding: 16px 24px;

              // &.is-active {
              //   color: #409eff;
              //   background: white;
              //   border-bottom: 3px solid #409eff;
              // }

              &:hover {
                color: #409eff;
              }
            }
          }

          ::v-deep .el-tabs__content {
            padding: 24px;
          }

          .tab-content {
            .form-container {
              max-width: 600px;

              .info-form,
              .password-form {
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
                    background: #f8f9fa;
                    color: #303133;
                    font-weight: 600;
                    border-bottom: 1px solid #e9ecef;

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

                        &::placeholder {
                          color: #c0c4cc;
                        }
                      }

                      ::v-deep .el-input__prefix {
                        .el-input__icon {
                          color: #909399;
                        }
                      }
                    }

                    .gender-radio {
                      ::v-deep .el-radio {
                        margin-right: 20px;

                        &.radio-option {
                          .el-radio__input {
                            display: none;
                          }

                          .el-radio__label {
                            display: flex;
                            align-items: center;
                            gap: 8px;
                            padding: 8px 16px;
                            border: 2px solid #e9ecef;
                            border-radius: 8px;
                            transition: all 0.3s ease;
                            cursor: pointer;

                            &:hover {
                              border-color: #667eea;
                              background: rgba(102, 126, 234, 0.05);
                            }
                          }

                          &.is-checked {
                            .el-radio__label {
                              border-color: #667eea;
                              background: rgba(102, 126, 234, 0.1);
                              color: #667eea;
                              font-weight: 600;
                            }
                          }
                        }
                      }
                    }
                  }
                }

                .form-actions {
                  text-align: center;

                  .save-btn {
                    border-radius: 8px;
                    background: linear-gradient(
                      135deg,
                      #667eea 0%,
                      #764ba2 100%
                    );
                    border: none;
                    font-weight: 500;
                    padding: 12px 32px;
                    font-size: 16px;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);

                    &:hover {
                      transform: translateY(-1px);
                      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
                    }

                    &:active {
                      transform: translateY(0);
                    }

                    i {
                      margin-right: 8px;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  // 响应式设计
  @media (max-width: 768px) {
    .personal-center-container {
      padding: 10px;

      .personal-center-content {
        .user-profile-card,
        .settings-card {
          ::v-deep .el-card__body {
            padding: 16px;
          }
        }

        .settings-card {
          .settings-tabs {
            ::v-deep .el-tabs__header {
              .el-tabs__item {
                padding: 12px 16px;
                font-size: 14px;
              }
            }

            ::v-deep .el-tabs__content {
              padding: 16px;
            }
          }
        }

        .user-info-list {
          .info-item {
            flex-direction: column;
            text-align: center;

            .info-icon {
              margin-right: 0;
              margin-bottom: 8px;
            }

            .info-content {
              .info-label {
                margin-bottom: 4px;
              }
            }
          }
        }
      }
    }
  }

  @media (max-width: 480px) {
    .personal-center-container {
      .settings-card {
        .tab-content {
          .form-container {
            .info-form,
            .password-form {
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
