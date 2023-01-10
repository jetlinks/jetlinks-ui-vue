import { UnorderedListOutlined, AppstoreOutlined } from '@ant-design/icons-vue'
import styles from './index.module.less'
import { Space, Pagination, Table, Empty } from 'ant-design-vue'
import type { TableProps } from 'ant-design-vue/es/table'
enum ModelEnum {
    TABLE = 'TABLE',
    CARD = 'CARD',
}

export declare type RequestData = {
    code: string;
    result: {
        data: any[] | undefined;
        pageIndex: number;
        pageSize: number;
        total: number;
    };
    status: number;
} & Record<string, any>;
// interface ColumnType extends 

interface JTableProps extends TableProps{
    // columns?: ColumnsType<RecordType>;
    request: (params: Record<string, any> & {
        pageSize?: number;
        pageIndex?: number;
    }) => Promise<Partial<RequestData>>;
    cardBodyClass?: string;
}


const JTable = defineComponent<JTableProps>({
    name: 'JTable',
    slots: [
        'headerTitle', // 顶部左边插槽
        'cardRender', // 卡片内容
    ],
    emits: [
        'modelChange', // 切换卡片和表格
    ],
    setup(props: JTableProps, { slots, emit }){
        const model = ref<keyof typeof ModelEnum>(ModelEnum.CARD); // 模式切换
        const column = ref<number>(3);
        console.log(props)
        const dataSource = ref<any[]>([
            {
              key: '1',
              name: '胡彦斌',
              age: 32,
              address: '西湖区湖底公园1号',
            },
            {
              key: '2',
              name: '胡彦祖1',
              age: 42,
              address: '西湖区湖底公园1号',
            },
            {
                key: '3',
                name: '胡彦斌',
                age: 32,
                address: '西湖区湖底公园1号',
              },
              {
                key: '4',
                name: '胡彦祖1',
                age: 42,
                address: '西湖区湖底公园1号',
              },
              {
                key: '5',
                name: '胡彦斌',
                age: 32,
                address: '西湖区湖底公园1号',
              },
              {
                key: '6',
                name: '胡彦祖1',
                age: 42,
                address: '西湖区湖底公园1号',
              },
        ])

        onMounted(() => {

        })
        
        return () => <div class={styles["jtable-body"]}>
            <div class={styles["jtable-body-header"]}>
                <div class={styles["jtable-body-header-left"]}>
                    {/* 顶部左边插槽 */}
                    {slots.headerTitle && slots.headerTitle()}
                </div>
                <div class={styles["jtable-body-header-right"]}>
                    {/* <Space> */}
                        <div class={[styles["jtable-setting-item"], ModelEnum.CARD === model.value ? styles['active'] : '']} onClick={() => {
                            model.value = ModelEnum.CARD
                        }}>
                            <AppstoreOutlined />
                        </div>
                        <div class={[styles["jtable-setting-item"], ModelEnum.TABLE === model.value ? styles['active'] : '']} onClick={() => {
                            model.value = ModelEnum.TABLE
                        }}>
                            <UnorderedListOutlined  />
                        </div>
                    {/* </Space> */}
                </div>
            </div>
            {/* content */}
            <div class={styles['jtable-content']}>
            {
                model.value === ModelEnum.CARD ?
                <div class={styles['jtable-card']}>
                    {
                        dataSource.value.length ? 
                        <div 
                            class={styles['jtable-card-items']}
                            style={{gridTemplateColumns: `repeat(${column.value}, 1fr)`}}
                        >
                            {
                                dataSource.value.map(item => slots.cardRender ? 
                                    <div class={[styles['jtable-card-item'], props.cardBodyClass]}>{slots.cardRender(item)}</div>
                                    : null)
                            }
                        </div> : 
                        <div><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /></div>
                    }
                </div> :
                <div>
                    <Table
                        dataSource={dataSource.value}
                        columns={props.columns}
                        pagination={false}
                    />
                </div>
            }
            </div>
            {/* 分页 */}
            {
                dataSource.value.length && 
                <div class={styles['jtable-pagination']}>
                    <Pagination 
                        size="small" 
                        total={50}
                        showTotal={(total) => {
                            const min  = 1
                            const max = 1
                            return `第 ${min} - ${max} 条/总共 ${total} 条`
                        }}
                        onChange={() => {

                        }}
                        onShowSizeChange={() => {

                        }}
                    />
                </div>
            }
        </div>
    }
})

export default JTable
