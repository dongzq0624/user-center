<template>
  <el-tree
    ref="selectTree"
    :data="departList"
    :default-expand-all="false"
    :default-expanded-keys="expandedKeys"
    :highlight-current="true"
    lazy
    :load="loadNode"
    node-key="id"
    :props="defaultProps"
    @node-click="handleNodeClick"
  />
</template>
<script>
  import { organLazyTreeList as getList } from '@/api/department/departmentManagement'
  export default {
    name: 'DepartLazyTree',
    props: {
      type: {
        type: String,
        default: 'department',
      },
      handleNodeClick: {
        type: Function,
        default: () => [],
      },
      selectedRoot: {
        type: Boolean,
        default: false,
      },
    },
    data: function () {
      return {
        defaultProps: {
          children: 'children',
          label: 'name',
          isLeaf: 'leaf',
        },
        departList: [],
        expandedKeys: [],
      }
    },
    created() {
      this.getDepartList()
    },
    methods: {
      async loadNode(node, resolve) {
        if (node.data.id) {
          let params = {
            type: this.type,
            parentId: node.data.id,
          }
          const data = await getList(params)
          let list = data.result.organLazyTreeList
            ? data.result.organLazyTreeList
            : []
          resolve(list)
        }
      },
      async getDepartList() {
        let params = {
          type: this.type,
          parentId: -1,
        }
        const data = await getList(params)
        this.departList = data.result.organLazyTreeList
          ? data.result.organLazyTreeList
          : []
        if (this.selectedRoot && this.departList.length > 0) {
          this.$nextTick(() => {
            this.$refs.selectTree.setCurrentNode(this.departList[0])
            this.handleNodeClick && this.handleNodeClick(this.departList[0])
            this.expandedKeys = [this.departList[0].id]
          })
        }
      },
    },
  }
</script>
