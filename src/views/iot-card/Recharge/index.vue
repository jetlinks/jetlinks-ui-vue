<!-- 充值管理 -->
<template>
    <page-container>
        <pro-search :columns="columns" target="recharge-search" @search="handleSearch" />
        <FullPage>
        <j-pro-table
          ref="rechargeRef"
          :columns="columns"
          :request="queryRechargeList"
          model="TABLE"
          :defaultParams="{
                    pageSize: 10,
                    sorts: [{ name: 'createTime', order: 'desc' }],
                }"
          :pagination="{
                    showSizeChanger: true,
                    pageSizeOptions: ['10', '20', '50', '100'],
                }"
          :params="params"
        >
            <template #headerTitle>
                <j-space>
                    <PermissionButton @click="visible = true" :hasPermission="'iot-card/Recharge:pay'" type="primary">
                        充值
                    </PermissionButton>
                    <div class="tips-text">
                        <span style="margin-right: 8px; font-size: 16px">
                            <AIcon type="ExclamationCircleOutlined"></AIcon>
                        </span>
                        本平台仅提供充值入口，具体充值结果需以运营商的充值结果为准
                    </div>
                </j-space>
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
                <j-space :size="16">
                    <template
                        v-for="i in getActions(slotProps)"
                        :key="i.key"
                    >
                        <PermissionButton
                            :disabled="i.disabled"
                            :popConfirm="i.popConfirm"
                            :tooltip="{
                                ...i.tooltip,
                            }"
                            @click="i.onClick"
                            type="link"
                            style="padding: 0px"
                            :hasPermission="'iot-card/Recharge:' + i.key"
                        >
                            <template #icon><AIcon :type="i.icon" /></template>
                        </PermissionButton>
                    </template>
                </j-space>
            </template>
        </j-pro-table>
        </FullPage>
        <!-- 充值 -->
        <Save v-if="visible" @change="saveChange" />
        <Detail v-if="detailVisible" :data="current" @close="close" />
    </page-container>
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
        ellipsis: true,
    },
    {
        title: '订单时间',
        dataIndex: 'createTime',
        key: 'createTime',
        scopedSlots: true,
        width: 200,
        search: {
            type: 'date',
        },
    },
    {
        title: '操作',
        key: 'action',
        fixed: 'right',
        width: 60,
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

const handleSearch = (e: any) => {
    params.value = e;
};

/**
 * 充值关闭弹窗
 * @param val 加载表格
 */
const saveChange = (val: any) => {
    visible.value = false;
    if (val) {
      setTimeout(() => {
        rechargeRef.value?.reload();
      }, 700)
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
