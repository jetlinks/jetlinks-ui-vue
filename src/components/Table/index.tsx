import { UnorderedListOutlined, AppstoreOutlined } from '@ant-design/icons-vue'
import styles from './index.module.less'
import { Pagination, Table, Empty, Spin, Alert } from 'ant-design-vue'
import type { TableProps, ColumnProps } from 'ant-design-vue/es/table'
import type { TooltipProps } from 'ant-design-vue/es/tooltip'
import type { PopconfirmProps } from 'ant-design-vue/es/popconfirm'
import { CSSProperties, PropType } from 'vue';

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

export interface JColumnProps extends ColumnProps{
    scopedSlots?: boolean; // 是否为插槽 true: 是 false: 否
}

export interface JTableProps extends TableProps{
    request?: (params: Record<string, any> & {
        pageSize: number;
        pageIndex: number;
    }) => Promise<Partial<RequestData>>;
    cardBodyClass?: string;
    columns: JColumnProps[];
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

const JTable = defineComponent<JTableProps>({
    name: 'JTable',
    slots: [
        'headerTitle', // 顶部左边插槽
        'card', // 卡片内容
    ],
    emits: [
        'modelChange', // 切换卡片和表格
    ],
    props: {
        request: {
            type: Function,
            default: undefined
        },
        cardBodyClass: {
            type: String,
            default: ''
        },
        columns: {
            type: Array,
            default: () => []
        },
        params: {
            type: Object,
            default: () => {}
        },
        model: {
            type: [String, undefined],
            default: undefined
        },
        actions: {
            type: Array as PropType<ActionsType[]>,
            default: () => []
        },
        noPagination: {
            type: Boolean,
            default: false
        },
        rowSelection: {
            type: Object as PropType<TableProps['rowSelection']>,
            default: () => undefined
        },
        cardProps: {
            type: Object,
            default: undefined
        },
        dataSource: {
            type: Array,
            default: () => []
        }
    } as any,
    setup(props: JTableProps ,{ slots, emit }){
        const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE
        const _model = ref<keyof typeof ModelEnum>(props.model ? props.model : ModelEnum.CARD); // 模式切换
        const column = ref<number>(4);
        const _dataSource = ref<Record<string, any>[]>([])
        const pageIndex = ref<number>(0)
        const pageSize = ref<number>(6)
        const total = ref<number>(0)
        const _columns = ref<JColumnProps[]>(props?.columns || [])
        const loading = ref<boolean>(true)

        // alert关闭，取消选择
        const handleAlertClose = () => {
            emit('cancelSelect')
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

        watchEffect(() => {
            handleSearch(props.params)
        })
        
        return () => <Spin spinning={loading.value}>
                <div class={styles["jtable-body"]}>
                <div class={styles["jtable-body-header"]}>
                    <div class={styles["jtable-body-header-left"]}>
                        {/* 顶部左边插槽 */}
                        {slots.headerTitle && slots.headerTitle()}
                    </div>
                    <div class={styles["jtable-body-header-right"]}>
                        <div class={[styles["jtable-setting-item"], ModelEnum.CARD === _model.value ? styles['active'] : '']} onClick={() => {
                            _model.value = ModelEnum.CARD
                        }}>
                            <AppstoreOutlined />
                        </div>
                        <div class={[styles["jtable-setting-item"], ModelEnum.TABLE === _model.value ? styles['active'] : '']} onClick={() => {
                            _model.value = ModelEnum.TABLE
                        }}>
                            <UnorderedListOutlined  />
                        </div>
                    </div>
                </div>
                {/* content */}
                <div class={styles['jtable-content']}>
                    {
                        props?.rowSelection && props?.rowSelection?.selectedRowKeys && props.rowSelection.selectedRowKeys?.length ?
                        <div class={styles['jtable-alert']}>
                            <Alert
                                message={'已选择' + props?.rowSelection?.selectedRowKeys?.length + '项'}
                                type="info"
                                onClose={handleAlertClose}
                                closeText={<a>取消选择</a>}
                             />
                        </div> : null
                    }
                    {
                        _model.value === ModelEnum.CARD ?
                        <div class={styles['jtable-card']}>
                            {
                                _dataSource.value.length ? 
                                <div 
                                    class={styles['jtable-card-items']}
                                    style={{gridTemplateColumns: `repeat(${column.value}, 1fr)`}}
                                >
                                    {
                                        _dataSource.value.map(item => slots.card ? 
                                            <div class={[styles['jtable-card-item'], props.cardBodyClass]}>{slots.card({row: item, actions: props?.actions || []})}</div>
                                            : null)
                                    }
                                </div> : 
                                <div><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /></div>
                            }
                        </div> :
                        <div>
                            <Table
                                dataSource={_dataSource.value}
                                columns={_columns.value}
                                pagination={false}
                                rowKey="id"
                                rowSelection={props.rowSelection}
                                scroll={{x: 1366}}
                                v-slots={{
                                    bodyCell: (dt: Record<string, any>) => {
                                        const {column, record} = dt;
                                        if((column?.key || column?.dataIndex) && column?.scopedSlots && (slots?.[column?.dataIndex] || slots?.[column?.key])) {
                                            const _key = column?.key || column?.dataIndex
                                            return slots?.[_key]!({row: record, actions: props.actions})
                                        } else {
                                            return record?.[column?.dataIndex] || ''
                                        }
                                    }
                                }}
                             />
                        </div>
                    }
                </div>
                {/* 分页 */}
                {
                    _dataSource.value.length && !props.noPagination &&
                    <div class={styles['jtable-pagination']}>
                        <Pagination 
                            size="small" 
                            total={total.value}
                            showQuickJumper={false}
                            showSizeChanger={true}
                            current={pageIndex.value}
                            pageSize={pageSize.value}
                            pageSizeOptions={['12', '24', '48', '60', '100']}
                            showTotal={(total, range) => {
                                return `第 ${range[0]} - ${range[1]} 条/总共 ${total} 条`
                            }}
                            onChange={(page, size) => {
                                handleSearch({
                                    ...props.params,
                                    pageSize: size,
                                    pageIndex: pageSize.value === size ? page : 1,
                                })
                            }}
                        />
                    </div>
                }
            </div>
        </Spin>
    }
})

export default JTable
