<template>
  <!-- 同步缓存确认弹窗 -->
  <a-modal
    v-model:open="syncCacheVisible"
    title="同步缓存"
    ok-text="开始"
    @ok="handleSyncCache"
    @cancel="emit('close')"
  >
    <p>缓存丢失导致产品底层数据与配置异常，可能导致设备数据无法正常上报，请点击「开始」按钮刷新数据</p>
  </a-modal>

  <!-- 同步进度弹窗 -->
  <a-modal
    v-model:open="syncProgressVisible"
    title="同步进度"
    :closable="false"
    :maskClosable="false"
  >
    <div style="text-align: center;">
      <a-progress :percent="syncProgress" :status="syncCompleted ? 'success' : 'active'" />
      <p style="margin-top: 16px;">{{ syncProgressText }}</p>
    </div>
    <template #footer>
      <a-button v-if="syncCompleted" type="primary" @click="handleSyncProgressClose">
        完成
      </a-button>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { onlyMessage } from "@jetlinks-web/utils";
import { syncProductCache, getProductCount } from "@device-manager-ui/api/product";
import { useRequest } from "@jetlinks-web/hooks";

// Props
interface Props {
  visible?: boolean;
  params?: any;
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  params: {}
});

// Emits
const emit = defineEmits<{
  'close': [];
  'update:visible': [value: boolean];
  'success': [];
}>();

const { data: total } = useRequest(getProductCount, {
  defaultParams: props.params
});

// 响应式数据
const syncCacheVisible = ref(false);
const syncProgressVisible = ref(false);
const syncProgress = ref(0);
const syncCompleted = ref(false);
const syncProgressText = ref('正在同步缓存...');
const syncNumber = ref(0);

// 监听外部visible变化
watch(() => props.visible, (newVal) => {
  syncCacheVisible.value = newVal;
});

// 监听内部visible变化，同步到外部
watch(syncCacheVisible, (newVal) => {
  emit('update:visible', newVal);
});

// 同步缓存处理函数
const handleSyncCache = async () => {
  syncCacheVisible.value = false;
  syncProgressVisible.value = true;
  syncProgress.value = 0;
  syncCompleted.value = false;
  syncProgressText.value = '正在同步缓存...';
  syncNumber.value = 0;
  try {
    const response = syncProductCache();
    response.subscribe({
      next: (data: any) => {
        data.result.map((i: any) => {
          if(i.success){
            syncNumber.value += i.total
          } else {
            syncNumber.value += 1
          }
        })
        syncProgress.value = (syncNumber.value / total.value) * 100
      },
      error: (error: any) => {
        console.error('同步缓存失败:', error);
        onlyMessage('同步缓存失败', 'error');
        syncProgressVisible.value = false;
      },
      complete: () => {
        syncCompleted.value = true;
        syncProgressText.value = '同步完成';
        onlyMessage('缓存同步完成', 'success');
        emit('success');
      }
    });
  } catch (error) {
    console.error('同步缓存失败:', error);
    onlyMessage('同步缓存失败', 'error');
    syncProgressVisible.value = false;
  }
};

// 关闭同步进度弹窗
const handleSyncProgressClose = () => {
  syncProgressVisible.value = false;
  syncProgress.value = 0;
  syncCompleted.value = false;
  syncProgressText.value = '正在同步缓存...';
  emit('close')
};

onMounted(() => {
  syncCacheVisible.value = true;
});
</script>
