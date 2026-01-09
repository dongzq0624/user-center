<template>
  <el-dialog
    :close-on-click-modal="false"
    title="合并"
    :visible="isShowModal"
    width="1400px"
    @close="close"
  >
    <div class="merge-detail-box">
      <div>
        <div class="pic-box" @click="onPropClick(delegationDetail, 'avatar')">
          <div class="row">
            <img
              class="check_box"
              :src="getCheckIcon(delegationDetail.type, 'avatar')"
            />
            代表用户
          </div>
          <img class="pic" :src="delegationDetail.avatar" />
        </div>

        <div
          class="pic-box"
          style="margin-top: 20px"
          @click="onPropClick(departDetail, 'avatar')"
        >
          <div class="row">
            <img
              class="check_box"
              :src="getCheckIcon(departDetail.type, 'avatar')"
            />
            机关用户
          </div>
          <img class="pic" :src="departDetail.avatar" />
        </div>
      </div>

      <div style="flex: 1; paddingleft: 30px; justify-content: center">
        <el-table border :data="list" stripe style="margin-top: 18px">
          <el-table-column align="center" prop="type" width="100">
            <template #default="{ row }">
              <span style="font-size: 14px; font-weight: bold; color: #606266">
                {{ row.type == 'department' ? '机关用户' : '代表用户' }}
              </span>
            </template>
          </el-table-column>

          <template v-for="(item, index) in columnList1">
            <el-table-column
              :key="'column1' + index"
              align="center"
              :label="item.label"
              :prop="item.propName"
            >
              <template #default="{ row }">
                <div class="row" @click="onPropClick(row, item.propName)">
                  <img
                    v-if="row[item.propName]"
                    class="check_box"
                    :src="getCheckIcon(row.type, item.propName)"
                  />
                  {{ getStrByPropName(row, item.propName) }}
                </div>
              </template>
            </el-table-column>
          </template>
        </el-table>

        <el-table border :data="list" stripe style="margin-top: 18px">
          <el-table-column align="center" prop="type" width="100">
            <template #default="{ row }">
              <span style="font-size: 14px; font-weight: bold; color: #606266">
                {{ row.type == 'department' ? '机关用户' : '代表用户' }}
              </span>
            </template>
          </el-table-column>

          <template v-for="(item, index) in columnList2">
            <el-table-column
              :key="'column2' + index"
              align="center"
              :label="item.label"
              :prop="item.propName"
            >
              <template #default="{ row }">
                <div class="row" @click="onPropClick(row, item.propName)">
                  <img
                    v-if="row[item.propName]"
                    class="check_box"
                    :src="getCheckIcon(row.type, item.propName)"
                  />
                  {{ getStrByPropName(row, item.propName) }}
                </div>
              </template>
            </el-table-column>
          </template>
        </el-table>

        <el-table border :data="list" stripe style="margin-top: 18px">
          <el-table-column align="center" prop="type" width="100">
            <template #default="{ row }">
              <span style="font-size: 14px; font-weight: bold; color: #606266">
                {{ row.type == 'department' ? '机关用户' : '代表用户' }}
              </span>
            </template>
          </el-table-column>

          <template v-for="(item, index) in columnList3">
            <el-table-column
              :key="'column3' + index"
              align="center"
              :label="item.label"
              :prop="item.propName"
            >
              <template #default="{ row }">
                <div class="row" @click="onPropClick(row, item.propName)">
                  <img
                    v-if="row[item.propName]"
                    class="check_box"
                    :src="getCheckIcon(row.type, item.propName)"
                  />
                  {{ getStrByPropName(row, item.propName) }}
                </div>
              </template>
            </el-table-column>
          </template>
        </el-table>
      </div>
    </div>
    <template #footer>
      <el-button @click="close">取 消</el-button>
      <el-button :loading="loading" type="primary" @click="submit">
        确 定
      </el-button>
    </template>
  </el-dialog>
</template>

<script>
  import { dictListByCode } from '@/api/components'
  import { USER_GENDER, findByKey } from '@/constant/Enums'
  import { mergeUser } from '@/api/systemManage/userManagement'
  export default {
    components: {},
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
        list: [
          { type: '代表用户', username: '张三' },
          { type: '机关用户', username: '' },
        ],
        columnList1: [
          { propName: 'username', label: '姓名' },
          { propName: 'phoneNo', label: '手机号码' },
          { propName: 'account', label: '账号' },
          { propName: 'genderCode', label: '性别' },
          { propName: 'idCard', label: '身份证号' },
        ],
        columnList2: [
          { propName: 'nation', label: '民族' },
          { propName: 'nativePlace', label: '籍贯' },
          { propName: 'homeAddress', label: '家庭地址' },
          { propName: 'birthday', label: '出生日期' },
          { propName: 'politicalOutlookCode', label: '政治面貌' },
        ],
        columnList3: [
          { propName: 'joinPartyTime', label: '入党时间' },
          { propName: 'workingHours', label: '参加工作时间' },
          { propName: 'educationCode', label: '学历' },
          { propName: 'graduatedUniversity', label: '毕业院校及专业' },
          { propName: 'remark', label: '备注' },
        ],
        delegationDetail: {}, //代表用户信息
        departDetail: {}, //机关用户信息
        propList: [],
        initPropList: [],
        educationList: [], //学历字典列表
        politicalOutlookList: [], //政治面貌字典列表
      }
    },
    computed: {},
    mounted() {
      this.getEducationList()
      this.getPoliticalOutlookList()
    },
    methods: {
      show(departDetail, delegationDetail) {
        departDetail.type = 'department'
        delegationDetail.type = 'delegation'

        this.propList = [
          { propName: 'avatar', type: '' },
          { propName: 'username', type: '' },
          { propName: 'phoneNo', type: '' },
          { propName: 'genderCode', type: '' },
          { propName: 'idCard', type: '' },
          { propName: 'birthday', type: '' },
          { propName: 'homeAddress', type: '' },
          { propName: 'politicalOutlookCode', type: '' },
          { propName: 'educationCode', type: '' },
          { propName: 'account', type: '' },
          { propName: 'nation', type: '' },
          { propName: 'nativePlace', type: '' },
          { propName: 'workingHours', type: '' },
          { propName: 'graduatedUniversity', type: '' },
          { propName: 'joinPartyTime', type: '' },
          { propName: 'remark', type: '' },
          { propName: 'transferDescription', type: 'department' },
          { propName: 'natureOfUnit', type: 'delegation' },
          { propName: 'unitLevel', type: 'delegation' },
          { propName: 'positionsLevel', type: 'delegation' },
          { propName: 'academicLevel', type: 'delegation' },
          { propName: 'occupationClass', type: 'delegation' },
          { propName: 'engagedIndustry', type: 'delegation' },
        ]

        this.propList.forEach((data) => {
          if (!data.type) {
            if (delegationDetail[data.propName]) {
              this.$set(data, 'type', delegationDetail.type)
            } else if (departDetail[data.propName]) {
              this.$set(data, 'type', departDetail.type)
            }
          }
        })

        this.isShowModal = true
        this.departDetail = departDetail
        this.delegationDetail = delegationDetail
        this.list = [this.delegationDetail, this.departDetail]
      },
      close() {
        this.isShowModal = false
      },
      getCheckIcon(type, propName) {
        let icon
        this.propList.forEach((data) => {
          if (propName == data.propName) {
            if (type == data.type) {
              icon = require('../../../../assets/img/icon_checked.png')
            } else {
              icon = require('../../../../assets/img/icon_uncheck.png')
            }
          }
        })
        return icon
      },
      getStrByPropName(row, propName) {
        if (row[propName]) {
          if (propName == 'genderCode') {
            //性别
            let genderEnum = findByKey(USER_GENDER, row[propName])
            return genderEnum.value ? genderEnum.value : row[propName]
          } else if (propName == 'politicalOutlookCode') {
            //政治面貌
            let name = ''
            this.politicalOutlookList.forEach((data) => {
              if (data.code == row[propName]) {
                name = data.name
              }
            })
            return name ? name : row[propName]
          } else if (propName == 'educationCode') {
            //学历
            let name = ''
            this.educationList.forEach((data) => {
              if (data.code == row[propName]) {
                name = data.name
              }
            })
            return name ? name : row[propName]
          } else {
            return row[propName]
          }
        } else {
          return '--'
        }
      },
      onPropClick(row, propName) {
        if (row[propName]) {
          this.propList.forEach((data) => {
            if (propName == data.propName) {
              data.type = row.type
            }
          })
        }
      },
      submit() {
        let params = {
          type: this.type,
        }
        if (this.type == 'department') {
          params.userId = this.departDetail.userId
          params.targetId = this.delegationDetail.userId
        } else if (this.type == 'delegation') {
          params.userId = this.delegationDetail.userId
          params.targetId = this.departDetail.userId
        }
        this.propList.forEach((data) => {
          if (data.type == 'department') {
            params[data.propName] = this.departDetail[data.propName]
          } else if (data.type == 'delegation') {
            params[data.propName] = this.delegationDetail[data.propName]
          } else {
            params[data.propName] = ''
          }
        })

        this.loading = true
        mergeUser(params)
          .then((resp) => {
            this.loading = false
            this.$message.success('合并成功')
            this.$emit('ok')
            this.close()
          })
          .catch(() => {
            this.loading = false
          })
      },
      getEducationList() {
        dictListByCode({
          code: 'education',
        }).then((res) => {
          this.educationList = res.result.dictList
        })
      },
      getPoliticalOutlookList() {
        dictListByCode({
          code: 'political_outlook',
        }).then((res) => {
          this.politicalOutlookList = res.result.dictList
        })
      },
    },
  }
</script>
<style lang="less" scoped>
  .merge-detail-box {
    display: flex;
    flex-direction: row;
    font-size: 14px;
    font-weight: bold;
    color: #606266;
    .row {
      display: flex;
      flex-direction: row;
      align-items: center;
      font-size: 14px;
      color: #303133;
    }
    .check_box {
      width: 16px;
      height: 16px;
      margin-right: 8px;
    }
    .pic-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      .pic {
        width: 128px;
        height: 172px;
        background: #f5f7fa;
        margin-top: 10px;
      }
    }
  }
</style>
