<template>
    <div class="inkling-device">
        <j-spin :spinning="spinning">
            <div class="search-box">
                <div class="search-warp">
                    <j-advanced-search
                        v-if="!spinning"
                        :columns="columns"
                        type="simple"
                        @search="handleSearch"
                        class="device-inkling"
                        target="device-inkling"
                    />
                </div>
                <div class="multiple" v-if="multiple">
                    <j-checkbox @change="checkChange">全选</j-checkbox>
                </div>
            </div>
            <div class="device-list-warp">
                <j-scrollbar v-if="deviceList.length">
                    <j-spin :spinning="deviceSpinning">
                        <div class="device-list-items">
                            <template v-for="item in deviceList">
                                <template v-if="disabledKeys.includes(item.id)">
                                    <j-tooltip title="该设备已绑定平台设备">
                                        <div
                                            :class="{
                                                'device-list-item': true,
                                                active: checkKeys.includes(
                                                    item.id,
                                                ),
                                                disabled: disabledKeys.includes(
                                                    item.id,
                                                ),
                                            }"
                                            @click="
                                                () => deviceClick(item.id, item)
                                            "
                                        >
                                            <div class="item-title">
                                                <span
                                                    class="title-name no-tooltip"
                                                >
                                                    {{ item.name }}
                                                </span>
                                                <span class="title-id">
                                                    ({{ item.id }})
                                                </span>
                                            </div>
                                        </div>
                                    </j-tooltip>
                                </template>
                                <div
                                    v-else
                                    :class="{
                                        'device-list-item': true,
                                        active: checkKeys.includes(item.id),
                                        disabled: disabledKeys.includes(
                                            item.id,
                                        ),
                                    }"
                                    @click="() => deviceClick(item.id, item)"
                                >
                                    <div class="item-title">
                                        <span class="title-name">
                                            <j-ellipsis>
                                                {{ item.name }}
                                            </j-ellipsis>
                                        </span>
                                        <span class="title-id">
                                            <j-ellipsis>
                                                ({{ item.id }})
                                            </j-ellipsis>
                                        </span>
                                    </div>
                                    <a-icon
                                        v-if="checkKeys.includes(item.id)"
                                        type="CheckOutlined"
                                    />
                                </div>
                            </template>
                        </div>
                    </j-spin>
                </j-scrollbar>
                <j-empty
                    v-else
                    description="暂无数据"
                    style="padding-top: 24px"
                />
                <div class="device-list-pagination">
                    <j-pagination
                        v-if="showPage"
                        :total="pageData.total"
                        :current="pageData.pageIndex + 1"
                        :pageSize="pageData.pageSize"
                        :show-total="
                            () => {
                                const minSize =
                                    pageData.pageIndex * pageData.pageSize + 1;
                                const MaxSize =
                                    (pageData.pageIndex + 1) *
                                    pageData.pageSize;
                                return `第 ${minSize} - ${
                                    MaxSize > pageData.total
                                        ? pageData.total
                                        : MaxSize
                                } 条/总共 ${pageData.total} 条`;
                            }
                        "
                        @change="pageChange"
                    />
                </div>
            </div>
        </j-spin>
    </div>
</template>

<script setup lang="ts" name="InklingDevice">
import {
    getCommandsByAccess,
    getCommandsDevicesByAccessId,
} from '@/api/link/accessConfig';
import { getInkingDevices } from '@/api/device/instance';
import { isArray } from 'lodash-es';

type Emit = {
    (e: 'update:value', data: string | string[]): void;
    (e: 'change', data: any | any[]): void;
};
const props = defineProps({
    value: {
        type: [String, Array],
        default: undefined,
    },
    accessId: {
        type: String,
        default: undefined,
    },
    multiple: {
        type: Boolean,
        default: false,
    },
    pluginId: {
        type: String,
        default: undefined,
    },
});

const emit = defineEmits<Emit>();

const spinning = ref(true);
const deviceSpinning = ref(false);
const deviceList = ref([]);
const disabledKeys = ref<string[]>([]);
const checkKeys = ref<string[]>([]);
const checkCache = ref<Map<string, any>>(new Map());
const showPage = ref(false);
const pageData = reactive({
    pageSize: 10,
    pageIndex: 0,
    total: 0,
});
const params = ref({
    terms: [],
});

const columns = ref([]);

const queryInkingDevices = (data: string[]) => {
    return new Promise(async (resolve) => {
        if (!data.length) {
            resolve(true);
            return;
        }

        const res = await getInkingDevices(data,props.pluginId);
        if (res) {
            disabledKeys.value = res.result?.map((item) => item.externalId);
        }
        resolve(true);
    });
};

const getDeviceList = async () => {
    const resp = await getCommandsDevicesByAccessId(props.accessId!, {
        pageIndex: pageData.pageIndex,
        pageSize: pageData.pageSize,
        terms: params.value.terms,
    }).catch(() => ({ success: false }));
    if (resp.success) {
        await queryInkingDevices(
            resp.result?.data.map((item) => item.id) || [],
        );
        deviceList.value = resp.result?.data || [];
        pageData.total = resp.result?.total || 0;
    }
};

const checkChange = (e: any) => {
    // 全选
    if (e.target.checked) {
        const keys = deviceList.value
            .filter((item) => {
                //  过滤已选中和已绑定
                const type =
                    !checkKeys.value.includes(item.id) &&
                    !disabledKeys.value.includes(item.id);
                if (type && !checkCache.value.has(item.id)) {
                    checkCache.value.set(item.id, item);
                }
                return type;
            })
            .map((item) => item.id);
        checkKeys.value = [...checkKeys.value, ...keys];
        emit('update:value', checkKeys.value);
        emit('change', [...checkCache.value.values()]);
    } else {
        checkCache.value.clear();
        checkKeys.value = [];
        emit('update:value', []);
        emit('change', []);
    }
};

const handleSearch = (p: any) => {
    // 查询
    pageData.pageIndex = 0;
    params.value = p;
    getDeviceList();
};

const pageChange = (page: number, pageSize: number) => {
    // 分页变化
    pageData.pageSize = pageSize;
    pageData.pageIndex = page - 1;
    getDeviceList();
};

const init = async () => {
    if (props.accessId) {
        const resp = await getCommandsByAccess(props.accessId);
        if (resp.success) {
            const item = resp.result?.[0];
            if (item) {
                showPage.value = item.id === 'QueryDevicePage'; // 分页
                columns.value = item.expands?.terms?.map((t) => ({
                    title: t.name,
                    dataIndex: t.id,
                    search: {
                        type: t.valueType.type,
                    },
                }));
            }
        }
        spinning.value = false;
        await getDeviceList();
    }
};

const deviceClick = (id: string, option: any) => {
    if (option.disabled || disabledKeys.value.includes(id)) return;

    const _check = new Set(checkKeys.value);

    if (props.multiple) {
        // 多选
        if (_check.has(id)) {
            _check.delete(id);
            checkCache.value.delete(id);
        } else {
            checkCache.value.set(id, option);
            _check.add(id);
        }
        checkKeys.value = [..._check.values()];
        emit('update:value', checkKeys.value);
        emit('change', [...checkCache.value.values()]);
    } else {
        checkKeys.value = [id];
        emit('update:value', id);
        emit('change', option);
    }
};

watch(
    () => props.value,
    (newValue) => {
        if (!newValue) {
            checkKeys.value = [];
            return;
        }
        if (isArray(newValue)) {
            checkKeys.value = newValue;
        } else {
            checkKeys.value = [newValue as string];
        }
    },
    { immediate: true, deep: true },
);

onMounted(() => {
    init();
});
</script>

<style scoped lang="less">
.inkling-device {
    min-height: 200px;
}

.search-box {
    padding-bottom: 24px;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    margin-bottom: 12px;
    gap: 24px;
    align-items: center;

    :deep(.device-inkling) {
        padding: 0;
        margin: 0;
        padding-bottom: 0;
    }

    .search-warp {
        flex: 1 1 auto;
    }

    .multiple {
        width: 60px;
    }
}

.device-list-warp {
    .device-list-items {
        .device-list-item {
            padding: 10px 16px;
            color: #4f4f4f;
            border-bottom: 1px solid #f0f0f0;
            display: flex;
            justify-content: space-between;

            > .item-title {
                display: flex;
                min-width: 0;
                flex-grow: 1;
                gap: 8px;

                .title-name {
                    max-width: 70%;
                }

                .no-tooltip {
                    overflow: hidden;
                    vertical-align: bottom;
                    cursor: pointer;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    word-break: break-all;
                    max-height: 380px;
                    -webkit-line-clamp: 1;
                    text-overflow: ellipsis;
                }

                .title-id {
                    flex: 1 1 auto;
                    color: #a3a3a3;
                }
            }

            &:hover {
                background-color: rgba(47, 84, 235, 0.06);
            }

            &.active {
                background-color: rgba(153, 153, 153, 0.06);
                color: @primary-color;
                .title-id {
                    color: @primary-color;
                    opacity: 0.8;
                }
            }

            &.disabled {
                cursor: not-allowed;
                background-color: rgba(153, 153, 153, 0.06);
            }
        }
    }

    .device-list-pagination {
        margin-top: 24px;
        text-align: right;
    }
}
</style>
