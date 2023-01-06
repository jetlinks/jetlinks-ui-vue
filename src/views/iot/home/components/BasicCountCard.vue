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
                <div class="label">CPU使用率</div>
                <div class="value">{{ cpu }}</div>
                <div class="chart" ref="cpuChart"></div>
            </div>
            <div class="box-item">
                <div class="label">JVM内存</div>
                <div class="value">{{ jvm }}</div>
                <div class="chart" ref="jvmChart"></div>
            </div>
        </div>
    </a-card>
</template>

<script setup lang="ts">
const cpu = ref('0%');
const jvm = ref('10%');

const jumpPage = () => {};
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
