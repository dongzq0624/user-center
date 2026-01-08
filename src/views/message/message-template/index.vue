<template>
  <div class="menu-management-container">
    <vab-query-form>
      <vab-query-form-left-panel :span="24">
        <el-button
          v-permissions="['system_message_template_add']"
          icon="el-icon-plus"
          type="primary"
          @click="showEdit"
        >
          新增
        </el-button>
      </vab-query-form-left-panel>
    </vab-query-form>
    <el-row :gutter="20">
      <el-col :lg="5" :md="8" :sm="24" :xl="4" :xs="24">
        <el-card :body-style="{ minHeight: '450px' }" shadow="hover">
          <application-tree @node-click="handleNodeClick" />
        </el-card>
      </el-col>
      <el-col :lg="19" :md="16" :sm="24" :xl="20" :xs="24">
        <xc-base-table
          ref="basicTable"
          :async-func="fetchListFunc"
          list-name="messageTemplateList"
          :search-params="{
            applicationId: selectedNode.applicationId,
            ...searchParams,
          }"
          :table-columns="tableColumns"
        >
          <template slot="noticeType" slot-scope="{ row }">
            <span>{{ getNoticeTypeEnum(row.noticeType).value }}</span>
          </template>

          <template slot="pushModel" slot-scope="{ row }">
            <template
              v-for="(item, index) in row.pushModel.split(',')"
              v-if="row.pushModel"
            >
              <el-tag :key="index" size="small">
                {{ getPushModelEnum(item).value }}
              </el-tag>
            </template>
          </template>

          <template slot="templateContent" slot-scope="{ row }">
            <a href="javascript:void(0)" @click="showContent(row)">
              <vab-icon icon="eye-fill" />
            </a>
          </template>

          <template slot="operation" slot-scope="{ row }">
            <el-button
              v-permissions="['system_message_template_edit']"
              type="text"
              @click="showEdit(row)"
            >
              编辑
            </el-button>
            <el-button
              v-permissions="['system_message_template_delete']"
              type="text"
              @click="handleDelete(row.id)"
            >
              删除
            </el-button>
          </template>
        </xc-base-table>
      </el-col>
    </el-row>

    <xc-base-form-dialog
      ref="editRef"
      :add-func="addFunc"
      :detail-func="detailFunc"
      :handle-detail-data="handleDetailData"
      :handle-submit-data="handleSubmitData"
      :options="formOptions"
      :show-title-prefix="true"
      title="模板"
      @ok="queryList"
    >
      <template slot="organizationPersonList" slot-scope="{ data }">
        <member-select
          multiple
          :show-types="['department']"
          type="list"
          :value="
            data.organizationPersonList ? data.organizationPersonList : []
          "
          @onChange="
            (value) => {
              directorOnChange(data, value)
            }
          "
        />
      </template>
    </xc-base-form-dialog>
  </div>
</template>

<script>
  import {
    messageTemplateList,
    saveMessageTemplate,
    messageTemplateDetail,
    messageTemplateDelete,
  } from '@/api/message'
  import {
    findByKey,
    toList,
    MESSAGE_NOTICE_TYPE,
    MESSAGE_PUSH_MODEL,
  } from '@/constant/Enums'

  export default {
    components: {
      ApplicationTree: () => import('@/components/applicationTree'),
    },
    data() {
      return {
        selectedNode: {},

        searchParams: {},
        tableColumns: [
          { type: 'selection', width: 60 },
          { key: 'templateCode', title: '模板编码', width: 180, align: 'left' },
          { key: 'templateName', title: '模板名称', width: 300, align: 'left' },
          { key: 'noticeType', title: '通知类型', width: 120, type: 'slot' },
          { key: 'pushModel', title: '推送方式', width: 160, type: 'slot' },
          { key: 'templateContent', title: '模板内容', type: 'slot' },
          { key: 'operation', title: '操作', type: 'slot', width: 150 },
        ],
        fetchListFunc: messageTemplateList,

        formOptions: [
          {
            key: 'applicationName',
            label: '所属应用',
            span: 24,
            disabled: true,
          },
          { key: 'templateCode', label: '模板编码', required: true, span: 12 },
          { key: 'templateName', label: '模板名称', required: true, span: 12 },
          { key: 'messageTitle', label: '消息标题', required: true, span: 24 },
          {
            key: 'templateContent',
            label: '消息内容',
            type: 'textarea',
            required: true,
            span: 24,
          },
          {
            key: 'pushModelList',
            label: '推送方式',
            type: 'select',
            optionList: toList(MESSAGE_PUSH_MODEL),
            multiple: true,
            required: true,
            span: 12,
          },
          {
            key: 'noticeType',
            label: '通知类型',
            type: 'select',
            optionList: toList(MESSAGE_NOTICE_TYPE),
            required: true,
            span: 12,
          },
          {
            key: 'organizationPersonList',
            label: '接收人',
            type: 'slot',
            required: true,
            span: 24,
            hideRule: this.personListHideRule,
          },
        ],
        addFunc: saveMessageTemplate, //新增请求方法
        detailFunc: messageTemplateDetail, //详情请求方法
      }
    },
    mounted() {},
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
      handleNodeClick(node) {
        this.selectedNode = node
        this.queryList()
      },
      getNoticeTypeEnum(key) {
        return findByKey(MESSAGE_NOTICE_TYPE, key)
      },
      getPushModelEnum(key) {
        return findByKey(MESSAGE_PUSH_MODEL, key)
      },
      directorOnChange(dataInfo, value) {
        this.$set(dataInfo, 'organizationPersonList', [...value])
        //  this.$refs['formRef'].clearValidate('directors')
      },
      showContent(row) {
        this.$alert(row.templateContent, '消息内容', {
          confirmButtonText: '确定',
        })
      },
      personListHideRule(dataInfo) {
        return dataInfo.noticeType != MESSAGE_NOTICE_TYPE.SINGLE.key
      },
      showEdit(row) {
        this.$refs.editRef.refreshOptions(
          this.formOptions,
          'applicationName',
          'defaultValue',
          this.selectedNode.applicationName
        )
        if (row) {
          this.$refs.editRef.show(row.id)
        } else {
          this.$refs.editRef.show()
        }
      },
      //删除
      handleDelete(id) {
        this.$baseConfirm('你确定要删除选中项吗', null, async () => {
          const { message } = await messageTemplateDelete({ id: id })
          this.$baseMessage(message, 'success', 'vab-hey-message-success')
          this.queryList()
        })
      },
      handleSubmitData(dataInfo) {
        dataInfo.applicationId = this.selectedNode.applicationId
        dataInfo.pushModel = dataInfo.pushModelList.join(',')
      },
      handleDetailData(dataInfo) {
        dataInfo.applicationName = this.selectedNode.applicationName
        dataInfo.pushModelList = dataInfo.pushModel.split(',')
      },
    },
  }
</script>

<style lang="scss" scoped>
  $base: '.menu-management';
  #{$base}-container {
    // padding: 0 !important;
    // background: $base-color-background !important;
  }
</style>
