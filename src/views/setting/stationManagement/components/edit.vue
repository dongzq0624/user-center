<template>
  <el-dialog
    :close-on-click-modal="false"
    :title="title"
    :visible="dialogFormVisible"
    width="500px"
    @close="close"
  >
    <el-form ref="formRef" label-width="80px" :model="form" :rules="rules">
      <el-form-item label="岗位名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入" />
      </el-form-item>

      <el-form-item label="岗位代码" prop="code">
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

      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio :label="USER_STATUS.ON.key">
            {{ USER_STATUS.ON.value }}
          </el-radio>
          <el-radio :label="USER_STATUS.OFF.key">
            {{ USER_STATUS.OFF.value }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import { doEdit } from '@/api/systemManage/stationManagement'
  import { USER_STATUS } from '@/constant/Enums.js'
  export default {
    name: 'RoleManagementEdit',
    emits: ['fetch-data'],
    data() {
      return {
        USER_STATUS,
        formRef: null,
        treeRef: null,
        form: {
          status: USER_STATUS.ON.key,
        },
        rules: {
          code: [
            { required: true, trigger: 'blur', message: '请输入角色代码' },
          ],
          name: [
            { required: true, trigger: 'blur', message: '请输入角色名称' },
          ],
          remark: [
            { required: false, trigger: 'blur', message: '请输入角备注' },
          ],
          status: [
            { required: true, trigger: 'change', message: '请选择状态' },
          ],
          sortindex: [{ type: 'number', message: '排序代码必须为数字' }],
        },
        title: '',
        dialogFormVisible: false,
        list: [],
        params: {
          pageNo: 1,
          pageSize: 9999,
        },
      }
    },
    methods: {
      showEdit(row) {
        if (!row) {
          this.title = '新增'
        } else {
          this.title = '编辑'
          this.form = Object.assign({}, row)
        }
        this.dialogFormVisible = true
      },
      close() {
        this.$refs['formRef'].resetFields()
        this.form = {}
        this.dialogFormVisible = false
      },
      save() {
        this.$refs['formRef'].validate(async (valid) => {
          if (valid) {
            // const tree = this['treeRef'].getCheckedKeys()
            // const treeObject = { 'treeArray:': tree }
            const { message } = await doEdit({
              ...this.form,
            })
            this.$baseMessage(message, 'success', 'vab-hey-message-success')
            this.$emit('fetch-data')
            this.close()
          }
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
  .vab-tree-border {
    height: 200px;
    padding: $base-padding;
    overflow-y: auto;
    border: 1px solid #dcdfe6;
    border-radius: $base-border-radius;
  }
</style>
