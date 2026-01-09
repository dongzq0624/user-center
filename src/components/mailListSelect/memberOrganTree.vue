<template>
  <div class="member_tree">
    <el-menu unique-opened @open="onOpen">
      <el-submenu v-for="menu in organList" :key="menu.id" :index="menu.id">
        <template slot="title">
          <i class="el-icon-office-building"></i>
          {{ menu.name }}
        </template>
        <div class="tree_content">
          <member-organ-tree
            v-if="isInOpenIds(menu.id)"
            :multiple="multiple"
            :organ-id="menu.id"
            :organ-name="menu.name"
            :value="value"
            @onSelect="getValue"
          />
        </div>
      </el-submenu>
    </el-menu>
    <member-select
      v-if="memberList.length > 0"
      :member-list="memberList"
      :multiple="multiple"
      :value="value"
      @onSelect="membenOnClick"
    />
  </div>
</template>
<script>
  import { organSummaryList, organUserSummaryList } from '@/api/common/components'
  import MemberSelect from './memberSelect'
  export default {
    name: 'MemberOrganTree',
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
      organName: {
        //机构名称
        type: [String, Number],
        default: '',
      },
    },
    data() {
      return {
        organList: [],
        memberList: [],
        openIds: [],
      }
    },
    mounted() {
      this.queryData()
    },
    methods: {
      membenOnClick(member) {
        this.$emit('onSelect', member)
      },
      getValue(val) {
        this.$emit('onSelect', val)
      },
      onOpen(id) {
        if (!this.isInOpenIds(id)) {
          this.openIds.push(id)
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
      queryData() {
        organSummaryList({ parentId: this.organId }).then((resp) => {
          this.organList = resp.result.organSummaryList
        })
        organUserSummaryList({ organId: this.organId }).then((resp) => {
          let list = resp.result.organUserSummaryList
          this.memberList = list.map((data) => {
            return {
              userId: data.id,
              userName: data.realname,
              avatar: data.avatar,
              phoneNo: data.phoneNo,
              organizationId: this.organId,
              organizationName: this.organName,
            }
          })
        })
      },
    },
  }
</script>
