<template>
    <a-modal
        :title="$t('Apply.index.663043-0')"
        open
        :centered="true"
        :confirm-loading="loading"
        @cancel="emits('close')"
        :maskClosable="false"
        :width="1000"
    >
        <div class="content">
            <div v-if="step === 0" class="type">
                <j-card-select
                    :column="2"
                    v-model:value="type"
                    :options="typeList"
                >
                    <template #itemRender="{ node }">
                        <a-space align="center">
                          <AIcon :type="node.iconUrl" style="font-size: 60px"></AIcon>
                          <div>
                            <p>{{node.label}}</p>
                            <p>{{node.subLabel}}</p>
                          </div>
                        </a-space>
                    </template>
                </j-card-select>
            </div>
            <div v-else>
                <List
                    :productList="productList"
                    :resourceMetadata="resourceMetadata"
                />
                <ProtocolList
                    v-if="protocolList.length"
                    :protocolList="protocolList"
                    type="protocol"
                />
                <ProtocolList
                    v-if="pluginList.length"
                    :protocolList="pluginList"
                    type="plugin"
                />
            </div>
        </div>

        <template #footer>
            <a-space>
                <a-button @click="emits('close')">{{ $t('Apply.index.663043-1') }}</a-button>
                <a-button v-if="step === 0" type="primary" @click="onStep"
                    >{{ $t('Apply.index.663043-2') }}</a-button
                >
                <a-button v-else type="primary" @click="onSave">{{ $t('Apply.index.663043-3') }}</a-button>
            </a-space>
        </template>
    </a-modal>
</template>

<script setup lang="ts" name="Apply">
import { onlyMessage } from '@jetlinks-web/utils';
import List from './List.vue';
import ProtocolList from './ProtocolList.vue';
import {
  saveProduct,
    savePlugin,
    saveProtocol,
    _queryNew,
    _queryNowNoPaging,
    _queryProductNoPaging,
} from '@device-manager-ui/api/resource/resource';
import { useMenuStore, useAuthStore } from '@jetlinks-web-core/store';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const permission = useAuthStore().hasPermission(`device/Product:add`);
const permission1 = useAuthStore().hasPermission(`device/Product:update`);

const emits = defineEmits(['close']);
const menuStory = useMenuStore();
const typeList = computed(() => {
  return [
    {
      value: 'create',
      label: $t('Apply.index.663043-4'),
      subLabel: $t('Apply.index.663043-5'),
      iconUrl: 'AppstoreAddOutlined',
      disabled: !permission,
    },
    {
      value: 'update',
      label: $t('Apply.index.663043-6'),
      subLabel: $t('Apply.index.663043-7'),
      iconUrl: 'SyncOutlined',
      disabled: !permission1,
    },
  ]
});

const props = defineProps({
    data: {
        type: Object,
        default: () => ({}),
    },
});

const type = ref();
const step = ref(0);
const productList = ref<any>([]);
const pluginList = ref<any>([]);
const resourceMetadata = ref();
const protocolList = ref<any>([]);
const loading = ref(false);

const onStep = () => {
    if (!type.value) {
        onlyMessage($t('Apply.index.663043-8'), 'warning');
        return;
    }
    if (type.value === 'create') {
        menuStory.jumpPage('device/Product/QuickCreate', {
            query:{
              id: props.data.id,
            }
        });
    } else {
        step.value = 1;
        getProduct();
        getProtocolList();
        getPluginList()
    }
};

const getProduct = async () => {
    const res = await _queryProductNoPaging(props.data.id, {
        paging: false,
    });
    if (res.success) {
        productList.value = res.result;
        resourceMetadata.value = JSON.parse(props.data.metadata);
    }
};


const matchArray = (arr, newArr) => {
  const _arr = arr.map((item: any) => {
    const obj = newArr?.find((i: any) => i.id === item?.configuration?.sourceId);
    if (obj) {
      console.log(item, obj)
      item.newProtocol = obj;
      return item;
    }
    return false
  });
  return _arr.filter((item: any) => item && item?.configuration?.version !== item?.newProtocol?.version);
}
// 获取当前协议
const getProtocolList = async () => {
    const res: any = await _queryNowNoPaging(props.data.id, 'protocol', {
        paging: false,
    });
    if (res.success) {
        const resp: any = await _queryNew(props.data.id, 'protocol');
        if (resp.success) {
            protocolList.value = matchArray(res.result, resp.result)
        }
    }
};

const getPluginList = async () => {
  const res: any = await _queryNowNoPaging(props.data.id, 'plugin', {
    paging: false,
  });
  if (res.success) {
    const resp: any = await _queryNew(props.data.id, 'plugin');
    if (resp.success) {
      pluginList.value = matchArray(res.result, resp.result)
    }
  }
};

const onSave = async () => {
    // 物模型
    const _new = productList.value.filter((i: any) => i.newMetaData);
    // 协议
    const _newProtocol = protocolList.value.filter((i: any) => i.handle);
    // 插件
    const _newPlugin = pluginList.value.filter((i: any) => i.handle);

    if (!_new.length && !_newProtocol.length && !_newPlugin.length) {
        onlyMessage($t('Apply.index.663043-9'), 'warning');
        return;
    }
    loading.value = true;
    const requestList = []
    if (_new.length) {
        const _data = productList.value.map((item: any) => ({
            ...item,
            metadata: JSON.stringify(item.newMetaData),
        }));
        requestList.push(saveProduct(_data));
    }
    if (_newProtocol.length) {
        const arr = protocolList.value
            .filter((i: any) => i.handle === 'cover')
            .map((item: any) => ({
                id: item.id,
                name: item.newProtocol.name,
                type: 'jar',
                configuration: {
                    location: item.newProtocol.location,
                    version: item.newProtocol.version,
                    sourceId: item.configuration.sourceId,
                },
            }));
        arr.length && requestList.push(saveProtocol(arr));
    }

    if(_newPlugin.length){
      const arr = pluginList.value
          .filter((i: any) => i.handle === 'cover')
          .map((item: any) => ({
            ...item,
            id: item.id,
            name: item.newProtocol.name,
            configuration: {
              location: item.newProtocol.location,
              version: item.newProtocol.version,
              sourceId: item.configuration.sourceId,
            },
          }));
      arr.length && requestList.push(savePlugin(arr));
    }
    const res = await Promise.all(requestList).finally(() => (loading.value = false));
    const result = res.every((i: any) => i.success)
    if(result) {
      emits('close');
      onlyMessage($t('Apply.index.663043-10'), 'success');
    }
};
</script>

<style lang="less" scoped>
.content {
    height: 60vh;
    overflow-y: auto;
    overflow-x: hidden;
  .type {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
