<template>
  <j-drawer :mask-closable="false" title="查看物模型" width="700" v-model:visible="_visible" destroy-on-close @close="close">
    <template #extra>
      <j-space>
        <j-button type="primary" @click="handleExport">
          导出
        </j-button>
      </j-space>
    </template>
    <j-spin :spinning="loading">
      <div class="cat-content">
        <p class="cat-tip">
          物模型是对设备在云端的功能描述，包括设备的属性、服务和事件。物联网平台通过定义一种物的描述语言来描述物模型，称之为
          TSL（即 Thing Specification Language），采用 JSON 格式，您可以根据 TSL
          组装上报设备的数据。您可以导出完整物模型，用于云端应用开发。
        </p>
      </div>
      <j-tabs @change="handleConvertMetadata" destroy-inactive-tab-pane>
        <j-tab-pane v-for="item in codecs" :key="item.id" :tab="item.name">
          <div class="cat-panel">
            <JMonacoEditor v-model="monacoValue" lang="javascript" style="height: 100%" theme="vs"></JMonacoEditor>
          </div>
        </j-tab-pane>
      </j-tabs>
    </j-spin>
  </j-drawer>
</template>
<script setup lang="ts" name="Cat">
import { downloadObject } from '@/utils/utils'
import { useInstanceStore } from '@/store/instance';
import { useProductStore } from '@/store/product';
import type { Key } from 'ant-design-vue/es/_util/type';
import { convertMetadata, getCodecs, detail as productDetail } from '@/api/device/product';
import { detail } from '@/api/device/instance'
import { onlyMessage } from '@/utils/comm';
import {cloneDeep} from "lodash";
import {omit} from "lodash-es";

interface Props {
  visible: boolean;
  type: 'product' | 'device';
}
interface Emits {
  (e: 'update:visible', data: boolean): void;
}
const props = defineProps<Props>()
const emits = defineEmits<Emits>()
const route = useRoute()
const loading = ref(false)

const _visible = computed({
  get: () => {
    return props.visible;
  },
  set: (val: any) => {
    emits('update:visible', val);
  },
})

const close = () => {
  emits('update:visible', false);
}

const instanceStore = useInstanceStore()
const productStore = useProductStore()
const metadata = computed(() => {
  const metadataMap = {
    product: productStore.current?.metadata as string,
    device: instanceStore.current?.metadata as string,
  };
  return metadataMap[props.type];
})
// const metadata = metadataMap[props.type];
const value = ref(metadata.value)
const monacoValue = ref()

const handleExport = async () => {
  try {
    downloadObject(
      JSON.parse(value.value),
      `${props.type === 'device'
        ? instanceStore.current?.name
        : productStore.current?.name
      }-物模型`,
      'YYYY/MM/DD',
    );
  } catch (e) {
    onlyMessage('请先配置物模型', 'error');
  }
}

const handleConvertMetadata = (key: Key) => {
  if (key === 'alink') {
    value.value = '';
    if (metadata) {
      convertMetadata('to', 'alink', JSON.parse(metadata.value)).then(res => {
        if (res.status === 200) {
          value.value = JSON.stringify(res.result)
        }
      });
    }
  } else {
    value.value = metadata.value;
    hideVirtualRule(metadata.value)
  }
};

const codecs = ref<{ id: string; name: string }[]>()

const routeChange = async (id: string) => {
  const res = await getCodecs()
  if (res.status === 200) {
    codecs.value = [{ id: 'jetlinks', name: 'jetlinks' }].concat(res.result)
  }
  if (props.type === 'device' && id) {
    detail(id as string).then((resp) => {
      if (resp.status === 200) {
        instanceStore.setCurrent(resp.result);
        const _metadata = resp.result?.metadata;
        value.value = _metadata;
        hideVirtualRule(_metadata)
      }
    });
  }
}

// watch(
//   () => route.params.id,
//   (id) => routeChange(id as string),
//   { immediate: true }
// )

const hideVirtualRule = (metadata: string) => {
  const _metadata = JSON.parse(metadata)
  if (_metadata.properties) {
    _metadata.properties = _metadata.properties.map((item: any) => {
      if (item.expands.virtualRule) {
        item.expands = cloneDeep(omit(item.expands, ['virtualRule']))
      }
      return item
    })
  }
  monacoValue.value = JSON.stringify(_metadata)
}

onMounted(() => {
  routeChange(route.params.id as string)
})

watch(
  () => [props.visible, props.type],
  () => {
    if (props.visible) {
      loading.value = true
      const { id } = route.params
      if (props.type === 'device') {
        detail(id as string).then((resp) => {
          loading.value = false
          instanceStore.setCurrent(resp.result)
          value.value = resp.result.metadata
        });
      } else {
        productDetail(id as string).then((resp) => {
          loading.value = false
          productStore.setCurrent(resp.result)
          value.value = resp.result.metadata
        });
      }
    }
  },
  { immediate: true }
)

watch(() => metadata.value, () => {
  hideVirtualRule(metadata.value)
}, { immediate: true})
</script>
<style scoped lang="less">
.cat-content {
  background: #F6F6F6;

  .cat-tip {
    padding: 10px;
    color: rgba(0, 0, 0, 0.55);
  }
}

.cat-panel {
  border: 1px solid #eeeeee;
  height: 670px;
  width: 650px;
}
</style>