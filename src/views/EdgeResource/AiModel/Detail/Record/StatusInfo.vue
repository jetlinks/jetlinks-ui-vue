<template>
    <div class="body-detail">
        <div class="detail-item">
            <label>
                <j-space>
                    <AIcon type="CheckCircleOutlined"/>已完成
                </j-space>
            </label>
            <div>{{ success }}</div>
        </div>
        <div class="detail-item">
            <label>
                <j-space>
                    <AIcon type="CloseCircleOutlined"/>已失败
                </j-space>
            </label>
            <div>{{ failed }}</div>
        </div>
        <div class="detail-item">
            <label>
                <j-space>
                    <AIcon type="HourglassOutlined"/>进行中
                </j-space>
            </label>
            <div>{{ processing }}</div>
        </div>
        <div class="detail-item">
            <label><j-space>
                <AIcon type="ClockCircleOutlined"/>排队中
            </j-space>
            </label>
            <div>{{ waiting }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";

const props = defineProps({
    success: {
        type: String,
        default: 0
    },
    failed: {
        type: String,
        default: 0
    },
    waiting: {
        type: String,
        default: 0
    },
    processing: {
        type: String,
        default: 0
    }
})
</script>

<style scoped lang="less">
.body-detail {
    display: flex;
    gap: 50px;
    .detail-item {
        display: flex;
        gap: 12px;

        >label {
            color: @font-gray-500;
        }

        >span {
            color: @font-gray-600;
        }
    }
}
</style>