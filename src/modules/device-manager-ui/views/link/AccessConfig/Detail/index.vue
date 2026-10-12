<template>
    <j-page-container>
        <a-spin :spinning="loading">
            <div v-if="type && id === ':id'">
              <component
                :is="components.provider"
                :dataSource="dataSource"
                @onClick="goProviders"
              />
            </div>
            <FullPage :fixed="false" v-else>
                <a-card :bordered="false">
                    <div>
                        <div class="go-back" v-if="id === ':id'">
                            <a @click="goBack">{{ $t('Detail.index.308483-0') }}</a>
                        </div>
                      <component
                        :is="showType === 'network' ? components[provider.id] || components.network : components[showType]"
                        :data="data"
                        :provider="provider"
                        :bindProduct="provider.id === `composite-device-gateway` ? undefined: bindProduct"
                        :otherProvider="provider.id === `composite-device-gateway` ? compositeProvider : undefined"
                      />
                    </div>
                </a-card>
            </FullPage>
        </a-spin>
    </j-page-container>
</template>

<script lang="ts" setup name="AccessConfigDetail">
import {getProviders, detail} from '@device-manager-ui/api/link/accessConfig';
import {queryProductList} from '@device-manager-ui/api/product';
import {accessConfigTypeFilter} from '@/utils';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const route = useRoute();
const id = route.params.id as string;

const components = {
  network: defineAsyncComponent(() => import('../components/Network/index.vue')),
  provider: defineAsyncComponent(() => import('../components/Provider/index.vue')),
  media: defineAsyncComponent(() => import('../components/Media/index.vue')),
  channel: defineAsyncComponent(() => import('../components/Channel/index.vue')),
  edge: defineAsyncComponent(() => import('../components/Edge/index.vue')),
  cloud: defineAsyncComponent(() => import('../components/Cloud/index.vue')),
  'collector-gateway': defineAsyncComponent(() => import('../components/Edge/geteway.vue')),
  'plugin_gateway': defineAsyncComponent(() => import('../components/Plugin/index.vue')),
  'composite-device-gateway': defineAsyncComponent(() => import('../components/Composite/index.vue')),
}


const dataSource: any = ref([]);
const type = ref(false);
const loading = ref(true);
const provider = ref({});
const data = ref({});
const showType: any = ref('');
const bindProduct = ref(false)

const goProviders = (param: any) => {
    showType.value = param.type;
    provider.value = param;
    type.value = false;
};

const goBack = () => {
    provider.value = {};
    type.value = true;
};

const compositeProvider = computed(() => {
    const arr: any[] = []
    dataSource.value.forEach((item: any) => {
        item.list?.forEach((item: any) => {
            if(item.type === 'network' && !['composite-device-gateway', 'plugin_gateway','agent-device-gateway','agent-media-device-gateway'].includes(item.id) ) {
                arr.push(item)
            }
        })
    })
    return arr
});

//network
const TypeMap = new Map([
    ['fixed-media', 'media'],
    ['gb28181-2016', 'media'],
    ['onvif', 'media'],
    ['media-plugin', 'media'],
    ['OneNet', 'cloud'],
    ['OneNet-platform', 'cloud'],
    ['Ctwing', 'cloud'],
    ['modbus-tcp', 'channel'],
    ['opc-ua', 'channel'],
    ['official-edge-gateway', 'edge'],
    ['edge-child-device', 'edge'],
    ['network', 'network'],
    ['agent-device-gateway','network'],
    ['agent-media-device-gateway','network']
]);
// DataMap后期优化
const DataMap = new Map();
DataMap.set('fixed-media', {type: 'media', title: $t('Detail.index.308483-1')});
DataMap.set('gb28181-2016', {type: 'media', title: $t('Detail.index.308483-1')});
DataMap.set('onvif', {type: 'media', title: $t('Detail.index.308483-1')});
DataMap.set('media-plugin', {type: 'media', title: $t('Detail.index.308483-1')});
DataMap.set('OneNet', {type: 'cloud', title: $t('Detail.index.308483-2')});
DataMap.set('OneNet-platform', {type: 'cloud', title: $t('Detail.index.308483-2')});
DataMap.set('Ctwing', {type: 'cloud', title: $t('Detail.index.308483-2')});
DataMap.set('modbus-tcp', {type: 'channel', title: $t('Detail.index.308483-3')});
DataMap.set('opc-ua', {type: 'channel', title: $t('Detail.index.308483-3')});
DataMap.set('official-edge-gateway', {type: 'edge', title: $t('Detail.index.308483-4')});
DataMap.set('edge-child-device', {type: 'edge', title: $t('Detail.index.308483-4')});
DataMap.set('network', {type: 'network', title: $t('Detail.index.308483-5')});
DataMap.set('agent-device-gateway',{ type:'network', title:$t('Detail.index.308483-6')})
DataMap.set('agent-media-device-gateway',{ type:'network', title:$t('Detail.index.308483-6')})

const getTypeList = (result: Record<string, any>) => {
    const list = [];
    const media: any[] = [];
    const network: any[] = [];
    const cloud: any[] = [];
    const channel: any[] = [];
    const edge: any[] = [];
    const agent: any[] = [];
    result.map((item: any) => {
        if (item.id === 'fixed-media' || item.id === 'gb28181-2016' || item.id === 'onvif' || item.id === 'media-plugin') {
            item.type = 'media';
            media.push(item);
        } else if (item.id === 'OneNet' || item.id === 'Ctwing' || item.id === 'OneNet-platform') {
            item.type = 'cloud';
            cloud.push(item);
        } else if (item.id === 'modbus-tcp' || item.id === 'opc-ua' || item.id === 'collector-gateway') {
            item.type = 'channel';
            if (item.id === 'collector-gateway') {
                channel.push(item);
            }
        } else if (
            item.id === 'official-edge-gateway' ||
            item.id === 'edge-child-device'
        ) {
            item.type = 'edge';
            edge.push(item);
        } else if (
            item.id === 'agent-device-gateway' ||
            item.id === 'agent-media-device-gateway'
        ) {
            item.type = 'network';
            agent.push(item);
        }  else {
            item.type = 'network';
            network.push(item);
        }
    });

    network.length &&
    list.push({
        list: [...network],
        title: $t('Detail.index.308483-5'),
    });
    media.length &&
    list.push({
        list: [...media],
        title: $t('Detail.index.308483-1'),
    });
    cloud.length &&
    list.push({
        list: [...cloud],
        title: $t('Detail.index.308483-2'),
    });
    channel.length &&
    list.push({
        list: [...channel],
        title: $t('Detail.index.308483-3'),
    });
    edge.length &&
    list.push({
        list: [...edge],
        title: $t('Detail.index.308483-4'),
    });
    agent.length && list.push({
        list: [...agent],
        title: $t('Detail.index.308483-6')
    })
    return list;
};

const queryProviders = async () => {
    const resp: any = await getProviders();
    if (resp.status === 200) {
        const _data = resp.result || [];
        dataSource.value = getTypeList(accessConfigTypeFilter(_data as any[]));
        // 快速添加接入网关
        if (route.query.save && route.query?.type) {
            const type = route.query.type;
            goProviders(
                dataSource.value
                    .find((f: any) => f.title === DataMap.get(type).title)
                    ?.list?.find((f: any) => f.id === type),
            );
        }
    }
};

/**
 * 检查是否被产品使用
 */
const checkBindProduct = async (_id: string) => {
    const resp = await queryProductList({
        paging: false,
        terms: [{
            column: 'accessId',
            termType: 'eq',
            value: _id
        }]
    })
    console.log(resp.success && resp.result?.total)
    if (resp.success && resp.result?.total) {
        bindProduct.value = true
    }
}

const getProvidersData = async () => {
    if (id !== ':id' && !route.query.provider) {
        checkBindProduct(id)
        getProviders().then((response: any) => {
            if (response.status === 200) {
                const _data = response.result || [];
                dataSource.value = getTypeList(
                    accessConfigTypeFilter(_data as any[]),
                );
                detail(id).then((resp: any) => {
                    if (resp.status === 200) {
                        const dt = response.result.find(
                            (item: any) => item?.id === resp.result.provider,
                        );
                        response.result.forEach((item: any) => {
                            if (item.id === resp.result.provider) {
                                resp.result.type = TypeMap.has(item.id)
                                    ? TypeMap.get(item.id)
                                    : TypeMap.get('network');
                                showType.value = resp.result.type;
                            }
                        });

                        provider.value = dt;
                        data.value = resp.result;
                        type.value = false;
                    }
                });
            }
            loading.value = false;
        });
    } else {
        type.value = route.query.provider ? false : true;
        !route.query.data && queryProviders();
        loading.value = false;
    }
};

watch(() => route.query.provider, (val) => {
    if(val) {
        const _data = JSON.parse(val as string)
        type.value = false;
        showType.value = _data.type
        provider.value = _data
    }
}, {immediate: true})

watch(() => route.query.data, (val) => {
    if(val) {
        data.value = JSON.parse(val as string)
    }
}, {immediate: true})

onMounted(() => {
    loading.value = true;
    getProvidersData();
});
</script>

<style lang="less" scoped>
.go-back {
    margin: 0 0 20px 0;
}
</style>
