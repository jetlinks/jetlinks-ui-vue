import { useInstanceStore } from "@/store/instance";
import { useMenuStore } from "@/store/menu";
import { AIcon, Button, Modal, Descriptions, DescriptionsItem, Space } from "jetlinks-ui-components"
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

        const instanceStore = useInstanceStore();

        const menuStory = useMenuStore();

        const dataRender = () => {
            if (data.type === 'device' || data.type === 'product') {
                return (
                    <>
                        <div style={{ flex: 1 }}>
                            <div class={styles.alert}>
                                <span style={{ marginRight: '10px' }}><AIcon type="InfoCircleOutlined" /></span>
                                请检查配置项是否填写正确，若您确定该项无需诊断可
                                <Button type="link" style="padding: 0"
                                    onClick={() => {
                                        emit('save', data)
                                    }}
                                >
                                    忽略
                                </Button>
                            </div>
                            <div style={{ marginTop: '10px' }}>
                                <Descriptions title={data?.data?.name} layout="vertical" bordered>
                                    {(data?.data?.properties || []).map((item: any) => (
                                        <DescriptionsItem
                                            key={item.property}
                                            label={`${item.name}${item?.description ? `(${item.description})` : ''}`}
                                        >
                                            {data?.configuration[item.property] || ''}
                                        </DescriptionsItem>
                                    ))}
                                </Descriptions>
                            </div>
                        </div>
                        {data?.data?.description ? (
                            <div
                                style={{ width: '50%', border: '1px solid #f0f0f0', padding: '10px', borderLeft: 'none' }}
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
                                <span style={{ marginRight: '10px' }}><AIcon type="InfoCircleOutlined" /></span>
                                请检查配置项是否填写正确，若您确定该项无需诊断可
                                <Button type="link" style="padding: 0"
                                    onClick={() => {
                                        emit('save', data)
                                    }}
                                >
                                    忽略
                                </Button>
                            </div>
                            <div style={{ marginTop: '10px' }}>
                                <Descriptions title={data?.data?.name} layout="vertical" bordered>
                                    {data.configuration?.provider === 'OneNet' ? (
                                        <>
                                            <DescriptionsItem label={'接口地址'}>
                                                {data?.configuration?.configuration?.apiAddress || ''}
                                            </DescriptionsItem>
                                            <DescriptionsItem label={'apiKey'}>
                                                {data?.configuration?.configuration?.apiKey || ''}
                                            </DescriptionsItem>
                                            <DescriptionsItem label={'通知Token'}>
                                                {data?.configuration?.configuration?.validateToken || ''}
                                            </DescriptionsItem>
                                            <DescriptionsItem label={'aesKey'}>
                                                {data?.configuration?.configuration?.aesKey || ''}
                                            </DescriptionsItem>
                                        </>
                                    ) : (
                                        <>
                                            <DescriptionsItem label={'接口地址'}>
                                                {data?.configuration?.configuration?.apiAddress || ''}
                                            </DescriptionsItem>
                                            <DescriptionsItem label={'appKey'}>
                                                {data?.configuration?.configuration?.appKey || ''}
                                            </DescriptionsItem>
                                            <DescriptionsItem label={'appSecret'}>
                                                {data?.configuration?.configuration?.appSecret || ''}
                                            </DescriptionsItem>
                                        </>
                                    )}
                                </Descriptions>
                            </div>
                        </div>
                        {data?.configuration?.configuration?.description ? (
                            <div
                                style={{ width: '50%', border: '1px solid #f0f0f0', padding: '10px', borderLeft: 'none' }}
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
                                <span style={{ marginRight: '10px' }}><AIcon type="InfoCircleOutlined" /></span>
                                请检查配置项是否填写正确，若您确定该项无需诊断可
                                <Button type="link" style="padding: 0"
                                    onClick={() => {
                                        emit('save', data)
                                    }}
                                >
                                    忽略
                                </Button>
                            </div>
                            <div style={{ marginTop: '10px' }}>
                                <Descriptions title={data?.data?.name} layout="vertical" bordered>
                                    {data?.configuration?.configuration?.shareCluster ? (
                                        <>
                                            <DescriptionsItem label={'SIP 域'}>
                                                {data?.configuration?.configuration?.domain || ''}
                                            </DescriptionsItem>
                                            <DescriptionsItem label={'SIP ID'}>
                                                {data?.configuration?.configuration?.sipId || ''}
                                            </DescriptionsItem>
                                            <DescriptionsItem label={'集群'}>
                                                {data?.configuration?.configuration?.shareCluster ? '共享配置' : '独立配置'}
                                            </DescriptionsItem>
                                            <DescriptionsItem label={'SIP 地址'}>
                                                {`${data?.configuration?.configuration?.hostPort?.host}:${data?.configuration?.configuration?.hostPort?.port}`}
                                            </DescriptionsItem>
                                            <DescriptionsItem label={'公网 Host'}>
                                                {`${data?.configuration?.configuration?.hostPort?.publicHost}:${data?.configuration?.configuration?.hostPort?.publicPort}`}
                                            </DescriptionsItem>
                                        </>
                                    ) : (
                                        <>
                                            <DescriptionsItem label={'SIP 域'}>
                                                {data?.configuration?.configuration?.domain || ''}
                                            </DescriptionsItem>
                                            <DescriptionsItem label={'SIP ID'}>
                                                {data?.configuration?.configuration?.sipId || ''}
                                            </DescriptionsItem>
                                            <DescriptionsItem label={'集群'}>
                                                {data?.configuration?.configuration?.shareCluster ? '共享配置' : '独立配置'}
                                            </DescriptionsItem>
                                            {data?.configuration?.configuration?.cluster.map((i: any, it: number) => (
                                                <div key={it}>
                                                    <div>节点{it + 1}</div>
                                                    <DescriptionsItem label={'节点名称'}>
                                                        {i?.clusterNodeId || ''}
                                                    </DescriptionsItem>
                                                    <DescriptionsItem label={'SIP 地址'}>
                                                        {`${i.host}:${i?.port}`}
                                                    </DescriptionsItem>
                                                    <DescriptionsItem label={'公网 Host'}>
                                                        {`${i?.publicHost}:${i?.publicPort}`}
                                                    </DescriptionsItem>
                                                </div>
                                            ))}
                                        </>
                                    )}
                                </Descriptions>
                            </div>
                        </div>
                        {data?.configuration?.description ? (
                            <div
                                style={{ width: '50%', border: '1px solid #f0f0f0', padding: '10px', borderLeft: 'none' }}
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
            onOk={() => {
                emit('save', data)
            }}
            onCancel={() => {
                emit('close')
            }}
            v-slots={{
                footer: <Space>
                    <Button onClick={() => {
                        if (data.type === 'device') {
                            instanceStore.tabActiveKey = 'Info'
                        } else if (data.type === 'product') {
                            menuStory.jumpPage('device/Product/Detail', { id: data.productId, tab: 'access' });
                        } else {
                            menuStory.jumpPage('link/AccessConfig/Detail', { id: data.configuration?.id });
                        }
                    }}>去修改</Button>
                    <Button onClick={() => {
                        emit('save', data)
                    }}>确认无误</Button>
                </Space>
            }}
        >
            <div style={{ display: 'flex' }}>{dataRender()}</div>
        </Modal>
    }
})

export default ManualInspection