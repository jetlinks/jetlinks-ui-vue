import { Badge, Descriptions, Modal, DescriptionsItem } from "ant-design-vue"
import { AIcon, Ellipsis } from '@jetlinks-web/components'
import TitleComponent from '@jetlinks-web-core/components/TitleComponent/index.vue'
import styles from './index.module.less'
import { map, flatten} from "lodash-es";
import i18n from "@jetlinks-web-core/locales";

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
        return () => <Modal open title={i18n.global.t('Status.DiagnosticAdvice.980298-0')} width={1000} onOk={() => {
            emit('close')
        }}
            onCancel={() => {
                emit('close')
            }}
        >
            <div>
                <TitleComponent data={i18n.global.t('Status.DiagnosticAdvice.980298-1')} />
                <div class={styles.advice}>
                    <div class={styles.alert}>
                        <span style={{ marginRight: 10 }}><AIcon type="InfoCircleOutlined" /></span>
                        {i18n.global.t('Status.DiagnosticAdvice.980298-2')}
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
                <TitleComponent data={i18n.global.t('Status.DiagnosticAdvice.980298-3')} />
                <Descriptions column={2}>
                    <DescriptionsItem span={1} label={i18n.global.t('Status.DiagnosticAdvice.980298-4')}>
                        {data?.info?.id || ''}
                    </DescriptionsItem>
                    {data?.info?.address?.length > 0 && (
                        <DescriptionsItem span={1} label={i18n.global.t('Status.DiagnosticAdvice.980298-5')}>
                            <Ellipsis
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
                            </Ellipsis>
                        </DescriptionsItem>
                    )}

                    {(flatten(map(data?.info?.config, 'properties')) || []).map((item: any, index: number) => (
                        <DescriptionsItem
                            key={index}
                            span={1}
                            label={
                                item?.description ? (
                                    <div style={{display: "flex"}}>
                                        <span style={{ marginRight: '10px' }}>{item.name}</span>
                                        <Ellipsis title={item.description}>
                                            <AIcon type="QuestionCircleOutlined" />
                                        </Ellipsis>
                                    </div>
                                ) : (
                                    item.name
                                )
                            }
                        >
                            {data?.info?.configValue[item?.property] || ''}
                        </DescriptionsItem>
                    ))}
                </Descriptions>
            </div>
        </Modal>
    }
})

export default DiagnosticAdvice
