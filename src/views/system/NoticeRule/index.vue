<template>
    <page-container>
        <FullPage>
            <div style="padding: 24px">
                <div class="alert">
                    <AIcon type="InfoCircleOutlined" />
                    你可以为每种通知类型配置不同的通知方式与通知模版；
                </div>
                <div class="alert">
                    <AIcon type="InfoCircleOutlined" />
                    默认平台中所有用户都能接收到通知，如需限制接收权限可以在配置通知方式时完成，或在通知类型后方的“权限控制”处配置外层权限。
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
                                            <div
                                                class="child-item-left-auth"
                                                :class="{
                                                    active: child.active,
                                                }"
                                                @click="onAuth(item, child)"
                                            >
                                                <AIcon type="UserOutlined" />
                                                <span>权限控制</span>
                                            </div>
                                        </div>
                                        <div class="child-item-right">
                                            <MCarousel :data="child.children">
                                                <template #card="slotProps">
                                                    <div class="box-item">
                                                        <j-dropdown>
                                                            <div
                                                                class="box-item-img"
                                                            >
                                                                <img
                                                                    style="
                                                                        width: 100%;
                                                                    "
                                                                    :src="
                                                                        getImage(
                                                                            `/notice/${slotProps?.type}.png`,
                                                                        )
                                                                    "
                                                                />
                                                            </div>
                                                            <template #overlay>
                                                                <j-menu mode="">
                                                                    <j-menu-item>
                                                                        <PermissionButton
                                                                            @click="
                                                                                onView(
                                                                                    item,
                                                                                    child,
                                                                                )
                                                                            "
                                                                            type="link"
                                                                            :hasPermission="
                                                                                true
                                                                            "
                                                                        >
                                                                            查看
                                                                        </PermissionButton>
                                                                    </j-menu-item>
                                                                    <j-menu-item>
                                                                        <PermissionButton
                                                                            @click="
                                                                                onEdit(
                                                                                    item,
                                                                                    child,
                                                                                )
                                                                            "
                                                                            type="link"
                                                                            :hasPermission="
                                                                                true
                                                                            "
                                                                        >
                                                                            编辑
                                                                        </PermissionButton>
                                                                    </j-menu-item>
                                                                    <j-menu-item>
                                                                        <PermissionButton
                                                                            @click="
                                                                                onDelete(
                                                                                    item,
                                                                                    child,
                                                                                )
                                                                            "
                                                                            danger
                                                                            type="link"
                                                                            :hasPermission="
                                                                                true
                                                                            "
                                                                        >
                                                                            删除
                                                                        </PermissionButton>
                                                                    </j-menu-item>
                                                                </j-menu>
                                                            </template>
                                                        </j-dropdown>
                                                        <div
                                                            class="box-item-text"
                                                        >
                                                            {{ item.name }}
                                                        </div>
                                                    </div>
                                                </template>
                                                <template #add>
                                                    <div class="box-item">
                                                        <div
                                                            @click="
                                                                onAdd(
                                                                    item,
                                                                    child,
                                                                )
                                                            "
                                                            class="box-item-img"
                                                        >
                                                            <AIcon
                                                                style="
                                                                    font-size: 20px;
                                                                "
                                                                type="PlusOutlined"
                                                            />
                                                        </div>
                                                        <div
                                                            class="box-item-text"
                                                        ></div>
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
        </FullPage>
        <Save v-if="visible" @close="visible = false" @save="onSave" />
        <Detail v-if="detailVisible" @close="detailVisible = false" />
        <Auth
            v-if="authVisible"
            @close="authVisible = false"
            @save="onAuthSave"
        />
    </page-container>
</template>

<script lang="ts" setup>
import MCarousel from '@/components/MCarousel/index.vue';
import { getImage } from '@/utils/comm';
import Save from './components/Save/index.vue';
import Detail from './components/Detail/index.vue';
import Auth from './components/Auth/index.vue';

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
const visible = ref<boolean>(false);
const detailVisible = ref<boolean>(false);
const authVisible = ref<boolean>(false);
const current = reactive({
    item: {},
    child: {},
});

const onAdd = (_item: any, _child: any) => {
    (current.child = _child), (current.item = _item);
    visible.value = true;
};

const onView = (_item: any, _child: any) => {
    (current.child = _child), (current.item = _item);
    detailVisible.value = true;
};

const onEdit = (_item: any, _child: any) => {
    (current.child = _child), (current.item = _item);
    visible.value = true;
};

const onDelete = (_item: any, _child: any) => {};

const onSave = () => {
    visible.value = false;
};

const onAuth = (_item: any, _child: any) => {
    (current.child = _child), (current.item = _item);
    authVisible.value = true;
};

const onAuthSave = (_data: string[]) => {
    console.log(_data);
    authVisible.value = false;
};
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
                &:hover {
                    color: @primary-color-hover;
                }
                &.active {
                    color: @primary-color;
                }
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