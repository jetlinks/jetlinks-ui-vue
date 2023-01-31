<template>
    <a-spin :spinning="loading">
        <a-card :bordered="false">
            <div v-if="type && modeType === 'add'">
                <Provider
                    @onClick="goProviders"
                    :dataSource="dataSource"
                ></Provider>
            </div>
            <div v-else>
                <div v-if="!id"><a @click="goBack">返回</a></div>
                <AccessNetwork
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
        </a-card>
    </a-spin>
</template>

<script lang="ts" setup name="AccessConfigDetail">
import { getImage } from '@/utils/comm';
import AccessNetwork from '../components/Network.vue';
import Provider from '../components/Provider/index.vue';
import { getProviders, detail } from '@/api/link/accessConfig';
import Media from '../components/Media/index.vue';
import Channel from '../components/Channel/index.vue';
import Edge from '../components/Edge/index.vue';
import Cloud from '../components/Cloud/index.vue';

const route = useRoute();

const modeType = route.params.type as string;
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

const getTypeList = (result: any[]) => {
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
            network.push(item);
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
    }
};

const getProvidersData = async () => {
    if (id && modeType !== 'add') {
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
.provider {
    position: relative;
    width: 100%;
    padding: 20px;
    background: url('/public/images/access/background.png') no-repeat;
    background-size: 100% 100%;
    border: 1px solid #e6e6e6;

    &::before {
        position: absolute;
        top: 0;
        left: 40px;
        display: block;
        width: 15%;
        min-width: 64px;
        height: 2px;
        background-image: url('/public/images/access/rectangle.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;
        // border: 1px #8da1f4 solid;
        // border-bottom-left-radius: 10%;
        // border-bottom-right-radius: 10%;
        content: ' ';
    }

    &:hover {
        box-shadow: 0 0 24px rgba(#000, 0.1);
    }
}

.box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;

    .left {
        display: flex;
        width: calc(100% - 70px);
        .images {
            width: 64px;
            height: 64px;

            img {
                width: 100%;
            }
        }

        .context {
            width: calc(100% - 84px);
            margin: 10px;

            .title {
                font-weight: 600;
            }

            .desc {
                width: 100%;
                margin-top: 10px;
                overflow: hidden;
                color: rgba(0, 0, 0, 0.55);
                font-weight: 400;
                font-size: 13px;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
        }
    }
    .right {
        width: 70px;
    }
}
</style>
