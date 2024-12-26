<template>
  <div>
    <div class="cloud">
      <a-button
          class="cloudBtn"
          type="primary"
          @click="getResourceByCloud"
      >
        从云端获取
      </a-button>
      <div class="upload">
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
            </div>
          </div>
        </a-upload-dragger>
      </div>
    </div>
  </div>
</template>

<script setup>
import {FILE_UPLOAD} from "@/api/comm";
import {_queryResourceCloud} from '@/api/link/resource';

const props = defineProps({
  source: {
    type: String,
    default: ''
  },
  value: {
    type: Array,
    default: () => []
  }
})
const emits = defineEmits(['update:value', 'update:source'])
const fileList = ref([]);
const source = ref('');
const handleChange = () => {
};

const getResourceByCloud = async () => {
  source.value = 'cloud';
  const res = await _queryResourceCloud();
  if (res.success) {
    fileList.value = res.result;
    emits('update:value', fileList.value)
    emits('update:source', source.value)
  }
};

const handleDrop = () => {

}

watch(() => props.source, () => {
  source.value = props.source
}, {
  immediate: true
})
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
