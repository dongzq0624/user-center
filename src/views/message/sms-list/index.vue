<template>
  <div class="dictionary-management-container">
    <an-base-table-search
      ref="searchForm"
      :options="searchOptions"
      @onSearch="onSearch"
    />
    <vab-query-form>
      <an-base-table
        ref="basicTable"
        :async-func="fetchListFunc"
        list-name="sendMessageReceiveList"
        :search-params="searchParams"
        :table-columns="tableColumns"
      >
        <template slot="busiType" slot-scope="{ row }">
          <span>{{ getBusiTypeEnum(row.busiType).value }}</span>
        </template>
      </an-base-table>
    </vab-query-form>
  </div>
</template>

<script>
  import { sendMessageReceiveList } from '@/api/common/message'
  import { findByKey, toList, SMS_BUSI_TYPE } from '@/constant/Enums'

  export default {
    components: {},
    data() {
      return {
        searchOptions: [
          { key: 'phoneNo', label: '手机号' },
          { key: 'receiveName', label: '接收人' },
          {
            key: 'sendStartTime',
            key2: 'sendEndTime',
            type: 'daterange',
            label: '发送时间',
          },
          {
            key: 'busiType',
            label: '业务类型',
            type: 'select',
            optionList: toList(SMS_BUSI_TYPE),
          },
        ],
        searchParams: {},
        tableColumns: [
          { key: 'phoneNo', title: '接收手机号', width: 140 },
          { key: 'receiveName', title: '接收人', width: 90 },
          { key: 'busiType', title: '业务类型', width: 90, type: 'slot' },
          { key: 'sendTime', title: '发送时间', width: 180 },
          { key: 'msgContent', title: '消息内容', align: 'left' },
        ],
        fetchListFunc: sendMessageReceiveList,
      }
    },
    mounted() {
      this.queryList()
    },
    methods: {
      //请求列表
      queryList() {
        this.$refs.basicTable.fetchData()
      },
      //搜索回调
      onSearch(searchParams) {
        this.searchParams = searchParams
        this.queryList()
      },
      getBusiTypeEnum(key) {
        return findByKey(SMS_BUSI_TYPE, key)
      },
    },
  }
</script>
