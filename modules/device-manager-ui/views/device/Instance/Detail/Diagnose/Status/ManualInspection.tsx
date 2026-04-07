import { useInstanceStore } from "../../../../../../store/instance";
import { useMenuStore } from "@jetlinks-web-core/store/menu";
import { Button, Modal, Descriptions, DescriptionsItem, Space } from "ant-design-vue"
import { AIcon } from '@jetlinks-web/components'
import styles from './index.module.less'
import i18n from "@jetlinks-web-core/locales";

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
                                {i18n.global.t('Status.index.565893-69')}
                                <Button type="link" style="padding: 0"
                                    onClick={() => {
                                        emit('save', data)
                                    }}
                                >
                                    {i18n.global.t('Status.index.565893-20')}
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
                                <h4>{i18n.global.t('Status.index.565893-70')}</h4>
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
                                {i18n.global.t('Status.index.565893-69')}
                                <Button type="link" style="padding: 0"
                                    onClick={() => {
                                        emit('save', data)
                                    }}
                                >
                                    {i18n.global.t('Status.index.565893-20')}
                                </Button>
                            </div>
                            <div style={{ marginTop: '10px' }}>
                                <Descriptions title={data?.data?.name} layout="vertical" bordered>
                                    {data.configuration?.provider === 'OneNet' ? (
                                        <>
                                            <DescriptionsItem label={i18n.global.t('Status.index.565893-71')}>
                                                {data?.configuration?.configuration?.apiAddress || ''}
                                            </DescriptionsItem>
                                            <DescriptionsItem label={'apiKey'}>
                                                {data?.configuration?.configuration?.apiKey || ''}
                                            </DescriptionsItem>
                                            <DescriptionsItem label={i18n.global.t('Status.index.565893-72')}>
                                                {data?.configuration?.configuration?.validateToken || ''}
                                            </DescriptionsItem>
                                            <DescriptionsItem label={'aesKey'}>
                                                {data?.configuration?.configuration?.aesKey || ''}
                                            </DescriptionsItem>
                                        </>
                                    ) : (
                                        <>
                                            <DescriptionsItem label={i18n.global.t('Status.index.565893-71')}>
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
                                <h4>{i18n.global.t('Status.index.565893-70')}</h4>
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
                                {i18n.global.t('Status.index.565893-69')}
                                <Button type="link" style="padding: 0"
                                    onClick={() => {
                                        emit('save', data)
                                    }}
                                >
                                    {i18n.global.t('Status.index.565893-20')}
                                </Button>
                            </div>
                            <div style={{ marginTop: '10px' }}>
                                <Descriptions title={data?.data?.name} layout="vertical" bordered>
                                    {data?.configuration?.configuration?.shareCluster ? (
                                        <>
                                            <DescriptionsItem label={i18n.global.t('Status.index.565893-73')}>
                                                {data?.configuration?.configuration?.domain || ''}
                                            </DescriptionsItem>
                                            <DescriptionsItem label={'SIP ID'}>
                                                {data?.configuration?.configuration?.sipId || ''}
                                            </DescriptionsItem>
                                            <DescriptionsItem label={i18n.global.t('Status.index.565893-74')}>
                                                {data?.configuration?.configuration?.shareCluster ? i18n.global.t('Status.index.565893-75') : i18n.global.t('Status.index.565893-76')}
                                            </DescriptionsItem>
                                            <DescriptionsItem label={i18n.global.t('Status.index.565893-77')}>
                                                {`${data?.configuration?.configuration?.hostPort?.host}:${data?.configuration?.configuration?.hostPort?.port}`}
                                            </DescriptionsItem>
                                            <DescriptionsItem label={i18n.global.t('Status.index.565893-78')}>
                                                {`${data?.configuration?.configuration?.hostPort?.publicHost}:${data?.configuration?.configuration?.hostPort?.publicPort}`}
                                            </DescriptionsItem>
                                        </>
                                    ) : (
                                        <>
                                            <DescriptionsItem label={i18n.global.t('Status.index.565893-73')}>
                                                {data?.configuration?.configuration?.domain || ''}
                                            </DescriptionsItem>
                                            <DescriptionsItem label={'SIP ID'}>
                                                {data?.configuration?.configuration?.sipId || ''}
                                            </DescriptionsItem>
                                            <DescriptionsItem label={i18n.global.t('Status.index.565893-74')}>
                                                {data?.configuration?.configuration?.shareCluster ? i18n.global.t('Status.index.565893-75') : i18n.global.t('Status.index.565893-76')}
                                            </DescriptionsItem>
                                            {data?.configuration?.configuration?.cluster.map((i: any, it: number) => (
                                                <div key={it}>
                                                    <div>{i18n.global.t('Status.index.565893-79', [it + 1])}</div>
                                                    <DescriptionsItem label={i18n.global.t('Status.index.565893-80')}>
                                                        {i?.clusterNodeId || ''}
                                                    </DescriptionsItem>
                                                    <DescriptionsItem label={i18n.global.t('Status.index.565893-77')}>
                                                        {`${i.host}:${i?.port}`}
                                                    </DescriptionsItem>
                                                    <DescriptionsItem label={i18n.global.t('Status.index.565893-78')}>
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
                                <h4>{i18n.global.t('Status.index.565893-70')}</h4>
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
            title={i18n.global.t('Status.index.565893-17')}
            open
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
                            menuStory.jumpPage('device/Product/Detail', { params: { id: data.productId, tab: 'Device' }});
                        } else {
                            menuStory.jumpPage('link/AccessConfig/Detail', {
                            params: {
                                id: data.configuration?.id
                            }
                        });
                        }
                    }}>{i18n.global.t('Status.index.565893-81')}</Button>
                    <Button onClick={() => {
                        emit('save', data)
                    }}>{i18n.global.t('Status.index.565893-22')}</Button>
                </Space>
            }}
        >
            <div style={{ display: 'flex' }}>{dataRender()}</div>
        </Modal>
    }
})

export default ManualInspection
