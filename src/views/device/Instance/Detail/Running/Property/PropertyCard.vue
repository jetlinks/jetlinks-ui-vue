<template>
    <a-card :hoverable="true" class="card-box">
        <a-spin :spinning="loading">
            <div class="card-container">
                <div class="header">
                    <div class="title">{{ _props.data.name }}</div>
                    <div class="extra">
                        <a-space>
                            <a-tooltip title="设置属性至设备" v-if="data.expands?.type?.includes('write')">
                                <AIcon
                                    type="EditOutlined"
                                    style="font-size: 12px"
                                />
                            </a-tooltip>
                            <a-tooltip title="指标" v-if="(data.expands?.metrics || []).length > 0 &&
            ['int', 'long', 'float', 'double', 'string', 'boolean', 'date'].includes(
              data.valueType?.type || '',
            )">
                                <AIcon
                                    type="ClockCircleOutlined"
                                    style="font-size: 12px"
                                />
                            </a-tooltip>
                            <a-tooltip title="获取最新属性值" v-if="data.expands?.type?.includes('read')">
                                <AIcon
                                    type="SyncOutlined"
                                    style="font-size: 12px"
                                />
                            </a-tooltip>
                            <a-tooltip title="详情">
                                <AIcon
                                    type="BarsOutlined"
                                    style="font-size: 12px"
                                />
                            </a-tooltip>
                        </a-space>
                    </div>
                </div>
                <div class="value">
                    <ValueRender :data="data" />
                </div>
                <div class="bottom">
                    <div style="color: rgba(0, 0, 0, .65); font-size: 12px">更新时间</div>
                    <div class="time-value">{{data?.time || '--'}}</div>
                </div>
            </div>
        </a-spin>
    </a-card>
</template>

<script lang="ts" setup>
import ValueRender from './ValueRender.vue'
const _props = defineProps({
    data: {
        type: Object,
        default: () => {},
    },
});
const loading = ref<boolean>(true);

watchEffect(() => {
    if (_props.data.name) {
        loading.value = false;
    }
});
</script>

<style lang="less" scoped>
.card-box {
    background-color: rgba(0, 0, 0, 0.02);
    width: 100%;

    .card-container {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 154px;

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .title {
                width: 60%;
                margin-right: 10px;
                overflow: hidden;
                color: rgba(0, 0, 0, 0.65);
                font-weight: 400;
                font-size: 12px;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
        }

        .value {
            height: 60px;
            line-height: 60px;
            color: #323130;
            font-weight: 700;
            font-size: 24px;
            margin: 10px 0;
        }

        .bottom {
            .time-value {
                margin-top: 5px;
                font-size: 16px;
                min-height: 25px;
                color: #000;
            }
        }
    }   
}
</style>