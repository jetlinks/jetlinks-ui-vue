<template>
    <a-spin :spinning="loading">
        <div class="jtable-body">
            <div class="jtable-body-header">
                <div class="jtable-body-header-left">
                    <slot name="headerTitle"></slot>
                </div>
                <div class="jtable-body-header-right" v-if="!model">
                    <div class="jtable-setting-item" :class="[ModelEnum.CARD === _model ? 'active' : '']" @click="modelChange(ModelEnum.CARD)">
                        <AppstoreOutlined />
                    </div>
                    <div class="jtable-setting-item" :class="[ModelEnum.TABLE === _model ? 'active' : '']" @click="modelChange(ModelEnum.TABLE)">
                        <UnorderedListOutlined  />
                    </div>
                </div>
            </div>
            <div class="jtable-content">
                <div class="jtable-alert" v-if="rowSelection && rowSelection.selectedRowKeys && rowSelection.selectedRowKeys.length">
                    <a-alert :message="'已选择' + rowSelection.selectedRowKeys.length + '项'" type="info" :afterClose="handleAlertClose">
                        <template #closeText>
                            <a>取消选择</a>
                        </template>
                    </a-alert>
                </div>
                <div v-if="_model === ModelEnum.CARD" class="jtable-card">
                    <div 
                        v-if="_dataSource.length"
                        class="jtable-card-items"
                        :style="{gridTemplateColumns: `repeat(${column}, 1fr)`}"
                    >
                        <div 
                            class="jtable-card-item" 
                            v-for="(item, index) in _dataSource" 
                            :key="index"
                        >
                            <slot name="card" v-bind="item" :index="index"></slot>
                        </div>
                    </div>
                    <div v-else>
                        <a-empty :image="Empty.PRESENTED_IMAGE_SIMPLE" />
                    </div>
                </div>
                <div v-else>
                    <a-table rowKey="id" :rowSelection="rowSelection" :columns="[..._columns]" :dataSource="_dataSource" :pagination="false">
                        <template #bodyCell="{ column, record }">
                            <!-- <template v-if="column.key === 'action'">
                                <a-space>
                                    <a-tooltip v-for="i in actions" :key="i.key" v-bind="i.tooltip">
                                        <a-popconfirm v-if="i.popConfirm" v-bind="i.popConfirm">
                                            <a><AIcon :type="i.icon" /></a>
                                        </a-popconfirm>
                                        <a v-else @click="i.onClick && i.onClick(record)">
                                            <AIcon :type="i.icon" />
                                        </a>
                                    </a-tooltip>
                                </a-space>
                            </template> -->
                            <template v-if="column.scopedSlots">
                               <slot :name="column.key" :row="record"></slot>
                            </template>
                        </template>
                    </a-table>
                </div>
            </div>
            <div class="jtable-pagination" v-if="_dataSource.length && !noPagination">
                <a-pagination
                    size="small"
                    :total="total"
                    :showQuickJumper="false"
                    :showSizeChanger="true"
                    v-model:current="pageIndex"
                    v-model:page-size="pageSize"
                    :show-total="(total, range) => `第 ${range[0]} - ${range[1]} 条/总共 ${total} 条`"
                    @change="pageChange"
                    :page-size-options="[12, 24, 48, 60, 100]"
                />
            </div>
        </div>
    </a-spin>
</template>

<script setup lang="ts" name="JTable">
import { UnorderedListOutlined, AppstoreOutlined } from '@ant-design/icons-vue'
import type { TableProps, ColumnsType } from 'ant-design-vue/es/table'
import type { TooltipProps } from 'ant-design-vue/es/tooltip'
import type { PopconfirmProps } from 'ant-design-vue/es/popconfirm'
import { Empty } from 'ant-design-vue'
import { CSSProperties } from 'vue';

enum ModelEnum {
    TABLE = 'TABLE',
    CARD = 'CARD',
}

type RequestData = {
    code: string;
    result: {
        data: Record<string, any>[] | undefined;
        pageIndex: number;
        pageSize: number;
        total: number;
    };
    status: number;
} & Record<string, any>;

export interface ActionsType {
    key: string;
    text?: string;
    disabled?: boolean;
    permission?: boolean;
    onClick?: (data: any) => void;
    style?: CSSProperties;
    tooltip?: TooltipProps;
    popConfirm?: PopconfirmProps;
    icon?: string;
}

export interface JColumnsProps extends ColumnsType{
    scopedSlots?: boolean; // 是否为插槽 true: 是 false: 否
}

export interface JTableProps extends TableProps{
    request?: (params: Record<string, any> & {
        pageSize: number;
        pageIndex: number;
    }) => Promise<Partial<RequestData>>;
    cardBodyClass?: string;
    columns: JColumnsProps;
    params?: Record<string, any> & {
        pageSize: number;
        pageIndex: number;
    };
    model?: keyof typeof ModelEnum | undefined; // 显示table还是card
    actions?: ActionsType[];
    noPagination?: boolean;
    rowSelection?: TableProps['rowSelection'];
    cardProps?:  Record<string, any>;
    dataSource?:  Record<string, any>[];
}
// props
const props = withDefaults(defineProps<JTableProps>(), {
    cardBodyClass: '',
    request: undefined,
})

// emit 
const emit = defineEmits<{
  (e: 'cancelSelect'): void
}>()

const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE

const _model = ref<keyof typeof ModelEnum>(props.model ? props.model : ModelEnum.CARD); // 模式切换
const column = ref<number>(4);
const _dataSource = ref<Record<string, any>[]>([])
const pageIndex = ref<number>(0)
const pageSize = ref<number>(6)
const total = ref<number>(0)
const _columns = ref<Record<string, any>[]>([...props.columns])
const loading = ref<boolean>(true)

// 方法
// 切换卡片和表格
const modelChange = (type: keyof typeof ModelEnum) => {
    _model.value = type
}
/**
 * 请求数据
 */
const handleSearch = async (_params?: Record<string, any>) => {
    loading.value = true
    if(props.request) {
    const resp = await props.request({
            pageSize: 12,
            pageIndex: 1,
            ..._params
        })
        if(resp.status === 200){
            // 判断如果是最后一页且最后一页为空，就跳转到前一页
            if(resp.result?.data?.length === 0 && resp.result.total && resp.result.pageSize && resp.result.pageIndex) {
                handleSearch({
                    ..._params,
                    pageSize: pageSize.value,
                    pageIndex: pageIndex.value - 1,
                })
            } else {
                _dataSource.value = resp.result?.data || []
                pageIndex.value = resp.result?.pageIndex || 0
                pageSize.value = resp.result?.pageSize || 6
                total.value = resp.result?.total || 0
            }
        }
    } else {
        _dataSource.value = props?.dataSource || []
    }
    
    loading.value = false
}
/**
 * 页码变化
 */
const pageChange = (page: number, size: number) => {
    handleSearch({
        ...props.params,
        pageSize: size,
        pageIndex: pageSize.value === size ? page : 1,
    })
}

// alert关闭，取消选择
const handleAlertClose = () => {
    emit('cancelSelect')
}

// watchEffect(() => {
//     if(Array.isArray(props.actions) && props.actions.length) {
//          _columns.value = [...props.columns,
//             {
//                 title: '操作',
//                 key: 'action',
//                 fixed: 'right',
//                 width: 250
//             }   
//         ]
//     } else {
//          _columns.value = [...props.columns]
//     }
// })

watchEffect(() => {
    handleSearch(props.params)
})
// TODO 选择的双向绑定和图标的渲染
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
        .jtable-alert {
            margin-bottom: 16px;
        }
        .jtable-card {
            .jtable-card-items {
                display: grid;
                grid-gap: 26px;
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
        /deep/  .ant-pagination-item {
            display: none !important;
        }
    }
}   
</style>