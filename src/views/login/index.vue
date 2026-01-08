<template>
  <div class="login-container">
    <el-image class="image" :src="require('@/assets/logo.png')" />

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
            <template v-if="passwordType === 'password'" #suffix>
              <vab-icon
                class="show-password"
                icon="eye-off-line"
                @click="handlePassword"
              />
            </template>
            <template v-else #suffix>
              <vab-icon
                class="show-password"
                icon="eye-line"
                @click="handlePassword"
              />
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
                    <vab-icon icon="barcode-box-line" />
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
      </el-form>
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

    <PuzzleVerify
      v-show="verifyShow"
      ref="PuzzleVerify"
      @hideVerify="verifyShow = false"
      @onSuccess="verifySuccess"
    />
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import { translateTitle } from '@/utils/i18n'
  import { isPassword } from '@/utils/validate'
  import { changePassword } from '@/api/user'
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
          ? (this.passwordType = '')
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
    height: 100%;
    background: url('~@/assets/login_images/background.jpg') center center fixed
      no-repeat;
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    .image {
      height: 50px;
      position: absolute;
      top: 40px;
      left: 40px;
    }
  }
  .login_box {
    width: 480px;
  }

  .login-form {
    box-shadow: 0px 0px 16px 0px rgba(11, 58, 103, 0.6);
    border-radius: 16px;
    padding: 30px 50px 50px 40px;
    margin-bottom: 60px;
    overflow: hidden;
    background-color: #fff;
    background-size: 100% 100%;
    .title-tips {
      font-size: 28px;
      font-family: 'Microsoft YaHei';
      font-weight: bold;
      color: #191f25;
      text-align: center;
    }
    .welcome {
      font-size: 24px;
      font-weight: 400;
      font-style: italic;
      color: #c0c4cc;
      text-align: center;
    }
    .my_label {
      font-size: 18px;
      font-family: 'Microsoft YaHei';
      font-weight: 400;
      color: #191f25;
      line-height: 50px;
    }

    .login-btn {
      display: inherit;
      width: 100%;
      height: 50px;
      margin-top: 48px;
      border: 0;
      background: #005dad;
      span {
        font-size: 20px;
      }
      &:hover {
        opacity: 0.9;
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
      right: 25px;
      left: -35px;
      font-size: 16px;
      color: #d7dee3;
      cursor: pointer;
      user-select: none;
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
          padding-left: 55px;
          font-size: $base-font-size-default;
          line-height: 58px;
          background: #fff;
          border-bottom: 2px #e3e4e4 solid;
          border-top: 0;
          border-left: 0;
          border-right: 0;
          border-radius: 0;
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
