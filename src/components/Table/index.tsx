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

enum TypeEnum {
    TREE = 'TREE',
    PAGE = 'PAGE',
}

type RequestData = {
    code: string;
    result: {
        data?: Record<string, any>[] | undefined;
        pageIndex: number;
        pageSize: number;
        total: number;
    };
    status: number;
} | Record<string, any>;

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
    children?: ActionsType[];
}

export interface JColumnProps extends ColumnProps{
    scopedSlots?: boolean; // 是否为插槽 true: 是 false: 否
}

export interface JTableProps extends TableProps{
    request?: (params?: Record<string, any>) => Promise<Partial<RequestData>>;
    cardBodyClass?: string;
    columns: JColumnProps[];
    params?: Record<string, any>;
    model?: keyof typeof ModelEnum | undefined; // 显示table还是card
    // actions?: ActionsType[];
    noPagination?: boolean;
    rowSelection?: TableProps['rowSelection'];
    cardProps?:  Record<string, any>;
    dataSource?:  Record<string, any>[];
    gridColumn?: number;
    /**
     * 用于不同分辨率
     * gridColumns[0] 1366 ~ 1440 分辨率；
     * gridColumns[1] 1440 ~  1600 分辨率；
     * gridColumns[2] > 1600 分辨率；
     */
     gridColumns?: number[];
     alertRender?: boolean;
     type?: keyof typeof TypeEnum;
     defaultParams?: Record<string, any>;
}

const JTable = defineComponent<JTableProps>({
    name: 'JTable',
    slots: [
        'headerTitle', // 顶部左边插槽
        'card', // 卡片内容
        'rightExtraRender'
    ],
    emits: [
        'modelChange', // 切换卡片和表格
        'reload' // 刷新数据
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
        },
        gridColumns: {
            type: Array as PropType<Number[]>,
            default: [2, 3, 4]
        },
        gridColumn: {
            type: Number,
            default: 4
        },
        alertRender: {
            type: Boolean,
            default: true
        },
        type: {
            type: String,
            default: 'PAGE'
        },
        defaultParams: {
            type: Object,
            default: () => {
                return {
                    pageIndex: 0,
                    pageSize: 12
                }
            }
        }
    } as any,
    setup(props: JTableProps ,{ slots, emit, expose }){
        const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE
        const _model = ref<keyof typeof ModelEnum>(props.model ? props.model : ModelEnum.CARD); // 模式切换
        const column = ref<number>(props.gridColumn || 4);
        const _dataSource = ref<Record<string, any>[]>([])
        const pageIndex = ref<number>(0)
        const pageSize = ref<number>(6)
        const total = ref<number>(0)
        const _columns = ref<JColumnProps[]>(props?.columns || [])
        const loading = ref<boolean>(true)

        /**
         * 监听宽度，计算显示卡片个数
         */
        const windowChange = () => {
            if (window.innerWidth <= 1440) {
                const _column = props.gridColumn && props.gridColumn < 2 ? props.gridColumn : 2;
                column.value = props.gridColumns ? props.gridColumns[0] : _column
            } else if (window.innerWidth > 1440 && window.innerWidth <= 1600) {
                const _column = props.gridColumn && props.gridColumn < 3 ? props.gridColumn : 3;
                column.value = props.gridColumns ? props.gridColumns[1] : _column
            } else if (window.innerWidth > 1600) {
                const _column = props.gridColumn && props.gridColumn < 4 ? props.gridColumn : 4;
                column.value = props.gridColumns ? props.gridColumns[2] : _column
            }
        }

        /**
         * 请求数据
         */
        const handleSearch = async (_params?: Record<string, any>) => {
            loading.value = true
            if(props.request) {
                const resp = await props.request({
                    pageIndex: 0, 
                    pageSize: 12,
                    ...props.defaultParams,
                    ..._params,
                    terms: [
                        ...(props.defaultParams?.terms || []),
                        ...(_params?.terms || [])
                    ]
                })
                if(resp.status === 200){
                    if(props.type === 'PAGE'){
                        // 判断如果是最后一页且最后一页为空，就跳转到前一页
                        if(resp.result.total && resp.result.pageSize && resp.result.pageIndex && resp.result?.data?.length === 0) {
                            handleSearch({
                                ..._params,
                                pageSize: pageSize.value,
                                pageIndex: pageIndex.value > 0 ?  pageIndex.value - 1 : 0,
                            })
                        } else {
                            _dataSource.value = resp.result?.data || []
                            pageIndex.value = resp.result?.pageIndex || 0
                            pageSize.value = resp.result?.pageSize || 6
                            total.value = resp.result?.total || 0
                        }
                    } else {
                        _dataSource.value = resp?.result || []
                    }
                } else {
                    _dataSource.value  = []
                }
            } else {
                console.log(props?.dataSource)
                _dataSource.value = props?.dataSource || []
            }
            loading.value = false
        }

        watch(
            () => props.params, 
            (newValue) => {
                handleSearch(newValue)
            }, 
            {deep: true, immediate: true}
        )

        watch(
            () => props.dataSource, 
            (newValue) => {
                if(props.dataSource){
                    handleSearch(props.params)
                }
            }, 
            {deep: true, immediate: true}
        )

        onMounted(() => {
            window.onresize = () => {
                windowChange()
            }
        })

        onUnmounted(() => {
            window.onresize = null
        })

        /**
         * 刷新数据
         * @param _params 
         */
        const reload = (_params?: Record<string, any>) => {
            handleSearch({
                ..._params,
                pageSize: 12,
                pageIndex: 0
            })
        }

        /**
         * 导出方法
         */
         expose({ reload })
        
        return () => <Spin spinning={loading.value}>
                <div class={styles["jtable-body"]}>
                <div class={styles["jtable-body-header"]}>
                    <div class={styles["jtable-body-header-left"]}>
                        {/* 顶部左边插槽 */}
                        {slots.headerTitle && slots.headerTitle()}
                    </div>
                    <div class={styles["jtable-body-header-right"]}>
                        {/* 顶部右边插槽 */}
                        {slots.rightExtraRender && slots.rightExtraRender()}
                        {
                            !props.model && <div class={styles["jtable-body-header-right-button"]}>
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
                        }
                    </div>
                </div>
                {/* content */}
                <div class={styles['jtable-content']}>
                    {
                        props.alertRender && props?.rowSelection && props?.rowSelection?.selectedRowKeys && props.rowSelection.selectedRowKeys?.length ?
                        <div class={styles['jtable-alert']}>
                            <Alert
                                message={'已选择' + props?.rowSelection?.selectedRowKeys?.length + '项'}
                                type="info"
                                onClose={() => {
                                    emit('cancelSelect')
                                }}
                                closeText={<a-button type="link">取消选择</a-button>}
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
                                            <div class={[styles['jtable-card-item'], props.cardBodyClass]}>
                                                {slots.card(item)}
                                            </div> : null
                                        )
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
                                            return slots?.[_key]!(record)
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
                    (!!_dataSource.value.length) && !props.noPagination && props.type === 'PAGE' &&
                    <div class={styles['jtable-pagination']}>
                        <Pagination 
                            size="small" 
                            total={total.value}
                            showQuickJumper={false}
                            showSizeChanger={true}
                            current={pageIndex.value + 1}
                            pageSize={pageSize.value}
                            pageSizeOptions={['12', '24', '48', '60', '100']}
                            showTotal={(num) => {
                                const minSize = pageIndex.value * pageSize.value + 1;
                                const MaxSize = (pageIndex.value + 1) * pageSize.value;
                                return `第 ${minSize} - ${MaxSize > num ? num : MaxSize} 条/总共 ${num} 条`;
                            }}
                            onChange={(page, size) => {
                                handleSearch({
                                    ...props.params,
                                    pageSize: size,
                                    pageIndex: pageSize.value === size ? (page ? page - 1 : 0) : 0
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
