<template>
  <div class="login-container">
    <div class="left-panel">
      <div class="logo-section">
        <el-image class="image" :src="require('@/assets/img/logo-blue.png')" />
      </div>

      <div class="illustration"></div>

      <div class="description">
        <h1 class="title">欢迎使用统一用户管理平台</h1>
        <p class="subtitle">安全、高效、便捷的用户管理系统</p>
      </div>
    </div>

    <div class="right-panel">
      <div class="login_box">
        <el-form
          ref="form"
          class="login-form"
          label-position="left"
          :model="form"
          :rules="rules"
        >
        <div class="title-tips">
          {{ translateTitle('统一用户管理平台') }}
        </div>
        <el-form-item prop="username" style="margin-top: 30px">
          <el-input
            v-model.trim="form.username"
            v-focus
            :placeholder="translateTitle('请输入用户名')"
            tabindex="1"
            type="text"
          >
            <template #prefix>
              <span class="my_label">账号</span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            :key="passwordType"
            ref="passwordRef"
            v-model.trim="form.password"
            :placeholder="translateTitle('请输入密码')"
            tabindex="2"
            :type="passwordType"
            @keyup.enter="handleLogin"
          >
            <template #prefix>
              <span class="my_label">密码</span>
            </template>
            <template #suffix>
              <span @click="handlePassword">
                <svg-icon
                class="show-password"
                :icon="passwordType === 'password' ? 'eye-line' : 'eye-off-line'"
              />
              </span>
        
            </template>
          </el-input>
        </el-form-item>
        <!-- 验证码验证逻辑需自行开发，如不需要验证码功能建议注释 -->
        <!-- <el-form-item prop="verificationCode">
                <el-input
                  v-model.trim="form.verificationCode"
                  :placeholder="translateTitle('验证码') + previewText"
                  tabindex="3"
                  type="text"
                >
                  <template #prefix>
                    <svg-icon icon="barcode-box-line" />
                  </template>
                </el-input>
                <el-image class="code" :src="codeUrl" @click="changeCode" />
              </el-form-item> -->
        <el-button
          class="login-btn"
          :loading="loading"
          style="font-size: 20px"
          type="primary"
          @click="handleLogin"
        >
          {{ translateTitle('登录') }}
        </el-button>
        <!-- <router-link to="/register">
                <div style="margin-top: 20px">{{ translateTitle('注册') }}</div>
              </router-link> -->

        <PuzzleVerify
          v-show="verifyShow"
          ref="PuzzleVerify"
          @hideVerify="verifyShow = false"
          @onSuccess="verifySuccess"
        />
        </el-form>
      </div>
    </div>

    <!-- 密码过期,修改密码 -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <el-alert
        :closable="false"
        effect="dark"
        title="您的密码已过期。请先修改密码"
        type="warning"
      />
      <div class="passwordBox">
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
            <el-input v-model="passform.confirmPassword" type="password" />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSave">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import { translateTitle } from '@/utils/i18n'
  import { isPassword } from '@/utils/validate'
  import { changePassword } from '@/api/user/user'
  import store from '@/store'
  export default {
    name: 'Login',
    components: {
      PuzzleVerify: () => import('@/components/PuzzleVerify'),
    },
    directives: {
      focus: {
        inserted(el) {
          el.querySelector('input').focus()
        },
      },
    },
    beforeRouteLeave(to, from, next) {
      clearInterval(this.timer)
      next()
    },
    data() {
      const validateUsername = (rule, value, callback) => {
        if ('' === value)
          callback(new Error(this.translateTitle('用户名不能为空')))
        else callback()
      }
      const validatePassword = (rule, value, callback) => {
        if (!isPassword(value))
          callback(new Error(this.translateTitle('密码不能少于6位')))
        else callback()
      }
      const validateMust = (rule, value, callback) => {
        if (!value) {
          callback(new Error('旧密码不能为空'))
        } else {
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
      return {
        form: {
          username: '',
          password: '',
          // verificationCode: '',
        },
        rules: {
          username: [
            {
              required: true,
              trigger: 'blur',
              validator: validateUsername,
            },
          ],
          password: [
            {
              required: true,
              trigger: 'blur',
              validator: validatePassword,
            },
          ],
          /* verificationCode: [
          {
            required: true,
            trigger: 'blur',
            message: '验证码不能空',
          },
        ], */
        },
        loading: false,
        passwordType: 'password',
        redirect: undefined,
        timer: 0,
        codeUrl: 'https://www.oschina.net/action/user/captcha',
        previewText: '',
        dialogVisible: false,
        passform: {},
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
        errorCode: '',

        verifyShow: false, // 是否显示拼图验证
      }
    },
    computed: {
      ...mapGetters({
        title: 'settings/title',
        isExpiration: 'user/isExpiration',
        loginUserId: 'user/loginUserId',
      }),
    },
    watch: {
      $route: {
        handler(route) {
          this.redirect = (route.query && route.query.redirect) || '/'
        },
        immediate: true,
      },
    },
    methods: {
      async verifySuccess(params) {
        console.log(JSON.stringify(params))
        let requestParams = {
          ...params,
          ...this.form,
        }
        try {
          this.loading = true
          await this.login(requestParams).catch((res) => {
            if (res.code == 99997000) {
              store.commit('user/setIsExpiration', '')
            }
            this.errorCode = res.code
          })
          if (this.isExpiration == 'yes') {
            this.dialogVisible = true
          } else if (this.errorCode == 99997000) {
            this.dialogVisible = false
          } else {
            // await this.$router.push(this.handleRoute())
            await this.$router.push('/')
          }
          this.errorCode = ''
        } finally {
          this.loading = false
        }
        setTimeout(() => {
          this.verifyShow = false
        }, 1000)
      },

      onSave() {
        this.$set(this.passform, 'userId', this.loginUserId)
        this.$refs.passwordRef.validate(async (valid) => {
          if (valid) {
            const { message } = await changePassword(this.passform)
            this.dialogVisible = false
            this.$set(this.passform, 'oldPassword', '')
            this.$set(this.passform, 'newPassword', '')
            this.$set(this.passform, 'confirmPassword', '')
            this.$baseMessage(message, 'success', 'vab-hey-message-success')
          }
        })
      },
      translateTitle,
      handleRoute() {
        console.log(this.redirect)
        return this.redirect === '/404' || this.redirect === '/403'
          ? '/'
          : this.redirect
      },
      handlePassword() {
        this.passwordType === 'password'
          ? (this.passwordType = 'text')
          : (this.passwordType = 'password')
        this.$nextTick(() => {
          this.$refs.passwordRef.focus()
        })
      },
      async handleLogin() {
        this.$refs.form.validate(async (valid) => {
          if (valid) {
            this.$refs.PuzzleVerify.handleClick()
            this.verifyShow = true
          }
        })
      },
      changeCode() {
        this.codeUrl = `https://www.oschina.net/action/user/captcha?timestamp=${new Date().getTime()}`
      },
      ...mapActions({
        login: 'user/login',
      }),
    },
  }
</script>

<style lang="scss" scoped>
  .login-container {
    width: 100%;
    height: 100vh;
    background: #f8fafc;
    display: flex;
    overflow: hidden;

    .left-panel {
      flex: 1;
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      min-width: 400px;
      padding: 60px 40px;
      box-shadow: 2px 0 20px rgba(0, 0, 0, 0.08);

      .logo-section {
        position: absolute;
        top: 40px;
        left: 40px;
        z-index: 10;
      }

      .illustration {
        width: 300px;
        height: 250px;
        background: url('~@/assets/svg/login-box-bg.svg') center center no-repeat;
        background-size: contain;
        margin-bottom: 40px;
      }

      .description {
        text-align: center;
        max-width: 360px;

        .title {
          font-size: 28px;
          font-weight: 700;
          color: #1a202c;
          margin-bottom: 16px;
          line-height: 1.3;
        }

        .subtitle {
          font-size: 16px;
          color: #718096;
          line-height: 1.6;
          margin-bottom: 12px;
        }

        .features {
          display: flex;
          flex-direction: column;
          gap: 8px;

          .feature-item {
            display: flex;
            align-items: center;
            font-size: 14px;
            color: #4a5568;

            &::before {
              content: '✓';
              color: #48bb78;
              font-weight: bold;
              margin-right: 8px;
              font-size: 16px;
            }
          }
        }
      }
    }

    .right-panel {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 40px;
      background: #ffffff;
      min-width: 400px;
    }

    .image {
      height: 50px;
      width: auto;
    }
  }

  // 响应式设计
  @media (max-width: 768px) {
    .login-container {
      flex-direction: column;

      .left-panel {
        flex: none;
        min-width: auto;
        padding: 40px 20px;

        .illustration {
          width: 200px;
          height: 150px;
          margin-bottom: 30px;
        }

        .description {
          .title {
            font-size: 24px;
          }

          .subtitle {
            font-size: 14px;
          }
        }

        .logo-section {
          top: 20px;
          left: 20px;
        }
      }

      .right-panel {
        flex: 1;
        padding: 20px;
      }
    }

    .login-form {
      max-width: 100%;
      padding: 30px 20px;
    }
  }
  .login_box {
    width: 100%;
    max-width: 580px;
  }

  .login-form {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    border-radius: 16px;
    padding: 40px 50px;
    overflow: hidden;
    background-color: #fff;
    width: 100%;
    max-width: 550px;
    border: 1px solid #e2e8f0;
    .title-tips {
      font-size: 24px;
      font-family: 'Microsoft YaHei', sans-serif;
      font-weight: 600;
      color: #2d3748;
      text-align: center;
      margin-bottom: 10px;
    }
    .welcome {
      font-size: 24px;
      font-weight: 400;
      font-style: italic;
      color: #c0c4cc;
      text-align: center;
    }
    .my_label {
      font-size: 14px;
      font-weight: 600;
      color: #4a5568;
      position: absolute;
      width: 50px;
      top: 50%;
      transform: translateY(-50%);
      z-index: 2;
      pointer-events: none;
    }

    .login-btn {
      width: 100%;
      height: 50px;
      margin-top: 30px;
      border: none;
      border-radius: 12px;
      background: #3182ce;
      color: #fff;
      font-size: 16px;
      font-weight: 600;
      transition: all 0.3s ease;
      cursor: pointer;

      &:hover {
        background: #2c5282;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(49, 130, 206, 0.3);
      }

      &:active {
        transform: translateY(0);
      }

      .forget-passwordword {
        width: 100%;
        margin-top: 40px;
        text-align: left;

        .forget-password {
          width: 129px;
          height: 19px;
          font-size: 20px;
          font-weight: 400;
          color: rgba(92, 102, 240, 1);
        }
      }
    }

    .tips {
      margin-bottom: 10px;
      font-size: $base-font-size-default;
      color: var(--el-color-white);
      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }

    .title-container {
      position: relative;

      .title {
        margin: 0 auto 40px auto;
        font-size: 34px;
        font-weight: bold;
        color: var(--el-color-primary);
        text-align: center;
      }
    }

    i {
      position: absolute;
      top: 8px;
      left: 5px;
      z-index: $base-z-index;
      font-size: 16px;
      color: #d7dee3;
      cursor: pointer;
      user-select: none;
    }

    .show-password {
      position: absolute;
      right: 15px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 18px;
      color: #a0aec0;
      cursor: pointer;
      user-select: none;
      z-index: 2;
      transition: color 0.3s ease;

      &:hover {
        color: #667eea;
      }
    }

    ::v-deep {
      .el-form-item {
        padding-right: 0;
        margin: 20px 0;
        color: #454545;
        background: transparent;

        &__content {
          min-height: $base-input-height;
          line-height: $base-input-height;
        }

        &__error {
          position: absolute;
          top: 100%;
          left: 18px;
          font-size: $base-font-size-small;
          line-height: 18px;
          color: var(--el-color-error);
        }
        .el-button {
          span {
            font-size: 20px;
          }
        }
      }

      .el-input {
        box-sizing: border-box;

        input {
          height: 50px;
          min-width: 300px;
          padding: 0 20px 0 55px;
          font-size: 16px;
          border: 1px solid #e1e5e9;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.9);
          transition: all 0.3s ease;
          color: #2c3e50;

          &:focus {
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
            background: #fff;
          }

          &::placeholder {
            color: #a0aec0;
          }
        }
      }

      .code {
        position: absolute;
        top: 4px;
        right: 4px;
        cursor: pointer;
        border-radius: $base-border-radius;
      }
    }
  }
</style>
