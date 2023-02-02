<template>
    <a-card class="device-count-container">
        <template #title>
            <h5 class="title">基础统计</h5>
        </template>
        <template #extra>
            <span style="color: #1d39c4; cursor: pointer" @click="jumpPage"
                >详情</span
            >
        </template>

        <div class="box-list">
            <div class="box-item">
                <div class="label">设备数量</div>
                <div class="value">{{ deviceCount }}</div>
                <img :src="getImage('/home/top-1.png')" alt="" />
            </div>
            <div class="box-item">
                <div class="label">通道数量</div>
                <div class="value">{{ channelCount }}</div>
                <img :src="getImage('/home/top-2.png')" alt="" />
            </div>
        </div>
    </a-card>
</template>

<script setup lang="ts">
import homeApi from '@/api/media/home';
import { getImage } from '@/utils/comm';

const channelCount = ref(0);
const deviceCount = ref(0);

onMounted(() => {
    getData();
});

const getData = () => {
    homeApi.deviceCount().then((resp) => {
        deviceCount.value = resp.result;
    });
    homeApi.channelCount().then((resp) => {
        channelCount.value = resp.result;
    });
};

const router = useRouter();
const jumpPage = () => {
    router.push('/media/dashboard');
};
</script>

<style lang="less" scoped>
.device-count-container {
    :deep(.ant-card-body) {
        padding-top: 0;
    }
    .title {
        position: relative;
        z-index: 2;
        display: flex;
        justify-content: space-between;
        margin-bottom: 12px;
        padding-left: 18px;
        font-weight: 700;
        font-size: 18px;

        &::before {
            position: absolute;
            top: 50%;
            left: 0;
            width: 8px;
            height: 8px;
            background-color: #1d39c4;
            border: 1px solid #b4c0da;
            transform: translateY(-50%);
            content: ' ';
        }
    }

    .box-list {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-gap: 24px;
        gap: 24px;

        .box-item {
            position: relative;
            padding: 16px;
            background: linear-gradient(
                135.62deg,
                #f6f7fd 22.27%,
                hsla(0, 0%, 100%, 0.86) 91.82%
            );
            border-radius: 2px;
            box-shadow: 0 4px 18px #efefef;

            .label {
                color: #4f4f4f;
            }
            .value {
                margin: 20px 0;
                color: rgba(0, 0, 0, 0.85);
                font-weight: 700;
                font-size: 20px;
            }

            img {
                position: absolute;
                right: 10%;
                bottom: 0;
                width: 90px;
                height: 90px;
            }
        }
    }
}
</style>
