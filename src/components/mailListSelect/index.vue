<template>
  <div class="mail_list">
    <div
      v-if="value && value.userId && type === 'input'"
      class="member_clear"
      @click="memberOnClear"
    >
      <i class="el-icon-circle-close" />
    </div>
    <el-popover
      ref="myPopover"
      :disabled="disabled"
      :placement="placement"
      trigger="click"
      width="260"
      @hide="hidePopover"
      @show="onShow"
    >
      <div class="mail_list_box" slot="reference">
        <slot name="result">
          <div v-if="type === 'input'" class="member_input">
            <el-input
              clearable
              :placeholder="'请选择' + title"
              readonly
              :value="selectedMember.userName"
            />
          </div>
          <div v-else-if="type === 'list'" class="selected_list">
            <template v-if="!multiple">
              <div v-if="selectedMember !== undefined" class="selected_item">
                <div class="item_portrait">
                  <div
                    v-if="selectedMember.userName"
                    class="portrait_box"
                    :class="selectedMember.gender"
                    :style="{ background: selectedMember.avatar }"
                  >
                    {{ getSingleName(selectedMember) }}
                  </div>
                  <div v-else class="default_portrait">
                    <svg-icon icon="user-add-line" />
                  </div>
                </div>
                <div class="item_content">
                  <div v-if="selectedMember.userName" class="item_name">
                    {{ selectedMember.userName }}
                  </div>
                  <div v-else class="item_placeholder">
                    {{ title || '请选择' }}
                  </div>
                  <div
                    v-if="title && selectedMember.userName"
                    class="item_title"
                  >
                    {{ title }}
                  </div>
                </div>
              </div>
            </template>
            <template v-else>
              <template
                v-if="selectedMember.length > 0 && selectedMember !== undefined"
              >
                <div
                  v-for="(item, index) in selectedMember"
                  :key="index"
                  class="selected_item"
                >
                  <div class="item_portrait">
                    <div
                      v-if="item.userName"
                      class="portrait_box"
                      :class="item.gender"
                      :style="{ background: item.avatar }"
                    >
                      {{ getSingleName(item) }}
                    </div>
                    <div v-else class="default_portrait">
                      <svg-icon icon="user-add-line" />
                    </div>
                  </div>
                  <div class="item_content">
                    <div v-if="item.userName" class="item_name">
                      <!-- {{ item.userName }} -->
                    </div>
                    <div v-else class="item_placeholder">
                      {{ title || '请选择' }}
                    </div>
                    <div v-if="title && item.userName" class="item_title">
                      {{ title }}
                    </div>
                  </div>
                </div>
              </template>
              <div class="selected_item">
                <div class="item_portrait">
                  <div class="default_portrait">
                    <svg-icon icon="user-add-line" />
                  </div>
                </div>
                <div class="item_content">
                  <div class="item_placeholder">
                    {{ title || '请选择' }}
                  </div>
                </div>
              </div>
            </template>
          </div>
        </slot>
      </div>
      <div class="member_select">
        <div v-if="activeName === 'member'" class="search_box">
          <el-input v-model="searchValue" placeholder="搜索成员">
            <i slot="prefix" class="el-input__icon el-icon-search" />
          </el-input>
        </div>
        <div v-if="isLoadComponent" class="tab_row">
          <div class="tab_box">
            <el-tabs v-model="activeName" @tab-click="tabOnClick">
              <el-tab-pane v-if="showTab('member')" label="成员" name="member">
                <div class="tab_item">
                  <member-page-list
                    :multiple="multiple"
                    :search-value="searchValue"
                    :value="value"
                    @onSelect="membenOnClick"
                  />
                </div>
              </el-tab-pane>
              <el-tab-pane
                v-if="showTab('department')"
                label="部门"
                name="department"
              >
                <div class="tab_item">
                  <!--<member-organ-tree-->
                  <!--v-if="isShowOrgan"-->
                  <!--:multiple="multiple"-->
                  <!--:organ-id="-1"-->
                  <!--:value="value"-->
                  <!--@onSelect="membenOnClick"-->
                  <!--/>-->
                </div>
              </el-tab-pane>
              <el-tab-pane v-if="showTab('group')" label="用户组" name="group">
                <div class="tab_item">
                  <member-group-tree
                    v-if="isShowGroup"
                    ref="groupTree"
                    :multiple="multiple"
                    :value="value"
                    @onSelect="membenOnClick"
                  />
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
          <!--<div-->
          <!--v-if="activeName === 'group'"-->
          <!--class="setting_box"-->
          <!--@click="setGroupOnClick"-->
          <!--&gt;-->
          <!--<i class="el-icon-s-tools"></i>-->
          <!--</div>-->
        </div>
      </div>
    </el-popover>
    <MemberGroup v-if="!disabled" ref="MemberGroup" @change="onGroupUpdate" />
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import MemberGroupTree from './memberGroupTree'
  import MemberPageList from './memberPageList'
  import MemberGroup from '../memberGroup'
  export default {
    name: 'MailSelect',
    components: {
      MemberGroupTree,
      MemberGroup,
      MemberPageList,
    },
    props: {
      value: {
        type: [Object, Array],
        default: () => {
          return (
            {
              userId: '',
              userName: '',
            } | []
          )
        },
      },
      placement: {
        type: String,
        default: 'bottom',
      },
      type: {
        type: String,
        default: 'input', // input--输入框, list--头像列表
      },
      title: {
        type: String,
        default: '',
      },
      multiple: {
        //是否支持多选
        type: Boolean,
        default: false,
      },
      disabled: {
        type: Boolean,
        default: false,
      },
      showTypes: {
        type: [Array],
        default: () => {
          return []
        },
      },
    },
    data() {
      return {
        searchValue: '',
        mailList: [],
        popVisible: false,
        activeName: '',
        groupList: [],
        allMembersList: [],
        isLoadComponent: false, //是否加载组件
        isShowOrgan: false, //是否加载机构
        isShowGroup: false, //是否加载用户组
      }
    },
    computed: {
      selectedMember() {
        let member = {
          userId: '',
          singleName: '',
          userName: '',
        }
        if (this.value) {
          member = this.value
        }

        return member
      },
      ...mapGetters({
        userInfo: 'user/userInfo',
      }),
    },
    watch: {
      value(val) {
        if (this.multiple && val) {
          this.allMembersList = val
        }
      },
    },
    mounted() {
      if (this.multiple && this.value) {
        this.allMembersList = this.value
      }

      if (
        this.showTypes.length == 0 ||
        this.showTypes.find((e) => e == 'member')
      ) {
        this.activeName = 'member'
      } else {
        this.tabOnClick({ name: this.showTypes[0] })
      }
    },
    methods: {
      showTab(tabName) {
        if (
          this.showTypes.length == 0 ||
          this.showTypes.find((e) => e == tabName)
        ) {
          return true
        } else {
          return false
        }
      },
      onShow() {
        if (!this.isLoadComponent) {
          this.isLoadComponent = true
        }
      },
      hidePopover() {
        this.searchValue = ''
      },
      onGroupUpdate() {
        this.$refs.groupTree && this.$refs.groupTree.refresh()
      },
      setGroupOnClick() {
        this.$refs.MemberGroup.show()
      },
      checkOrganData(data) {
        if (data.length > 0) {
          const result = data.map((node) => {
            const obj = {
              name: node.orgName,
              id: node.orgId,
              membersNum: node.membersNum,
              type: 'organ',
              memberTreeList: node.memberTreeList.map((item) => {
                item.singleName = item.userName.substring(
                  item.userName.length - 2
                )
                return item
              }),
              children:
                node.subOrgMemberTree &&
                this.checkOrganData(node.subOrgMemberTree),
            }

            return obj
          })
          return result
        } else {
          return []
        }
      },
      membenOnClick(member) {
        let flag = false
        this.allMembersList.forEach((m, ind, array) => {
          if (m.userId == member.userId) {
            array.splice(ind, 1)
            flag = true
          }
        })
        if (!flag) {
          this.allMembersList.push(member)
        }
        if (this.multiple) {
          this.valueOnChange(this.allMembersList)
        } else {
          if (member.userId === this.value.userId) {
            this.valueOnChange({})
          } else {
            this.valueOnChange(member)
          }
        }
      },
      tabOnClick(tab) {
        switch (tab.name) {
          case 'member':
            break
          case 'department':
            this.isShowOrgan = true
            break
          case 'group':
            this.isShowGroup = true
            break
          default:
            break
        }
        this.activeName = tab.name
      },
      memberOnClear() {
        this.valueOnChange({})
      },
      valueOnChange(value) {
        this.$emit('onChange', value)
        if (value && !this.multiple) {
          this.$refs.myPopover.doClose()
        }
      },
      getSingleName(item) {
        let singleName = item.singleName
        if (!singleName && item.userName) {
          if (item.userName.length <= 2) {
            singleName = item.userName
          } else {
            singleName = item.userName.substring(item.userName.length - 2)
          }
        }
        return singleName
      },
    },
  }
</script>
<style lang="less">
  @import './index.less';
</style>
