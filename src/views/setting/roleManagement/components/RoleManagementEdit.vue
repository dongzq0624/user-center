<template>
  <el-dialog
    class="my_role_dialog"
    :close-on-click-modal="false"
    :title="title"
    top="12vh"
    :visible="dialogFormVisible"
    width="900px"
    @close="close"
  >
    <el-form ref="formRef" label-width="80px" :model="form" :rules="rules">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入" />
      </el-form-item>

      <el-form-item label="角色代码" prop="code">
        <el-input v-model="form.code" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="form.remark"
          placeholder="请输入"
          :rows="5"
          type="textarea"
        />
      </el-form-item>
      <el-row>
        <el-col :span="24">
          <el-form-item label="菜单" prop="powerIds">
            <div class="vab-tree-border">
              <el-tree
                ref="treeRef"
                :data="btnRoles"
                :default-checked-keys="defaultSelect"
                node-key="powerId"
                :props="props"
                show-checkbox
                @check-change="handleCheckChange"
              >
                <template #default="{ data }">
                  <span>{{ data.name }}</span>
                </template>
              </el-tree>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import { PowerList, doEdit } from '@/api/application/roleManagement'
  const validateMenu = (rule, value, callback) => {
    if (value.length == 0) {
      return callback(new Error('菜单选择不能为空'))
    } else {
      callback()
    }
  }

  export default {
    name: 'RoleManagementEdit',
    props: {
      applicationId: {
        type: String,
        default: '',
      },
    },
    emits: ['fetch-data'],
    data() {
      return {
        formRef: null,
        treeRef: null,
        form: {
          powerIds: [],
        },
        props: {
          label: 'name',
          children: 'childrenList',
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
          powerIds: [
            {
              required: true,
              validator: validateMenu,
              trigger: 'change',
              message: '请选择菜单',
            },
          ],
          roleDataPowerList: [
            { required: true, trigger: 'change', message: '请选择数据权限' },
          ],
        },
        title: '',
        dialogFormVisible: false,
        list: [],
        /* btnRoles demo */
        btnRoles: [],
        defaultSelect: [],
        params: {
          pageNo: 1,
          pageSize: 9999,
        },
        roleDataPowerTree: [],
        components: [],
        checkedCities: {},
      }
    },
    mounted() {},
    methods: {
      showEdit(row) {
        if (!row) {
          this.title = '新增'
        } else {
          this.title = '编辑'
          this.form = Object.assign({}, row)
        }
        console.log('row', JSON.stringify(row))
        this.getPowerList(row)
        //        this.defaultSelect = row ? row.powerCodeList : []
        setTimeout(() => {
          row.powerIds.forEach((value) => {
            this.$refs['treeRef'].setChecked(value, true)
          })
        }, 500)
        this.dialogFormVisible = true
      },
      close() {
        this.$refs['treeRef'].setCheckedKeys([])
        this.$refs['formRef'].resetFields()
        this.form = {
          powerCodeList: [],
        }
        this.dialogFormVisible = false
        this.checkedCities = {}
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
            // window.location.reload()
            this.close()
          }
        })
      },
      async getPowerList() {
        console.log(this.applicationId)
        const { result } = await PowerList({
          applicationId: this.applicationId,
        })
        this.btnRoles = result.powerList
        this.$nextTick(() => {
          console.log('powerCodeList:', this.form.powerCodeList)
          //            this.$refs['treeRef'].setCheckedKeys(this.form.powerCodeList)
        })
      },
      handleCheckChange() {
        //this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys())
        const tree = this.$refs['treeRef']
          .getCheckedKeys()
          .concat(this.$refs['treeRef'].getHalfCheckedKeys())
        // const tree = this['treeRef'].getCheckedKeys()
        console.log('tree', tree)
        this.$set(this.form, 'powerIds', tree)
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
