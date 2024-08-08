<template>
    <div class="content">
        <pro-search :columns="tableConf" @search="handleSearch" />
        <full-page>
            <j-pro-table
                :columns="tableConf"
                :request="fetchData"
                model="table"
                :defaultParams="{
                    sorts: [
                        {
                            name: 'createTime',
                            order: 'desc',
                        },
                    ],
                }"
                :params="globParams"
                :gridColumn="3"
                :rowKey="(record: any) => record.id"
            >
                <template #action="record">
                    <a
                        href="javascript: void(0);"
                        @click="handleShowModal(record)"
                    >
                        清洗规则
                    </a>
                </template>
                <template #paginationRender>
                    <a-pagination
                        :showQuickJumper="true"
                        :isShowContent="true"
                        :showSizeChanger="true"
                        :pageSize="pageSize"
                        :default-page-size="12"
                        :pageSizeOptions="['12', '24', '48', '96']"
                        :current="currentPage"
                        :total="dataTotal"
                        @change="handlePageChange"
                    />
                </template>
            </j-pro-table>
        </full-page>
    </div>
</template>

<script setup lang="ts">
import { FullPage } from 'components/Layout';
import { useProSearch } from '@/hook/useProSearch';
import { config, mockData } from '../../config';

defineOptions({
    name: 'EventTable',
});

const props = defineProps<{
    productId: string;
}>();
const emit = defineEmits(['showModal']);

// 数据表的配置项
const tableConf = reactive(config[1]);

// 全局的搜索参数
const globParams = ref<Record<string, any>>({});

// 表格数据总数
const dataTotal = ref<number>(0);
// 表格当前属于多少页
const currentPage = ref<number>(1);
// 表格每页显示多少条数据
const pageSize = ref<number>(12);

// 每次请求后的数据
const dataSource = ref<any[]>([]);

// 处理搜索，依赖另一个hooks中的reset方法
const { handleSearch } = useProSearch(globParams, () => {});

const handleShowModal = (record: Record<string, any>) => {
    console.log('table btn click');
    emit('showModal', record);
};

const fetchData = async (params: any) => {
    // todo 发送网络请求3
    let resp = await new Promise<any>((resolve) => {
        setTimeout(() => {
            resolve({
                status: 200,
                message: 'success',
                result: {
                    data: mockData[1],
                },
            });
        }, 1000);
    });
    console.log(resp);
    if (resp.status === 200) {
        dataTotal.value = resp.result.total;
        currentPage.value = resp.result.pageIndex + 1;
        pageSize.value = resp.result.pageSize;
        dataSource.value = resp.result.data;
        return {
            // 3.仿造请求结果返回给表格
            code: resp.status,
            result: resp.result,
            status: resp.status,
        };
    } else {
        return {
            code: 200,
            result: { data: [] },
            status: 200,
        };
    }
};

/**
 * @function handlePageChange 分页器改变的回调事件
 * @param num
 * @param pageSize
 */
const handlePageChange = (num: number, pageSize: number) => {
    const _params = {
        ...globParams.value,

        // 因为分页器发生改变时会自动改变当前页码和每页条数
        // 因此在这覆盖globSearchParam中的pageIndex和pageSize
        pageIndex: num - 1,
        pageSize: pageSize,
    };
    handleSearch(_params);
};
</script>

<style scoped lang="less"></style>
