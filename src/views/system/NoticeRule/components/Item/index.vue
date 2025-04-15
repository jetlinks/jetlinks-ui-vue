<template>
    <a-spin :spinning="spinning">
        <div class="child-item">
            <div class="child-item-left">
                <div style="color: #333333">
                    {{ data?.name }}
                </div>
                <div>
                    <a-tooltip :title="!action ? $t('Item.index.538002-0') : ''">
                        <a-switch
                            :disabled="!action"
                            @change="onSwitchChange"
                            :checked="checked"
                        />
                    </a-tooltip>
                </div>
                <div
                    class="child-item-left-auth"
                    :class="{ disabled: !checked }"
                >
                    <a-tooltip>
                        <template #title>
                            <span v-if="!update">{{ $t('Item.index.538002-0') }}</span>
                            <div v-else>
                                {{ $t('Item.index.538002-1', [data.name]) }}
                            </div>
                        </template>
                        <a-button
                            :disabled="!update || !checked"
                            type="text"
                            @click="onAuth"
                        >
                            <span
                                v-if="!auth.length"
                                class="child-item-left-auth-lock"
                                ><AIcon type="LockFilled"
                            /></span>
                            <span v-else class="child-item-left-auth-key"
                                ><AIcon type="KeyOutlined"
                            /></span>
                            <span class="child-item-left-auth-text"
                                >{{ $t('Item.index.538002-3') }}</span
                            >
                        </a-button>
                    </a-tooltip>
                </div>
            </div>
            <div class="child-item-right" :class="{ disabled: !checked }">
                <MCarousel :data="data?.channels">
                    <template #card="slotProps">
                        <div class="box-item">
                            <a-dropdown>
                                <div class="box-item-img">
                                    <img
                                        style="width: 100%"
                                        :src="
                                            iconMap.get(
                                                slotProps?.channelProvider,
                                            )
                                        "
                                    />
                                </div>
                                <template
                                    #overlay
                                    v-if="
                                        slotProps?.channelProvider !==
                                        'inside-mail'
                                    "
                                >
                                    <a-menu mode="">
                                        <a-menu-item>
                                            <j-permission-button
                                                @click="onView(slotProps)"
                                                type="link"
                                                :hasPermission="true"
                                            >
                                                {{ $t('Item.index.538002-4') }}
                                            </j-permission-button>
                                        </a-menu-item>
                                        <a-menu-item>
                                            <j-permission-button
                                                @click="onEdit(slotProps)"
                                                type="link"
                                                :hasPermission="[
                                                    'system/NoticeRule:update',
                                                ]"
                                            >
                                                {{ $t('Item.index.538002-5') }}
                                            </j-permission-button>
                                        </a-menu-item>
                                        <a-menu-item>
                                            <j-permission-button
                                                @click="onDelete(slotProps.id)"
                                                danger
                                                type="link"
                                                :hasPermission="[
                                                    'system/NoticeRule:delete',
                                                ]"
                                            >
                                                {{ $t('Item.index.538002-6') }}
                                            </j-permission-button>
                                        </a-menu-item>
                                    </a-menu>
                                </template>
                            </a-dropdown>
                            <div class="box-item-text">
                                <j-ellipsis>{{ slotProps?.i18nName || slotProps.name }}</j-ellipsis>
                            </div>
                        </div>
                    </template>
                </MCarousel>

                <a-tooltip :title="!add ? $t('Item.index.538002-0') : ''">
                    <a-button
                        class="box-item-add"
                        :disabled="!add"
                        @click="onAdd"
                    >
                        <AIcon type="PlusOutlined" />
                    </a-button>
                </a-tooltip>
            </div>
        </div>
    </a-spin>
    <Save
        :data="current"
        v-if="visible"
        @close="visible = false"
        @save="onSave"
        :loading="loading"
        :provider="provider"
        :name="data.name"
    />
    <Detail
        :data="current"
        v-if="detailVisible"
        @close="detailVisible = false"
    />
    <Auth
        v-if="authVisible"
        :data="data?.grant?.role?.idList"
        @close="authVisible = false"
        @save="onAuthSave"
        :name="data.name"
    />
</template>

<script lang="ts" setup>
import MCarousel from '@/components/MCarousel/index.vue';
import Save from '../Save/index.vue';
import Detail from '../Detail/index.vue';
import Auth from '../Auth/index.vue';
import { iconMap } from '../../data';
import { onlyMessage } from "@jetlinks-web/utils";
import {
    saveChannelConfig,
    actionChannelConfig,
    deleteChannelConfig,
    editChannelConfig,
    updateChannelConfig,
} from '@/api/system/noticeRule';
import { Modal, Checkbox } from 'ant-design-vue';
import { usePermission } from '@jetlinks-web/hooks'
import { LocalStore } from '@jetlinks-web/utils';
import { useUserStore } from '@/store/user'
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const props = defineProps({
    data: {
        type: Object,
        default: () => {},
    },
    isLast: {
        type: Boolean,
        default: false,
    },
    provider: {
        type: String,
        default: '',
    },
});

const emits = defineEmits(['refresh']);

const visible = ref<boolean>(false);
const detailVisible = ref<boolean>(false);
const authVisible = ref<boolean>(false);
const current = ref<any>({});

const checked = ref<boolean>(false);
const auth = ref<string[]>([]);
const loading = ref<boolean>(false);
const spinning = ref<boolean>(false);
const user = useUserStore();

const action = usePermission(ref('system/NoticeRule:action'));
const add = usePermission(ref('system/NoticeRule:add'));
const update = usePermission(ref('system/NoticeRule:update'));

watchEffect(() => {
    checked.value = props.data?.state?.value === 'enabled';
    auth.value = props.data?.grant?.role?.idList || [];
});

const onAdd = () => {
    visible.value = true;
    current.value = {
        providerId: props.data.id,
    };
};

const onView = (dt: any) => {
    current.value = dt;
    detailVisible.value = true;
};

const onEdit = (dt: any) => {
    current.value = dt;
    visible.value = true;
};

const onDelete = async (id: string) => {
    if (id) {
        const resp = await deleteChannelConfig(id);
        if (resp.status === 200) {
            onlyMessage($t('Item.index.538002-7'));
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
        },
    };
    spinning.value = true;
    editChannelConfig(props.data.id, obj)
        .then((resp) => {
            if (resp.status === 200) {
                onlyMessage($t('Item.index.538002-7'), 'success');
                authVisible.value = false;
                emits('refresh');
            }
        })
        .finally(() => {
            spinning.value = false;
        });
};

const onAction = (e: boolean) => {
    if (e) {
        // enable
        if (
            props.data.id &&
            props.data.channels?.length &&
            props.data.channels.find(
                (item: any) => item.channelProvider === 'inside-mail',
            )
        ) {
            spinning.value = true;
            actionChannelConfig(props.data.id, 'enable')
                .then((resp) => {
                    if (resp.status === 200) {
                        onlyMessage($t('Item.index.538002-7'));
                        emits('refresh');
                    }
                })
                .finally(() => {
                    spinning.value = false;
                });
        } else {
            const obj = {
                ...props.data,
                state: 'enabled',
                grant:
                    !props.data.grant?.role && props.provider === 'alarm'
                        ? {
                              role: {
                                  idList: [],
                              },
                          }
                        : props.data.grant,
                channels: [
                    {
                        name: $t('Item.index.538002-8'),
                        channelProvider: 'inside-mail',
                        grant: {
                            role: {
                                idList: [],
                            },
                        },
                        i18nMessages: {
                          name:
                            {
                              'zh_CN': '站内信',
                              'en_US': 'In-site Message',
                              'zh': '站内信',
                              'en': 'In-site Message'
                            }
                        }
                    },
                ],
            };
            spinning.value = true;
            saveChannelConfig([obj])
                .then((resp) => {
                    if (resp.status === 200) {
                        onlyMessage($t('Item.index.538002-7'), 'success');
                        emits('refresh');
                    }
                })
                .finally(() => {
                    spinning.value = false;
                });
        }
    } else {
        actionChannelConfig(props.data.id, 'disable').then((resp) => {
            if (resp.status === 200) {
                onlyMessage($t('Item.index.538002-7'));
                emits('refresh');
            }
        });
    }
};

const onSwitchChange = (e: boolean) => {
    const _value = LocalStore.get(user.userInfo?.name) || {};
    let _checked: boolean = e ? _value?.open : _value?.close;
    if (_checked) {
        onAction(e);
    } else {
        // if (e) {
        //     onAction(e);
        // } else {
            Modal.confirm({
                title: e
                    ? $t('Item.index.538002-9')
                    : $t('Item.index.538002-10'),
                cancelText: $t('Item.index.538002-11'),
                okText: e ? $t('Item.index.538002-12') : $t('Item.index.538002-13'),
                content: h(
                    'div',
                    {
                        style: {
                            display: 'flex',
                            justifyContent: 'flex-end',
                            marginTop: '20px',
                        },
                    },
                    [
                        h(
                            Checkbox,
                            {
                                onChange: (_e: any) => {
                                    LocalStore.set(
                                        user.userInfo?.name,
                                        e
                                            ? {
                                                  ..._value,
                                                  open: _e.target?.checked,
                                              }
                                            : {
                                                  ..._value,
                                                  close: _e.target?.checked,
                                              },
                                    );
                                },
                            },
                            $t('Item.index.538002-14'),
                        ),
                    ],
                ),
                onOk() {
                    onAction(e);
                },
                onCancel() {},
            });
        // }
    }
};

const onSave = (_data: any) => {
    loading.value = true;
    updateChannelConfig(props.data.id, [_data])
        .then((resp) => {
            if (resp.status === 200) {
                onlyMessage($t('Item.index.538002-7'), 'success');
                visible.value = false;
                emits('refresh');
            }
        })
        .finally(() => {
            loading.value = false;
        });
};
</script>

<style lang="less" scoped>
.child-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 68px;
    background: linear-gradient(270deg, #ffffff 0%, #f1f6ff 99%);
    border-radius: 4px;
    border: 1px solid #ebeef3;
    margin-bottom: 10px;

    .child-item-left {
        display: flex;
        align-items: center;
        margin-left: 24px;

        div {
            display: flex;
            margin-right: 24px;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }

        .child-item-left-auth {
            // margin-left: 20px;

            :deep(.ant-btn) {
                height: 78px;
            }

            .child-item-left-auth-text {
                color: #666666;
            }
            .child-item-left-auth-key {
                color: #00c800;
                font-size: 18px;
                margin-right: 10px;
            }

            .child-item-left-auth-lock {
                color: @primary-color;
                font-size: 18px;
                margin-right: 10px;
            }

            &.disabled {
                .child-item-left-auth-key,
                .child-item-left-auth-lock {
                    color: #666666 !important;
                }
            }
        }
    }

    .child-item-right {
        display: flex;
        align-items: center;

        .box-item {
            cursor: pointer;
            width: 100%;
            display: flex;
            justify-content: space-between;
            flex-direction: column;
            align-items: center;
            .box-item-img {
                width: 32px;
                height: 32px;
            }

            .box-item-text {
                width: 100%;
                text-align: center;
                color: #666666;
                font-size: 12px;
            }
        }

        .box-item-add {
            cursor: pointer;
            background-color: #f7f8fa;
            width: 54px;
            height: 54px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #666666;
            border: none;
            padding: 0;
            border-radius: 0;
            margin: 0 16px;

            &:hover {
                background-color: #eff2fe;
                color: #2f54eb;
            }
        }

        &.disabled {
            filter: grayscale(100%);
        }
    }
}
</style>
