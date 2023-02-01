<!-- 充值管理 -->
<template>
    <div class="page-container">
        <Search
            :columns="columns"
            target="iot-card-management-search"
            @search="handleSearch"
        />
        <JTable
            ref="rechargeRef"
            :columns="columns"
            :request="queryRechargeList"
            model="TABLE"
            :defaultParams="{ sorts: [{ name: 'createTime', order: 'desc' }] }"
            :params="params"
        >
            <template #headerTitle>
                <a-space>
                    <a-button type="primary" @click="visible = true">
                        充值
                    </a-button>
                    <div class="tips-text">
                        <span style="margin-right: 8px; font-size: 16px">
                            <AIcon type="ExclamationCircleOutlined"></AIcon>
                        </span>
                        本平台仅提供充值入口，具体充值结果需以运营商的充值结果为准
                    </div>
                </a-space>
            </template>
            <template #createTime="slotProps">
                {{
                    slotProps.createTime
                        ? moment(slotProps.createTime).format(
                              'YYYY-MM-DD HH:mm:ss',
                          )
                        : ''
                }}
            </template>
            <template #action="slotProps">
                <a-space :size="16">
                    <a-tooltip
                        v-for="i in getActions(slotProps)"
                        :key="i.key"
                        v-bind="i.tooltip"
                    >
                        <a-popconfirm v-if="i.popConfirm" v-bind="i.popConfirm">
                            <a-button
                                :disabled="i.disabled"
                                style="padding: 0"
                                type="link"
                                ><AIcon :type="i.icon"
                            /></a-button>
                        </a-popconfirm>
                        <a-button
                            style="padding: 0"
                            type="link"
                            v-else
                            @click="i.onClick && i.onClick(slotProps)"
                        >
                            <a-button
                                :disabled="i.disabled"
                                style="padding: 0"
                                type="link"
                                ><AIcon :type="i.icon"
                            /></a-button>
                        </a-button>
                    </a-tooltip>
                </a-space>
            </template>
        </JTable>
        <!-- 充值 -->
        <Save v-if="visible" @change="saveChange" />
        <Detail v-if="detailVisible" :data="current" @close="close" />
    </div>
</template>

<script setup lang="ts">
import moment from 'moment';
import type { ActionsType } from '@/components/Table';
import { queryRechargeList } from '@/api/iot-card/cardManagement';
import Save from './Save.vue';
import Detail from './Detail.vue';

const rechargeRef = ref<Record<string, any>>({});
const params = ref<Record<string, any>>({});
const visible = ref<boolean>(false);
const detailVisible = ref<boolean>(false);
const current = ref<Record<string, any>>({});

const columns = [
    {
        title: '充值金额',
        dataIndex: 'chargeMoney',
        key: 'chargeMoney',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '支付方式',
        dataIndex: 'paymentType',
        key: 'paymentType',
        search: {
            type: 'string',
        },
    },
    {
        title: '订单号',
        dataIndex: 'orderNumber',
        key: 'orderNumber',
        ellipsis: true,
    },
    {
        title: '支付URL',
        dataIndex: 'url',
        key: 'url',
    },
    {
        title: '订单时间',
        dataIndex: 'createTime',
        key: 'createTime',
        scopedSlots: true,
        search: {
            type: 'date',
        },
    },
    {
        title: '操作',
        key: 'action',
        fixed: 'right',
        scopedSlots: true,
    },
];

const getActions = (data: Partial<Record<string, any>>): ActionsType[] => {
    if (!data) return [];
    return [
        {
            key: 'view',
            text: '查看',
            tooltip: {
                title: '查看',
            },
            icon: 'EyeOutlined',
            onClick: () => {
              detailVisible.value = true;
              current.value = data;
            },
        },
    ];
};

const handleSearch = (params: any) => {
    console.log(params);
    params.value = params;
};

/**
 * 充值关闭弹窗
 * @param val 加载表格
 */
const saveChange = (val: any) => {
    visible.value = false;
    if (val) {
        rechargeRef.value?.reload();
    }
};

/**
 * 查看详情弹窗关闭
 */
const close = () => {
    detailVisible.value = false;
};
</script>

<style scoped lang="less">
.tips-text {
    padding-left: 24px;
    background: #fff;
    font-size: 14px;
}
</style>
