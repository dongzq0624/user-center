<template>
  <el-tree
    ref="appTree"
    :data="treeData"
    :default-expand-all="false"
    :highlight-current="true"
    node-key="applicationId"
    :props="defaultProps"
    @node-click="handleNodeClick"
  />
</template>
<script>
  import { getTree } from '@/api/systemManage/applicationManagement'
  export default {
    props: {},
    data() {
      return {
        defaultProps: {
          children: 'dictChildrenTree',
          label: 'applicationName',
        },
        treeData: [],
      }
    },
    mounted() {
      this.getAppTree()
    },
    methods: {
      handleNodeClick(node) {
        this.$emit('node-click', node)
      },
      getAppTree() {
        getTree({}).then((res) => {
          this.treeData = res.result.appTreeList
          if (this.treeData.length > 0) {
            const currentId = this.treeData[0].applicationId

            this.$nextTick(() => {
              this.$refs.appTree.setCurrentKey(currentId)
              this.handleNodeClick(this.treeData[0])
            })
          }
        })
      },
    },
  }
</script>
