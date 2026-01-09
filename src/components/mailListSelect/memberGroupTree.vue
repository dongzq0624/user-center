<template>
  <div class="member_tree">
    <el-menu unique-opened @open="onOpen">
      <el-submenu v-for="menu in groupList" :key="menu.id" :index="menu.id">
        <template slot="title">
          <i class="el-icon-office-building"></i>
          {{ menu.name }} ({{ menu.membersNum }})
        </template>
        <div class="tree_content">
          <member-select
            v-if="menu.memberList && menu.memberList.length > 0"
            :member-list="menu.memberList"
            :multiple="multiple"
            :value="value"
            @onSelect="membenOnClick"
          />
        </div>
      </el-submenu>
    </el-menu>
  </div>
</template>
<script>
  import { userGroupList, groupMemberList } from '@/api/common/components'
  import MemberSelect from './memberSelect'
  export default {
    name: 'MemberGroupTree',
    components: { MemberSelect },
    props: {
      treeNode: {
        type: Array,
        default: () => [],
      },
      value: {
        type: [Object, Array],
        default: () => {},
      },
      multiple: {
        //是否支持多选
        type: Boolean,
        default: false,
      },
      organId: {
        //机构ID
        type: [String, Number],
        default: '',
      },
    },
    data() {
      return {
        groupList: [],
        memberList: [],
        openIds: [],
      }
    },
    mounted() {
      this.queryGroupList()
    },
    methods: {
      refresh() {
        this.groupList = []
        this.openIds = []
        this.queryGroupList()
      },
      membenOnClick(member) {
        this.$emit('onSelect', member)
      },
      getValue(val) {
        this.$emit('onSelect', val)
      },
      onOpen(id) {
        if (!this.isInOpenIds(id)) {
          //加载数据
          this.queryMemberList(id)
        }
      },
      isInOpenIds(id) {
        let isExist = false
        this.openIds.forEach((openId) => {
          if (id == openId) {
            isExist = true
          }
        })
        return isExist
      },
      queryGroupList() {
        userGroupList({ pageNum: 1, pageSize: 999999 }).then((resp) => {
          this.groupList = resp.result.userGroupList
        })
      },
      queryMemberList(id) {
        groupMemberList({ groupId: id }).then((resp) => {
          this.openIds.push(id)
          let list = resp.result.groupMemberList
          let memberList = list.map((data) => {
            return {
              userId: data.userId,
              userName: data.userName,
              avatar: data.avatar,
            }
          })
          this.groupList.forEach((data) => {
            if (data.id == id) {
              this.$set(data, 'memberList', memberList)
            }
          })
        })
      },
    },
  }
</script>
