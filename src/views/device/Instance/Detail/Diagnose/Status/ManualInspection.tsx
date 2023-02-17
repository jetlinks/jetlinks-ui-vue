import AIcon from "@/components/AIcon";
import { Button, Descriptions, Modal } from "ant-design-vue"
import styles from './index.module.less'

const ManualInspection = defineComponent({
    props: {
        data: {
            type: Object,
            default: () => { }
        }
    },
    emits: ['close', 'save'],
    setup(props, { emit }) {

        const { data } = props

        const dataRender = () => {
            if (data.type === 'device' || data.type === 'product') {
                return (
                    <>
                        <div style={{ flex: 1 }}>
                            <div class={styles.alert}>
                                <span style={{ marginRight: 10 }}><AIcon type="InfoCircleOutlined" /></span>
                                请检查配置项是否填写正确，若您确定该项无需诊断可
                                <Button type="link" style="padding: 0"
                                    onClick={() => {
                                        emit('save', data)
                                    }}
                                >
                                    忽略
                                </Button>
                            </div>
                            <div style={{ marginTop: 10 }}>
                                <Descriptions title={data?.data?.name} layout="vertical" bordered>
                                    {(data?.data?.properties || []).map((item: any) => (
                                        <Descriptions.Item
                                            key={item.property}
                                            label={`${item.name}${item?.description ? `(${item.description})` : ''}`}
                                        >
                                            {data?.configuration[item.property] || ''}
                                        </Descriptions.Item>
                                    ))}
                                </Descriptions>
                            </div>
                        </div>
                        {data?.data?.description ? (
                            <div
                                style={{ width: '50%', border: '1px solid #f0f0f0', padding: 10, borderLeft: 'none' }}
                            >
                                <h4>诊断项说明</h4>
                                <p>{data?.data?.description}</p>
                            </div>
                        ) : (
                            ''
                        )}
                    </>
                );
            } else if (data.type === 'cloud') {
                return (
                    <>
                        <div style={{ flex: 1 }}>
                            <div class={styles.alert}>
                                <span style={{ marginRight: 10 }}><AIcon type="InfoCircleOutlined" /></span>
                                请检查配置项是否填写正确，若您确定该项无需诊断可
                                <Button type="link" style="padding: 0"
                                    onClick={() => {
                                        emit('save', data)
                                    }}
                                >
                                    忽略
                                </Button>
                            </div>
                            <div style={{ marginTop: 10 }}>
                                <Descriptions title={data?.data?.name} layout="vertical" bordered>
                                    {data.configuration?.provider === 'OneNet' ? (
                                        <>
                                            <Descriptions.Item label={'接口地址'}>
                                                {data?.configuration?.configuration?.apiAddress || ''}
                                            </Descriptions.Item>
                                            <Descriptions.Item label={'apiKey'}>
                                                {data?.configuration?.configuration?.apiKey || ''}
                                            </Descriptions.Item>
                                            <Descriptions.Item label={'通知Token'}>
                                                {data?.configuration?.configuration?.validateToken || ''}
                                            </Descriptions.Item>
                                            <Descriptions.Item label={'aesKey'}>
                                                {data?.configuration?.configuration?.aesKey || ''}
                                            </Descriptions.Item>
                                        </>
                                    ) : (
                                        <>
                                            <Descriptions.Item label={'接口地址'}>
                                                {data?.configuration?.configuration?.apiAddress || ''}
                                            </Descriptions.Item>
                                            <Descriptions.Item label={'appKey'}>
                                                {data?.configuration?.configuration?.appKey || ''}
                                            </Descriptions.Item>
                                            <Descriptions.Item label={'appSecret'}>
                                                {data?.configuration?.configuration?.appSecret || ''}
                                            </Descriptions.Item>
                                        </>
                                    )}
                                </Descriptions>
                            </div>
                        </div>
                        {data?.configuration?.configuration?.description ? (
                            <div
                                style={{ width: '50%', border: '1px solid #f0f0f0', padding: 10, borderLeft: 'none' }}
                            >
                                <h4>诊断项说明</h4>
                                <p>{data?.configuration?.configuration?.description}</p>
                            </div>
                        ) : (
                            ''
                        )}
                    </>
                );
            } else if (data.type === 'media') {
                return (
                    <>
                        <div style={{ flex: 1 }}>
                            <div class={styles.alert}>
                                <span style={{ marginRight: 10 }}><AIcon type="InfoCircleOutlined" /></span>
                                请检查配置项是否填写正确，若您确定该项无需诊断可
                                <Button type="link" style="padding: 0"
                                    onClick={() => {
                                        emit('save', data)
                                    }}
                                >
                                    忽略
                                </Button>
                            </div>
                            <div style={{ marginTop: 10 }}>
                                <Descriptions title={data?.data?.name} layout="vertical" bordered>
                                    {data?.configuration?.configuration?.shareCluster ? (
                                        <>
                                            <Descriptions.Item label={'SIP 域'}>
                                                {data?.configuration?.configuration?.domain || ''}
                                            </Descriptions.Item>
                                            <Descriptions.Item label={'SIP ID'}>
                                                {data?.configuration?.configuration?.sipId || ''}
                                            </Descriptions.Item>
                                            <Descriptions.Item label={'集群'}>
                                                {data?.configuration?.configuration?.shareCluster ? '共享配置' : '独立配置'}
                                            </Descriptions.Item>
                                            <Descriptions.Item label={'SIP 地址'}>
                                                {`${data?.configuration?.configuration?.hostPort?.host}:${data?.configuration?.configuration?.hostPort?.port}`}
                                            </Descriptions.Item>
                                            <Descriptions.Item label={'公网 Host'}>
                                                {`${data?.configuration?.configuration?.hostPort?.publicHost}:${data?.configuration?.configuration?.hostPort?.publicPort}`}
                                            </Descriptions.Item>
                                        </>
                                    ) : (
                                        <>
                                            <Descriptions.Item label={'SIP 域'}>
                                                {data?.configuration?.configuration?.domain || ''}
                                            </Descriptions.Item>
                                            <Descriptions.Item label={'SIP ID'}>
                                                {data?.configuration?.configuration?.sipId || ''}
                                            </Descriptions.Item>
                                            <Descriptions.Item label={'集群'}>
                                                {data?.configuration?.configuration?.shareCluster ? '共享配置' : '独立配置'}
                                            </Descriptions.Item>
                                            {data?.configuration?.configuration?.cluster.map((i: any, it: number) => (
                                                <div key={it}>
                                                    <div>节点{it + 1}</div>
                                                    <Descriptions.Item label={'节点名称'}>
                                                        {i?.clusterNodeId || ''}
                                                    </Descriptions.Item>
                                                    <Descriptions.Item label={'SIP 地址'}>
                                                        {`${i.host}:${i?.port}`}
                                                    </Descriptions.Item>
                                                    <Descriptions.Item label={'公网 Host'}>
                                                        {`${i?.publicHost}:${i?.publicPort}`}
                                                    </Descriptions.Item>
                                                </div>
                                            ))}
                                        </>
                                    )}
                                </Descriptions>
                            </div>
                        </div>
                        {data?.configuration?.configuration.description ? (
                            <div
                                style={{ width: '50%', border: '1px solid #f0f0f0', padding: 10, borderLeft: 'none' }}
                            >
                                <h4>诊断项说明</h4>
                                <p>{data?.configuration?.description}</p>
                            </div>
                        ) : (
                            ''
                        )}
                    </>
                );
            } else {
                return null;
            }
        };

        return () => <Modal
            title="人工检查"
            visible
            width={1000}
            cancelText="去修改"
            okText="确认无误"
            onOk={() => {
                emit('save', data)
            }}
            onCancel={() => {
                // TODO 跳转设备和产品
            }}>
            <div style={{ display: 'flex' }}>{dataRender()}</div>
        </Modal>
    }
})

export default ManualInspection