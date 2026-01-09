<template>
  <div v-infinite-scroll="getMailList" class="member_list">
    <div
      v-for="(member, index) in memberList"
      :key="index"
      class="member_item"
      style="overflow: auto"
      @click="membenOnClick(member)"
    >
      <div class="member_info">
        <div
          class="member_portrait"
          :class="member.gender"
          :style="{ background: member.avatar }"
        >
          {{ member.singleName }}
        </div>
        <div class="member_name">{{ member.userName }}</div>
        <div v-if="member.userId === userInfo.id" class="is_self">我自己</div>
      </div>
      <div
        v-if="multiple == false && member.userId === value.userId"
        class="selected"
      >
        <i class="el-icon-check" />
      </div>
      <template v-for="(item, ind) in value">
        <div
          v-if="multiple == true && item.userId == member.userId"
          :key="ind"
          class="selected"
        >
          <i class="el-icon-check" />
        </div>
      </template>
    </div>
  </div>
</template>
<script>
  import { memberList } from '@/api/common/components'
  import { mapGetters } from 'vuex'
  export default {
    name: 'MemberSelect',
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
      searchValue: {
        type: String,
        default: '',
      },
      multiple: {
        //是否支持多选
        type: Boolean,
        default: false,
      },
      disabled: {
        //是否禁用
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        pageNum: 1,
        pageSize: 20,
        isFinish: false,
        memberList: [],
      }
    },
    computed: {
      ...mapGetters({
        userInfo: 'user/userInfo',
      }),
    },
    watch: {
      searchValue() {
        this.isFinish = false
        this.pageNum = 1
        this.getMailList()
      },
    },
    created() {},
    mounted() {},
    methods: {
      getMailList() {
        if (!this.isFinish) {
          let params = {
            realName: this.searchValue,
            pageNum: this.pageNum,
            pageSize: this.pageSize,
          }
          memberList(params).then((res) => {
            let list = res.result.memberNameList.map((item) => {
              item.singleName = item.userName.substring(
                item.userName.length - 2
              )
              return item
            })
            if (this.pageNum == 1) {
              this.memberList = list
            } else {
              this.memberList = this.memberList.concat(list)
            }
            this.pageNum++

            if (list.length < this.pageSize) {
              this.isFinish = true
            }
          })
        }
      },
      membenOnClick(member) {
        if (!this.disabled) {
          this.$emit('onSelect', member)
        }
      },
    },
  }
</script>
