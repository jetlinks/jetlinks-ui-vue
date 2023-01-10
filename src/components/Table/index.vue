<template>
    <div class="jtable-body">
        <div class="jtable-body-header">
            <div class="jtable-body-header-left">
                <slot name="headerTitle"></slot>
            </div>
            <div class="jtable-body-header-right">
                <div class="jtable-setting-item" :class="[ModelEnum.CARD === model ? 'active' : '']" @click="modelChange(ModelEnum.CARD)">
                    <AppstoreOutlined />
                </div>
                <div class="jtable-setting-item" :class="[ModelEnum.TABLE === model ? 'active' : '']" @click="modelChange(ModelEnum.TABLE)">
                    <UnorderedListOutlined  />
                </div>
            </div>
        </div>
        <div class="jtable-content">
            <div v-if="model === ModelEnum.CARD" class="jtable-card">
                <div 
                    v-if="dataSource.length"
                    class="jtable-card-items"
                    :style="{gridTemplateColumns: `repeat(${column}, 1fr)`}"
                >
                    <div 
                        class="jtable-card-item" 
                        v-for="(item, index) in dataSource" 
                        :key="index"
                    >
                        <slot name="cardRender" :item="item" :index="index"></slot>
                    </div>
                </div>
                <div v-else>
                    <a-empty :image="Empty.PRESENTED_IMAGE_SIMPLE" />
                </div>
            </div>
            <div v-else>
                <a-table :columns="columns" :dataSource="dataSource" :pagination="false" />
            </div>
        </div>
        <div class="jtable-pagination" v-if="dataSource.length">
            <a-pagination
                size="small"
                :total="50"
                :show-total="total => `第 ${1} - ${1} 条/总共 ${total} 条`"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { UnorderedListOutlined, AppstoreOutlined } from '@ant-design/icons-vue'
import type { TableProps } from 'ant-design-vue/es/table'
import { Empty } from 'ant-design-vue'

enum ModelEnum {
    TABLE = 'TABLE',
    CARD = 'CARD',
}

export declare type RequestData = {
    code: string;
    result: {
        data: Record<string, any>[] | undefined;
        pageIndex: number;
        pageSize: number;
        total: number;
    };
    status: number;
} & Record<string, any>;

interface JTableProps extends TableProps{
    request: (params: Record<string, any> & {
        pageSize: number;
        pageIndex: number;
    }) => Promise<Partial<RequestData>>;
    cardBodyClass?: string;
    columns: Record<string, any>[];
    params: Record<string, any> & {
        pageSize: number;
        pageIndex: number;
    }
}
// props和emit
const emit = defineEmits(["modelChange"]);
const props = withDefaults(defineProps<JTableProps>(), {
    cardBodyClass: '',
    request: undefined
})

const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE
const model = ref<keyof typeof ModelEnum>(ModelEnum.CARD); // 模式切换
const column = ref<number>(4);
const dataSource = ref<Record<string, any>[]>([])
console.log(props)
// 方法

// 切换卡片和表格
const modelChange = (type: keyof typeof ModelEnum) => {
    model.value = type
}

// 请求数据
const handleSearch = async (params1?: Record<string, any>) => {
    const resp = await props.request({
        pageSize: 10,
        pageIndex: 1,
        ...params1
    })
    if(resp.status === 200){
        dataSource.value = resp.result?.data || []
    }
}

watchEffect(() => {
    handleSearch(props.params)
})

</script>

<style lang="less" scoped> 
.jtable-body {
    width: 100%;
    padding: 0 24px 24px;
    background-color: white;
    .jtable-body-header {
        padding: 16px 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .jtable-body-header-right {
            display: flex;
            gap: 8px;
            .jtable-setting-item {
                color: rgba(0, 0, 0, 0.75);
                font-size: 16px;
                cursor: pointer;

                &:hover {
                    color: @primary-color-hover;
                }

                &.active {
                    color: @primary-color-active;
                }
            }
        }
    }
    .jtable-content {
        .jtable-card {
            .jtable-card-items {
                display: grid;
                grid-gap: 26px;
                // grid-template-columns: repeat(4, 1fr);
                .jtable-card-item {
                    display: flex;
                }
            }
        }
    }
    .jtable-pagination {
        margin-top: 20px;
        display: flex;
        justify-content: flex-end;
        // position: absolute;
        // right: 24px;
        // bottom: 24px;
    }
}   
</style>