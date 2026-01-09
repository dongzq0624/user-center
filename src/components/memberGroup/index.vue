<template>
  <div class="member_setting">
    <el-dialog
      append-to-body
      :before-close="hide"
      center
      title="用户组管理"
      :visible.sync="visible"
      width="800"
    >
      <div class="group_container">
        <div class="group_setting_box">
          <div class="box_title">
            <span>用户组·{{ groupList.length }}</span>
            <div class="control_item" @click="addGroupOnClick">
              <i class="el-icon-circle-plus-outline"></i>
            </div>
          </div>
          <div class="box_content">
            <div v-show="addGroupInputVisible" class="input_box">
              <el-input
                ref="addGroupInput"
                v-model="addGroupName"
                clearable
                placeholder="请输入用户组名称，按回车键保存"
                size="medium"
                @blur="cancelAddGroup"
                @keyup.enter.native="addGroupNameOnSubmit"
              />
            </div>
            <div v-if="groupList.length > 0" class="list_box">
              <div
                v-for="(group, index) in groupList"
                :key="group.id"
                class="list_item"
                :class="{ active: index === selectGroup }"
              >
                <template v-if="editGroup && selectGroup === index">
                  <div class="input_item">
                    <el-input
                      ref="editGroupInput"
                      v-model="group.name"
                      clearable
                      placeholder="请输入用户组名称，按回车键保存"
                      size="medium"
                      @blur="cancelEditGroup"
                      @keyup.enter.native="
                        editGroupNameOnSubmit(group.id, group.name)
                      "
                    />
                  </div>
                </template>
                <template v-else>
                  <div class="text" @click="groupOnClick(index)">
                    <vab-icon icon="group-line" />
                    {{ group.name }} （{{ group.membersNum || '0' }}人）
                  </div>
                  <div class="control_box">
                    <vab-icon
                      icon="edit-line"
                      style="margin: 0 10px"
                      @click.stop="editGroupOnClick(index)"
                    />
                    <el-popconfirm
                      title="是否确定删除分组？"
                      @confirm="groupOnDelete(group.id)"
                    >
                      <vab-icon
                        icon="delete-bin-line"
                        slot="reference"
                        style="margin: 0 10px"
                      />
                    </el-popconfirm>
                  </div>
                </template>
              </div>
            </div>
            <el-empty v-else description="暂无群组" />
          </div>
        </div>
        <div class="group_setting_box">
          <template v-if="selectGroup > -1 && selectGroup < groupList.length">
            <div class="member_control">
              <div class="control_item">
                <member-select
                  :multiple="true"
                  placement="left-end"
                  :show-value="false"
                  :value="memberList"
                  @onChange="changeMemberList"
                >
                  <div slot="result">
                    <vab-icon icon="add-line" />
                    新增成员
                  </div>
                </member-select>
              </div>
            </div>
            <div class="box_content">
              <div v-if="memberList.length > 0" class="list_box">
                <div
                  v-for="member in memberList"
                  :key="member.userId"
                  class="list_item"
                >
                  <div class="text">
                    <div
                      class="portrait"
                      :style="{ background: member.avatar }"
                    >
                      {{ member.singleName }}
                    </div>
                    {{ member.userName }}
                  </div>
                  <div class="control_box">
                    <vab-icon
                      icon="close-line"
                      @click="memberOnDelete(member.userId)"
                    />
                  </div>
                </div>
              </div>
              <el-empty v-else description="暂无成员" />
            </div>
          </template>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {
    userGroupList,
    saveUserGroup,
    deleteUserGroup,
    joinMember,
    eliminateMember,
    groupMemberList,
  } from '@/api/common/components'
  export default {
    name: 'MemberGroup',
    props: ['applicationId'],
    data() {
      return {
        visible: false,
        addGroupInputVisible: false,
        editGroup: false,
        selectGroup: 0,
        addGroupName: '',
        groupList: [],
        memberList: [],
      }
    },
    created() {},
    methods: {
      groupOnClick(index) {
        if (this.selectGroup !== index) {
          this.selectGroup = index
          this.getMembersByGroup()
        }
      },
      editGroupOnClick(index) {
        this.selectGroup = index
        this.editGroup = true
        this.$nextTick(() => {
          console.log(this.$refs.editGroupInput)
          this.$refs.editGroupInput[index].focus()
        })
      },
      cancelEditGroup() {
        this.editGroup = false
        this.getGroupList()
      },
      addGroupOnClick() {
        this.addGroupName = ''
        this.addGroupInputVisible = true
        this.$nextTick(() => {
          this.$refs.addGroupInput.focus()
        })
      },
      cancelAddGroup() {
        if (!this.addGroupName) {
          this.addGroupInputVisible = false
        }
      },
      editGroupNameOnSubmit(id, name) {
        const params = { id, name }
        this.addGroup(params)
      },
      addGroupNameOnSubmit() {
        const params = { name: this.addGroupName }
        this.addGroup(params)
      },
      show(index) {
        if (index && index > -1) {
          this.groupOnClick(index)
        }
        this.getGroupList()
        this.visible = true
      },
      hide() {
        this.visible = false
      },
      getMembersByGroup() {
        if (this.selectGroup < this.groupList.length) {
          groupMemberList({
            groupId: this.groupList[this.selectGroup].id,
          }).then((res) => {
            this.memberList = res.result.groupMemberList.map((item) => {
              item.singleName = item.userName
                ? item.userName.substring(item.userName.length - 2)
                : ''
              return item
            })
          })
        }
      },

      changeMemberList(value) {
        // console.log(value)
        const params = {
          groupMemberList: value.map((item) => {
            return {
              groupId: this.groupList[this.selectGroup].id,
              ...item,
            }
          }),
        }
        console.log(params)
        joinMember(params).then((res) => {
          if (res.code == 200) {
            this.getGroupList()
            this.$emit('change')
          }
        })
      },
      memberOnDelete(userId) {
        const params = {
          groupId: this.groupList[this.selectGroup].id,
          memberList: [userId],
        }
        this.removeMemberByGroup(params)
        this.$emit('change')
      },
      removeMemberByGroup(params) {
        eliminateMember(params).then((res) => {
          if (res.code == 200) {
            this.$message.success('操作成功')
            this.getGroupList()
          }
        })
      },
      groupOnDelete(id) {
        deleteUserGroup({ id }).then((res) => {
          if (res.code == 200) {
            this.$message.success('删除')
            this.getGroupList()
            this.$emit('change')
          }
        })
      },
      getGroupList() {
        userGroupList({
          applicationId: this.applicationId || '',
          pageSize: 9999,
          pageNum: 1,
        }).then((res) => {
          this.groupList = res.result.userGroupList
          this.getMembersByGroup()
        })
      },
      addGroup(params) {
        if (this.applicationId) params.applicationId = this.applicationId
        saveUserGroup(params).then((res) => {
          if (res.code == 200) {
            this.$message.success(params.id ? '修改成功' : '新增成功')
            this.addGroupInputVisible = false
            this.getGroupList()
            this.$emit('change')
          }
        })
      },
    },
  }
</script>
<style lang="scss" scoped>
  @import './index.scss';
</style>
