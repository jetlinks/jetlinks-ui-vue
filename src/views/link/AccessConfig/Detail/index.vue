<template>
    <a-spin :spinning="loading">
        <a-card :bordered="false">
            <div v-if="type">
                <Provider
                    @onClick="goProviders"
                    :dataSource="dataSource"
                ></Provider>
            </div>
            <div v-else>
                <div v-if="!id"><a @click="goBack">返回</a></div>
                <AccessNetwork :provider="provider" :data="data" />
            </div>
        </a-card>
    </a-spin>
</template>

<script lang="ts" setup name="AccessConfigDetail">
import { getImage } from '@/utils/comm';
import TitleComponent from '@/components/TitleComponent/index.vue';
import AccessNetwork from '../components/Network.vue';
import Provider from '../components/Provider/index.vue';
import { getProviders, detail } from '@/api/link/accessConfig';

// const router = useRouter();
const route = useRoute();

const id = route.query.id;

const dataSource = ref([]);
const type = ref(false);
const loading = ref(true);
const provider = ref({});
const data = ref({});

const goProviders = (param: object) => {
    provider.value = param;
    type.value = false;
};

const goBack = () => {
    provider.value = {};
    type.value = true;
};

const queryProviders = async () => {
    const resp = await getProviders();
    if (resp.status === 200) {
        dataSource.value = resp.result.filter(
            (item) =>
                item.channel === 'network' || item.channel === 'child-device',
        );
    }
};

const getProvidersData = async () => {
    if (id) {
        getProviders().then((response) => {
            if (response.status === 200) {
                dataSource.value = response.result.filter(
                    (item) =>
                        item.channel === 'network' ||
                        item.channel === 'child-device',
                );
                detail(id).then((resp) => {
                    if (resp.status === 200) {
                        const dt = response.result.find(
                            (item) => item?.id === resp.result.provider,
                        );
                        provider.value = dt;
                        data.value = resp.result;
                        type.value = false;
                    }
                });
                loading.value = false;
            } else {
                loading.value = false;
            }
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
