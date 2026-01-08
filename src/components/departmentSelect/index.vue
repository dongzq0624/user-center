<template>
  <tree-select
    v-model="editData.department"
    search-placeholder="Please select"
    style="width: 100%"
    tree-checkable
    :tree-data="departmentList"
  />
</template>
<script>
  import { organTree } from '@/api/systemManage/departmentManagement'
  export default {
    name: 'DepartmentSelect',
    props: {
      value: {
        type: Array,
        default: () => [],
      },
    },
    data: function () {
      return {
        departmentList: [],
      }
    },
    created() {},
    shouldUpdateComponent() {
      this.getList()
    },
    method: {
      getList() {
        organTree().then((res) => {
          console.log(res)
        })
      },
    },
  }
</script>
