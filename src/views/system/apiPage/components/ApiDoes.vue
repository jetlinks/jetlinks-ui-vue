<template>
    <div class="api-does-container">
        <div class="top">
            <h5>{{ selectApi.summary }}</h5>
            <div class="input">
                <InputCard :value="selectApi.method" />
                <a-input :value="selectApi?.url" disabled />
            </div>
        </div>

        <p style="display: flex; justify-content: space-between">
            <span class="label">请求数据类型</span>
            <span class="value">{{
                getContent(selectApi.requestBody) ||
                'application/x-www-form-urlencoded'
            }}</span>
            <span class="label">响应数据类型</span>
            <span class="value">{{ `["/"]` }}</span>
        </p>

        <div class="api-card">
            <h5>请求参数</h5>
            <div class="content">
                <JTable
                    :columns="columns.request"
                    :dataSource="selectApi.parameters"
                    noPagination
                    model="TABLE"
                >
                    <template #required="slotProps">
                        <span>{{ slotProps.row.required + '' }}</span>
                    </template>
                    <template #type="slotProps">
                        <span>{{ slotProps.row.schema.type }}</span>
                    </template>
                </JTable>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { apiDetailsType } from '../index';
import InputCard from './InputCard.vue';
import { PropType } from 'vue';

const props = defineProps({
    selectApi: {
        type: Object as PropType<apiDetailsType>,
        required: true,
    },
});
const { selectApi } = toRefs(props);

const columns = {
    request: [
        {
            title: '参数名',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '参数说明',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: '请求类型',
            dataIndex: 'in',
            key: 'in',
        },
        {
            title: '是否必须',
            dataIndex: 'required',
            key: 'required',
            scopedSlots: true,
        },
        {
            title: '参数类型',
            dataIndex: 'type',
            key: 'type',
            scopedSlots: true,
        },
    ],
};

console.log(selectApi.value);
const getContent = (data: any) => {
    if (!data) return '';
    return Object.keys(data.content)[0];
};
</script>

<style lang="less" scoped>
.api-does-container {
    .top {
        width: 100%;

        h5 {
            font-weight: bold;
            font-size: 16px;
        }

        .input {
            display: flex;
        }
    }

    .api-card {
        h5 {
            position: relative;
            padding-left: 10px;

            &::before {
                position: absolute;
                top: 0;
                left: 0;
                width: 4px;
                height: 100%;
                background-color: #1d39c4;
                border-radius: 0 3px 3px 0;
                content: ' ';
            }
        }
        .content {
            padding-left: 10px;


            :deep(.jtable-body) {
                padding: 0;

                .jtable-body-header {
                    display: none;
                }
            }
        }
    }
}
</style>
