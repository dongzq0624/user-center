<template>
  <div class="message">
    <vab-query-form>
      <el-form
        :inline="true"
        label-width="75px"
        :model="queryForm"
        @submit.prevent
      >
        <el-form-item label="发文时间">
          <el-date-picker
            v-model="timeRange"
            end-placeholder="结束日期"
            range-separator="至"
            start-placeholder="开始日期"
            type="daterange"
            value-format="yyyy-MM-dd"
            @change="getTimeRange"
          />
        </el-form-item>
        <el-form-item label="类型">
          <el-select
            v-model="queryForm.type"
            clearable
            placeholder="请选择"
            style="width: 168px"
          >
            <el-option
              v-for="item in checkTypeList"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="类别">
          <el-select
            v-model="queryForm.category"
            clearable
            placeholder="请选择"
            style="width: 168px"
          >
            <el-option
              v-for="item in categoryList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="标题">
          <el-input
            v-model.trim="queryForm.title"
            clearable
            placeholder="请输入标题"
            style="width: 168px"
          />
        </el-form-item>

        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="queryData">
            查询
          </el-button>
        </el-form-item>
      </el-form>
    </vab-query-form>
    <div class="message_line">
      <el-button type="primary" @click="addShow = true">新增</el-button>
    </div>
    <el-table border :data="tableData" style="width: 100%">
      <el-table-column align="center" label="类型" prop="type">
        <template slot-scope="scope">
          <span v-if="scope.row.type == 'link'">链接</span>
          <span v-if="scope.row.type == 'text'">文本</span>
          <span v-if="scope.row.type == 'pdf'">pdf文件</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="类别"
        prop="category"
        width="150"
      />
      <el-table-column align="center" label="标题" prop="title" width="800" />
      <el-table-column align="center" label="发文时间" prop="createTime" />
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="handleEdit(scope.row)">
            编辑
          </el-button>

          <el-popconfirm
            title="确定删除该数据吗？"
            @confirm="deleteList(scope.row)"
          >
            <el-button
              size="mini"
              style="margin-left: 10px"
              type="text"
              slot="reference"
            >
              删除
            </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
      <template slot="empty">
        <no-content :height="400" />
      </template>
    </el-table>

    <div class="page">
      <el-pagination
        background
        :current-page="queryForm.pageNum"
        layout="total,sizes, prev, pager, next, jumper"
        :page-size="queryForm.pageSize"
        :page-sizes="[10, 20, 30, 40]"
        :total="total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </div>
    <!-- 新增公告 -->
    <baseDialog
      :height="620"
      :message-show-model="addShow"
      title="新增"
      :width="800"
      @click="closeForm"
    >
      <div slot="form" class="add_form">
        <el-form
          ref="formLine"
          label-position="top"
          label-width="75px"
          :model="addForm"
          :rules="rules"
          @submit.prevent
        >
          <el-form-item label="标题" prop="title">
            <el-input
              v-model.trim="addForm.title"
              clearable
              placeholder="请输入标题"
            />
          </el-form-item>
          <el-form-item label="类型" prop="type">
            <el-select
              v-model="addForm.type"
              clearable
              placeholder="请选择"
              style="width: 100%"
              @change="getTextType"
            >
              <el-option
                v-for="item in checkTypeList"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="类别" prop="category">
            <el-select
              v-model="addForm.category"
              clearable
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option
                v-for="item in categoryList"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="发布部门" prop="departmentName">
            <el-input
              v-model.trim="addForm.departmentName"
              clearable
              placeholder="请输入发布部门"
            />
          </el-form-item>
          <el-form-item label="发布人" prop="publisher">
            <el-input
              v-model.trim="addForm.publisher"
              clearable
              placeholder="请输入发布人"
            />
          </el-form-item>
          <el-form-item label="摘要" prop="summary">
            <el-input
              v-model.trim="addForm.summary"
              clearable
              placeholder="请输入摘要"
              :rows="3"
              type="textarea"
            />
          </el-form-item>

          <el-form-item v-if="pdfShow" label="内容" prop="content">
            <el-input
              v-if="textAreaShow"
              v-model.trim="addForm.content"
              clearable
              placeholder="请输入内容"
            />

            <quill-editor
              v-if="!textAreaShow"
              ref="QuillEditor"
              v-model="addForm.content"
              class="editor"
              :options="editorOption"
            />

            <el-upload
              ref="my_upload"
              accept="image/jpg, image/jpeg, image/png, image/gif"
              :action="UPLOAD_URL"
              class="avatarUploader"
              :multiple="true"
              :on-success="handelSuccess"
            >
              <el-button class="editor-img-plus" type="text">
                <vab-icon icon="attachment-2" />
                上传附件
              </el-button>
            </el-upload>
          </el-form-item>
          <el-form-item
            v-if="attachShow"
            label="附件"
            prop="attachList"
            :rules="[
              {
                required: attachRequired,
                message: '请选择附件',
                trigger: 'change',
              },
            ]"
          >
            <el-upload
              :action="UPLOAD_URL"
              :file-list="fileList"
              :limit="limit"
              :multiple="true"
              :on-remove="handleRemove"
              :on-success="onSuccess"
            >
              <el-button type="text">
                <vab-icon icon="attachment-2" />
                上传附件
              </el-button>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
      <div
        slot="button"
        style="
          height: 100%;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          padding-right: 20px;
        "
      >
        <el-button @click="addForm = false">取 消</el-button>
        <el-button :loading="loading" type="primary" @click="saveForm">
          确定
        </el-button>
      </div>
    </baseDialog>
  </div>
</template>

<script>
  import {
    noticeList,
    noticeDelete,
    noticeSave,
    noticeDetail,
    getDictListByCode,
  } from '@/api/message'
  import baseDialog from '@/components/base-dialog'
  import { upload_url } from '@/api/project-management/file-list'
  import { baseURL } from '@/config'
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'
  import { quillEditor } from 'vue-quill-editor'
  // 工具栏配置
  const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'], // 加粗 斜体 下划线 删除线 -----['bold', 'italic', 'underline', 'strike']
    ['blockquote', 'code-block'], // 引用  代码块-----['blockquote', 'code-block']
    [{ header: 1 }, { header: 2 }], // 1、2 级标题-----[{ header: 1 }, { header: 2 }]
    [{ list: 'ordered' }, { list: 'bullet' }], // 有序、无序列表-----[{ list: 'ordered' }, { list: 'bullet' }]
    [{ script: 'sub' }, { script: 'super' }], // 上标/下标-----[{ script: 'sub' }, { script: 'super' }]
    [{ indent: '-1' }, { indent: '+1' }], // 缩进-----[{ indent: '-1' }, { indent: '+1' }]
    [{ direction: 'rtl' }], // 文本方向-----[{'direction': 'rtl'}]
    [{ size: ['small', false, 'large', 'huge'] }], // 字体大小-----[{ size: ['small', false, 'large', 'huge'] }]
    [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题-----[{ header: [1, 2, 3, 4, 5, 6, false] }]
    [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色-----[{ color: [] }, { background: [] }]
    [{ font: [] }], // 字体种类-----[{ font: [] }]
    [{ align: [] }], // 对齐方式-----[{ align: [] }]
    ['clean'], // 清除文本格式-----['clean']
    ['image'], // 链接、图片、视频-----['link', 'image', 'video']
  ]
  // toolbar标题
  const titleConfig = [
    { Choice: '.ql-insertMetric', title: '跳转配置' },
    { Choice: '.ql-bold', title: '加粗' },
    { Choice: '.ql-italic', title: '斜体' },
    { Choice: '.ql-underline', title: '下划线' },
    { Choice: '.ql-header', title: '段落格式' },
    { Choice: '.ql-strike', title: '删除线' },
    { Choice: '.ql-blockquote', title: '块引用' },
    { Choice: '.ql-code', title: '插入代码' },
    { Choice: '.ql-code-block', title: '插入代码段' },
    { Choice: '.ql-font', title: '字体' },
    { Choice: '.ql-size', title: '字体大小' },
    { Choice: '.ql-list[value="ordered"]', title: '编号列表' },
    { Choice: '.ql-list[value="bullet"]', title: '项目列表' },
    { Choice: '.ql-direction', title: '文本方向' },
    { Choice: '.ql-header[value="1"]', title: 'h1' },
    { Choice: '.ql-header[value="2"]', title: 'h2' },
    { Choice: '.ql-align', title: '对齐方式' },
    { Choice: '.ql-color', title: '字体颜色' },
    { Choice: '.ql-background', title: '背景颜色' },
    { Choice: '.ql-image', title: '图像' },
    { Choice: '.ql-video', title: '视频' },
    { Choice: '.ql-link', title: '新增链接' },
    { Choice: '.ql-formula', title: '插入公式' },
    { Choice: '.ql-clean', title: '清除字体格式' },
    { Choice: '.ql-script[value="sub"]', title: '下标' },
    { Choice: '.ql-script[value="super"]', title: '上标' },
    { Choice: '.ql-indent[value="-1"]', title: '向左缩进' },
    { Choice: '.ql-indent[value="+1"]', title: '向右缩进' },
    { Choice: '.ql-header .ql-picker-label', title: '标题大小' },
    { Choice: '.ql-header .ql-picker-item[data-value="1"]', title: '标题一' },
    { Choice: '.ql-header .ql-picker-item[data-value="2"]', title: '标题二' },
    { Choice: '.ql-header .ql-picker-item[data-value="3"]', title: '标题三' },
    { Choice: '.ql-header .ql-picker-item[data-value="4"]', title: '标题四' },
    { Choice: '.ql-header .ql-picker-item[data-value="5"]', title: '标题五' },
    { Choice: '.ql-header .ql-picker-item[data-value="6"]', title: '标题六' },
    { Choice: '.ql-header .ql-picker-item:last-child', title: '标准' },
    { Choice: '.ql-size .ql-picker-item[data-value="small"]', title: '小号' },
    { Choice: '.ql-size .ql-picker-item[data-value="large"]', title: '大号' },
    { Choice: '.ql-size .ql-picker-item[data-value="huge"]', title: '超大号' },
    { Choice: '.ql-size .ql-picker-item:nth-child(2)', title: '标准' },
    { Choice: '.ql-align .ql-picker-item:first-child', title: '居左对齐' },
    {
      Choice: '.ql-align .ql-picker-item[data-value="center"]',
      title: '居中对齐',
    },
    {
      Choice: '.ql-align .ql-picker-item[data-value="right"]',
      title: '居右对齐',
    },
    {
      Choice: '.ql-align .ql-picker-item[data-value="justify"]',
      title: '两端对齐',
    },
  ]

  export default {
    name: 'Message',
    components: {
      baseDialog,
      quillEditor,
    },
    data() {
      return {
        queryForm: {
          pageNum: 1,
          pageSize: 10,
        },
        timeRange: [],
        tableData: [],
        total: 0,
        checkTypeList: [
          {
            name: '链接',
            value: 'link',
          },
          {
            name: '文本',
            value: 'text',
          },
          {
            name: 'pdf文件',
            value: 'pdf',
          },
        ],
        addShow: false,
        addForm: {
          topFlag: '1',
          title: '',
          type: '',
          departmentName: '',
          publisher: '',
          summary: '',
          content: '',
          attachList: [],
          category: '',
        },
        UPLOAD_URL: '',
        fileList: [],
        attachRequired: false, //附件必传
        rules: {
          title: [
            { required: true, message: '请输入公告标题', trigger: 'blur' },
          ],
          type: [
            { required: true, message: '请选择公告类型', trigger: 'change' },
          ],
          category: [
            { required: true, message: '请选择公告类别', trigger: 'change' },
          ],
          content: [
            { required: true, message: '请输入公告内容', trigger: 'blur' },
          ],
        },
        loading: false,
        fileUrlList: [],
        editorOption: {
          //  富文本编辑器配置
          modules: {
            //工具栏定义的
            toolbar: toolbarOptions,
          },
          //主题
          theme: 'snow',
          placeholder: '请输入正文',
        },
        textAreaShow: false,
        pdfShow: true,
        attachShow: true, //附件
        limit: 8,
        categoryList: [],
      }
    },
    computed: {},
    watch: {},
    created() {
      this.UPLOAD_URL = baseURL + upload_url
      this.noticeList()
      this.getCategory()
    },
    mounted() {
      this.initTitle()
      var _this = this
      var imgHandler = async function (image) {
        if (image) {
          document.querySelector('.editor-img-plus').click()
        }
      }
      _this.$refs.QuillEditor.quill
        .getModule('toolbar')
        .addHandler('image', imgHandler)
    },
    methods: {
      //获取文件类别
      getCategory() {
        getDictListByCode({
          code: 'noticeCategroy',
        }).then((resp) => {
          let data = resp.result.dictList ? resp.result.dictList : []
          this.categoryList = data
        })
      },
      getTextType(val) {
        if (val == 'text') {
          //文本
          this.textAreaShow = false
          this.pdfShow = true
          this.attachShow = true
          this.attachRequired = false
        } else if (val == 'pdf') {
          //pdf
          this.pdfShow = false
          this.attachShow = true
          this.attachRequired = true
          this.limit = 1
        } else if (val == 'link') {
          //链接
          this.textAreaShow = true
          this.pdfShow = true
          this.attachShow = false
          this.attachRequired = false
        }
      },
      handelSuccess(res) {
        let quill = this.$refs.QuillEditor.quill
        if (res.result.path !== null) {
          // 获取光标所在位置
          let length = quill.getSelection().index
          // 插入图片
          quill.insertEmbed(length, 'image', res.result.path)
          // 调整光标到最后
          quill.setSelection(length + 1)
        } else {
          this.$message.error('图片插入失败')
        }
      },
      initTitle() {
        if (document.getElementsByClassName('ql-editor')[0] !== undefined) {
          document.getElementsByClassName('ql-editor')[0].dataset.placeholder =
            ''
          for (let item of titleConfig) {
            let tip = document.querySelector('.quill-editor ' + item.Choice)
            if (!tip) continue
            tip.setAttribute('title', item.title)
          }
        }
      },
      closeForm() {
        this.addShow = false
        // this.addForm.title = ''
        // this.addForm.content = ''
        // this.addForm.type = ''
        this.fileUrlList = []
        this.fileList = []
        this.$set(this.addForm, 'id', '')
        this.$set(this.addForm, 'departmentName', '')
        this.$set(this.addForm, 'publisher', '')
        this.$set(this.addForm, 'summary', '')
        this.$set(this.addForm, 'title', '')
        this.$set(this.addForm, 'content', '')
        this.$set(this.addForm, 'type', '')
        this.$set(this.addForm, 'category', '')
      },
      onSuccess(res) {
        let file = {
          fileName: res.result.originalName,
          fileUrl: res.result.path,
        }
        this.fileUrlList.push(file)
        this.$refs['formLine'].clearValidate('attachList')
        this.$set(this.addForm, 'attachList', this.fileUrlList)
      },
      handleRemove(file) {
        let removeUrl = ''
        if (file.url) {
          removeUrl = file.url
        } else {
          removeUrl = file.response.result.path
        }
        if (removeUrl) {
          this.fileUrlList.forEach((m, ind, array) => {
            if (removeUrl == m.fileUrl) {
              array.splice(ind, 1)
            }
          })
        }
      },
      handleEdit(item) {
        noticeDetail({
          id: item.id,
        }).then((resp) => {
          let data = resp.result
          this.addForm = data
          this.$set(this.addForm, 'topFlag', '1')
          this.$set(this.addForm, 'id', item.id)
          this.addShow = true
          this.fileUrlList = data.attachList
          data.attachList.map((m) => {
            this.fileList.push({
              name: m.fileName,
              url: m.fileUrl,
            })
          })
          if (data.type == 'text') {
            //文本
            this.textAreaShow = false
            this.pdfShow = true
            this.attachShow = true
            this.attachRequired = false
          } else if (data.type == 'pdf') {
            //pdf
            this.pdfShow = false
            this.attachShow = true
            this.attachRequired = true
            this.limit = 1
          } else if (data.type == 'link') {
            //link
            this.textAreaShow = true
            this.pdfShow = true
            this.attachShow = false
            this.attachRequired = false
          }
        })
      },
      saveForm() {
        console.log(this.addForm.content, 'this.addForm')
        this.addForm.attachList = this.fileUrlList
        this.$refs['formLine'].validate((valid) => {
          if (valid) {
            this.loading = true
            noticeSave(this.addForm).then(
              () => {
                this.$message.success('公告新增成功')
                this.noticeList()
                this.loading = false
                this.addShow = false
                this.addForm.title = ''
                this.addForm.content = ''
                this.addForm.type = ''
                this.fileUrlList = []
                this.fileList = []
                this.closeForm()
              },
              () => {
                this.loading = false
              }
            )
          } else {
            console.log('校验失败')
          }
        })
      },
      deleteList(item) {
        noticeDelete({
          id: item.id,
        }).then(() => {
          this.$message.success('消息删除成功')
          this.noticeList()
        })
      },
      handleCurrentChange(val) {
        this.queryForm.pageNum = val
        this.noticeList()
      },
      handleSizeChange(val) {
        this.queryForm.pageSize = val
        this.queryForm.pageNum = 1
        this.noticeList()
      },
      queryData() {
        this.noticeList()
      },
      getTimeRange(val) {
        if (val !== null) {
          this.queryForm.sendStartTime = val[0]
          this.queryForm.sendEndTime = val[1]
        } else {
          this.queryForm.sendStartTime = ''
          this.queryForm.sendEndTime = ''
        }
      },
      noticeList() {
        noticeList(this.queryForm).then((resp) => {
          let data = resp.result.noticeList ? resp.result.noticeList : []
          this.tableData = data
          this.total = resp.result.totalRows
        })
      },
    },
  }
</script>
<style lang="scss">
  .editor {
    line-height: normal !important;
    height: 230px;
    margin-bottom: 50px;
  }
</style>

<style lang="scss" scoped>
  .avatarUploader {
    display: none;
  }
  .message {
    width: 100%;
    height: 100%;
    padding: 20px;
    .message_line {
      line-height: 32px;
      display: flex;
      justify-content: space-between;
      margin-bottom: 16px;
      margin-top: 14px;
      h2 {
        font-size: 14px;
        font-weight: 400;
        color: #303133;
        line-height: 32px;
        span {
          color: #ff4d4f;
        }
      }
    }
    .add_form {
      padding-left: 30px;
      padding-right: 30px;
    }
  }
  :deep() {
    .el-range-editor--small .el-range-separator {
      padding-right: 15px;
    }
  }
  :deep() {
    .el-upload-list {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      .el-upload-list__item {
        width: 360px;
        height: 32px;
        display: flex;
        align-items: center;
        .el-upload-list__item-status-label {
          height: 32px;
          line-height: 32px;
        }
      }
      .el-upload-list__item:hover {
        background: #f5faff;
      }
    }
  }
  //@import url(); 引入公共css类
</style>
