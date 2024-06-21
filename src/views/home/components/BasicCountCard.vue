<template>
    <div class="device-count-container">
        <h5 class="title">基础统计</h5>
        <span class="detail" @click="jumpPage('link/DashBoard')"> 详情 </span>

        <div class="box-list">
            <div class="box-item">
                <div class="label">CPU使用率</div>
                <div class="value">{{ cpu + '%' }}</div>
                <Pie
                    class="chart"
                    :value="cpu"
                    chart-ref="cpuChart"
                    :color-arr="['#ffe3db', '#F84914']"
                    image="/images/home/top-3.svg"
                />
            </div>
            <div class="box-item">
                <div class="label">JVM内存</div>
                <div class="value">{{ jvm + '%' }}</div>
                <Pie
                    class="chart"
                    chart-ref="jvmChart"
                    :value="jvm"
                    :color-arr="['#ffe3db', '#F84914']"
                    image="/images/home/top-4.svg"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { getWebSocket } from '@/utils/websocket';
import Pie from './Pie.vue';
import { map } from 'rxjs/operators';
import { useMenuStore } from '@/store/menu';

const cpu = ref(0);
const jvm = ref(0);

const { jumpPage } = useMenuStore();

const cpuSocket = getWebSocket(
    'operations-statistics-system-info-cpu-realTime',
    '/dashboard/systemMonitor/stats/info/realTime',
    {
        type: 'cpu',
        interval: '2s',
        agg: 'avg',
    },
)
    ?.pipe(map((res: any) => res.payload))
    .subscribe((resp: any) => {
        cpu.value = resp.value?.systemUsage || 0;
    });
const jvmSocket = getWebSocket(
    `operations-statistics-system-info-memory-realTime`,
    `/dashboard/systemMonitor/stats/info/realTime`,
    {
        type: 'memory',
        interval: '2s',
        agg: 'avg',
    },
)
    ?.pipe(map((res: any) => res.payload))
    .subscribe((payload: any) => {
        jvm.value = payload.value?.jvmHeapUsage || 0;
    });

onUnmounted(() => {
    cpuSocket && cpuSocket.unsubscribe();
    jvmSocket && jvmSocket.unsubscribe();
});
</script>

<style lang="less" scoped>
.device-count-container {
    background-color: #fff;
    padding: 24px 14px;
    position: relative;
    .detail {
        color: var(--theme-color-primary);
        cursor: pointer;
        position: absolute;
        right: 12px;
        top: 24px;
        z-index: 3;
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
            background-color: var(--boot-card-icon-primary);
            border: 1px solid var(--boot-card-icon-border);
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
            background: var(--card-bg-linear);
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

            .chart {
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
