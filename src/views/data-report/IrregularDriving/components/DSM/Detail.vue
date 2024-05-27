<template>
    <j-modal
        title="报警附件"
        visible
        width="560px"
        height="664px"
        destroyOnClose
        @ok="emits('update:visible', false)"
        @cancel="emits('update:visible', false)"
        class="details-box"
    >
        <a-row :gutter="[24, 24]">
            <a-col :span="24"
                ><span class="details-label">报警类型：</span>
                <span class="details-desc">{{ data.reportType }}</span></a-col
            >
            <a-col :span="24"
                ><span class="details-label">报警时间：</span>
                <span class="details-desc">
                    {{ dayjs(data.reportTime).format('YYYY-MM-DD HH:mm:ss') }}
                </span></a-col
            >
            <a-col :span="24"
                ><span class="details-label">报警信息：</span>
                <span class="details-desc">{{ data.reportInfo }}</span></a-col
            >
            <a-col :span="24"
                ><span class="details-label"> 报警位置：</span>
                <span class="details-desc">{{ data.reportArea }}</span></a-col
            >
        </a-row>
        <a-divider />
        <a-radio-group v-model:value="value">
            <a-radio-button value="1">报警视频</a-radio-button>
            <a-radio-button value="2">报警图片</a-radio-button>
        </a-radio-group>
        <div class="detail-box">
            <img :src="data.reportPicture" alt="" />
        </div>
    </j-modal>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';

withDefaults(
    defineProps<{
        data: any;
    }>(),
    {},
);

const emits = defineEmits(['refresh', 'update:visible']);

const value = ref('2');
</script>

<style lang="less" scoped>
.details-box {
    .details-label {
        font-family: 'HarmonyOS Sans SC';
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 18px;
        text-align: right;
        color: #6b6f7f;
        margin-right: 8px;
    }
    .details-desc {
        font-family: 'HarmonyOS Sans SC';
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 18px;
        text-align: right;
        color: #191c27;
    }
    .detail-box {
        height: 380px;
        width: 100%;
        margin-top: 10px;
        img {
            width: 512px;
            height: 292px;
        }
    }
}
</style>
