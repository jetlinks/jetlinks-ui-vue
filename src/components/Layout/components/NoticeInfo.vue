<template>
    <div class="notice-info-container">
        <j-tabs :activeKey="'default'">
            <j-tab-pane key="default" tab="未读消息">
                <div class="no-data" v-if="props.data.length === 0">
                    <img
                        src="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
                        alt=""
                    />
                </div>

                <div v-else class="content">
                    <j-scrollbar class="list" max-height="400">
                        <div
                            class="list-item"
                            v-for="item in props.data"
                            @click.stop="read(item.id)"
                        >
                            <h5>{{ item.topicName }}</h5>
                            <p>{{ item.message }}</p>
                        </div>
                    </j-scrollbar>
                    <div class="btns">
                        <span @click="read()">当前标记为已读</span>
                        <span @click="jumpPage('account/NotificationRecord')"
                            >查看更多</span
                        >
                    </div>
                </div>
            </j-tab-pane>
        </j-tabs>
    </div>
</template>

<script setup lang="ts">
import { changeStatus_api } from '@/api/account/notificationRecord';
import { useMenuStore } from '@/store/menu';

const emits = defineEmits(['onAction']);
const props = defineProps<{
    data: any[];
}>();
const { jumpPage } = useMenuStore();

const read = (id?: string) => {
    const ids = id ? [id] : props.data.map((item) => item.id);
    changeStatus_api('_read', ids).then((resp: any) => {
        if (resp.status === 200) {
            jumpPage('account/NotificationRecord', {
                row: props.data.find((f: any) => f.id === id),
            });
            emits('onAction');
        }
    });
};
</script>

<style lang="less" scoped>
.notice-info-container {
    width: 336px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 6px 16px -8px rgb(0 0 0 / 8%), 0 9px 28px 0 rgb(0 0 0 / 5%),
        0 12px 48px 16px rgb(0 0 0 / 3%);

    :deep(.ant-tabs-nav-wrap) {
        display: flex;
        justify-content: center;
    }

    .no-data {
        width: 100%;
        padding: 73px 0 88px;
        color: rgba(0, 0, 0, 0.45);
        text-align: center;

        img {
            height: 76px;
        }
    }

    .content {
        .list {
            max-height: 400px;
            overflow: auto;
            padding: 0;
            margin: 0;
            &::-webkit-scrollbar {
                //隐藏或取消滚动条
                display: none;
            }

            .list-item {
                padding: 12px 24px;
                list-style: none;
                border-bottom: 1px solid #f0f0f0;
                cursor: pointer;
                h5 {
                    color: rgba(0, 0, 0, 0.85);
                    font-size: 14px;
                    font-weight: normal;
                }
                p {
                    font-size: 12px;
                    color: rgba(0, 0, 0, 0.45);
                }

                &:hover {
                    background: #f0f5ff;
                }
            }
        }
        .btns {
            display: flex;
            height: 46px;
            line-height: 46px;
            span {
                display: block;
                width: 50%;
                text-align: center;
                cursor: pointer;

                &:first-child {
                    border-right: 1px solid #f0f0f0;
                }
            }
        }
    }
}
</style>
