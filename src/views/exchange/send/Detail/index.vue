<template>
    <page-container>
        <FullPage>
            <j-pro-table
                class="ant-table-striped"
                :defaultParams="{
                    pageSize: 20,
                }"
                :pagination="{
                    pageSizeOptions: ['10', '20', '50', '80', '100'],
                    showSizeChanger: true,
                    showQuickJumper: false,
                    size: 'size',
                }"
                model="table"
                :columns="columns"
                :params="params"
                :row-class-name="(_record :any, index:any) => (index % 2 === 1 ? 'table-striped' : null)"
                bordered
                ref="cardRef"
                :request="query"
            >
            </j-pro-table>
        </FullPage>
    </page-container>
</template>

<script lang="ts" setup>
import { queryNoPagingPost } from '@/api/device/product';

const params = ref<Record<string, any>>({});
const productList = ref<Record<string, any>>({});

const columns = [
    { title: '姓名', dataIndex: 'name' },
    { title: 'ID', dataIndex: 'id' },
];

const data = [
    {
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
    },
    {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
    },
];

const query = (params: Record<string, any>) =>
    new Promise((resolve) => {
        queryNoPagingPost({ paging: false })
            .then((resp: any) => {
                console.log(resp);
                resolve({
                    result: {
                        data: resp.result,
                        pageIndex: params.pageIndex || 0,
                        pageSize: params.pageSize || 20,
                        total: resp.result?.length,
                    },
                    status: resp.status,
                });
            })
            .catch((error: any) => {
                console.log(error);
            });
    });
</script>

<style lang="less" scoped>
[data-doc-theme='light'] .ant-table-striped :deep(.table-striped) td {
    background-color: #7dd1e0;
}
[data-doc-theme='dark'] .ant-table-striped :deep(.table-striped) td {
    background-color: rgb(230, 228, 228);
}
</style>
