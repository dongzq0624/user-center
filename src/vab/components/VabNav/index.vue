<template>
  <div class="vab-nav">
    <el-row :gutter="15" justify="space-between" type="flex">
      <el-col
        :lg="HasCenterNav ? 4 : 12"
        :md="HasCenterNav ? 4 : 12"
        :sm="HasCenterNav ? 4 : 12"
        :xl="HasCenterNav ? 4 : 12"
        :xs="4"
      >
        <div class="left-panel">
          <vab-fold v-if="layout !== 'float'" />
          <el-tabs
            v-if="layout === 'comprehensive'"
            v-model="extra.first"
            tab-position="top"
            @tab-click="handleTabClick"
          >
            <template v-for="(route, index) in handleRoutes">
              <el-tab-pane :key="index + route.name" :name="route.name">
                <span slot="label">
                  <svg-icon
                    v-if="route.meta.icon"
                    :icon="route.meta.icon"
                    :is-custom-svg="route.meta.isCustomSvg"
                    style="min-width: 16px"
                  />
                  {{ translateTitle(route.meta.title) }}
                </span>
              </el-tab-pane>
            </template>
          </el-tabs>
          <vab-breadcrumb v-else class="hidden-xs-only" />
        </div>
      </el-col>
      <el-col v-if="HasCenterNav" :lg="16" :md="16" :sm="16" :xl="16">
        <div class="nav_list">
          <router-link
            v-if="checkPermission('ActivityBoard')"
            :to="`/project-management/activity-board?id=${projectId}`"
          >
            项目看板
          </router-link>
          <!-- <router-link to="/">活动日历</router-link> -->
          <router-link
            v-if="checkPermission('Activitytable')"
            :to="`/project-management/activity-table?id=${projectId}`"
          >
            项目表格
          </router-link>
          <router-link
            v-if="checkPermission('Ganttchart')"
            :to="`/project-management/gantt-chart?id=${projectId}`"
          >
            甘特图
          </router-link>
          <router-link
            v-if="checkPermission('Documentation')"
            :class="{ active: fileShow }"
            :to="`/project-management/file-list?id=${projectId}`"
          >
            文件资料
          </router-link>

          <router-link
            v-if="checkPermission('ProjectSummary')"
            :to="`/project-management/project-overview?id=${projectId}`"
          >
            项目概要
          </router-link>
          <router-link
            v-if="checkPermission('Safety_matters')"
            :to="`/project-management/safety-matters?id=${projectId}&type=staff`"
          >
            安全事项
          </router-link>
          <router-link
            v-if="checkPermission('supervision_log')"
            :to="`/project-management/supervision-log?id=${projectId}`"
          >
            监理日志
          </router-link>
          <router-link
            v-if="checkPermission('supervision_contact_list')"
            :to="`/project-management/contact-list?id=${projectId}`"
          >
            监理联系单
          </router-link>

          <router-link
            v-if="checkPermission('feedback')"
            :to="`/project-management/project-feedback?id=${projectId}`"
          >
            民情反馈
          </router-link>

          <router-link
            v-if="checkPermission('materials_planned_order')"
            :to="`/project-management/materials-planned-order?id=${projectId}`"
          >
            材料计划单
          </router-link>

          <!-- <el-dropdown trigger="click" @command="handleCommand">
            <a class="el-dropdown-link" :class="{ active: activeShow }">
              {{ activeName }}
              <i class="el-icon-caret-bottom el-icon--right"></i>
            </a>
            <el-dropdown-menu slot="dropdown" class="header_new_drop">
              <el-dropdown-item command="overview">项目概要</el-dropdown-item>
              <el-dropdown-item command="safety">安全事项</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown> -->
        </div>
      </el-col>
      <el-col
        :lg="HasCenterNav ? 4 : 12"
        :md="HasCenterNav ? 4 : 12"
        :sm="HasCenterNav ? 4 : 12"
        :xl="HasCenterNav ? 4 : 12"
        :xs="20"
      >
        <div class="right-panel">
          <vab-error-log />
          <vab-full-screen width="20" height="20" style="margin-right: 15px" />
          <!--<vab-language />-->
          <vab-refresh width="20" height="20" />
          <vab-avatar />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { translateTitle } from '@/utils/i18n'
  import { mapGetters } from 'vuex'
  import { openFirstMenu } from '@/config'

  export default {
    name: 'VabNav',
    props: {
      layout: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        firstMenu: '',
        HasCenterNav: false,
        activeName: '更多',
        activeShow: false,
        fileShow: false,
      }
    },
    created() {},
    computed: {
      ...mapGetters({
        extra: 'settings/extra',
        routes: 'routes/routes',
        projectPermission: 'acl/projectPermission',
      }),
      checkPermission() {
        return function (code) {
          if (this.projectPermission.includes(code)) {
            return true
          } else {
            return false
          }
        }
      },
      handleRoutes() {
        return this.routes.filter(
          (route) => route.meta && route.meta.hidden !== true
        )
      },
      projectId() {
        return this.$route.query.id
      },
      handleActiveMenu() {
        return this.routes.find((route) => route.name === this.extra.first)
      },
      handlePartialRoutes() {
        const activeMenu = this.handleActiveMenu
        return activeMenu ? activeMenu.children : []
      },
    },
    watch: {
      $route: {
        handler(route) {
          if (route.name == 'project-overview') {
            this.activeShow = true
            this.activeName = '概要'
          } else if (route.name == 'safety-matters') {
            this.activeShow = true
            this.activeName = '安全事项'
          } else if (route.name == 'folder-file') {
            this.fileShow = true
          } else {
            this.fileShow = false
            this.activeShow = false
            this.activeName = '更多'
          }
          this.handleNoCenterNav()
          const firstMenu = route.matched[0].name
          if (this.extra.first !== firstMenu) {
            this.extra.first = firstMenu
            this.handleTabClick(true)
          }
        },
        immediate: true,
      },
    },
    methods: {
      handleCommand(val) {
        if (val == 'safety') {
          this.$router.push(
            `/project-management/safety-matters?id=${this.projectId}&type=staff`
          )
        } else if (val == 'overview') {
          this.$router.push({
            name: 'project-overview',
            query: {
              id: this.projectId,
            },
          })
        }
      },
      translateTitle,
      handleTabClick(handler) {
        if (handler !== true && openFirstMenu)
          this.$router.push(this.handleActiveMenu)
      },
      handleNoCenterNav() {
        if (this.$route.meta.HasCenterNav) {
          this.HasCenterNav = true
        } else {
          this.HasCenterNav = false
        }
      },
    },
  }
</script>
<style>
  .header_new_drop li {
    width: 160px !important;
    line-height: 40px !important;
    color: #606266 !important;
    font-size: 14px !important;
  }
</style>
<style lang="scss" scoped>
  .vab-nav {
    position: relative;
    height: $base-nav-height;
    padding-right: $base-padding;
    padding-left: $base-padding;
    overflow: hidden;
    user-select: none;
    background: $base-color-white;
    box-shadow: $base-box-shadow;

    .left-panel {
      display: flex;
      align-items: center;
      justify-items: center;
      height: $base-nav-height;

      :deep() {
        .fold-unfold {
          margin-right: $base-margin;
        }

        .el-tabs {
          width: 100%;
          margin-left: $base-margin;

          .el-tabs__header {
            margin: 0;

            > .el-tabs__nav-wrap {
              display: flex;
              align-items: center;

              .el-icon-arrow-left,
              .el-icon-arrow-right {
                font-weight: 600;
                color: $base-color-grey;
              }
            }
          }

          .el-tabs__item {
            text-align: center;
            > div {
              display: flex;
              align-items: center;

              i {
                margin-right: 3px;
              }
            }
          }
        }

        .el-tabs__nav-wrap::after {
          display: none;
        }
      }
    }
    .nav_list {
      a {
        font-size: 14px;
        font-family: 'Microsoft YaHei';
        font-weight: 400;
        color: #303133;
        line-height: 60px;
        width: 100px;
        display: inline-block;
        text-align: center;
      }
      .router-link-active {
        border-bottom: 2px solid #1890ff;
        color: #1890ff;
        height: 58px;
      }
      .active {
        border-bottom: 2px solid #1890ff;
        color: #1890ff;
        height: 58px;
      }
    }
    .right-panel {
      display: flex;
      align-content: center;
      align-items: center;
      justify-content: flex-end;
      height: $base-nav-height;

      :deep() {
        [class*='ri-'] {
          margin-left: $base-margin;
          color: $base-color-grey;
          cursor: pointer;
        }

        button {
          [class*='ri-'] {
            margin-left: 0;
            color: $base-color-white;
            cursor: pointer;
          }
        }
      }
    }
  }
</style>
