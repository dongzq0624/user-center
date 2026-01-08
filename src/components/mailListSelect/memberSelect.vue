<template>
  <div class="member_list">
    <div
      v-for="(member, index) in memberList"
      :key="index"
      class="member_item"
      @click="membenOnClick(member)"
    >
      <div class="member_info">
        <div
          class="member_portrait"
          :class="member.gender"
          :style="{ background: member.avatar }"
        >
          {{ member.userName.substring(member.userName.length - 2) }}
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
  import { mapGetters } from 'vuex'
  export default {
    name: 'MemberSelect',
    props: {
      memberList: {
        type: Array,
        default: () => [],
      },
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
    computed: {
      ...mapGetters({
        userInfo: 'user/userInfo',
      }),
    },
    mounted() {},
    methods: {
      membenOnClick(member) {
        if (!this.disabled) {
          this.$emit('onSelect', member)
        }
      },
    },
  }
</script>
