<template>
  <div class="personal-center-container">
    <el-row :gutter="20">
      <el-col :lg="8" :md="12" :sm="24" :xl="8" :xs="24">
        <el-card shadow="hover">
          <p>个人信息</p>
          <el-divider />
          <div class="personal-center-user-info">
            <el-avatar :size="100" :src="avatar" @click="openDialog" />
            <div class="personal-center-user-info-full-name">
              {{ username }}
            </div>
            <!-- <div class="personal-center-user-info-description">
              {{ form.description }}
            </div> -->

            <ul class="personal-center-user-info-list">
              <li>
                <vab-icon icon="cellphone-line" />
                电话号码：
                {{ userInfo.phoneNo }}
              </li>
              <li>
                <vab-icon icon="women-line" />
                性别：
                <span v-if="userInfo.gender == USER_GENDER.MALE.key">
                  {{ USER_GENDER.MALE.value }}
                </span>
                <span v-if="userInfo.gender == USER_GENDER.FEMALE.key">
                  {{ USER_GENDER.FEMALE.value }}
                </span>
                <span v-if="userInfo.gender == USER_GENDER.UNKNOWN.key">
                  {{ USER_GENDER.UNKNOWN.value }}
                </span>
              </li>
              <li>
                <vab-icon icon="community-line" />
                所属部门：
                {{ userInfo.organizationName }}
              </li>

              <li>
                <vab-icon icon="admin-line" />
                所属角色：
                {{ userInfo.roleName }}
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :lg="16" :md="12" :sm="24" :xl="16" :xs="24">
        <el-card shadow="hover">
          <el-tabs v-model="activeName">
            <el-tab-pane label="基本信息" name="first">
              <div style="width: 500px; padding-top: 15px">
                <el-form
                  ref="formRef"
                  label-width="90px"
                  :model="form"
                  :rules="rules"
                >
                  <el-form-item label="姓名：" prop="username">
                    <el-input v-model="form.username" />
                  </el-form-item>
                  <el-form-item label="性别：" prop="gender">
                    <el-radio-group v-model="form.gender">
                      <el-radio :label="USER_GENDER.MALE.key">
                        {{ USER_GENDER.MALE.value }}
                      </el-radio>
                      <el-radio :label="USER_GENDER.FEMALE.key">
                        {{ USER_GENDER.FEMALE.value }}
                      </el-radio>
                      <!-- <el-radio :label="USER_GENDER.UNKNOWN.key">
                        {{ USER_GENDER.UNKNOWN.value }}
                      </el-radio> -->
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="手机号码：" prop="phoneNo">
                    <el-input v-model="form.phoneNo" :maxlength="11" />
                  </el-form-item>
                  <!-- <el-form-item label="身份证号：" prop="idCardCode">
                    <el-input v-model="form.idCardCode" :maxlength="18" />
                  </el-form-item> -->

                  <el-form-item>
                    <el-button type="primary" @click="onSubmit">保存</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </el-tab-pane>
            <el-tab-pane label="修改密码" name="second">
              <div style="width: 500px; padding-top: 15px">
                <el-form
                  ref="passwordRef"
                  label-width="90px"
                  :model="passform"
                  :rules="passRules"
                >
                  <el-form-item label="旧密码：" prop="oldPassword">
                    <el-input v-model="passform.oldPassword" type="password" />
                  </el-form-item>
                  <el-form-item label="新密码：" prop="newPassword">
                    <el-input v-model="passform.newPassword" type="password" />
                  </el-form-item>
                  <el-form-item label="确认密码：" prop="confirmPassword">
                    <el-input
                      v-model="passform.confirmPassword"
                      type="password"
                    />
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="onSave">保存</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
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
  } from '@/api/user'

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
  $base: '.personal-center';

  #{$base}-container {
    padding: 0 !important;
    background: $base-color-background !important;

    #{$base}-user-info {
      padding: $base-padding;
      text-align: center;

      :deep() {
        .el-avatar {
          img {
            cursor: pointer;
            width: 100%;
          }
        }
      }

      &-full-name {
        margin-top: 15px;
        font-size: 24px;
        font-weight: 500;
        color: #262626;
      }

      &-description {
        margin-top: 8px;
      }

      &-follow {
        margin-top: 15px;
      }

      &-list {
        margin-top: 18px;
        line-height: 30px;
        text-align: left;
        list-style: none;

        h5 {
          margin: -20px 0 5px 0;
        }

        :deep() {
          .el-tag {
            margin-right: 10px !important;
          }

          .el-tag + .el-tag {
            margin-left: 0;
          }
        }
      }
    }

    #{$base}-item {
      display: flex;

      i {
        font-size: 40px;
      }

      &-content {
        box-sizing: border-box;
        flex: 1;
        margin-left: $base-margin;

        &-second {
          margin-top: 8px;
        }
      }
    }
  }

  .QRLogin {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: flex-start;

    p {
      width: 256px;
      font-size: 16px;
      font-family: 'Microsoft YaHei';
      font-weight: 400;
      color: #353a45;
      line-height: 32px;
      text-align: center;

      a {
        color: #256ddb;
      }
    }
  }
</style>
