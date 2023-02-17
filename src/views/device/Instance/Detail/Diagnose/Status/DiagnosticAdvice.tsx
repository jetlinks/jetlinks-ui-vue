import { Badge, Descriptions, Modal, Tooltip } from "ant-design-vue"
import TitleComponent from '@/components/TitleComponent/index.vue'
import styles from './index.module.less'
import AIcon from "@/components/AIcon";
import _ from "lodash";

const DiagnosticAdvice = defineComponent({
    props: {
        data: {
            type: Object,
            default: () => { }
        }
    },
    emits: ['close'],
    setup(props, { emit }) {
        const { data } = props
        return () => <Modal visible title="设备诊断" width={1000} onOk={() => {
            emit('close')
        }}
            onCancel={() => {
                emit('close')
            }}
        >
            <div>
                <TitleComponent data="诊断建议" />
                <div class={styles.advice}>
                    <div class={styles.alert}>
                        <span style={{ marginRight: 10 }}><AIcon type="InfoCircleOutlined" /></span>
                        所有诊断均无异常但设备仍未上线，请检查以下内容
                    </div>
                    <div style={{ marginLeft: 10 }}>
                        {
                            (data?.list || []).map((item: any, index: number) => (
                                <div class={styles.infoItem} key={index} style={{ margin: '10px 0' }}>
                                    {item}
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
            <div style={{ marginTop: 15 }}>
                <TitleComponent data="连接信息" />
                <Descriptions column={2}>
                    <Descriptions.Item span={1} label="设备ID">
                        {data?.info?.id || ''}
                    </Descriptions.Item>
                    {data?.info?.address?.length > 0 && (
                        <Descriptions.Item span={1} label="连接地址">
                            <Tooltip
                                placement="topLeft"
                                title={
                                    <div class="serverItem">
                                        {(data?.info?.address || []).map((i: any) => (
                                            <div key={i.address}>
                                                <Badge color={i.health === -1 ? 'red' : 'green'} />
                                                {i.address}
                                            </div>
                                        ))}
                                    </div>
                                }
                            >
                                <div class="serverItem">
                                    {(data?.info?.address || []).slice(0, 1).map((i: any) => (
                                        <div key={i.address}>
                                            <Badge color={i.health === -1 ? 'red' : 'green'} />
                                            {i.address}
                                        </div>
                                    ))}
                                </div>
                            </Tooltip>
                        </Descriptions.Item>
                    )}

                    {(_.flatten(_.map(data?.info?.config, 'properties')) || []).map((item: any, index: number) => (
                        <Descriptions.Item
                            key={index}
                            span={1}
                            label={
                                item?.description ? (
                                    <div>
                                        <span style={{ marginRight: '10px' }}>{item.name}</span>
                                        <Tooltip title={item.description}>
                                            <AIcon type="QuestionCircleOutlined" />
                                        </Tooltip>
                                    </div>
                                ) : (
                                    item.name
                                )
                            }
                        >
                            {data?.info?.configValue[item?.property] || ''}
                        </Descriptions.Item>
                    ))}
                </Descriptions>
            </div>
        </Modal>
    }
})

export default DiagnosticAdvice