<template>
    <page-container>
        <j-spin :spinning="loading">
            <j-card :bordered="false">
                <div v-if="type && id === ':id'">
                    <Provider
                        @onClick="goProviders"
                        :dataSource="dataSource"
                    ></Provider>
                </div>
                <div v-else>
                    <div class="go-back" v-if="id === ':id'">
                        <a @click="goBack">返回</a>
                    </div>
                    <Network
                        v-if="showType === 'network'"
                        :provider="provider"
                        :data="data"
                    />
                    <Media
                        v-if="showType === 'media'"
                        :provider="provider"
                        :data="data"
                    />
                    <Channel
                        v-if="showType === 'channel'"
                        :provider="provider"
                        :data="data"
                    />
                    <Edge
                        v-if="showType === 'edge'"
                        :provider="provider"
                        :data="data"
                    />
                    <Cloud
                        v-if="showType === 'cloud'"
                        :provider="provider"
                        :data="data"
                    />
                </div>
            </j-card>
        </j-spin>
    </page-container>
</template>

<script lang="ts" setup name="AccessConfigDetail">
import Network from '../components/Network/index.vue';
import Provider from '../components/Provider/index.vue';
import Media from '../components/Media/index.vue';
import Channel from '../components/Channel/index.vue';
import Edge from '../components/Edge/index.vue';
import Cloud from '../components/Cloud/index.vue';
import { getProviders, detail } from '@/api/link/accessConfig';

const route = useRoute();
const id = route.params.id as string;

const dataSource = ref([]);
const type = ref(false);
const loading = ref(true);
const provider = ref({});
const data = ref({});
const showType = ref('');

const goProviders = (param: object) => {
    showType.value = param.type;
    provider.value = param;
    type.value = false;
};

const goBack = () => {
    provider.value = {};
    type.value = true;
};

const getTypeList = (result: Record<string, any>) => {
    const list = [];
    const media: any[] = [];
    const network: any[] = [];
    const cloud: any[] = [];
    const channel: any[] = [];
    const edge: any[] = [];
    result.map((item) => {
        if (item.id === 'fixed-media' || item.id === 'gb28181-2016') {
            item.type = 'media';
            media.push(item);
        } else if (item.id === 'OneNet' || item.id === 'Ctwing') {
            item.type = 'cloud';
            cloud.push(item);
        } else if (item.id === 'modbus-tcp' || item.id === 'opc-ua') {
            item.type = 'channel';
            channel.push(item);
        } else if (
            item.id === 'official-edge-gateway' ||
            item.id === 'edge-child-device'
        ) {
            item.type = 'edge';
            edge.push(item);
        } else {
            item.type = 'network';
            // network.push(item);
            /**
             * 插件设备接入 暂时不开发 todo
             */
            if (item.id !== 'plugin_gateway' || item.name !== '插件设备接入') {
                network.push(item);
            }
        }
    });

    network.length &&
        list.push({
            list: [...network],
            title: '自定义设备接入',
        });
    media.length &&
        list.push({
            list: [...media],
            title: '视频类设备接入',
        });
    cloud.length &&
        list.push({
            list: [...cloud],
            title: '云平台接入',
        });
    channel.length &&
        list.push({
            list: [...channel],
            title: '通道类设备接入',
        });
    edge.length &&
        list.push({
            list: [...edge],
            title: '官方接入',
        });

    return list;
};

const queryProviders = async () => {
    const resp = await getProviders();
    if (resp.status === 200) {
        dataSource.value = getTypeList(resp.result);
        // dataSource.value = getTypeList(resp.result)[0].list.filter(
        //     (item) => item.name !== '插件设备接入',
        // );
        console.log(111, dataSource.value);
    }
};

const getProvidersData = async () => {
    if (id !== ':id') {
        getProviders().then((response) => {
            if (response.status === 200) {
                const list = getTypeList(response.result);
                dataSource.value = list.filter(
                    (item) =>
                        item.channel === 'network' ||
                        item.channel === 'child-device',
                );
                detail(id).then((resp) => {
                    if (resp.status === 200) {
                        const dt = response.result.find(
                            (item) => item?.id === resp.result.provider,
                        );

                        response.result.forEach((item) => {
                            if (item.id === resp.result.provider) {
                                resp.result.type = item.type;
                                showType.value = item.type;
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
        type.value = true;
        queryProviders();
        loading.value = false;
    }
};

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
