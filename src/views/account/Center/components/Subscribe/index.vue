<template>
    <div style="margin-top: 24px">
        <div class="alert">
            <AIcon type="InfoCircleOutlined" />
            你可以在该页面选择需要订阅的主题及接收通知的方式。
        </div>
        <div style="margin-top: 20px">
            <j-collapse :bordered="false" v-model:activeKey="activeKey">
                <template #expandIcon="{ isActive }">
                    <AIcon
                        type="CaretRightOutlined"
                        :rotate="isActive ? 90 : 0"
                    />
                </template>
                <j-collapse-panel
                    v-for="item in dataSource"
                    :key="item.id"
                    class="custom"
                >
                    <template #header
                        ><h3>{{ item.name }}</h3></template
                    >
                    <div class="child">
                        <template
                            v-for="child in item.children"
                            :key="child.id"
                        >
                            <div class="child-item">
                                <div class="child-item-left">
                                    <div style="font-weight: 600">
                                        {{ child.name }}
                                    </div>
                                    <div class="child-item-left-auth">
                                        <j-tooltip
                                            title="当产品类型的告警被触发时，你将在已订阅的方式中收到通知"
                                        >
                                            <AIcon
                                                type="ExclamationCircleOutlined"
                                            />
                                        </j-tooltip>
                                    </div>
                                </div>
                                <div class="child-item-right">
                                    <MCarousel :data="child.children">
                                        <template #card="slotProps">
                                            <div class="box-item">
                                                <j-popover>
                                                    <div class="box-item-img">
                                                        <img
                                                            style="width: 100%"
                                                            :src="
                                                                getImage(
                                                                    `/notice/${slotProps?.type}.png`,
                                                                )
                                                            "
                                                        />
                                                        <div
                                                            class="box-item-checked"
                                                        >
                                                            <j-checkbox
                                                                :checked="
                                                                    !slotProps?.type
                                                                "
                                                            ></j-checkbox>
                                                        </div>
                                                    </div>
                                                    <template #content>
                                                        <Detail />
                                                        <!-- <Error v-else /> -->
                                                    </template>
                                                </j-popover>
                                                <div class="box-item-text">
                                                    {{ item.name }}
                                                </div>
                                            </div>
                                        </template>
                                    </MCarousel>
                                </div>
                            </div>
                        </template>
                    </div>
                </j-collapse-panel>
            </j-collapse>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { getImage } from '@/utils/comm';
import MCarousel from '@/components/MCarousel/index.vue';
import Detail from './components/Detail.vue';
import Error from './components/Error.vue'

const dataSource = ref([
    {
        id: 'a',
        name: '告警',
        children: [
            {
                id: 'product',
                name: '产品告警',
                active: true,
                children: [
                    {
                        id: 'sms9',
                        name: '站内信',
                        type: 'sms',
                    },
                    {
                        id: 'dingtalk8',
                        name: '钉钉',
                        type: 'dingtalk',
                    },
                    {
                        id: 'wechat7',
                        name: '微信',
                        type: 'wechat',
                    },
                    {
                        id: 'email6',
                        name: '邮箱',
                        type: 'email',
                    },
                    {
                        id: 'dingtalk5',
                        name: '钉钉',
                        type: 'dingtalk',
                    },
                    {
                        id: 'wechat4',
                        name: '微信',
                        type: 'wechat',
                    },
                    {
                        id: 'email3',
                        name: '邮箱',
                        type: 'email',
                    },
                    {
                        id: 'email2',
                        name: '邮箱',
                        type: 'email',
                    },
                    {
                        id: 'email1',
                        name: '邮箱',
                        type: 'email',
                    },
                ],
            },
            {
                id: 'device',
                name: '设备告警',
                active: false,
                children: [
                    {
                        id: 'sms11',
                        name: '站内信',
                        type: 'sms',
                    },
                    {
                        id: 'wechat11',
                        name: '微信',
                        type: 'wechat',
                    },
                    {
                        id: 'voice11',
                        name: '语音',
                        type: 'voice',
                    },
                ],
            },
        ],
    },
    {
        id: 'b',
        name: '系统监控',
        children: [
            {
                id: 'cache',
                name: '缓冲区数据丢弃',
                active: false,
                children: [
                    {
                        id: 'message111',
                        name: '站内信',
                        type: 'sms',
                    },
                ],
            },
            {
                id: 'mqtt',
                name: 'MQTT并发限制',
                active: false,
                children: [
                    {
                        id: 'message22',
                        name: '站内信',
                        type: 'sms',
                    },
                ],
            },
        ],
    },
    {
        id: 'c',
        name: '业务监控',
        children: [
            {
                id: 'error',
                name: '透传消息解析异常',
                active: false,
                children: [
                    {
                        id: 'message333',
                        name: '站内信',
                        type: 'sms',
                    },
                ],
            },
        ],
    },
]);
const activeKey = ['a', 'b', 'c'];
</script>

<style lang="less" scoped>
.alert {
    height: 40px;
    padding-left: 10px;
    margin-bottom: 10px;
    color: rgba(0, 0, 0, 0.55);
    line-height: 40px;
    background-color: #f6f6f6;
}
.custom {
    background: #f7f7f7;
    border-radius: 4px;
    border: 0;
    overflow: hidden;
}
.child {
    background-color: white;
    padding: 10px;
    .child-item {
        padding: 10px 20px;
        margin: 5px;
        background: #f7f7f7;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .child-item-left {
            display: flex;
            align-items: center;

            div {
                display: flex;
                margin-right: 30px;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }

            .child-item-left-auth {
                cursor: pointer;
            }
        }

        .child-item-right {
            display: flex;

            .box-item {
                margin-left: 10px;
                .box-item-img {
                    background-color: #fff;
                    width: 48px;
                    height: 48px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    position: relative;

                    .box-item-checked {
                        position: absolute;
                        top: -10px;
                        right: -10px;
                    }
                }

                .box-item-text {
                    width: 100%;
                    text-align: center;
                    height: 20px;
                }
            }
        }
    }
}
</style>