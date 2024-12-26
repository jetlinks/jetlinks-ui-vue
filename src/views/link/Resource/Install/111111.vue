<template>
  <a-modal
      title="安装资源"
      visible
      @cancel="emits('close')"
      :maskClosable="false"
      :width="800"
      :footer="null"
  >

    <div class="upload_container" v-if="true">
      <div
          class="cloud"
          v-if="!source"
      >
        <a-button
            class="cloudBtn"
            type="primary"
            @click="getResourceByCloud"
        >
          从云端获取
        </a-button>
      </div>
      <InstallFile
          ref="installRef"
          v-if="source === 'cloud' && fileList.length "
          :data="fileList"
          :install-type="source"
      />
      <a-empty v-if="source === 'cloud' && !fileList.length"></a-empty>
      <div class="upload" v-if="source !== 'cloud'">
        <a-upload-dragger
            v-model:fileList="fileList"
            name="file"
            :multiple="true"
            :maxCount="10"
            :action="FILE_UPLOAD"
            @change="handleChange"
            @drop="handleDrop"
        >
          <div style="height: 400px; padding: 0 10px">
            <div v-if="!fileList.length" class="noData">
              <AIcon
                  type="PlusSquareOutlined"
                  style="font-size: 100px"
              />
              <div class="tips">
                <div>
                  拖放安装资源或者点击上方按钮从本地文件中选取资源安装;
                </div>
                <div>单次支持最多选取10个资源文件</div>
              </div>
            </div>
            <div v-else>
              <div class="header">
                <div>
                  您可继续拖放资源或从本地文件中选取资源
                </div>
                <div>
                  <a-button type="primary">继续添加</a-button>
                </div>
              </div>
              <div class="uploadList">
                <InstallFile :data="fileList" :install-type="source"></InstallFile>
              </div>
            </div>
          </div>
        </a-upload-dragger>
      </div>
    </div>
    <template #footer>
      <div v-if="fileList.length">
        <a-button @click="emits('close')">取消</a-button>
        <a-button @click="onInstall" type="primary">全部安装</a-button>
      </div>
    </template>
  </a-modal>
</template>

<script setup>
import {FILE_UPLOAD} from '@/api/comm';
import InstallFile from './components/InstallFile.vue';
import {_queryResourceCloud} from '@/api/link/resource';

const emits = defineEmits(['close']);
const fileList = ref([]);
const source = ref('');
const installRef = ref()
const handleChange = () => {
};

const getResourceByCloud = async () => {
  source.value = 'cloud';
  const res = await _queryResourceCloud();
  if (res.success) {
    fileList.value = res.result;
  }
};

const onInstall = () => {
  installRef.value?.onInstall()
}
</script>
<style lang="less" scoped>
.cloud {
  text-align: right;
}

.upload {
  margin-top: 12px;

  .tips {
    text-align: center;
    font-size: 12px;
    margin-top: 24px;
  }

  .noData {
    margin-top: 20%;
  }

  .header {
    display: flex;
    justify-content: space-between;
  }

  .uploadList {
    height: calc(100% - 20px);
    overflow: auto;
  }
}
</style>
