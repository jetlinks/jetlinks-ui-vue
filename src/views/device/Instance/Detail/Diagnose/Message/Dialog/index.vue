<template>
    <div
        class="dialog-item"
        :key="data.key"
        :class="{ 'dialog-active': !data?.upstream }"
    >
        <div class="dialog-card">
            <div class="dialog-list" v-for="item in data.list" :key="item.key">
                <div class="dialog-icon" @click="getDetail(item)">
                    <AIcon
                        v-if="visible.includes(item.key)"
                        type="DownOutlined"
                    />
                    <AIcon v-else type="RightOutlined" />
                </div>
                <div class="dialog-box">
                    <div class="dialog-header">
                        <div class="dialog-title">
                            <a-badge
                                :color="
                                    statusColor.get(
                                        item.error ? 'error' : 'success',
                                    )
                                "
                                style="margin-right: 5px"
                            />
                            {{
                                operationMap.get(item.operation) ||
                                item?.operation
                            }}
                        </div>
                        <div class="dialog-time">
                            {{
                                moment(item.endTime).format(
                                    'YYYY-MM-DD HH:mm:ss',
                                )
                            }}
                        </div>
                    </div>
                    <div
                        class="dialog-editor"
                        v-if="visible.includes(item.key)"
                    >
                        <a-textarea autoSize :bordered="false" :value="item?.detail" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
const operationMap = new Map();
import moment from 'moment';
operationMap.set('connection', '连接');
operationMap.set('auth', '权限验证');
operationMap.set('decode', '解码');
operationMap.set('encode', '编码');
operationMap.set('request', '请求');
operationMap.set('response', '响应');
operationMap.set('downstream', '下行消息');
operationMap.set('upstream', '上行消息');

const statusColor = new Map();
statusColor.set('error', '#E50012');
statusColor.set('success', '#24B276');

const props = defineProps({
    data: {
        type: Object,
        default: () => {},
    },
});
const visible = ref<string[]>([]);
const getDetail = (item: any) => {
    const index = visible.value.indexOf(item.key);
    if (index === -1) {
        visible.value.push(item.key);
    } else {
        visible.value.splice(index, 1);
    }
};

watchEffect(() => {
  console.log(props.data)
})
</script>

<style lang="less" scoped>
// @import 'ant-design-vue/es/style/themes/default.less';

// :root {
//     --dialog-primary-color: @primary-color;
// }

.dialog-item {
    display: flex;
    justify-content: flex-start;
    width: 100%;
    padding-bottom: 12px;

    .dialog-card {
        display: flex;
        flex-direction: column;
        width: 60%;
        padding: 24px;
        background-color: #fff;

        .dialog-list {
            display: flex;

            .dialog-icon {
                margin-right: 10px;
                color: rgba(0, 0, 0, 0.75);
                font-weight: 500;
                font-size: 12px;
            }

            .dialog-box {
                display: flex;
                flex-direction: column;
                width: 100%;

                .dialog-header {
                    .dialog-title {
                        color: rgba(0, 0, 0, 0.75);
                        font-weight: 700;
                        font-size: 14px;
                    }

                    .dialog-time {
                        color: rgba(0, 0, 0, 0.65);
                        font-size: 12px;
                    }
                }

                .dialog-editor {
                    width: 100%;
                    margin-top: 10px;
                    color: rgba(0, 0, 0, 0.75);

                    textarea::-webkit-scrollbar {
                        width: 5px !important;
                    }
                }
            }
        }
    }
}

.dialog-active {
    display: flex;
    justify-content: flex-end;
    .dialog-card {
        background-color: @primary-color;

        .dialog-list {
            .dialog-icon {
                color: #fff;
            }

            .dialog-box {
                .dialog-header {
                    .dialog-title,
                    .dialog-time {
                        color: #fff;
                    }
                }

                .dialog-editor {
                    textarea {
                        color: #fff !important;
                        background-color: @primary-color !important;
                    }
                }
            }
        }
    }
}
</style>