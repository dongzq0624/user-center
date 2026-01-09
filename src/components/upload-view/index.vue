<template>
  <div :class="limit == value.length || hideUpload ? 'hide' : ''">
    <el-upload
      :accept="accept"
      :action="uploadUrl"
      :before-upload="beforeAvatarUpload"
      class="avatar-uploader"
      :file-list="value.length == 1 && value[0] == undefined ? [] : value"
      :headers="{ xc_sso_sessionid: xc_sso_sessionid }"
      :limit="limit"
      list-type="picture-card"
      :on-error="onUploadFail"
      :on-remove="handleRemove"
      :on-success="onUploadSuccess"
    >
      <i slot="default" class="el-icon-plus"></i>
      <div slot="file" v-if="file.status != 'uploading'" slot-scope="{ file }">
        <img class="avatar" :src="file.url" />
        <span class="el-upload-list__item-actions">
          <span
            class="el-upload-list__item-preview"
            @click="handlePictureCardPreview(file)"
          >
            <i class="el-icon-zoom-in"></i>
          </span>
          <span class="el-upload-list__item-delete" @click="handleRemove(file)">
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </div>
    </el-upload>

    <el-dialog append-to-body :visible.sync="dialogVisible" width="600px">
      <img alt="" :src="dialogImageUrl" width="100%" />
    </el-dialog>

    <el-dialog append-to-body :visible.sync="videoDialogVisible">
      <video
        align="center"
        controls="true"
        preload="auto"
        style="max-height: 500px"
        width="100%"
      >
        <source :src="videoUrl" type="video/mp4" />
      </video>
    </el-dialog>
  </div>
</template>

<script>
  import { baseURL } from '@/config'
  import store from '@/store'
  import { matchFileSuffixType } from '@/utils/checkFileType'
  export default {
    name: 'UploadView',
    components: {},
    props: {
      show: {
        type: Boolean,
        default: false,
      },
      limit: {
        type: Number,
        default: 9,
      },
      value: {
        type: Array,
        default: () => {
          return []
        },
      },
      accept: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        uploadUrl: baseURL + '/common/uploadFile',
        xc_sso_sessionid: store.getters['user/token'],
        hideUpload: false,
        dialogImageUrl: '',
        dialogVisible: false,

        videoUrl: '',
        videoDialogVisible: false,
      }
    },
    computed: {},
    watch: {
      value(val) {
        console.log('val', JSON.stringify(val))
        if (!val || val.length == 0) {
          this.hideUpload = false
        }
      },
    },
    created() {},
    mounted() {},
    methods: {
      onUploadSuccess(res) {
        if (res.code == 200) {
          let result = res.result
          let file = { url: result.path, originalName: result.originalName }
          let fileList = [...this.value, file]
          this.$emit('input', fileList)
        } else {
          this.hideUpload = false
        }
      },
      onUploadFail() {
        this.hideUpload = false
      },
      beforeAvatarUpload() {
        if (this.value.length + 1 == this.limit) {
          this.hideUpload = true
        }
        //        const isJPG = file.type === 'image/jpeg';
        //        const isLt2M = file.size / 1024 / 1024 < 2;
        //
        //        if (!isJPG) {
        //          this.$message.error('上传头像图片只能是 JPG 格式!');
        //        }
        //        if (!isLt2M) {
        //          this.$message.error('上传头像图片大小不能超过 2MB!');
        //        }
        //        let isSuccess = isJPG && isLt2M
        //        if(isSuccess) {
        //          this.hideUpload = true
        //        }
        //        return isSuccess;
        return true
      },
      handleRemove(file) {
        let deletePosition = -1
        this.value.forEach((data, index) => {
          if (data.url == file.url) {
            deletePosition = index
          }
        })

        if (deletePosition != -1) {
          this.hideUpload = false
          let fileList = [...this.value]
          fileList.splice(deletePosition, 1)
          this.$emit('input', fileList)
        }
      },
      handlePictureCardPreview(file) {
        if (matchFileSuffixType(file.url) === 'image') {
          this.dialogImageUrl = file.url
          this.dialogVisible = true
        }
      },
    },
  }
</script>
<style lang="less" scoped>
  .avatar-uploader {
    display: flex;
    flex-direction: row;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
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
  }
  /deep/.el-upload--picture-card {
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  /deep/.el-upload-list__item {
    width: 80px;
    height: 80px;
  }
  .hide {
    /deep/.el-upload--picture-card {
      display: none !important;
    }
  }
  /deep/ .el-list-enter-active,
  /deep/ .el-list-leave-active {
    transition: none;
  }
  /deep/ .el-list-enter,
  /deep/ .el-list-leave-active {
    opacity: 0;
  }
</style>
