<template>
    <div class="child-item">
        <div class="child-item-left">
            <div style="font-weight: 600">
                {{ data?.name }}
            </div>
            <div>
                <j-switch @change="onSwitchChange" :checked="checked" />
            </div>
        </div>
        <div class="child-item-right" v-if="checked">
            <MCarousel :data="data?.channels">
                <template #card="slotProps">
                    <div class="box-item">
                        <j-dropdown>
                            <div class="box-item-img">
                                <img
                                    style="width: 100%"
                                    :src="
                                        getImage(
                                            `/notice/${noticeType.get(
                                                slotProps?.channelProvider,
                                            )}.png`,
                                        )
                                    "
                                />
                            </div>
                            <template #overlay v-if="slotProps?.channelProvider !== 'inside-mail'">
                                <j-menu mode="">
                                    <j-menu-item>
                                        <PermissionButton
                                            @click="onView(slotProps)"
                                            type="link"
                                            :hasPermission="true"
                                        >
                                            查看
                                        </PermissionButton>
                                    </j-menu-item>
                                    <j-menu-item>
                                        <PermissionButton
                                            @click="onEdit(slotProps)"
                                            type="link"
                                            :hasPermission="true"
                                        >
                                            编辑
                                        </PermissionButton>
                                    </j-menu-item>
                                    <j-menu-item>
                                        <PermissionButton
                                            @click="onDelete(slotProps.id)"
                                            danger
                                            type="link"
                                            :hasPermission="true"
                                        >
                                            删除
                                        </PermissionButton>
                                    </j-menu-item>
                                </j-menu>
                            </template>
                        </j-dropdown>
                        <div class="box-item-text">
                            {{ slotProps?.name }}
                        </div>
                    </div>
                </template>
                <template #add>
                    <div class="box-item">
                        <div @click="onAdd" class="box-item-img">
                            <AIcon
                                style="font-size: 20px"
                                type="PlusOutlined"
                            />
                        </div>
                        <div class="box-item-text"></div>
                    </div>
                </template>
            </MCarousel>

            <div
                class="child-item-right-auth"
                :class="{ active: auth.length }"
                @click="onAuth"
            >
                <AIcon type="UserOutlined" />
                <span>权限控制</span>
            </div>
        </div>
    </div>
    <Save :data="current" v-if="visible" @close="visible = false" @save="onSave" />
    <Detail :data="current" v-if="detailVisible" @close="detailVisible = false" />
    <Auth
        v-if="authVisible"
        :data="data?.grant?.role?.idList"
        @close="authVisible = false"
        @save="onAuthSave"
    />
</template>

<script lang="ts" setup>
import MCarousel from '@/components/MCarousel/index.vue';
import Save from '../Save/index.vue';
import Detail from '../Detail/index.vue';
import Auth from '../Auth/index.vue';
import { noticeType } from '../../data';
import { getImage, onlyMessage } from '@/utils/comm';
import {
    saveChannelConfig,
    actionChannelConfig,
    deleteChannelConfig,
    editChannelConfig,
    updateChannelConfig,
} from '@/api/system/noticeRule';
import { Modal } from 'jetlinks-ui-components';

const props = defineProps({
    data: {
        type: Object,
        default: () => {},
    },
});

const emits = defineEmits(['refresh']);

const visible = ref<boolean>(false);
const detailVisible = ref<boolean>(false);
const authVisible = ref<boolean>(false);
const current = ref<any>({});

const checked = ref<boolean>(false);
const auth = ref<string[]>([]);

watchEffect(() => {
    checked.value = props.data?.state?.value === 'enabled';
    auth.value = props.data?.grant?.role?.idList || [];
});

const onAdd = () => {
    visible.value = true;
    current.value = {
        providerId: props.data.id
    }
};

const onView = (dt: any) => {
    current.value = dt
    detailVisible.value = true;
};

const onEdit = (dt: any) => {
    current.value = dt
    visible.value = true;
};

const onDelete = async (id: string) => {
    if (id) {
        const resp = await deleteChannelConfig(id);
        if (resp.status === 200) {
            onlyMessage('操作成功！');
            emits('refresh');
        }
    }
};

const onAuth = () => {
    authVisible.value = true;
};

const onAuthSave = (_data: string[]) => {
    const obj = {
        grant: {
            role: {
                idList: _data || [],
            },
            permissions: [],
        },
    };
    editChannelConfig(props.data.id, obj).then((resp) => {
        if (resp.status === 200) {
            onlyMessage('操作成功！', 'success');
            authVisible.value = false;
            emits('refresh');
        }
    });
};

const onSwitchChange = (e: boolean) => {
    Modal.confirm({
        title: e
            ? '开启后默认平台所有用户都能接收到该通知'
            : '关闭后平台所有用户都不能接收到该通知',
        cancelText: '取消',
        okText: e ? '确认开启' : '确认关闭',
        onOk() {
            if (e) {
                // enable
                if (
                    props.data.id &&
                    props.data.channels?.length &&
                    props.data.channels.find(
                        (item: any) => item.channelProvider === 'inside-mail',
                    )
                ) {
                    actionChannelConfig(props.data.id, 'enable').then(
                        (resp) => {
                            if (resp.status === 200) {
                                onlyMessage('操作成功！');
                                emits('refresh');
                            }
                        },
                    );
                } else {
                    const obj = {
                        ...props.data,
                        state: 'enabled',
                        channels: [
                            {
                                name: '站内信',
                                channelProvider: 'inside-mail',
                                grant: {},
                            },
                        ],
                    };
                    saveChannelConfig([obj]).then((resp) => {
                        if (resp.status === 200) {
                            onlyMessage('操作成功！', 'success');
                            emits('refresh');
                        }
                    });
                }
            } else {
                actionChannelConfig(props.data.id, 'disable').then((resp) => {
                    if (resp.status === 200) {
                        onlyMessage('操作成功！');
                        emits('refresh');
                    }
                });
            }
        },
        onCancel() {},
    });
};

const onSave = (_data: any) => {
    updateChannelConfig(props.data.id, {...props.data, ..._data}).then((resp) => {
        if (resp.status === 200) {
            onlyMessage('操作成功！', 'success');
            visible.value = false;
            emits('refresh');
        }
    });
};
</script>

<style lang="less" scoped>
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
        height: 80px;

        div {
            display: flex;
            margin-right: 30px;
            flex-direction: column;
            justify-content: center;
            align-items: center;
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

        .child-item-right-auth {
            margin-left: 20px;
            height: 78px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            &:hover {
                color: @primary-color-hover;
            }
            &.active {
                color: @primary-color;
            }
        }
    }
}
</style>