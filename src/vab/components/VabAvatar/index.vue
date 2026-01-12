<template>
  <el-dropdown @command="handleCommand" @visible-change="handleVisibleChange">
    <span class="avatar-dropdown">
      <el-avatar class="user-avatar" :src="avatar" />
      <div class="user-name">
        <span class="hidden-xs-only">{{ username }}</span>
        <svg-icon
          class="vab-dropdown"
          :class="{ 'vab-dropdown-active': active }"
          icon="arrow-down-s-line"
        />
      </div>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="personalCenter">
          <div class="dropdown-content">
            <svg-icon icon="user-line" />
            <span>{{ translateTitle('个人中心') }}</span>
          </div>
        </el-dropdown-item>
        <el-dropdown-item command="logout">
          <div class="dropdown-content">
            <svg-icon icon="logout-circle-r-line" />
            <span>{{ translateTitle('退出登录') }}</span>
          </div>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script>
  import { translateTitle } from '@/utils/i18n'
  import { mapActions, mapGetters } from 'vuex'
  import { toLoginRoute } from '@/utils/routes'

  export default {
    name: 'VabAvatar',
    data() {
      return {
        active: false,
      }
    },
    computed: {
      ...mapGetters({
        avatar: 'user/avatar',
        username: 'user/username',
      }),
    },
    methods: {
      translateTitle,
      ...mapActions({
        _logout: 'user/logout',
      }),
      async handleCommand(command) {
        switch (command) {
          case 'logout':
            this.logout()
            break
          case 'personalCenter':
            await this.$router.push({ name: 'userCenter' })
            break
        }
      },
      handleVisibleChange(val) {
        this.active = val
      },
      async logout() {
        await this._logout()
        await this.$router.push(toLoginRoute(this.$route.fullPath))
      },
    },
  }
</script>

<style lang="scss" scoped>
  .avatar-dropdown {
    display: flex;
    align-content: center;
    align-items: center;
    justify-content: center;
    justify-items: center;

    .user-avatar {
      width: 40px;
      height: 40px;
      margin-left: 15px;
      cursor: pointer;
      border-radius: 50%;
    }

    :deep() {
      .el-avatar > img {
        width: 100%;
      }

      .el-dropdown-menu__item {
        padding: 0;
        height: 40px !important;
        line-height: 40px !important;

        .dropdown-content {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          padding: 0 20px;
          height: 100%;

          svg {
            margin-right: 8px;
            margin-top: 3px;
            flex-shrink: 0;
            width: 16px;
            height: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          span {
            flex: 1;
            display: flex;
            align-items: center;
            font-size: 14px;
            line-height: 1.2;
          }
        }
      }
    }
    .user-name {
      position: relative;
      display: flex;
      align-content: center;
      align-items: center;
      height: 40px;
      margin-left: 6px;
      line-height: 40px;
      cursor: pointer;

      [class*='ri-'] {
        margin-left: 0 !important;
      }
    }
  }
</style>
