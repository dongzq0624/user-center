<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      title="温馨提示"
      :visible="isShowModal"
      width="440px"
      @close="close"
    >
      <div class="tip-modal-container">
        <img src="../../../../assets/img/icon_modal_tip.png" />
        <span>
          {{
            type == 'department'
              ? '当前手机号在代表用户中已存在，是否需要合并账户 ：'
              : '当前手机号在机关用户中已存在，是否需要合并账户 ：'
          }}
        </span>
        <span>
          {{ type == 'department' ? '代表姓名：' : '机关用户姓名：' }}
          <span class="red">{{ name }}</span>
        </span>
        <span>
          {{ type == 'department' ? '所属代表团：' : '所属部门：' }}
          <span class="red">{{ departName }}</span>
        </span>
      </div>
      <template #footer>
        <el-button @click="close">取 消</el-button>
        <el-button :loading="loading" type="primary" @click="merge">
          合 并
        </el-button>
      </template>
    </el-dialog>

    <merge-detail ref="mergeDetail" :type="type" @ok="ok" />
  </div>
</template>

<script>
  import {
    ensurePhoneNoExist,
    deputyDetail, //代表详情
    userDetail, //机关用户详情
  } from '@/api/common/userManagement'
  export default {
    components: {
      MergeDetail: () => import('./mergeDetail'),
    },
    props: {
      type: {
        type: String,
        default: '',
      },
      oldUserInfo: {
        type: Object,
        default: () => {
          return {}
        },
      },
    },
    data() {
      return {
        isShowModal: false,
        loading: false,
        name: '',
        departName: '',
        targetId: '',
      }
    },
    computed: {},
    mounted() {},
    methods: {
      show() {
        this.isShowModal = true
      },
      close() {
        this.isShowModal = false
      },
      check(phoneNo) {
        let params = {
          type: this.type,
          phoneNo,
        }
        ensurePhoneNoExist(params).then((resp) => {
          let detail = resp.result
          if (detail.isExist == 'yes') {
            this.name = detail.realname
            this.departName = detail.organizationName
            this.targetId = detail.userId
            this.show()
          }
        })
      },
      merge() {
        if (this.type == 'department') {
          this.loading = true
          deputyDetail({ userId: this.targetId }).then((resp) => {
            this.loading = false
            let detail = resp.result
            detail.userId = this.targetId
            this.$refs.mergeDetail.show(this.oldUserInfo, detail)
          })
        } else if (this.type == 'delegation') {
          this.loading = true
          userDetail({ id: this.targetId }).then((resp) => {
            this.loading = false
            let detail = resp.result
            detail.userId = this.targetId
            this.$refs.mergeDetail.show(detail, this.oldUserInfo)
          })
        }
      },
      ok() {
        this.$emit('ok')
        this.close()
      },
    },
  }
</script>
<style lang="less" scoped>
  .tip-modal-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    img {
      width: 80px;
      height: 80px;
      margin-bottom: 15px;
    }
    span {
      color: #333333;
      font-size: 16px;
      margin-top: 8px;
    }
    .red {
      color: #ff4d4f;
    }
  }
</style>
