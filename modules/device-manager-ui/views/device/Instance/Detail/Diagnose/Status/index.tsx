import { Badge, Button, Space } from "ant-design-vue"
import TitleComponent from '@jetlinks-web-core/components/TitleComponent/index.vue'
import styles from './index.module.less'
import type { ListProps } from './util'
import { networkInitList, childInitList, cloudInitList, mediaInitList, TextColorMap, StatusMap, modifyArrayList, isExit, gatewayList, urlMap } from './util'
import { useInstanceStore } from "../../../../../../store/instance"
import { startNetwork, startGateway, getGatewayDetail, queryGatewayState, queryProtocolDetail, detail, queryProductState, queryProductConfig, queryDeviceConfig, _deploy } from '../../../../../../api/instance'
import { PropType, VNode } from "vue"
import { _deploy as _deployProduct } from "../../../../../../api/product"
import { uniq, map} from "lodash-es"
import DiagnosticAdvice from './DiagnosticAdvice'
import ManualInspection from './ManualInspection'
import { PermissionButton } from '@jetlinks-web/components'
import { useMenuStore } from "@jetlinks-web-core/store/menu"
import BindParentDevice from '../../components/BindParentDevice/index.vue'
import { onlyMessage } from "@jetlinks-web-core/utils/comm"
import i18n from "@jetlinks-web-core/locales";

type TypeProps = 'network' | 'child-device' | 'media' | 'cloud' | 'channel'

const Status = defineComponent({
    components: { TitleComponent },
    props: {
        providerType: {
            type: String as PropType<TypeProps>,
            default: undefined
        }
    },
    emits: ['percentChange', 'countChange', 'stateChange'],
    setup(props, { emit }) {
        const instanceStore = useInstanceStore()
        const time = 500;

        const status = ref<'loading' | 'finish'>('loading')

        const device = ref(instanceStore.current)
        const gateway = ref<Partial<Record<string, any>>>({}) // 网关信息
        const parent = ref<Partial<Record<string, any>>>({}) // 父设备
        const product = ref<Partial<Record<string, any>>>({}) // 产品

        const artificialVisible = ref<boolean>(false)
        const artificialData = ref<Partial<Record<string, any>>>()

        const diagnoseVisible = ref<boolean>(false)
        const diagnoseData = ref<Partial<Record<string, any>>>()

        const bindParentVisible = ref<boolean>(false)
        const menuStory = useMenuStore();

        const configuration = reactive<{
            product: Record<string, any>,
            device: Record<string, any>
        }>({
            product: {},
            device: []
        })

        const list = ref<ListProps[]>([])

        const manualInspection = (params: any) => {
            artificialVisible.value = true
            artificialData.value = params
        }

        const jumpAccessConfig = () => {
            menuStory.jumpPage('device/Product/Detail', {
            params: {
                id: unref(device).productId,
                tab: 'Device'
            }
        });
        };

        const jumpDeviceConfig = () => {
            instanceStore.tabActiveKey = 'Info'
        }

        // 网络信息
        const diagnoseNetwork = () => new Promise(async (resolve) => {
            if (unref(device).state?.value === 'online') {
                setTimeout(() => {
                    list.value = modifyArrayList(unref(list), {
                        key: 'network',
                        name: i18n.global.t('Status.index.565893-0'),
                        desc: i18n.global.t('Status.index.565893-1'),
                        status: 'success',
                        text: i18n.global.t('Status.index.565893-2'),
                        info: null,
                    });
                    resolve({})
                }, time)
            } else {
                const _device = unref(device)
                if (_device.accessId) {
                    const response: Record<string, any> = await queryGatewayState(_device.accessId)
                    if (response.status === 200) {
                        gateway.value = response.request
                        const address = response.result?.channelInfo?.addresses || [];
                        const _label = address.some((i: any) => i.health === -1);
                        const __label = address.every((i: any) => i.health === 1);
                        const health = _label ? -1 : __label ? 1 : 0;
                        let _item: ListProps | undefined = undefined
                        if (health === 1) {
                            _item = {
                                key: 'network',
                                name: i18n.global.t('Status.index.565893-0'),
                                desc: i18n.global.t('Status.index.565893-1'),
                                status: 'success',
                                text: i18n.global.t('Status.index.565893-2'),
                                info: null,
                            };
                        } else {
                            _item = {
                                key: 'network',
                                name: i18n.global.t('Status.index.565893-0'),
                                desc: i18n.global.t('Status.index.565893-1'),
                                status: 'error',
                                text: i18n.global.t('Status.index.565893-3'),
                                info: health === -1 ? (
                                    <div>
                                        <div class={styles.infoItem}>
                                            <Badge
                                                status="default"
                                                text={
                                                    <span>{i18n.global.t('Status.index.565893-4')}
                                                        <PermissionButton
                                                            type="link"
                                                            style="padding: 0"
                                                            hasPermission="link/Type:action"
                                                            popConfirm={{
                                                                title: i18n.global.t('Status.index.565893-5'),
                                                                onConfirm: async () => {
                                                                    const _response = await startNetwork(
                                                                        unref(gateway)?.channelId,
                                                                    );
                                                                    if (_response.success) {
                                                                        onlyMessage(i18n.global.t('Status.index.565893-6'));
                                                                        list.value = modifyArrayList(
                                                                            list.value,
                                                                            {
                                                                                key: 'network',
                                                                                name: i18n.global.t('Status.index.565893-0'),
                                                                                desc: i18n.global.t('Status.index.565893-1'),
                                                                                status: 'success',
                                                                                text: i18n.global.t('Status.index.565893-2'),
                                                                                info: null,
                                                                            },
                                                                        );
                                                                    }
                                                                  return _response
                                                                }
                                                            }}
                                                        >
                                                            {i18n.global.t('Status.index.565893-7')}
                                                        </PermissionButton>
                                                    </span>
                                                }
                                            />
                                        </div>
                                    </div >
                                ) : (
                                    <div>
                                        <div class={styles.infoItem}>
                                            <Badge
                                                status="default"
                                                text={i18n.global.t('Status.index.565893-8')}
                                            />
                                        </div>
                                        <div class={styles.infoItem}>
                                            <Badge
                                                status="default"
                                                text={i18n.global.t('Status.index.565893-9')}
                                            />
                                        </div>
                                    </div>
                                ),
                            };
                        }
                        setTimeout(() => {
                            if (_item) {
                                list.value = modifyArrayList(list.value, _item);
                            }
                            resolve({});
                        }, time);
                    } else {
                        onlyMessage(i18n.global.t('Status.index.565893-10'), 'error')
                    }
                } else {
                    onlyMessage(i18n.global.t('Status.index.565893-11'), 'error')
                }
            }
        })

        // 设备接入网关
        const diagnoseGateway = () => new Promise(async (resolve) => {
            const desc = props.providerType && ['child-device', 'cloud'].includes(props.providerType)
                ? i18n.global.t('Status.index.565893-12')
                : i18n.global.t('Status.index.565893-13');
            if (unref(device).state.value === 'online') {
                setTimeout(() => {
                    list.value = modifyArrayList(list.value, {
                        key: 'gateway',
                        name: i18n.global.t('Status.index.565893-14'),
                        desc: desc,
                        status: 'success',
                        text: i18n.global.t('Status.index.565893-2'),
                        info: null,
                    });
                    resolve({});
                }, time);
            } else {
                let _item: ListProps | undefined = undefined
                if (!unref(gateway)?.id) {
                    const accessId = unref(device)?.accessId
                    if (accessId) {
                        const response: Record<string, any> = await queryGatewayState(accessId)
                        if (response.status === 200) {
                            gateway.value = response.result
                            if (response.result?.state?.value === 'enabled') {
                                if (props.providerType === 'cloud' || unref(device)?.accessProvider === 'gb28181-2016') {
                                    _item = {
                                        key: 'gateway',
                                        name: i18n.global.t('Status.index.565893-14'),
                                        desc: desc,
                                        status: 'warning',
                                        text: i18n.global.t('Status.index.565893-15'),
                                        info: (
                                            <div>
                                                <div class={styles.infoItem}>
                                                    <Badge
                                                        status="default"
                                                        text={
                                                            <span>
                                                                {i18n.global.t('Status.index.565893-16')}<Button type="link" style="padding: 0" onClick={async () => {
                                                                    const config: any = await getGatewayDetail(
                                                                        response.result?.id || '',
                                                                    );
                                                                    if (config.status === 200) {
                                                                        manualInspection({
                                                                            type: props.providerType,
                                                                            key: `gateway`,
                                                                            name: i18n.global.t('Status.index.565893-14'),
                                                                            desc: desc,
                                                                            data: { name: `${unref(device)?.accessProvider}配置` },
                                                                            configuration: { ...config.result },
                                                                        });
                                                                    }
                                                                }}>{i18n.global.t('Status.index.565893-17')}</Button>{i18n.global.t('Status.index.565893-18')}
                                                                <PermissionButton

                                                                    type="link"
                                                                    style="padding: 0"
                                                                    popConfirm={{
                                                                        title: i18n.global.t('Status.index.565893-19'),
                                                                        onConfirm:() => {
                                                                            list.value = modifyArrayList(
                                                                                list.value,
                                                                                {
                                                                                    key: 'gateway',
                                                                                    name: i18n.global.t('Status.index.565893-14'),
                                                                                    desc: desc,
                                                                                    status: 'success',
                                                                                    text: i18n.global.t('Status.index.565893-2'),
                                                                                    info: null,
                                                                                },
                                                                            );
                                                                        }
                                                                    }}
                                                                >
                                                                    {i18n.global.t('Status.index.565893-20')}
                                                                </PermissionButton>
                                                            </span>
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        ),
                                    };
                                } else {
                                    _item = {
                                        key: 'gateway',
                                        name: i18n.global.t('Status.index.565893-14'),
                                        desc: desc,
                                        status: 'success',
                                        text: i18n.global.t('Status.index.565893-2'),
                                        info: null,
                                    };
                                }
                            } else {
                                _item = {
                                    key: 'gateway',
                                    name: i18n.global.t('Status.index.565893-14'),
                                    desc: desc,
                                    status: 'error',
                                    text: i18n.global.t('Status.index.565893-3'),
                                    info: (
                                        <div>
                                            <div class={styles.infoItem}>
                                                <Badge
                                                    status="default"
                                                    text={<span>{i18n.global.t('Status.index.565893-21')}
                                                        <PermissionButton
                                                            hasPermission="link/AccessConfig:action"
                                                            type="link"
                                                            style="padding: 0"
                                                            popConfirm={{
                                                                title: i18n.global.t('Status.index.565893-5'),
                                                                onConfirm:  async () => {
                                                                    const _response =  await startGateway(unref(device).accessId || '');
                                                                    if (_response.status === 200) {
                                                                        onlyMessage(i18n.global.t('Status.index.565893-6'));
                                                                        list.value = modifyArrayList(
                                                                            list.value,
                                                                            {
                                                                                key: 'gateway',
                                                                                name: i18n.global.t('Status.index.565893-14'),
                                                                                desc: desc,
                                                                                status: 'success',
                                                                                text: i18n.global.t('Status.index.565893-2'),
                                                                                info: null,
                                                                            },
                                                                        );
                                                                    }
                                                                    return _response
                                                                }
                                                            }}
                                                        >
                                                            {i18n.global.t('Status.index.565893-7')}
                                                        </PermissionButton>
                                                    </span>}
                                                />
                                            </div>
                                        </div>
                                    ),
                                };
                            }
                            setTimeout(() => {
                                if (_item) {
                                    list.value = modifyArrayList(list.value, _item);
                                }
                                resolve({});
                            }, time);
                        } else {
                            {i18n.global.t('Status.index.565893-10')}
                        }
                    } else {
                        onlyMessage(i18n.global.t('Status.index.565893-11'), 'error')
                    }
                } else {
                    if (unref(gateway)?.state?.value === 'enabled') {
                        if (props.providerType === 'cloud' || unref(device)?.accessProvider === 'gb28181-2016') {
                            _item = {
                                key: 'gateway',
                                name: i18n.global.t('Status.index.565893-14'),
                                desc: desc,
                                status: 'warning',
                                text: i18n.global.t('Status.index.565893-15'),
                                info: (
                                    <div>
                                        <div class={styles.infoItem}>
                                            <Badge
                                                status="default"
                                                text={
                                                    <span>
                                                        {i18n.global.t('Status.index.565893-16')}<Button type="link" style="padding: 0"
                                                            onClick={async () => {
                                                                const config: any = await getGatewayDetail(
                                                                    unref(gateway)?.id || '',
                                                                );
                                                                if (config.status === 200) {
                                                                    manualInspection({
                                                                        type: props.providerType,
                                                                        key: `gateway`,
                                                                        name: i18n.global.t('Status.index.565893-14'),
                                                                        desc: desc,
                                                                        data: { name: `${unref(device)?.accessProvider}${i18n.global.t('Status.index.565893-22')}` },
                                                                        configuration: { ...config.result },
                                                                    });
                                                                }
                                                            }}
                                                        >{i18n.global.t('Status.index.565893-17')}</Button>
                                                        {i18n.global.t('Status.index.565893-18')}
                                                        <PermissionButton
                                                            type="link"
                                                            style="padding: 0"
                                                            popConfirm={{
                                                                title: i18n.global.t('Status.index.565893-20'),
                                                                onConfirm:() => {
                                                                    list.value = modifyArrayList(
                                                                        list.value,
                                                                        {
                                                                            key: 'gateway',
                                                                            name: i18n.global.t('Status.index.565893-14'),
                                                                            desc: desc,
                                                                            status: 'success',
                                                                            text: i18n.global.t('Status.index.565893-2'),
                                                                            info: null,
                                                                        },
                                                                    );
                                                                }
                                                            }}
                                                        >
                                                            {i18n.global.t('Status.index.565893-20')}
                                                        </PermissionButton>
                                                    </span>
                                                }
                                            />
                                        </div>
                                    </div>
                                ),
                            };
                        } else {
                            _item = {
                                key: 'gateway',
                                name: i18n.global.t('Status.index.565893-14'),
                                desc: desc,
                                status: 'success',
                                text: i18n.global.t('Status.index.565893-2'),
                                info: null,
                            };
                        }
                    } else {
                        _item = {
                            key: 'gateway',
                            name: i18n.global.t('Status.index.565893-14'),
                            desc: desc,
                            status: 'error',
                            text: i18n.global.t('Status.index.565893-3'),
                            info: (
                                <div>
                                    <div class={styles.infoItem}>
                                        <Badge
                                            status="default"
                                            text={
                                                <span>
                                                    {i18n.global.t('Status.index.565893-21')}
                                                    <PermissionButton
                                                        hasPermission="link/AccessConfig:action"
                                                        type="link"
                                                        style="padding: 0"
                                                        popConfirm={{
                                                            title: i18n.global.t('Status.index.565893-5'),
                                                            onConfirm: async () => {
                                                                const _response =  await startGateway(unref(device).accessId || '');
                                                                if (_response.status === 200) {
                                                                    onlyMessage(i18n.global.t('Status.index.565893-6'));
                                                                    list.value = modifyArrayList(
                                                                        list.value,
                                                                        {
                                                                            key: 'gateway',
                                                                            name: i18n.global.t('Status.index.565893-14'),
                                                                            desc: desc,
                                                                            status: 'success',
                                                                            text: i18n.global.t('Status.index.565893-2'),
                                                                            info: null,
                                                                        },
                                                                    );
                                                                }
                                                                return _response
                                                            }
                                                        }}
                                                    >
                                                        {i18n.global.t('Status.index.565893-7')}
                                                    </PermissionButton>
                                                </span>
                                            }
                                        />
                                    </div>
                                </div>
                            ),
                        };
                    }
                    setTimeout(() => {
                        if (_item) {
                            list.value = modifyArrayList(list.value, _item);
                        }
                        resolve({});
                    }, time);
                }
            }
        })

        // 网关父设备
        const diagnoseParentDevice = () => new Promise(async (resolve) => {
            if (unref(device).state.value === 'online') {
                setTimeout(() => {
                    list.value = modifyArrayList(unref(list), {
                        key: 'parent-device',
                        name: i18n.global.t('Status.index.565893-23'),
                        desc: i18n.global.t('Status.index.565893-24'),
                        status: 'success',
                        text: i18n.global.t('Status.index.565893-2'),
                        info: null,
                    });
                    resolve({});
                }, time);
            } else {
                const _device = unref(device)
                if (!_device?.parentId) {
                    setTimeout(() => {
                        list.value = modifyArrayList(unref(list), {
                            key: 'parent-device',
                            name: i18n.global.t('Status.index.565893-23'),
                            desc: i18n.global.t('Status.index.565893-24'),
                            status: 'error',
                            text: i18n.global.t('Status.index.565893-3'),
                            info: (
                                <div>
                                    <div class={styles.infoItem}>
                                        <Badge
                                            status="default"
                                            text={
                                                <span>
                                                    {i18n.global.t('Status.index.565893-25')}
                                                    <Button type="link" style="padding: 0"
                                                        onClick={() => {
                                                            bindParentVisible.value = true
                                                        }}
                                                    >
                                                        {i18n.global.t('Status.index.565893-26')}
                                                    </Button>
                                                    {i18n.global.t('Status.index.565893-27')}
                                                </span>
                                            }
                                        />
                                    </div>
                                </div>
                            ),
                        });
                        resolve({});
                    }, time);
                } else {
                    let _item: ListProps | undefined = undefined;
                    const response = await detail(_device?.parentId);
                    parent.value = response.result
                    if (response.status === 200) {
                        if (response?.result?.state?.value === 'notActive') {
                            _item = {
                                key: 'parent-device',
                                name: i18n.global.t('Status.index.565893-23'),
                                desc: i18n.global.t('Status.index.565893-24'),
                                status: 'error',
                                text: i18n.global.t('Status.index.565893-23'),
                                info: (
                                    <div>
                                        <div class={styles.infoItem}>
                                            <Badge
                                                status="default"
                                                text={
                                                    <span>
                                                        {i18n.global.t('Status.index.565893-28')}
                                                        <PermissionButton
                                                            hasPermission="device/Product:action"
                                                            type="link"
                                                            style="padding: 0"
                                                            popConfirm={{
                                                                title: i18n.global.t('Status.index.565893-5'),
                                                                onConfirm: async () => {
                                                                    const _response =  await _deploy(response?.result?.id || '');
                                                                    if (_response.success) {
                                                                        onlyMessage(i18n.global.t('Status.index.565893-6'));
                                                                        list.value = modifyArrayList(
                                                                            list.value,
                                                                            {
                                                                                key: 'parent-device',
                                                                                name: i18n.global.t('Status.index.565893-23'),
                                                                                desc: i18n.global.t('Status.index.565893-24'),
                                                                                status: 'success',
                                                                                text: i18n.global.t('Status.index.565893-2'),
                                                                                info: null,
                                                                            },
                                                                        );
                                                                    }
                                                                   return _response
                                                                }
                                                            }}
                                                        >
                                                            {i18n.global.t('Status.index.565893-7')}
                                                        </PermissionButton>
                                                    </span>
                                                }
                                            />
                                        </div>
                                    </div>
                                ),
                            };
                        } else if (response?.result?.state?.value === 'online') {
                            _item = {
                                key: 'parent-device',
                                name: i18n.global.t('Status.index.565893-23'),
                                desc: i18n.global.t('Status.index.565893-24'),
                                status: 'success',
                                text: i18n.global.t('Status.index.565893-2'),
                                info: null,
                            };
                        } else {
                            _item = {
                                key: 'parent-device',
                                name: i18n.global.t('Status.index.565893-23'),
                                desc: i18n.global.t('Status.index.565893-24'),
                                status: 'error',
                                text: i18n.global.t('Status.index.565893-3'),
                                info: (
                                    <div>
                                        <div class={styles.infoItem}>
                                            <Badge
                                                status="default"
                                                text={<span>{i18n.global.t('Status.index.565893-29')}</span>}
                                            />
                                        </div>
                                    </div>
                                ),
                            };
                        }
                        setTimeout(() => {
                            if (_item) {
                                list.value = modifyArrayList(unref(list), _item);
                            }
                            resolve({});
                        }, time);
                    }
                }
            }
        })

        // 产品状态
        const diagnoseProduct = () => new Promise(async (resolve) => {
            if (unref(device).state?.value === 'online') {
                setTimeout(() => {
                    list.value = modifyArrayList(unref(list), {
                        key: 'product',
                        name: i18n.global.t('Status.index.565893-30'),
                        desc: i18n.global.t('Status.index.565893-31'),
                        status: 'success',
                        text: i18n.global.t('Status.index.565893-2'),
                        info: null,
                    });
                    resolve({});
                }, time);
            } else {
                const _device = unref(device)
                if (_device.productId) {
                    const response: Record<string, any> = await queryProductState(_device.productId)
                    if (response.status === 200) {
                        product.value = response.result
                        let _item: ListProps | undefined = undefined
                        const state = response.result?.state
                        _item = {
                            key: 'product',
                            name: i18n.global.t('Status.index.565893-30'),
                            desc: i18n.global.t('Status.index.565893-31'),
                            status: state === 1 ? 'success' : 'error',
                            text: state === 1 ? i18n.global.t('Status.index.565893-2') : i18n.global.t('Status.index.565893-3'),
                            info:
                                state === 1 ? null : (
                                    <div>
                                        <div class={styles.infoItem}>
                                            <Badge
                                                status="default"
                                                text={
                                                    <span>
                                                       {i18n.global.t('Status.index.565893-32')}
                                                        <PermissionButton
                                                            hasPermission="device/Product:action"
                                                            type="link"
                                                            style="padding: 0"
                                                            popConfirm={{
                                                                title: i18n.global.t('Status.index.565893-5'),
                                                                onConfirm: async () => {
                                                                    const _response = await  _deployProduct(unref(device).productId || '');
                                                                    if (_response.status === 200) {
                                                                        onlyMessage(i18n.global.t('Status.index.565893-6'));
                                                                        list.value = modifyArrayList(
                                                                            list.value,
                                                                            {
                                                                                key: 'product',
                                                                                name: i18n.global.t('Status.index.565893-30'),
                                                                                desc: i18n.global.t('Status.index.565893-31'),
                                                                                status: 'success',
                                                                                text: i18n.global.t('Status.index.565893-2'),
                                                                                info: null,
                                                                            },
                                                                        );
                                                                    }
                                                                   return _response
                                                                }
                                                            }}
                                                        >
                                                            {i18n.global.t('Status.index.565893-7')}
                                                        </PermissionButton>
                                                        {i18n.global.t('Status.index.565893-33')}
                                                    </span>
                                                }
                                            />
                                        </div>
                                    </div>
                                ),
                        };
                        setTimeout(() => {
                            if (_item) {
                                list.value = modifyArrayList(unref(list), _item);
                            }
                            resolve({});
                        }, time);
                    }
                }
            }
        })

        // 设备状态
        const diagnoseDevice = () => new Promise(resolve => {
            const _device = unref(device)
            if (_device.state?.value === 'online') {
                setTimeout(() => {
                    list.value = modifyArrayList(unref(list), {
                        key: 'device',
                        name: i18n.global.t('Status.index.565893-34'),
                        desc: i18n.global.t('Status.index.565893-35'),
                        status: 'success',
                        text: i18n.global.t('Status.index.565893-2'),
                        info: null,
                    });
                    resolve({});
                }, time);
            } else {
                let item: ListProps | undefined = undefined;
                if (_device.state?.value === 'notActive') {
                    item = {
                        key: 'device',
                        name: i18n.global.t('Status.index.565893-34'),
                        desc: i18n.global.t('Status.index.565893-35'),
                        status: 'error',
                        text: i18n.global.t('Status.index.565893-3'),
                        info: (
                            <div>
                                <div class={styles.infoItem}>
                                    <Badge
                                        status="default"
                                        text={
                                            <span>
                                                {i18n.global.t('Status.index.565893-36')}
                                                <PermissionButton
                                                    hasPermission="device/Instance:action"
                                                    type="link"
                                                    style="padding: 0"
                                                    popConfirm={{
                                                        title: i18n.global.t('Status.index.565893-5'),
                                                        onConfirm: async () => {
                                                            const _response = await _deploy(unref(device)?.id || '');
                                                            if (_response.success) {
                                                                instanceStore.current.state = { value: 'offline', text: i18n.global.t('Status.index.565893-37') }
                                                                onlyMessage(i18n.global.t('Status.index.565893-6'));
                                                                list.value = modifyArrayList(
                                                                    list.value,
                                                                    {
                                                                        key: 'device',
                                                                        name: i18n.global.t('Status.index.565893-34'),
                                                                        desc: i18n.global.t('Status.index.565893-35'),
                                                                        status: 'success',
                                                                        text: i18n.global.t('Status.index.565893-2'),
                                                                        info: null,
                                                                    },
                                                                );
                                                            }
                                                            return _response
                                                        }
                                                    }}
                                                >
                                                    {i18n.global.t('Status.index.565893-7')}
                                                </PermissionButton>
                                                {i18n.global.t('Status.index.565893-38')}
                                            </span>
                                        }
                                    />
                                </div>
                            </div>
                        ),
                    };
                } else {
                    item = {
                        key: 'device',
                        name: i18n.global.t('Status.index.565893-34'),
                        desc: i18n.global.t('Status.index.565893-35'),
                        status: 'success',
                        text: i18n.global.t('Status.index.565893-2'),
                        info: null,
                    };
                }
                setTimeout(() => {
                    if (item) {
                        list.value = modifyArrayList(unref(list), item);
                    }
                    resolve({});
                }, time);
            }
        })

        // 产品认证配置
        const diagnoseProductAuthConfig = () => new Promise(async (resolve) => {
            const _device = unref(device)
            if (_device.productId) {
                const response: Record<string, any> = await queryProductConfig(_device.productId)
                if (response.status === 200 && response.result.length > 0) {
                    configuration.product = response.result;
                    const _configuration = unref(product)?.configuration || {};
                    response.result.map((item: any, i: number) => {
                        const _list = [...list.value];
                        if (!map(_list, 'key').includes(`product-auth${i}`)) {
                            list.value = modifyArrayList(
                                list.value,
                                {
                                    key: `product-auth${i}`,
                                    name: i18n.global.t('Status.index.565893-39', [item?.name]),
                                    desc: i18n.global.t('Status.index.565893-40', [item?.name]),
                                    status: 'loading',
                                    text: i18n.global.t('Status.index.565893-41'),
                                    info: null,
                                },
                                list.value.length,
                            );
                        }
                        const properties = map(item?.properties, 'property');
                        if (unref(device).state?.value === 'online') {
                            setTimeout(() => {
                                list.value = modifyArrayList(list.value, {
                                    key: `product-auth${i}`,
                                    name: i18n.global.t('Status.index.565893-39', [item?.name]),
                                    desc: i18n.global.t('Status.index.565893-40', [item?.name]),
                                    status: 'success',
                                    text: i18n.global.t('Status.index.565893-2'),
                                    info: null,
                                });
                                resolve({});
                            }, time);
                        } else if (
                            !isExit(
                                properties,
                                Object.keys(_configuration).filter((k: string) => !!_configuration[k]),
                            )
                        ) {
                            setTimeout(() => {
                                list.value = modifyArrayList(list.value, {
                                    key: `product-auth${i}`,
                                    name: i18n.global.t('Status.index.565893-39', [item?.name]),
                                    desc: i18n.global.t('Status.index.565893-40', [item?.name]),
                                    status: 'error',
                                    text: i18n.global.t('Status.index.565893-3'),
                                    info: (
                                        <div>
                                            <div class={styles.infoItem}>
                                                <Badge
                                                    status="default"
                                                    text={
                                                        <span>
                                                            {i18n.global.t('Status.index.565893-42')}
                                                            <Button type="link" style="padding: 0"
                                                                onClick={() => {
                                                                    jumpAccessConfig();
                                                                }}
                                                            >
                                                                {i18n.global.t('Status.index.565893-43')}
                                                            </Button>
                                                            {i18n.global.t('Status.index.565893-44')}
                                                            <PermissionButton
                                                                type="link"
                                                                style="padding: 0"
                                                                popConfirm={{
                                                                     title: i18n.global.t('Status.index.565893-19'),
                                                                     onConfirm:() => {
                                                                        list.value = modifyArrayList(
                                                                            list.value,
                                                                            {
                                                                                key: `product-auth${i}`,
                                                                                name: i18n.global.t('Status.index.565893-39', [item?.name]),
                                                                                desc: i18n.global.t('Status.index.565893-40', [item?.name]),
                                                                                status: 'success',
                                                                                text: i18n.global.t('Status.index.565893-2'),
                                                                                info: null,
                                                                            },
                                                                        );
                                                                    }
                                                                }}
                                                            >
                                                                {i18n.global.t('Status.index.565893-20')}
                                                            </PermissionButton>
                                                        </span>
                                                    }
                                                />
                                            </div>
                                        </div>
                                    ),
                                });
                                resolve({});
                            }, time);
                        } else {
                            setTimeout(() => {
                                list.value = modifyArrayList(list.value, {
                                    key: `product-auth${i}`,
                                    name: i18n.global.t('Status.index.565893-39', [item?.name]),
                                    desc: i18n.global.t('Status.index.565893-40', [item?.name]),
                                    status: 'warning',
                                    text: i18n.global.t('Status.index.565893-15'),
                                    info: (
                                        <div>
                                            <div class={styles.infoItem}>
                                                <Badge
                                                    status="default"
                                                    text={
                                                        <span>
                                                            {i18n.global.t('Status.index.565893-16')}
                                                            <Button type="link" style="padding: 0"
                                                                onClick={() => {
                                                                    manualInspection({
                                                                        type: 'product',
                                                                        key: `product-auth${i}`,
                                                                        name: i18n.global.t('Status.index.565893-39', [item?.name]),
                                                                        desc: i18n.global.t('Status.index.565893-40', [item?.name]),
                                                                        data: { ...item },
                                                                        configuration: _configuration,
                                                                        productId: unref(device).productId,
                                                                    });
                                                                }}
                                                            >
                                                                {i18n.global.t('Status.index.565893-17')}
                                                            </Button>
                                                            {i18n.global.t('Status.index.565893-45', [item.name])}
                                                            <PermissionButton
                                                                type="link"
                                                                style="padding: 0"
                                                                popConfirm={
                                                                    {
                                                                        title: i18n.global.t('Status.index.565893-19'),
                                                                        onConfirm:() => {
                                                                            list.value = modifyArrayList(
                                                                                list.value,
                                                                                {
                                                                                    key: `product-auth${i}`,
                                                                                    name: i18n.global.t('Status.index.565893-39', [item?.name]),
                                                                                    desc: i18n.global.t('Status.index.565893-40', [item?.name]),
                                                                                    status: 'success',
                                                                                    text: i18n.global.t('Status.index.565893-2'),
                                                                                    info: null,
                                                                                },
                                                                            );
                                                                        }
                                                                    }
                                                                }

                                                            >
                                                               {i18n.global.t('Status.index.565893-20')}
                                                            </PermissionButton>
                                                        </span>
                                                    }
                                                />
                                            </div>
                                        </div>
                                    ),
                                });
                                resolve({});
                            }, time);
                        }
                    });
                } else {
                    resolve({});
                }
            }
        })

        // 设备认证配置
        const diagnoseDeviceAuthConfig = () => new Promise(async (resolve) => {
            const _device = unref(device)
            if (_device.id) {
                const response: Record<string, any> = await queryDeviceConfig(_device.id)
                if (response.status === 200 && response.result.length > 0) {
                    configuration.device = response.result;
                    const _configuration = _device?.configuration || {};
                    response.result.map((item: any, i: number) => {
                        const _list = [...list.value];
                        if (!map(_list, 'key').includes(`device-auth${i}`)) {
                            list.value = modifyArrayList(
                                list.value,
                                {
                                    key: `device-auth${i}`,
                                    name: i18n.global.t('Status.index.565893-46', [item?.name]),
                                    desc: i18n.global.t('Status.index.565893-47', [item?.name]),
                                    status: 'loading',
                                    text: i18n.global.t('Status.index.565893-41'),
                                    info: null,
                                },
                                list.value.length,
                            );
                        }
                        const properties = map(item?.properties, 'property');
                        if (_device.state?.value === 'online') {
                            setTimeout(() => {
                                list.value = modifyArrayList(list.value, {
                                    key: `device-auth${i}`,
                                    name: i18n.global.t('Status.index.565893-46', [item?.name]),
                                    desc: i18n.global.t('Status.index.565893-47', [item?.name]),
                                    status: 'success',
                                    text: i18n.global.t('Status.index.565893-2'),
                                    info: null,
                                });
                                resolve({});
                            }, time);
                        } else if (
                            !isExit(
                                properties,
                                Object.keys(_configuration).filter((k: string) => !!_configuration[k]),
                            )
                        ) {
                            setTimeout(() => {
                                list.value = modifyArrayList(list.value, {
                                    key: `device-auth${i}`,
                                    name: i18n.global.t('Status.index.565893-46', [item?.name]),
                                    desc: i18n.global.t('Status.index.565893-47', [item?.name]),
                                    status: 'error',
                                    text: i18n.global.t('Status.index.565893-3'),
                                    info: (
                                        <div>
                                            <div class={styles.infoItem}>
                                                <Badge
                                                    status="default"
                                                    text={
                                                        <span>
                                                            {i18n.global.t('Status.index.565893-42')}
                                                            <Button type="link" style="padding: 0"
                                                                onClick={() => {
                                                                    jumpDeviceConfig();
                                                                }}
                                                            >
                                                                {i18n.global.t('Status.index.565893-43')}
                                                            </Button>
                                                            {i18n.global.t('Status.index.565893-44')}
                                                            <PermissionButton
                                                                type="link"
                                                                style="padding: 0"
                                                                popConfirm={{
                                                                     title: i18n.global.t('Status.index.565893-19'),
                                                                     onConfirm:() => {
                                                                        list.value = modifyArrayList(
                                                                            list.value,
                                                                            {
                                                                                key: `device-auth${i}`,
                                                                                name: i18n.global.t('Status.index.565893-46', [item?.name]),
                                                                                desc: i18n.global.t('Status.index.565893-47', [item?.name]),
                                                                                status: 'success',
                                                                                text: i18n.global.t('Status.index.565893-2'),
                                                                                info: null,
                                                                            },
                                                                        );
                                                                    }}
                                                                }
                                                            >
                                                               {i18n.global.t('Status.index.565893-20')}
                                                            </PermissionButton>
                                                        </span>
                                                    }
                                                />
                                            </div>
                                        </div>
                                    ),
                                });
                                resolve({});
                            }, time);
                        } else {
                            setTimeout(() => {
                                list.value = modifyArrayList(list.value, {
                                    key: `device-auth${i}`,
                                    name: i18n.global.t('Status.index.565893-46', [item?.name]),
                                    desc: i18n.global.t('Status.index.565893-47', [item?.name]),
                                    status: 'warning',
                                    text: i18n.global.t('Status.index.565893-15'),
                                    info: (
                                        <div>
                                            <div class={styles.infoItem}>
                                                <Badge
                                                    status="default"
                                                    text={
                                                        <span>
                                                            {i18n.global.t('Status.index.565893-16')}
                                                            <Button type="link" style="padding: 0"
                                                                onClick={() => {
                                                                    manualInspection({
                                                                        type: 'device',
                                                                        key: `device-auth${i}`,
                                                                        name: i18n.global.t('Status.index.565893-46', [item?.name]),
                                                                        desc: i18n.global.t('Status.index.565893-47', [item?.name]),
                                                                        data: { ...item },
                                                                        configuration: _configuration,
                                                                        productId: unref(device).productId,
                                                                    });
                                                                }}
                                                            >
                                                                {i18n.global.t('Status.index.565893-17')}
                                                            </Button>
                                                            {i18n.global.t('Status.index.565893-48', [item.name])}
                                                            <PermissionButton
                                                                type="link"
                                                                style="padding: 0"
                                                                popConfirm={{
                                                                      title: i18n.global.t('Status.index.565893-19'),
                                                                      onConfirm:() => {
                                                                        list.value = modifyArrayList(
                                                                            list.value,
                                                                            {
                                                                                key: `device-auth${i}`,
                                                                                name: i18n.global.t('Status.index.565893-46', [item?.name]),
                                                                                desc: i18n.global.t('Status.index.565893-47', [item?.name]),
                                                                                status: 'success',
                                                                                text: i18n.global.t('Status.index.565893-2'),
                                                                                info: null,
                                                                            },
                                                                        );
                                                                    }}
                                                                }
                                                            >
                                                                {i18n.global.t('Status.index.565893-20')}
                                                            </PermissionButton>
                                                        </span>
                                                    }
                                                />
                                            </div>
                                        </div>
                                    ),
                                });
                                resolve({});
                            }, time);
                        }
                    });
                } else {
                    resolve({});
                }
            }
        })

        // onenet
        const diagnoseOnenet = () => new Promise(async (resolve) => {
            const _device = unref(device)
            if (_device?.accessProvider === 'OneNet') {
                const response: any = await queryDeviceConfig(_device?.id || '');
                configuration.device = response.result;
                const _configuration = _device?.configuration || {};
                let item: ListProps | undefined = undefined;
                if (
                    _device.configuration?.onenet_imei ||
                    _device.configuration?.onenet_imsi ||
                    (unref(product)?.configuration &&
                        unref(product)?.configuration['api-key'])
                ) {
                    item = {
                        key: `onenet`,
                        name: i18n.global.t('Status.index.565893-49'),
                        desc: i18n.global.t('Status.index.565893-50'),
                        status: 'warning',
                        text: i18n.global.t('Status.index.565893-15'),
                        info: (
                            <div>
                                <div class={styles.infoItem}>
                                    {i18n.global.t('Status.index.565893-16')}
                                    <Button type="link" style="padding: 0"
                                        onClick={() => {
                                            manualInspection({
                                                type: 'device',
                                                key: `onenet`,
                                                name: i18n.global.t('Status.index.565893-49'),
                                                desc: i18n.global.t('Status.index.565893-50'),
                                                data: { ...response.result[0] },
                                                configuration: _configuration,
                                            });
                                        }}
                                    >
                                        {i18n.global.t('Status.index.565893-17')}
                                    </Button>
                                    {i18n.global.t('Status.index.565893-51')}
                                    <PermissionButton
                                        type="link"
                                        style="padding: 0"
                                        popConfirm={{
                                            title: i18n.global.t('Status.index.565893-19'),
                                            onConfirm:() => {
                                                list.value = modifyArrayList(list.value, {
                                                    key: `onenet`,
                                                    name: i18n.global.t('Status.index.565893-49'),
                                                    desc: i18n.global.t('Status.index.565893-50'),
                                                    status: 'success',
                                                    text: i18n.global.t('Status.index.565893-2'),
                                                    info: null,
                                                });
                                            }}
                                        }
                                    >
                                        {i18n.global.t('Status.index.565893-20')}
                                    </PermissionButton>
                                </div>
                            </div>
                        ),
                    };
                } else {
                    item = {
                        key: `onenet`,
                        name: i18n.global.t('Status.index.565893-49'),
                        desc: i18n.global.t('Status.index.565893-50'),
                        status: 'error',
                        text: i18n.global.t('Status.index.565893-3'),
                        info: (
                            <div>
                                <div class={styles.infoItem}>
                                    {i18n.global.t('Status.index.565893-42')}
                                    <Button type="link" style="padding: 0"
                                        onClick={() => {
                                            jumpDeviceConfig();
                                        }}
                                    >
                                        {i18n.global.t('Status.index.565893-43')}
                                    </Button>
                                    {i18n.global.t('Status.index.565893-44')}
                                    <PermissionButton
                                        title={i18n.global.t('Status.index.565893-19')}
                                        type="link"
                                        style="padding: 0"
                                        onConfirm={() => {
                                            list.value = modifyArrayList(list.value, {
                                                key: `onenet`,
                                                name: i18n.global.t('Status.index.565893-49'),
                                                desc: i18n.global.t('Status.index.565893-50'),
                                                status: 'success',
                                                text: i18n.global.t('Status.index.565893-2'),
                                                info: null,
                                            });
                                        }}
                                    >
                                        {i18n.global.t('Status.index.565893-20')}
                                    </PermissionButton>
                                </div>
                            </div>
                        ),
                    };
                }
                setTimeout(() => {
                    if (item) {
                        list.value = modifyArrayList(
                            list.value,
                            item,
                            list.value.length,
                        );
                    }
                    resolve({});
                }, time);
            } else {
                resolve({});
            }
        })

        // ctwing
        const diagnoseCTWing = () => new Promise(async (resolve) => {
            const _device = unref(device)
            if (_device?.accessProvider === 'Ctwing') {
                const response: any = await queryDeviceConfig(_device?.id || '');
                configuration.device = response.result;
                const _configuration = _device?.configuration || {};
                let item: ListProps | undefined = undefined;
                const config = unref(product)?.configuration;
                if (
                    _device.configuration?.ctwing_imei ||
                    _device.configuration?.ctwing_imsi ||
                    (config && (config.ctwing_product_id || config.master_key))
                ) {
                    item = {
                        key: `ctwing`,
                        name: i18n.global.t('Status.index.565893-52'),
                        desc: i18n.global.t('Status.index.565893-53'),
                        status: 'warning',
                        text: i18n.global.t('Status.index.565893-15'),
                        info: (
                            <div>
                                <div class={styles.infoItem}>
                                    {i18n.global.t('Status.index.565893-16')}
                                    <Button type="link" style="padding: 0"
                                        onClick={() => {
                                            manualInspection({
                                                type: 'device',
                                                key: `ctwing`,
                                                name: i18n.global.t('Status.index.565893-52'),
                                                desc: i18n.global.t('Status.index.565893-53'),
                                                data: { ...response.result[0] },
                                                configuration: _configuration,
                                            });
                                        }}
                                    >
                                        {i18n.global.t('Status.index.565893-17')}
                                    </Button>
                                    {i18n.global.t('Status.index.565893-54')}
                                    <PermissionButton
                                        type="link"
                                        style="padding: 0"
                                        popConfirm={{
                                            title: i18n.global.t('Status.index.565893-19'),
                                            onConfirm:() => {
                                                list.value = modifyArrayList(list.value, {
                                                    key: `ctwing`,
                                                    name: i18n.global.t('Status.index.565893-52'),
                                                    desc: i18n.global.t('Status.index.565893-53'),
                                                    status: 'success',
                                                    text: i18n.global.t('Status.index.565893-2'),
                                                    info: null,
                                                });
                                            }
                                        }}
                                    >
                                        {i18n.global.t('Status.index.565893-20')}
                                    </PermissionButton>
                                </div>
                            </div>
                        ),
                    };
                } else {
                    item = {
                        key: `ctwing`,
                        name: i18n.global.t('Status.index.565893-52'),
                        desc: i18n.global.t('Status.index.565893-53'),
                        status: 'error',
                        text: i18n.global.t('Status.index.565893-3'),
                        info: (
                            <div>
                                <div class={styles.infoItem}>
                                    {i18n.global.t('Status.index.565893-42')}
                                    <Button type="link" style="padding: 0"
                                        onClick={() => {
                                            jumpDeviceConfig();
                                        }}
                                    >
                                        {i18n.global.t('Status.index.565893-43')}
                                    </Button>
                                    {i18n.global.t('Status.index.565893-44')}
                                    <PermissionButton
                                        type="link"
                                        style="padding: 0"
                                        popConfirm={
                                            {
                                                title: i18n.global.t('Status.index.565893-19'),
                                                onConfirm:() => {
                                                    list.value = modifyArrayList(list.value, {
                                                        key: `ctwing`,
                                                        name: i18n.global.t('Status.index.565893-52'),
                                                        desc: i18n.global.t('Status.index.565893-53'),
                                                        status: 'success',
                                                        text: i18n.global.t('Status.index.565893-2'),
                                                        info: null,
                                                    });
                                                }
                                            }
                                        }

                                    >
                                        {i18n.global.t('Status.index.565893-20')}
                                    </PermissionButton>
                                </div>
                            </div>
                        ),
                    };
                }
                setTimeout(() => {
                    if (item) {
                        list.value = modifyArrayList(
                            list.value,
                            item,
                            list.value.length,
                        );
                    }
                    resolve({});
                }, time);
            } else {
                resolve({});
            }
        })

        const diagnoseNetworkOtherConfig = async () => {
            if (unref(device).state?.value != 'online') {
                const item: VNode[] = [];
                let info: any = {
                    id: unref(device).id,
                };
                item.push(<Badge status="default" text={i18n.global.t('Status.index.565893-55')} />);
                if (props.providerType === 'network') {
                    item.push(
                        <Badge
                            status="default"
                            style={{wordBreak: 'break-all'}}
                            text={
                                (unref(gateway)?.channelInfo?.addresses || []).length > 1 ? (
                                    <>
                                        {i18n.global.t('Status.index.565893-56')}
                                        <div class="serverItem">
                                            {(unref(gateway)?.channelInfo?.addresses || []).map((i: any) => (
                                                <span style={{ marginLeft: 15 }} key={i.address}>
                                                    <Badge color={i.health === -1 ? 'red' : 'green'} />
                                                    {i.address}
                                                </span>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {i18n.global.t('Status.index.565893-57')}
                                        {(unref(gateway)?.channelInfo?.addresses || []).map((i: any) => (
                                            <span style={{ marginLeft: 15 }} key={i.address}>
                                                <Badge color={i.health === -1 ? 'red' : 'green'} />
                                                {i.address}
                                            </span>
                                        ))}
                                    </>
                                )
                            }
                        />,
                    );
                    if (
                        unref(device)?.protocol &&
                        unref(device)?.accessProvider &&
                        gatewayList.includes(unref(device).accessProvider as string)
                    ) {
                        const response: any = await queryProtocolDetail(unref(device).protocol, 'MQTT');
                        if (response.status === 200) {
                            if ((response.result?.routes || []).length > 0) {
                                item.push(
                                    <Badge
                                        status="default"
                                        style={{wordBreak: 'break-all'}}
                                        text={
                                            <span>
                                                {i18n.global.t('Status.index.565893-58')}
                                                <Button type="link" style="padding: 0"
                                                    onClick={() => {
                                                        jumpAccessConfig();
                                                    }}
                                                >
                                                    {i18n.global.t('Status.index.565893-59')}
                                                </Button>
                                                {i18n.global.t('Status.index.565893-60', [urlMap.get(unref(device)?.accessProvider) || ''])}
                                            </span>
                                        }
                                    />,
                                );
                            } else {
                                item.push(
                                    <Badge
                                        status="default"
                                        style={{wordBreak: 'break-all'}}
                                        text={
                                            <span>
                                                {i18n.global.t('Status.index.565893-61', [urlMap.get(unref(device)?.accessProvider) || ''])}
                                            </span>
                                        }
                                    />,
                                );
                            }
                        }
                    }
                    info = {
                        ...info,
                        address: unref(gateway)?.channelInfo?.addresses || [],
                        config: configuration.device || [],
                    };
                } else if (props.providerType === 'child-device') {
                    if (unref(device)?.accessProvider === 'gb28181-2016') {
                        const address = unref(gateway)?.channelInfo?.addresses[0];
                        if (address) {
                            item.push(
                                <Badge
                                    status="default"
                                    style={{wordBreak: 'break-all'}}
                                    text={
                                        <span>
                                            {i18n.global.t('Status.index.565893-62', [' '])}
                                            <span style={{ marginLeft: 15 }}>
                                                <Badge color={address.health === -1 ? 'red' : 'green'} />
                                                {address.address}
                                            </span>
                                        </span>
                                    }
                                />,
                            );
                            info = {
                                ...info,
                                address: [address] || [],
                            };
                        }
                    }
                } else if (props.providerType === 'media') {
                    if (unref(device)?.accessProvider === 'gb28181-2016') {
                        const address = unref(gateway)?.channelInfo?.addresses[0];
                        if (address) {
                            item.push(
                                <Badge
                                    status="default"
                                    style={{wordBreak: 'break-all'}}
                                    text={
                                        <span>
                                            {i18n.global.t('Status.index.565893-62', [' '])}
                                            <span style={{ marginLeft: 15 }}>
                                                <Badge color={address.health === -1 ? 'red' : 'green'} />
                                                {address.address}
                                            </span>
                                        </span>
                                    }
                                />,
                            );
                            info = {
                                ...info,
                                address: [address] || [],
                            };
                        }
                    }
                } else if (props.providerType === 'cloud') {
                    item.push(
                        <Badge
                            status="default"
                            style={{wordBreak: 'break-all'}}
                            text={i18n.global.t('Status.index.565893-63')}
                        />,
                    );
                    item.push(<Badge status="default" text={i18n.global.t('Status.index.565893-64')} />);
                } else if (props.providerType === 'channel') {
                }
                info = {
                    ...info,
                    configValue: unref(device)?.configuration || {},
                };
                diagnoseData.value = {
                    list: [...item],
                    info,
                }
                diagnoseVisible.value = true
            } else {
                emit('stateChange', 'success')
            }
        };

        const handleSearch = async () => {
            emit('percentChange', 0)
            emit('countChange', 0)
            emit('stateChange', 'loading')
            status.value = 'loading'
            const { providerType } = props
            let arr: any[] = [];
            if (providerType === 'network') {
                list.value = [...networkInitList];
                arr = [
                    diagnoseNetwork,
                    diagnoseGateway,
                    diagnoseProduct,
                    diagnoseDevice,
                    diagnoseProductAuthConfig,
                    diagnoseDeviceAuthConfig,
                ];
            } else if (providerType === 'child-device') {
                list.value = [...childInitList];
                arr = [
                    diagnoseGateway,
                    diagnoseParentDevice,
                    diagnoseProduct,
                    diagnoseDevice,
                    diagnoseProductAuthConfig,
                    diagnoseDeviceAuthConfig,
                ];
            } else if (providerType === 'media') {
                list.value = [...mediaInitList];
                arr = [diagnoseGateway, diagnoseProduct, diagnoseDevice];
            } else if (providerType === 'cloud') {
                list.value = [...cloudInitList];
                arr = [diagnoseGateway, diagnoseProduct, diagnoseDevice, diagnoseCTWing, diagnoseOnenet];
            } else if (providerType === 'channel') {
                onlyMessage(i18n.global.t('Status.index.565893-65'), 'error');
                return;
            }
            if (arr.length > 0) {
                for (let i = 0; i < arr.length; i++) {
                    await arr[i]();
                    emit('percentChange')
                }
                emit('percentChange', 100)
                status.value = 'finish'
            }
        }

        watch(() => props.providerType, (newVal) => {
            if (newVal) {
                device.value = instanceStore.current
                handleSearch()
            }
        }, { deep: true, immediate: true })

        watch(() => [list, status], () => {
            if (status.value === 'finish') {
                const _list = uniq(map(unref(list), 'status'));
                if (unref(device).state?.value !== 'online') {
                    emit('stateChange', 'error')
                    if (_list[0] === 'success' && _list.length === 1) {
                        diagnoseNetworkOtherConfig();
                    }
                } else {
                    emit('stateChange', 'success')
                }
            } else if (status.value === 'loading') {
                const arr = map(unref(list), 'status').filter((i) => i !== 'loading');
                emit('countChange', arr.length)
            }
        }, { deep: true, immediate: true })

        return () => <div class={styles['statusBox']}>
            <div class={styles["statusHeader"]}>
                <TitleComponent data={i18n.global.t('Status.index.565893-66')} />
                <Space>
                    {
                        status.value === 'finish' && unref(device).state?.value !== 'online' && <Button type="primary" onClick={async () => {
                            let flag: boolean = true;
                            if (
                                Object.keys(unref(gateway)).length > 0 &&
                                unref(gateway)?.state?.value !== 'enabled'
                            ) {
                                const resp = await startGateway(unref(device).accessId || '');
                                if (resp.status === 200) {
                                    list.value = modifyArrayList(list.value, {
                                        key: 'gateway',
                                        name: i18n.global.t('Status.index.565893-14'),
                                        desc: i18n.global.t('Status.index.565893-13'),
                                        status: 'success',
                                        text: i18n.global.t('Status.index.565893-2'),
                                        info: null,
                                    });
                                } else {
                                    flag = false;
                                }
                            }
                            if (unref(product)?.state !== 1) {
                                const resp = await _deployProduct(unref(device).productId || '');
                                if (resp.status === 200) {
                                    list.value = modifyArrayList(list.value, {
                                        key: 'product',
                                        name: i18n.global.t('Status.index.565893-30'),
                                        desc: i18n.global.t('Status.index.565893-31'),
                                        status: 'success',
                                        text: i18n.global.t('Status.index.565893-2'),
                                        info: null,
                                    });
                                } else {
                                    flag = false;
                                }
                            }
                            if (unref(device)?.state?.value === 'notActive') {
                                const resp = await _deploy(unref(device)?.id || '');
                                if (resp.status === 200) {
                                    unref(device).state = { value: 'offline', text: i18n.global.t('Status.index.565893-37') };
                                    list.value = modifyArrayList(list.value, {
                                        key: 'device',
                                        name: i18n.global.t('Status.index.565893-34'),
                                        desc: i18n.global.t('Status.index.565893-35'),
                                        status: 'success',
                                        text: i18n.global.t('Status.index.565893-2'),
                                        info: null,
                                    });
                                } else {
                                    flag = false;
                                }
                            }
                            if (props.providerType === 'network' || props.providerType === 'child-device') {
                                const address = unref(gateway)?.channelInfo?.addresses || [];
                                const _label = address.some((i: any) => i.health === -1);
                                const __label = address.every((i: any) => i.health === 1);
                                const health = _label ? -1 : __label ? 1 : 0;
                                if (health === -1 && unref(gateway)?.channelId) {
                                    const res = await startNetwork(unref(gateway)?.channelId);
                                    if (res.status === 200) {
                                        list.value = modifyArrayList(list.value, {
                                            key: 'network',
                                            name: i18n.global.t('Status.index.565893-0'),
                                            desc: i18n.global.t('Status.index.565893-1'),
                                            status: 'success',
                                            text: i18n.global.t('Status.index.565893-2'),
                                            info: null,
                                        });
                                    } else {
                                        flag = false;
                                    }
                                }
                            }
                            if (props.providerType === 'child-device' && unref(device)?.parentId) {
                                if (unref(parent)?.state?.value === 'notActive') {
                                    const resp = await _deploy(unref(device)?.parentId || '');
                                    if (resp.status === 200) {
                                        list.value = modifyArrayList(list.value, {
                                            key: 'parent-device',
                                            name: i18n.global.t('Status.index.565893-23'),
                                            desc: i18n.global.t('Status.index.565893-24'),
                                            status: 'success',
                                            text: i18n.global.t('Status.index.565893-2'),
                                            info: null,
                                        });
                                    } else {
                                        flag = false;
                                    }
                                }
                            }
                            if (flag) {
                                onlyMessage(i18n.global.t('Status.index.565893-6'));
                            }
                        }}>{i18n.global.t('Status.index.565893-67')}</Button>
                    }
                    <Button onClick={() => {
                        handleSearch()
                    }}>{i18n.global.t('Status.index.565893-68')}</Button>
                </Space>
            </div>
            <div class={styles["statusContent"]}>
                {
                    list.value.map(item => (
                        <div key={item.key} class={styles["statusItem"]}>
                            <div class={styles["statusLeft"]}>
                                <div class={styles["statusImg"]}>
                                    <img
                                        style={{ height: 32 }}
                                        class={item.status === 'loading' ? styles.loading : {}}
                                        src={StatusMap.get(item.status)}
                                    />
                                </div>
                                <div class={styles["statusContext"]}>
                                    <div class={styles.statusTitle}>{item?.name}</div>
                                    <div class={styles.statusDesc}>{item.desc}</div>
                                    <div class={styles.info}>{item?.info}</div>
                                </div>
                            </div>
                            <div class={styles["statusRight"]} style={{ color: TextColorMap.get(item.status) }}>
                                {item?.text}
                            </div>
                        </div>
                    ))
                }
            </div>
            {
                diagnoseVisible.value && <DiagnosticAdvice
                    data={diagnoseData.value}
                    onClose={() => {
                        diagnoseVisible.value = false
                    }}
                />
            }
            {artificialVisible.value && (
                <ManualInspection
                    data={artificialData.value}
                    onClose={() => {
                        artificialVisible.value = false
                    }}
                    onSave={(params: any) => {
                        list.value = modifyArrayList(list.value, {
                            key: params.key,
                            name: params.name,
                            desc: params.desc,
                            status: 'success',
                            text: i18n.global.t('Status.index.565893-2'),
                            info: null,
                        });
                        artificialVisible.value = false
                    }}
                />
            )}
            {
                bindParentVisible.value && (
                    <BindParentDevice
                        data={device.value}
                        onCancel={() => {
                            bindParentVisible.value = false
                        }}
                        onOk={async (parentId: string) => {
                            let item: ListProps | undefined = undefined;
                            const response = await detail(parentId);
                            if (response.status === 200) {
                                if (response?.result?.state?.value === 'notActive') {
                                    item = {
                                        key: 'parent-device',
                                        name: i18n.global.t('Status.index.565893-23'),
                                        desc: i18n.global.t('Status.index.565893-24'),
                                        status: 'error',
                                        text: i18n.global.t('Status.index.565893-3'),
                                        info: (
                                            <div>
                                                <div class={styles.infoItem}>
                                                    <Badge
                                                        status="default"
                                                        text={
                                                            <span>
                                                                {i18n.global.t('Status.index.565893-28')}
                                                                <PermissionButton
                                                                    hasPermission="device/Product:action"
                                                                    type="link"
                                                                    style="padding: 0"
                                                                    popConfirm={{
                                                                        title: i18n.global.t('Status.index.565893-5'),
                                                                        onConfirm:  async () => {
                                                                            const _response = await  _deploy(response?.result?.id || '');
                                                                            if (_response.success) {
                                                                                onlyMessage(i18n.global.t('Status.index.565893-6'));
                                                                                list.value = modifyArrayList(
                                                                                    list.value,
                                                                                    {
                                                                                        key: 'parent-device',
                                                                                        name: i18n.global.t('Status.index.565893-23'),
                                                                                        desc: i18n.global.t('Status.index.565893-24'),
                                                                                        status: 'success',
                                                                                        text: i18n.global.t('Status.index.565893-2'),
                                                                                        info: null,
                                                                                    },
                                                                                );
                                                                            }
                                                                            return _response
                                                                        }
                                                                    }}
                                                                >
                                                                    {i18n.global.t('Status.index.565893-7')}
                                                                </PermissionButton>
                                                            </span>
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        ),
                                    };
                                } else if (response?.state?.value === 'online') {
                                    item = {
                                        key: 'parent-device',
                                        name: i18n.global.t('Status.index.565893-23'),
                                        desc: i18n.global.t('Status.index.565893-24'),
                                        status: 'success',
                                        text: i18n.global.t('Status.index.565893-2'),
                                        info: null,
                                    };
                                } else {
                                    item = {
                                        key: 'parent-device',
                                        name: i18n.global.t('Status.index.565893-23'),
                                        desc: i18n.global.t('Status.index.565893-24'),
                                        status: 'error',
                                        text: i18n.global.t('Status.index.565893-3'),
                                        info: (
                                            <div>
                                                <div class={styles.infoItem}>
                                                    <Badge
                                                        status="default"
                                                        text={<span>{i18n.global.t('Status.index.565893-29')}</span>}
                                                    />
                                                </div>
                                            </div>
                                        ),
                                    };
                                }
                                if (item) {
                                    list.value = modifyArrayList(unref(list), item);
                                }
                                instanceStore.current.parentId = parentId;
                                bindParentVisible.value = false
                            }
                        }}
                    />
                )
            }
        </div>
    },
})

export default Status
