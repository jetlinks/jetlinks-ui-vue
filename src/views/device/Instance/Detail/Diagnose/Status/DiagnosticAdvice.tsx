import { Badge, Descriptions, Modal, Tooltip, AIcon, DescriptionsItem } from "jetlinks-ui-components"
import TitleComponent from '@/components/TitleComponent/index.vue'
import styles from './index.module.less'
import _ from "lodash-es";
import i18n from '@/i18n'
const $t = i18n.global.t

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
        return () => <Modal visible title={$t('Status.DiagnosticAdvice.585608-0')} width={1000} onOk={() => {
            emit('close')
        }}
            onCancel={() => {
                emit('close')
            }}
        >
            <div>
                <TitleComponent data={$t('Status.DiagnosticAdvice.585608-1')} />
                <div class={styles.advice}>
                    <div class={styles.alert}>
                        <span style={{ marginRight: 10 }}><AIcon type="InfoCircleOutlined" /></span>
                        {$t('Status.DiagnosticAdvice.585608-2')}
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
                <TitleComponent data={$t('Status.DiagnosticAdvice.585608-3')} />
                <Descriptions column={2}>
                    <DescriptionsItem span={1} label={$t('Status.DiagnosticAdvice.585608-4')}>
                        {data?.info?.id || ''}
                    </DescriptionsItem>
                    {data?.info?.address?.length > 0 && (
                        <DescriptionsItem span={1} label={$t('Status.DiagnosticAdvice.585608-5')}>
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
                        </DescriptionsItem>
                    )}

                    {(_.flatten(_.map(data?.info?.config, 'properties')) || []).map((item: any, index: number) => (
                        <DescriptionsItem
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
                        </DescriptionsItem>
                    ))}
                </Descriptions>
            </div>
        </Modal>
    }
})

export default DiagnosticAdvice
