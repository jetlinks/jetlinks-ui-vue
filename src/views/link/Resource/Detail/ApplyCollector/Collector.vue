<template>
    <a-modal
        visible
        :centered="true"
        @cancel="emits('close')"
        :maskClosable="false"
        :width="1000"
        :footer="null"
        :closable="false"
    >
        <template #title>
            <div class="header">
                <div @click="emits('close')">
                    <AIcon
                        type="ArrowLeftOutlined"
                        style="font-size: 18px; margin-bottom: 12px"
                    />
                    返回
                </div>
                <div class="title">受影响的采集器</div>
            </div>
        </template>
        <pro-search :columns="columns" type="simple" @search="handleSearch" />
        <a-divider style="margin: 0" />
        <div class="content">
            <j-pro-table
                ref="actionRef"
                model="CARD"
                :columns="columns"
                :params="params"
                :request="e=>_queryCollector(_id, e)"
                :gridColumn="2"
                :bodyStyle="{
                    paddingRight: 0,
                    paddingLeft: 0,
                }"
            >
                <template #card="slotProps">
                    <CardBox
                        :value="slotProps"
                        :status="slotProps.state?.value"
                        :statusText="slotProps.state?.text"
                        :statusNames="{
                            enabled: 'processing',
                            disabled: 'error',
                       
                        }"
                    >
                        <template #img>
                            <slot name="img">
                                <img
                                    :width="80"
                                    :height="80"
                                    :src="
                                        slotProps.photoUrl ||
                                        getImage('/device-product.png')
                                    "
                                />
                            </slot>
                        </template>
                        <template #content>
                            <div style="width: calc(100% - 100px)">
                                <Ellipsis>
                                    <span
                                        style="
                                            font-size: 16px;
                                            font-weight: 600;
                                        "
                                    >
                                        {{ slotProps.name }}
                                    </span>
                                </Ellipsis>
                            </div>
                            <j-row>
                                <j-col :span="12">
                                    <div class="card-item-content-text">
                                        所属通道
                                    </div>
                                    <Ellipsis>{{
                                        slotProps.channelName
                                    }}</Ellipsis>
                                </j-col>
                                <j-col :span="12">
                                    <div class="card-item-content-text">
                                        说明
                                    </div>
                                    <Ellipsis>{{
                                        slotProps?.description || '--'
                                    }}</Ellipsis>
                                </j-col>
                            </j-row>
                        </template>
                    </CardBox>
                </template>
            </j-pro-table>
        </div>
    </a-modal>
</template>

<script setup lang="ts" name="Product">
import { getImage } from '@/utils/comm';
import {
    _queryCollector,
} from '@/api/link/resource';

const emits = defineEmits(['close']);

const params = ref({});
const route = useRoute();
const _id = route.params?.id as any;
const handleSearch = (p: any) => {
    params.value = p;
};

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        width: 300,
        ellipsis: true,
        fixed: 'left',
        search: {
            type: 'string',
        },
    },
    {
        title: '名称',
        dataIndex: 'name',
        width: 200,
        ellipsis: true,
        search: {
            type: 'string',
            first: true,
        },
    },
    {
        title: '状态',
        dataIndex: 'state',
        width: '90px',
        search: {
            type: 'select',
            options: [
                { label: '禁用', value: 'disabled' },
                { label: '正常', value: 'enabled' },
            ],
        },
    },
];
</script>

<style lang="less" scoped>
.header {
    display: flex;
    .title {
        width: 90%;
        text-align: center;
    }
}
.content {
    height: 70vh;
    overflow-y: auto;
}
</style>
