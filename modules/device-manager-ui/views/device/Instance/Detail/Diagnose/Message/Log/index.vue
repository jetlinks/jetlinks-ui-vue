<template>
    <div class="log-item" :key="data.id">
        <div class="log-card">
            <div class="log-icon" @click="visible = !visible">
                <AIcon :type="visible ? 'DownOutlined' : 'RightOutlined'" />
            </div>
            <div class="log-box">
                <div class="log-header">
                    <div class="log-title">
                        <a-tag color="error">ERROR</a-tag>
                        {{ operationMap.get(data.operation) }}
                    </div>
                    <div class="log-time">
                        {{ dayjs(data.endTime).format('YYYY-MM-DD HH:mm:ss') }}
                    </div>
                </div>
                <div className="log-editor" v-if="visible">
                    <a-textarea
                        autoSize
                        :bordered="false"
                        :value="data?.detail"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();

const operationMap = new Map();
operationMap.set('connection', $t('Dialog.index.786817-0'));
operationMap.set('auth', $t('Dialog.index.786817-1'));
operationMap.set('decode', $t('Dialog.index.786817-2'));
operationMap.set('encode', $t('Dialog.index.786817-3'));
operationMap.set('request', $t('Dialog.index.786817-4'));
operationMap.set('response', $t('Dialog.index.786817-5'));
operationMap.set('downstream', $t('Dialog.index.786817-6'));
operationMap.set('upstream', $t('Dialog.index.786817-7'));

const visible = ref<boolean>(false);

const props = defineProps({
    data: {
        type: Object,
        default: () => {},
    },
    isCollapse: {
        type: Boolean,
        default: false,
    },
});

watch(() => props.isCollapse, (val) => {
    visible.value = !val;
})
</script>

<style lang="less" scoped>
.log-item {
    display: flex;
    justify-content: flex-start;
    width: 100%;
    padding-bottom: 12px;

    .log-card {
        display: flex;
        width: 100%;
        background-color: #fff;

        .log-icon {
            margin-right: 10px;
            color: rgba(0, 0, 0, 0.75);
            font-weight: 500;
            font-size: 12px;
        }

        .log-box {
            display: flex;
            flex-direction: column;
            width: 100%;

            .log-header {
                .log-title {
                    color: rgba(0, 0, 0, 0.75);
                    font-weight: 700;
                    font-size: 14px;
                }

                .log-time {
                    color: rgba(0, 0, 0, 0.65);
                    font-size: 12px;
                }
            }

            .log-editor {
                width: 100%;
                margin-top: 10px;
                color: rgba(0, 0, 0, 0.75);

                textarea {
                    color: black !important;
                    background-color: #fafafa !important;
                }

                textarea::-webkit-scrollbar {
                    width: 5px !important;
                }
            }
        }
    }
}
</style>
