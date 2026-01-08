<template>
  <el-dialog
    :close-on-click-modal="false"
    :title="title"
    :visible="dialogFormVisible"
    width="500px"
    @close="close"
  >
    <el-form ref="formRef" label-width="80px" :model="form" :rules="rules">
      <el-form-item label="父级字典" prop="parentId">
        <el-select
          ref="selectTree"
          v-model="form.parentId"
          clearable
          placeholder="请选择父节点"
          style="width: 100%"
          @clear="selectOnClear('parentId')"
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

      <el-form-item label="字典名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入" />
      </el-form-item>

      <el-form-item label="字典代码" prop="code">
        <el-input v-model="form.code" placeholder="请输入" />
      </el-form-item>

      <el-form-item label="字典值" prop="value">
        <el-input v-model="form.value" placeholder="请输入" />
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
  import { doEdit, dictTree } from '@/api/systemManage/dictionaryManagement'

  export default {
    name: 'RoleManagementEdit',
    emits: ['fetch-data'],
    data() {
      return {
        formRef: null,
        treeRef: null,
        selectTree: null,
        form: {
          powerId: '',
          parentName: '',
        },
        rules: {
          code: [
            { required: true, trigger: 'blur', message: '请输入字典代码' },
          ],
          name: [
            { required: true, trigger: 'blur', message: '请输入字典名称' },
          ],
          remark: [
            { required: false, trigger: 'blur', message: '请输入字典备注' },
          ],
          value: [{ required: true, trigger: 'blur', message: '请输入字典值' }],
        },
        title: '',
        dialogFormVisible: false,
        list: [],
        params: {
          pageNo: 1,
          pageSize: 9999,
        },
        treeData: [],
        defaultProps: {
          children: 'dictChildrenTree',
          label: 'name',
        },
      }
    },
    mounted() {
      this.getDictionaryType()
      // getPowerList()
    },
    methods: {
      showEdit(row) {
        if (!row) {
          this.title = '新增'
        } else if (!row.id) {
          this.title = '新增'
          this.form = Object.assign({}, row)
        } else {
          this.title = '编辑'
          this.form = Object.assign({}, row)
        }
        this.dialogFormVisible = true
      },
      close() {
        this.$refs['formRef'].resetFields()
        this.form = {
          btnRolesCheckedList: [],
        }
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
            this.getDictionaryType()
            this.close()
          }
        })
      },
      handleNodeClick(node) {
        this.$set(this.form, 'parentName', node.name)
        this.$set(this.form, 'parentId', node.id)
        this.$refs['selectTree'].blur()
      },
      selectOnClear() {
        this.$set(this.form, 'parentName', '')
        this.$set(this.form, 'parentId', '')
      },
      getDictionaryType() {
        dictTree().then((resp) => {
          this.treeData = resp.result.dictTree
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
