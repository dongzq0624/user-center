<template>
  <el-dialog
    :close-on-click-modal="false"
    :title="title"
    :visible="dialogFormVisible"
    width="500px"
    @close="close"
  >
    <el-form ref="formRef" label-width="115px" :model="form" :rules="rules">
      <el-form-item label="类型" prop="type">
        <el-select v-model="form.type" placeholder="请选择" style="width: 100%">
          <el-option
            v-for="item in options"
            :key="item.key"
            :label="item.value"
            :value="item.key"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="父级菜单" prop="parentId">
        <el-select
          ref="selectTree"
          v-model="form.parentId"
          placeholder="请选择父节点"
          style="width: 100%"
        >
          <el-option
            :label="form.parentName"
            style="height: auto; padding: 0"
            :value="form.parentId"
          >
            <el-tree
              ref="treeRef"
              :data="treeData"
              :props="defaultProps"
              @node-click="handleNodeClick"
            />
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="菜单名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入" />
      </el-form-item>

      <el-form-item label="菜单代码" prop="code">
        <el-input v-model="form.code" placeholder="请输入" />
      </el-form-item>

      <el-form-item label="排序代码" prop="sortindex">
        <el-input v-model.number="form.sortindex" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="form.remark"
          placeholder="请输入"
          :rows="3"
          type="textarea"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script>
  //import VabIconSelector from '@/extra/VabIconSelector'
  import { doEdit, getList } from '@/api/systemManage/menuManagement'
  import { MENU_TYPE, toList } from '@/constant/Enums'
  import { upload_url } from '@/api/project-management/file-list'
  import { baseURL } from '@/config'

  export default {
    name: 'MenuManagementEdit',
    components: {
      //   VabIconSelector
    },
    props: {
      applicationId: {
        type: String,
        value: '',
      },
    },
    emits: ['fetch-data'],
    data() {
      return {
        UPLOAD_URL: baseURL + upload_url,
        formRef: null,
        selectTree: null,
        form: {
          parentName: '',
        },
        rules: {
          parentId: [
            { required: false, trigger: 'blur', message: '请输入父级菜单Id' },
          ],
          name: [
            { required: true, trigger: 'blur', message: '请输入菜单名称' },
          ],
          redirectUrl: [
            { required: true, trigger: 'blur', message: '请输入访问地址' },
          ],
          source: [
            {
              required: true,
              trigger: 'change',
              message: '请选择菜单所属平台',
            },
          ],
          type: [{ required: true, trigger: 'change', message: '请选择类型' }],
          code: [
            { required: true, trigger: 'blur', message: '请输入菜单代码' },
          ],
          sortindex: [
            { required: true, trigger: 'blur', message: '请输入排序代码' },
            { type: 'number', message: '排序代码必须为数字' },
          ],
          remark: [{ required: false, trigger: 'blur', message: '请输入备注' }],
        },
        title: '',
        dialogFormVisible: false,
        MENU_TYPE,
        options: toList(MENU_TYPE),
        defaultProps: {
          children: 'powerChildList',
          label: 'name',
        },
        treeData: [],
        sourceList: [
          {
            value: 'pc',
            label: '管理台',
          },
          {
            value: 'wechat',
            label: '小程序',
          },
        ],
        sourceShow: true,
        imageUrl: '',
      }
    },
    watch: {
      'form.parentId': {
        deep: true,
        handler: function (newV, oldV) {
          console.log('watch中：', oldV)
          if (newV !== undefined) {
            this.sourceShow = false
            if (newV == '-1') {
              this.sourceShow = true
            }
          } else {
            this.sourceShow = true
          }
        },
      },
    },
    mounted() {},
    methods: {
      handleIcon(item) {
        this.form.meta.icon = item
        this.$set(this.form.meta, 'icon', item)
      },
      showEdit(row) {
        if (!row) {
          this.title = '新增'
        } else {
          this.title = '编辑'
          this.form = Object.assign({}, row)
          console.log(this.form, 'this.form')
        }
        this.fetchData()
        this.dialogFormVisible = true
      },
      close() {
        this.$refs['formRef'].resetFields()
        this.form = {
          meta: {
            icon: '',
          },
        }
        this.dialogFormVisible = false
      },
      save() {
        this.$refs['formRef'].validate(async (valid) => {
          if (valid) {
            const { message } = await doEdit({
              applicationId: this.applicationId,
              ...this.form,
            })
            this.$baseMessage(message, 'success', 'vab-hey-message-success')
            this.$emit('fetch-data')
            this.fetchData()
            this.close()
          }
        })
      },

      handleNodeClick(node) {
        this.$set(this.form, 'parentName', node.name)
        this.$set(this.form, 'parentId', node.powerId)
        this.$refs['selectTree'].blur()
      },
      handleAvatarSuccess(res) {
        this.imageUrl = res.result.path
        this.$set(this.form, 'icon', res.result.path)
      },
      async fetchData() {
        const {
          result: { powerList },
        } = await getList({ applicationId: this.applicationId })
        this.treeData = powerList
      },
    },
  }
</script>

<style lang="scss" scoped>
  .avatarUploader {
    :deep(.el-upload) {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      .el-avatar {
        img {
          cursor: pointer;
          width: 100%;
        }
      }
    }
    .el-upload:hover {
      border-color: #409eff;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 80px;
      height: 80px;
      line-height: 80px;
      text-align: center;
    }

    .avatar {
      width: 80px;
      height: 80px;
      display: block;
    }
  }
</style>
