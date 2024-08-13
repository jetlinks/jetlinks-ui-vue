import { Badge, Button, Popconfirm, Space } from "jetlinks-ui-components"
import TitleComponent from '@/components/TitleComponent/index.vue'
import styles from './index.module.less'
import type { ListProps } from './util'
import { networkInitList, childInitList, cloudInitList, mediaInitList, TextColorMap, StatusMap, modifyArrayList, isExit, gatewayList, urlMap } from './util'
import { useInstanceStore } from "@/store/instance"
import { startNetwork, startGateway, getGatewayDetail, queryGatewayState, queryProtocolDetail, detail, queryProductState, queryProductConfig, queryDeviceConfig, _deploy } from '@/api/device/instance'
import { PropType, VNode } from "vue"
import { _deploy as _deployProduct } from "@/api/device/product"
import _ from "lodash-es"
import DiagnosticAdvice from './DiagnosticAdvice'
import ManualInspection from './ManualInspection'
import { deployDevice } from "@/api/initHome"
import PermissionButton from '@/components/PermissionButton/index.vue'
import { useMenuStore } from "@/store/menu"
import BindParentDevice from '../../components/BindParentDevice/index.vue'
import { onlyMessage } from "@/utils/comm"
import i18n from '@/i18n'
const $t = i18n.global.t

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
        const parent = ref<Partial<Record<string, any>>>({}) // 父{$t('Status.index.585606-38')}
        const product = ref<Partial<Record<string, any>>>({}) // {$t('Status.index.585606-33')}

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
            menuStory.jumpPage('device/Product/Detail', { id: unref(device).productId, tab: 'Device' });
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
                        name: $t('Status.index.585606-0'),
                        desc: $t('Status.index.585606-1'),
                        status: 'success',
                        text: $t('Status.index.585606-2'),
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
                                name: $t('Status.index.585606-0'),
                                desc: $t('Status.index.585606-1'),
                                status: 'success',
                                text: $t('Status.index.585606-2'),
                                info: null,
                            };
                        } else {
                            _item = {
                                key: 'network',
                                name: $t('Status.index.585606-0'),
                                desc: $t('Status.index.585606-1'),
                                status: 'error',
                                text: $t('Status.index.585606-3'),
                                info: health === -1 ? (
                                    <div>
                                        <div class={styles.infoItem}>
                                            <Badge
                                                status="default"
                                                text={
                                                    <span>{$t('Status.index.585606-4')}
                                                        <PermissionButton
                                                            type="link"
                                                            style="padding: 0"
                                                            hasPermission="link/Type:action"
                                                            popConfirm={{
                                                                title: $t('Status.index.585606-5'),
                                                                onConfirm:  () => {
                                                                    const response =  startNetwork(
                                                                        unref(gateway)?.channelId,
                                                                    );
                                                                    response.then((res)=>{
                                                                        if (res.status === 200) {
                                                                            onlyMessage($t('Status.index.585606-6'));
                                                                            list.value = modifyArrayList(
                                                                                list.value,
                                                                                {
                                                                                    key: 'network',
                                                                                    name: $t('Status.index.585606-0'),
                                                                                    desc: $t('Status.index.585606-1'),
                                                                                    status: 'success',
                                                                                    text: $t('Status.index.585606-2'),
                                                                                    info: null,
                                                                                },
                                                                            );
                                                                        }
                                                                    })
                                                                  return response
                                                                }
                                                            }}
                                                        >
                                                            {$t('Status.index.585606-7')}
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
                                                text={$t('Status.index.585606-8')}
                                            />
                                        </div>
                                        <div class={styles.infoItem}>
                                            <Badge
                                                status="default"
                                                text={$t('Status.index.585606-9')}
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
                        onlyMessage($t('Status.index.585606-10'), 'error')
                    }
                } else {
                    onlyMessage($t('Status.index.585606-11'), 'error')
                }
            }
        })

        // {$t('Status.index.585606-14')}
        const diagnoseGateway = () => new Promise(async (resolve) => {
            const desc = props.providerType && ['child-device', 'cloud'].includes(props.providerType)
                ? $t('Status.index.585606-12')
                : $t('Status.index.585606-13');
            if (unref(device).state.value === 'online') {
                setTimeout(() => {
                    list.value = modifyArrayList(list.value, {
                        key: 'gateway',
                        name: $t('Status.index.585606-14'),
                        desc: desc,
                        status: 'success',
                        text: $t('Status.index.585606-2'),
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
                                        name: $t('Status.index.585606-14'),
                                        desc: desc,
                                        status: 'warning',
                                        text: $t('Status.index.585606-15'),
                                        info: (
                                            <div>
                                                <div class={styles.infoItem}>
                                                    <Badge
                                                        status="default"
                                                        text={
                                                            <span>
                                                                {$t('Status.index.585606-16')}<Button type="link" style="padding: 0" onClick={async () => {
                                                                    const config: any = await getGatewayDetail(
                                                                        response.result?.id || '',
                                                                    );
                                                                    if (config.status === 200) {
                                                                        manualInspection({
                                                                            type: props.providerType,
                                                                            key: `gateway`,
                                                                            name: $t('Status.index.585606-14'),
                                                                            desc: desc,
                                                                            data: { name: $t('Status.index.585606-17', [unref(device)?.accessProvider]) },
                                                                            configuration: { ...config.result },
                                                                        });
                                                                    }
                                                                }}>{$t('Status.index.585606-18')}</Button>{$t('Status.index.585606-19')}
                                                                <PermissionButton
                                                                    
                                                                    type="link"
                                                                    style="padding: 0"
                                                                    popConfirm={{
                                                                        title:$t('Status.index.585606-20'),
                                                                        onConfirm:() => {
                                                                            list.value = modifyArrayList(
                                                                                list.value,
                                                                                {
                                                                                    key: 'gateway',
                                                                                    name: $t('Status.index.585606-14'),
                                                                                    desc: desc,
                                                                                    status: 'success',
                                                                                    text: $t('Status.index.585606-2'),
                                                                                    info: null,
                                                                                },
                                                                            );
                                                                        }
                                                                    }}
                                                                >
                                                                    {$t('Status.index.585606-21')}
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
                                        name: $t('Status.index.585606-14'),
                                        desc: desc,
                                        status: 'success',
                                        text: $t('Status.index.585606-2'),
                                        info: null,
                                    };
                                }
                            } else {
                                _item = {
                                    key: 'gateway',
                                    name: $t('Status.index.585606-14'),
                                    desc: desc,
                                    status: 'error',
                                    text: $t('Status.index.585606-3'),
                                    info: (
                                        <div>
                                            <div class={styles.infoItem}>
                                                <Badge
                                                    status="default"
                                                    text={<span>{$t('Status.index.585606-22')}
                                                        <PermissionButton
                                                            hasPermission="link/Type:action"
                                                            type="link"
                                                            style="padding: 0"
                                                            popConfirm={{
                                                                title: $t('Status.index.585606-5'),
                                                                onConfirm:  () => {
                                                                    const response =  startGateway(unref(device).accessId || '');
                                                                    response.then((resp)=>{
                                                                        if (resp.status === 200) {
                                                                            onlyMessage($t('Status.index.585606-6'));
                                                                            list.value = modifyArrayList(
                                                                                list.value,
                                                                                {
                                                                                    key: 'gateway',
                                                                                    name: $t('Status.index.585606-14'),
                                                                                    desc: desc,
                                                                                    status: 'success',
                                                                                    text: $t('Status.index.585606-2'),
                                                                                    info: null,
                                                                                },
                                                                            );
                                                                        }
                                                                    })
                                                                    return response
                                                                }
                                                            }}
                                                        >
                                                            {$t('Status.index.585606-7')}
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
                            onlyMessage($t('Status.index.585606-10'), 'error')
                        }
                    } else {
                        onlyMessage($t('Status.index.585606-11'), 'error')
                    }
                } else {
                    if (unref(gateway)?.state?.value === 'enabled') {
                        if (props.providerType === 'cloud' || unref(device)?.accessProvider === 'gb28181-2016') {
                            _item = {
                                key: 'gateway',
                                name: $t('Status.index.585606-14'),
                                desc: desc,
                                status: 'warning',
                                text: $t('Status.index.585606-15'),
                                info: (
                                    <div>
                                        <div class={styles.infoItem}>
                                            <Badge
                                                status="default"
                                                text={
                                                    <span>
                                                        {$t('Status.index.585606-16')}<Button type="link" style="padding: 0"
                                                            onClick={async () => {
                                                                const config: any = await getGatewayDetail(
                                                                    unref(gateway)?.id || '',
                                                                );
                                                                if (config.status === 200) {
                                                                    manualInspection({
                                                                        type: props.providerType,
                                                                        key: `gateway`,
                                                                        name: $t('Status.index.585606-14'),
                                                                        desc: desc,
                                                                        data: { name: $t('Status.index.585606-17', [unref(device)?.accessProvider]) },
                                                                        configuration: { ...config.result },
                                                                    });
                                                                }
                                                            }}
                                                        >{$t('Status.index.585606-18')}</Button>
                                                        {$t('Status.index.585606-19')}
                                                        <PermissionButton
                                                            type="link"
                                                            style="padding: 0"
                                                            popConfirm={{
                                                                title:$t('Status.index.585606-20'),
                                                                onConfirm:() => {
                                                                    list.value = modifyArrayList(
                                                                        list.value,
                                                                        {
                                                                            key: 'gateway',
                                                                            name: $t('Status.index.585606-14'),
                                                                            desc: desc,
                                                                            status: 'success',
                                                                            text: $t('Status.index.585606-2'),
                                                                            info: null,
                                                                        },
                                                                    );
                                                                }
                                                            }}
                                                        >
                                                            {$t('Status.index.585606-21')}
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
                                name: $t('Status.index.585606-14'),
                                desc: desc,
                                status: 'success',
                                text: $t('Status.index.585606-2'),
                                info: null,
                            };
                        }
                    } else {
                        _item = {
                            key: 'gateway',
                            name: $t('Status.index.585606-14'),
                            desc: desc,
                            status: 'error',
                            text: $t('Status.index.585606-3'),
                            info: (
                                <div>
                                    <div class={styles.infoItem}>
                                        <Badge
                                            status="default"
                                            text={
                                                <span>
                                                    {$t('Status.index.585606-22')}
                                                    <PermissionButton
                                                        hasPermission="link/AccessConfig:action"
                                                        type="link"
                                                        style="padding: 0"
                                                        popConfirm={{
                                                            title: $t('Status.index.585606-5'),
                                                            onConfirm:  () => {
                                                                const response =  startGateway(unref(device).accessId || '');
                                                                response.then((resp)=>{
                                                                    if (resp.status === 200) {
                                                                        onlyMessage($t('Status.index.585606-6'));
                                                                        list.value = modifyArrayList(
                                                                            list.value,
                                                                            {
                                                                                key: 'gateway',
                                                                                name: $t('Status.index.585606-14'),
                                                                                desc: desc,
                                                                                status: 'success',
                                                                                text: $t('Status.index.585606-2'),
                                                                                info: null,
                                                                            },
                                                                        );
                                                                    }
                                                                })
                                                                return response
                                                            }
                                                        }}
                                                    >
                                                        {$t('Status.index.585606-7')}
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

        // {$t('Status.index.585606-23')}
        const diagnoseParentDevice = () => new Promise(async (resolve) => {
            if (unref(device).state.value === 'online') {
                setTimeout(() => {
                    list.value = modifyArrayList(unref(list), {
                        key: 'parent-device',
                        name: $t('Status.index.585606-23'),
                        desc: $t('Status.index.585606-24'),
                        status: 'success',
                        text: $t('Status.index.585606-2'),
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
                            name: $t('Status.index.585606-23'),
                            desc: $t('Status.index.585606-24'),
                            status: 'error',
                            text: $t('Status.index.585606-3'),
                            info: (
                                <div>
                                    <div class={styles.infoItem}>
                                        <Badge
                                            status="default"
                                            text={
                                                <span>
                                                    {$t('Status.index.585606-25')}
                                                    <Button type="link" style="padding: 0"
                                                        onClick={() => {
                                                            bindParentVisible.value = true
                                                        }}
                                                    >
                                                        {$t('Status.index.585606-26')}
                                                    </Button>
                                                    {$t('Status.index.585606-27')}
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
                                name: $t('Status.index.585606-23'),
                                desc: $t('Status.index.585606-24'),
                                status: 'error',
                                text: $t('Status.index.585606-3'),
                                info: (
                                    <div>
                                        <div class={styles.infoItem}>
                                            <Badge
                                                status="default"
                                                text={
                                                    <span>
                                                        {$t('Status.index.585606-28')}
                                                        <PermissionButton
                                                            hasPermission="device/Product:action"
                                                            type="link"
                                                            style="padding: 0"
                                                            popConfirm={{
                                                                title: $t('Status.index.585606-5'),
                                                                onConfirm: () => {
                                                                    const response =  _deploy(response?.result?.id || '');
                                                                    response.then((resp)=>{
                                                                        if (resp.status === 200) {
                                                                            onlyMessage($t('Status.index.585606-6'));
                                                                            list.value = modifyArrayList(
                                                                                list.value,
                                                                                {
                                                                                    key: 'parent-device',
                                                                                    name: $t('Status.index.585606-23'),
                                                                                    desc: $t('Status.index.585606-24'),
                                                                                    status: 'success',
                                                                                    text: $t('Status.index.585606-2'),
                                                                                    info: null,
                                                                                },
                                                                            );
                                                                        }
                                                                    })
                                                                   return response
                                                                }
                                                            }}
                                                        >
                                                            {$t('Status.index.585606-7')}
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
                                name: $t('Status.index.585606-23'),
                                desc: $t('Status.index.585606-24'),
                                status: 'success',
                                text: $t('Status.index.585606-2'),
                                info: null,
                            };
                        } else {
                            _item = {
                                key: 'parent-device',
                                name: $t('Status.index.585606-23'),
                                desc: $t('Status.index.585606-24'),
                                status: 'error',
                                text: $t('Status.index.585606-3'),
                                info: (
                                    <div>
                                        <div class={styles.infoItem}>
                                            <Badge
                                                status="default"
                                                text={<span>{$t('Status.index.585606-29')}</span>}
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

        // {$t('Status.index.585606-30')}
        const diagnoseProduct = () => new Promise(async (resolve) => {
            if (unref(device).state?.value === 'online') {
                setTimeout(() => {
                    list.value = modifyArrayList(unref(list), {
                        key: 'product',
                        name: $t('Status.index.585606-30'),
                        desc: $t('Status.index.585606-31'),
                        status: 'success',
                        text: $t('Status.index.585606-2'),
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
                            name: $t('Status.index.585606-30'),
                            desc: $t('Status.index.585606-31'),
                            status: state === 1 ? 'success' : 'error',
                            text: state === 1 ? $t('Status.index.585606-2') : $t('Status.index.585606-3'),
                            info:
                                state === 1 ? null : (
                                    <div>
                                        <div class={styles.infoItem}>
                                            <Badge
                                                status="default"
                                                text={
                                                    <span>
                                                        {$t('Status.index.585606-32')}
                                                        <PermissionButton
                                                            hasPermission="device/Product:action"
                                                            type="link"
                                                            style="padding: 0"
                                                            popConfirm={{
                                                                title: $t('Status.index.585606-5'),
                                                                onConfirm:  () => {
                                                                    const response =  _deployProduct(unref(device).productId || '');
                                                                    response.then((resp)=>{
                                                                        if (resp.status === 200) {
                                                                            onlyMessage($t('Status.index.585606-6'));
                                                                            list.value = modifyArrayList(
                                                                                list.value,
                                                                                {
                                                                                    key: 'product',
                                                                                    name: $t('Status.index.585606-30'),
                                                                                    desc: $t('Status.index.585606-31'),
                                                                                    status: 'success',
                                                                                    text: $t('Status.index.585606-2'),
                                                                                    info: null,
                                                                                },
                                                                            );
                                                                        }
                                                                    })
                                                                   return response
                                                                }
                                                            }}
                                                        >
                                                            {$t('Status.index.585606-7')}
                                                        </PermissionButton>
                                                        {$t('Status.index.585606-33')}
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

        // {$t('Status.index.585606-34')}
        const diagnoseDevice = () => new Promise(resolve => {
            const _device = unref(device)
            if (_device.state?.value === 'online') {
                setTimeout(() => {
                    list.value = modifyArrayList(unref(list), {
                        key: 'device',
                        name: $t('Status.index.585606-34'),
                        desc: $t('Status.index.585606-35'),
                        status: 'success',
                        text: $t('Status.index.585606-2'),
                        info: null,
                    });
                    resolve({});
                }, time);
            } else {
                let item: ListProps | undefined = undefined;
                if (_device.state?.value === 'notActive') {
                    item = {
                        key: 'device',
                        name: $t('Status.index.585606-34'),
                        desc: $t('Status.index.585606-35'),
                        status: 'error',
                        text: $t('Status.index.585606-3'),
                        info: (
                            <div>
                                <div class={styles.infoItem}>
                                    <Badge
                                        status="default"
                                        text={
                                            <span>
                                                {$t('Status.index.585606-36')}
                                                <PermissionButton
                                                    hasPermission="device/Instance:action"
                                                    type="link"
                                                    style="padding: 0"
                                                    popConfirm={{
                                                        title: $t('Status.index.585606-5'),
                                                        onConfirm:  () => {
                                                            const response =  _deploy(unref(device)?.id || '');
                                                            response.then((resp)=>{
                                                                if (resp.status === 200) {
                                                                    instanceStore.current.state = { value: 'offline', text: $t('Status.index.585606-37') }
                                                                    onlyMessage($t('Status.index.585606-6'));
                                                                    list.value = modifyArrayList(
                                                                        list.value,
                                                                        {
                                                                            key: 'device',
                                                                            name: $t('Status.index.585606-34'),
                                                                            desc: $t('Status.index.585606-35'),
                                                                            status: 'success',
                                                                            text: $t('Status.index.585606-2'),
                                                                            info: null,
                                                                        },
                                                                    );
                                                                }
                                                            })
                                                           return response
                                                        }
                                                    }}
                                                >
                                                    {$t('Status.index.585606-7')}
                                                </PermissionButton>
                                                {$t('Status.index.585606-38')}
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
                        name: $t('Status.index.585606-34'),
                        desc: $t('Status.index.585606-35'),
                        status: 'success',
                        text: $t('Status.index.585606-2'),
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

        // {$t('Status.index.585606-33')}认证配置
        const diagnoseProductAuthConfig = () => new Promise(async (resolve) => {
            const _device = unref(device)
            if (_device.productId) {
                const response: Record<string, any> = await queryProductConfig(_device.productId)
                if (response.status === 200 && response.result.length > 0) {
                    configuration.product = response.result;
                    const _configuration = unref(product)?.configuration || {};
                    response.result.map((item: any, i: number) => {
                        const _list = [...list.value];
                        if (!_.map(_list, 'key').includes(`product-auth${i}`)) {
                            list.value = modifyArrayList(
                                list.value,
                                {
                                    key: `product-auth${i}`,
                                    name: $t('Status.index.585606-39', [item?.name]),
                                    desc: $t('Status.index.585606-40', [item?.name]),
                                    status: 'loading',
                                    text: $t('Status.index.585606-41'),
                                    info: null,
                                },
                                list.value.length,
                            );
                        }
                        const properties = _.map(item?.properties, 'property');
                        if (unref(device).state?.value === 'online') {
                            setTimeout(() => {
                                list.value = modifyArrayList(list.value, {
                                    key: `product-auth${i}`,
                                    name: $t('Status.index.585606-39', [item?.name]),
                                    desc: $t('Status.index.585606-40', [item?.name]),
                                    status: 'success',
                                    text: $t('Status.index.585606-2'),
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
                                    name: $t('Status.index.585606-39', [item?.name]),
                                    desc: $t('Status.index.585606-40', [item?.name]),
                                    status: 'error',
                                    text: $t('Status.index.585606-3'),
                                    info: (
                                        <div>
                                            <div class={styles.infoItem}>
                                                <Badge
                                                    status="default"
                                                    text={
                                                        <span>
                                                            {$t('Status.index.585606-42')}
                                                            <Button type="link" style="padding: 0"
                                                                onClick={() => {
                                                                    jumpAccessConfig();
                                                                }}
                                                            >
                                                                {$t('Status.index.585606-43')}
                                                            </Button>
                                                            {$t('Status.index.585606-44')}
                                                            <PermissionButton
                                                                type="link" 
                                                                style="padding: 0"
                                                                popConfirm={{
                                                                     title:$t('Status.index.585606-20'),
                                                                     onConfirm:() => {
                                                                        list.value = modifyArrayList(
                                                                            list.value,
                                                                            {
                                                                                key: `product-auth${i}`,
                                                                                name: $t('Status.index.585606-39', [item?.name]),
                                                                                desc: $t('Status.index.585606-40', [item?.name]),
                                                                                status: 'success',
                                                                                text: $t('Status.index.585606-2'),
                                                                                info: null,
                                                                            },
                                                                        );
                                                                    }
                                                                }}
                                                            >
                                                                {$t('Status.index.585606-21')}
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
                                    name: $t('Status.index.585606-39', [item?.name]),
                                    desc: $t('Status.index.585606-40', [item?.name]),
                                    status: 'warning',
                                    text: $t('Status.index.585606-15'),
                                    info: (
                                        <div>
                                            <div class={styles.infoItem}>
                                                <Badge
                                                    status="default"
                                                    text={
                                                        <span>
                                                            {$t('Status.index.585606-16')}
                                                            <Button type="link" style="padding: 0"
                                                                onClick={() => {
                                                                    manualInspection({
                                                                        type: 'product',
                                                                        key: `product-auth${i}`,
                                                                        name: $t('Status.index.585606-39', [item?.name]),
                                                                        desc: $t('Status.index.585606-40', [item?.name]),
                                                                        data: { ...item },
                                                                        configuration: _configuration,
                                                                        productId: unref(device).productId,
                                                                    });
                                                                }}
                                                            >
                                                                {$t('Status.index.585606-18')}
                                                            </Button>
                                                            {$t('Status.index.585606-45', [item.name])}
                                                            <PermissionButton      
                                                                type="link" 
                                                                style="padding: 0"
                                                                popConfirm={
                                                                    {
                                                                        title:$t('Status.index.585606-20'),
                                                                        onConfirm:() => {
                                                                            list.value = modifyArrayList(
                                                                                list.value,
                                                                                {
                                                                                    key: `product-auth${i}`,
                                                                                    name: $t('Status.index.585606-39', [item?.name]),
                                                                                    desc: $t('Status.index.585606-40', [item?.name]),
                                                                                    status: 'success',
                                                                                    text: $t('Status.index.585606-2'),
                                                                                    info: null,
                                                                                },
                                                                            );
                                                                        }
                                                                    }
                                                                }
                                                                
                                                            >
                                                               {$t('Status.index.585606-21')}
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

        // {$t('Status.index.585606-38')}认证配置
        const diagnoseDeviceAuthConfig = () => new Promise(async (resolve) => {
            const _device = unref(device)
            if (_device.id) {
                const response: Record<string, any> = await queryDeviceConfig(_device.id)
                if (response.status === 200 && response.result.length > 0) {
                    configuration.device = response.result;
                    const _configuration = _device?.configuration || {};
                    response.result.map((item: any, i: number) => {
                        const _list = [...list.value];
                        if (!_.map(_list, 'key').includes(`device-auth${i}`)) {
                            list.value = modifyArrayList(
                                list.value,
                                {
                                    key: `device-auth${i}`,
                                    name: $t('Status.index.585606-46', [item?.name]),
                                    desc: $t('Status.index.585606-47', [item?.name]),
                                    status: 'loading',
                                    text: $t('Status.index.585606-41'),
                                    info: null,
                                },
                                list.value.length,
                            );
                        }
                        const properties = _.map(item?.properties, 'property');
                        if (_device.state?.value === 'online') {
                            setTimeout(() => {
                                list.value = modifyArrayList(list.value, {
                                    key: `device-auth${i}`,
                                    name: $t('Status.index.585606-46', [item?.name]),
                                    desc: $t('Status.index.585606-47', [item?.name]),
                                    status: 'success',
                                    text: $t('Status.index.585606-2'),
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
                                    name: $t('Status.index.585606-46', [item?.name]),
                                    desc: $t('Status.index.585606-47', [item?.name]),
                                    status: 'error',
                                    text: $t('Status.index.585606-3'),
                                    info: (
                                        <div>
                                            <div class={styles.infoItem}>
                                                <Badge
                                                    status="default"
                                                    text={
                                                        <span>
                                                            {$t('Status.index.585606-42')}
                                                            <Button type="link" style="padding: 0"
                                                                onClick={() => {
                                                                    jumpDeviceConfig();
                                                                }}
                                                            >
                                                                {$t('Status.index.585606-43')}
                                                            </Button>
                                                            {$t('Status.index.585606-44')}
                                                            <PermissionButton
                                                                type="link"
                                                                style="padding: 0"
                                                                popConfirm={{
                                                                     title:$t('Status.index.585606-20'),
                                                                     onConfirm:() => {
                                                                        list.value = modifyArrayList(
                                                                            list.value,
                                                                            {
                                                                                key: `device-auth${i}`,
                                                                                name: $t('Status.index.585606-46', [item?.name]),
                                                                                desc: $t('Status.index.585606-47', [item?.name]),
                                                                                status: 'success',
                                                                                text: $t('Status.index.585606-2'),
                                                                                info: null,
                                                                            },
                                                                        );
                                                                    }}
                                                                }
                                                            >
                                                               {$t('Status.index.585606-21')}
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
                                    name: $t('Status.index.585606-46', [item?.name]),
                                    desc: $t('Status.index.585606-47', [item?.name]),
                                    status: 'warning',
                                    text: $t('Status.index.585606-15'),
                                    info: (
                                        <div>
                                            <div class={styles.infoItem}>
                                                <Badge
                                                    status="default"
                                                    text={
                                                        <span>
                                                            {$t('Status.index.585606-16')}
                                                            <Button type="link" style="padding: 0"
                                                                onClick={() => {
                                                                    manualInspection({
                                                                        type: 'device',
                                                                        key: `device-auth${i}`,
                                                                        name: $t('Status.index.585606-46', [item?.name]),
                                                                        desc: $t('Status.index.585606-47', [item?.name]),
                                                                        data: { ...item },
                                                                        configuration: _configuration,
                                                                        productId: unref(device).productId,
                                                                    });
                                                                }}
                                                            >
                                                                {$t('Status.index.585606-18')}
                                                            </Button>
                                                            {$t('Status.index.585606-70', [item.name])}
                                                            <PermissionButton
                                                                type="link" 
                                                                style="padding: 0"
                                                                popConfirm={{
                                                                      title:$t('Status.index.585606-20'),
                                                                      onConfirm:() => {
                                                                        list.value = modifyArrayList(
                                                                            list.value,
                                                                            {
                                                                                key: `device-auth${i}`,
                                                                                name: $t('Status.index.585606-46', [item?.name]),
                                                                                desc: $t('Status.index.585606-47', [item?.name]),
                                                                                status: 'success',
                                                                                text: $t('Status.index.585606-2'),
                                                                                info: null,
                                                                            },
                                                                        );
                                                                    }}
                                                                }
                                                            >
                                                                {$t('Status.index.585606-21')}
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
                        name: $t('Status.index.585606-48'),
                        desc: $t('Status.index.585606-49'),
                        status: 'warning',
                        text: $t('Status.index.585606-15'),
                        info: (
                            <div>
                                <div class={styles.infoItem}>
                                    {$t('Status.index.585606-16')}
                                    <Button type="link" style="padding: 0"
                                        onClick={() => {
                                            manualInspection({
                                                type: 'device',
                                                key: `onenet`,
                                                name: $t('Status.index.585606-48'),
                                                desc: $t('Status.index.585606-49'),
                                                data: { ...response.result[0] },
                                                configuration: _configuration,
                                            });
                                        }}
                                    >
                                        {$t('Status.index.585606-18')}
                                    </Button>
                                    {$t('Status.index.585606-50')}
                                    <PermissionButton
                                        type="link" 
                                        style="padding: 0"
                                        popConfirm={{
                                            title:$t('Status.index.585606-20'),
                                            onConfirm:() => {
                                                list.value = modifyArrayList(list.value, {
                                                    key: `onenet`,
                                                    name: $t('Status.index.585606-48'),
                                                    desc: $t('Status.index.585606-49'),
                                                    status: 'success',
                                                    text: $t('Status.index.585606-2'),
                                                    info: null,
                                                });
                                            }}
                                        }
                                    >
                                        {$t('Status.index.585606-21')}
                                    </PermissionButton>
                                </div>
                            </div>
                        ),
                    };
                } else {
                    item = {
                        key: `onenet`,
                        name: $t('Status.index.585606-48'),
                        desc: $t('Status.index.585606-49'),
                        status: 'error',
                        text: $t('Status.index.585606-3'),
                        info: (
                            <div>
                                <div class={styles.infoItem}>
                                    {$t('Status.index.585606-42')}
                                    <Button type="link" style="padding: 0"
                                        onClick={() => {
                                            jumpDeviceConfig();
                                        }}
                                    >
                                        {$t('Status.index.585606-43')}
                                    </Button>
                                    {$t('Status.index.585606-44')}
                                    <PermissionButton
                                        title={$t('Status.index.585606-20')}
                                        type="link" 
                                        style="padding: 0"
                                        onConfirm={() => {
                                            list.value = modifyArrayList(list.value, {
                                                key: `onenet`,
                                                name: $t('Status.index.585606-48'),
                                                desc: $t('Status.index.585606-49'),
                                                status: 'success',
                                                text: $t('Status.index.585606-2'),
                                                info: null,
                                            });
                                        }}
                                    >
                                        {$t('Status.index.585606-21')}
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
                        name: $t('Status.index.585606-51'),
                        desc: $t('Status.index.585606-52'),
                        status: 'warning',
                        text: $t('Status.index.585606-15'),
                        info: (
                            <div>
                                <div class={styles.infoItem}>
                                    {$t('Status.index.585606-16')}
                                    <Button type="link" style="padding: 0"
                                        onClick={() => {
                                            manualInspection({
                                                type: 'device',
                                                key: `ctwing`,
                                                name: $t('Status.index.585606-51'),
                                                desc: $t('Status.index.585606-52'),
                                                data: { ...response.result[0] },
                                                configuration: _configuration,
                                            });
                                        }}
                                    >
                                        {$t('Status.index.585606-18')}
                                    </Button>
                                    {$t('Status.index.585606-53')}
                                    <PermissionButton
                                        type="link" 
                                        style="padding: 0"
                                        popConfirm={{
                                            title:$t('Status.index.585606-20'),
                                            onConfirm:() => {
                                                list.value = modifyArrayList(list.value, {
                                                    key: `ctwing`,
                                                    name: $t('Status.index.585606-51'),
                                                    desc: $t('Status.index.585606-52'),
                                                    status: 'success',
                                                    text: $t('Status.index.585606-2'),
                                                    info: null,
                                                });
                                            }
                                        }}
                                    >
                                        {$t('Status.index.585606-21')}
                                    </PermissionButton>
                                </div>
                            </div>
                        ),
                    };
                } else {
                    item = {
                        key: `ctwing`,
                        name: $t('Status.index.585606-51'),
                        desc: $t('Status.index.585606-52'),
                        status: 'error',
                        text: $t('Status.index.585606-3'),
                        info: (
                            <div>
                                <div class={styles.infoItem}>
                                    {$t('Status.index.585606-42')}
                                    <Button type="link" style="padding: 0"
                                        onClick={() => {
                                            jumpDeviceConfig();
                                        }}
                                    >
                                        {$t('Status.index.585606-43')}
                                    </Button>
                                    {$t('Status.index.585606-44')}
                                    <PermissionButton
                                        type="link" 
                                        style="padding: 0"
                                        popConfirm={
                                            {
                                                title:$t('Status.index.585606-20'),
                                                onConfirm:() => {
                                                    list.value = modifyArrayList(list.value, {
                                                        key: `ctwing`,
                                                        name: $t('Status.index.585606-51'),
                                                        desc: $t('Status.index.585606-52'),
                                                        status: 'success',
                                                        text: $t('Status.index.585606-2'),
                                                        info: null,
                                                    });
                                                }
                                            }
                                        }
                                        
                                    >
                                        {$t('Status.index.585606-21')}
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
                item.push(<Badge status="default" text={$t('Status.index.585606-54')} />);
                if (props.providerType === 'network') {
                    item.push(
                        <Badge
                            status="default"
                            text={
                                (unref(gateway)?.channelInfo?.addresses || []).length > 1 ? (
                                    <>
                                        {$t('Status.index.585606-55')}
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
                                        {$t('Status.index.585606-56')}
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
                                        text={
                                            <span>
                                                {$t('Status.index.585606-57')}
                                                <Button type="link" style="padding: 0"
                                                    onClick={() => {
                                                        jumpAccessConfig();
                                                    }}
                                                >
                                                    {$t('Status.index.585606-58')}
                                                </Button>
                                                {$t('Status.index.585606-59')}{urlMap.get(unref(device)?.accessProvider) || ''}{$t('Status.index.585606-60')}
                                            </span>
                                        }
                                    />,
                                );
                            } else {
                                item.push(
                                    <Badge
                                        status="default"
                                        text={
                                            <span>
                                                {$t('Status.index.585606-61')}{urlMap.get(unref(device)?.accessProvider) || ''}
                                                {$t('Status.index.585606-62')}
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
                                    text={
                                        <span>
                                            {$t('Status.index.585606-63')}{' '}
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
                                    text={
                                        <span>
                                           {$t('Status.index.585606-63')}{' '}
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
                            text={$t('Status.index.585606-64')}
                        />,
                    );
                    item.push(<Badge status="default" text={$t('Status.index.585606-65')} />);
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
                onlyMessage($t('Status.index.585606-66'), 'error');
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
                const _list = _.uniq(_.map(unref(list), 'status'));
                if (unref(device).state?.value !== 'online') {
                    emit('stateChange', 'error')
                    if (_list[0] === 'success' && _list.length === 1) {
                        diagnoseNetworkOtherConfig();
                    }
                } else {
                    emit('stateChange', 'success')
                }
            } else if (status.value === 'loading') {
                const arr = _.map(unref(list), 'status').filter((i) => i !== 'loading');
                emit('countChange', arr.length)
            }
        }, { deep: true, immediate: true })

        return () => <div class={styles['statusBox']}>
            <div class={styles["statusHeader"]}>
                <TitleComponent data={$t('Status.index.585606-67')} />
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
                                        name: $t('Status.index.585606-14'),
                                        desc: $t('Status.index.585606-13'),
                                        status: 'success',
                                        text: $t('Status.index.585606-2'),
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
                                        name: $t('Status.index.585606-30'),
                                        desc: $t('Status.index.585606-31'),
                                        status: 'success',
                                        text: $t('Status.index.585606-2'),
                                        info: null,
                                    });
                                } else {
                                    flag = false;
                                }
                            }
                            if (unref(device)?.state?.value === 'notActive') {
                                const resp = await deployDevice(unref(device)?.id || '');
                                if (resp.status === 200) {
                                    unref(device).state = { value: 'offline', text: $t('Status.index.585606-37') };
                                    list.value = modifyArrayList(list.value, {
                                        key: 'device',
                                        name: $t('Status.index.585606-34'),
                                        desc: $t('Status.index.585606-35'),
                                        status: 'success',
                                        text: $t('Status.index.585606-2'),
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
                                            name: $t('Status.index.585606-0'),
                                            desc: $t('Status.index.585606-1'),
                                            status: 'success',
                                            text: $t('Status.index.585606-2'),
                                            info: null,
                                        });
                                    } else {
                                        flag = false;
                                    }
                                }
                            }
                            if (props.providerType === 'child-device' && unref(device)?.parentId) {
                                if (unref(parent)?.state?.value === 'notActive') {
                                    const resp = await deployDevice(unref(device)?.parentId || '');
                                    if (resp.status === 200) {
                                        list.value = modifyArrayList(list.value, {
                                            key: 'parent-device',
                                            name: $t('Status.index.585606-23'),
                                            desc: $t('Status.index.585606-24'),
                                            status: 'success',
                                            text: $t('Status.index.585606-2'),
                                            info: null,
                                        });
                                    } else {
                                        flag = false;
                                    }
                                }
                            }
                            if (flag) {
                                onlyMessage($t('Status.index.585606-6'));
                            }
                        }}>{$t('Status.index.585606-68')}</Button>
                    }
                    <Button onClick={() => {
                        handleSearch()
                    }}>{$t('Status.index.585606-69')}</Button>
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
                            text: $t('Status.index.585606-2'),
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
                                        name: $t('Status.index.585606-23'),
                                        desc: $t('Status.index.585606-24'),
                                        status: 'error',
                                        text: $t('Status.index.585606-3'),
                                        info: (
                                            <div>
                                                <div class={styles.infoItem}>
                                                    <Badge
                                                        status="default"
                                                        text={
                                                            <span>
                                                                {$t('Status.index.585606-28')}
                                                                <PermissionButton
                                                                    hasPermission="device/Product:action"
                                                                    type="link"
                                                                    style="padding: 0"
                                                                    popConfirm={{
                                                                        title: $t('Status.index.585606-5'),
                                                                        onConfirm:  () => {
                                                                            const response =  _deploy(response?.result?.id || '');
                                                                            response.then((resp)=>{
                                                                                if (resp.status === 200) {
                                                                                    onlyMessage($t('Status.index.585606-6'));
                                                                                    list.value = modifyArrayList(
                                                                                        list.value,
                                                                                        {
                                                                                            key: 'parent-device',
                                                                                            name: $t('Status.index.585606-23'),
                                                                                            desc: $t('Status.index.585606-24'),
                                                                                            status: 'success',
                                                                                            text: $t('Status.index.585606-2'),
                                                                                            info: null,
                                                                                        },
                                                                                    );
                                                                                }
                                                                            })
                                                                            return response
                                                                           
                                                                        }
                                                                    }}
                                                                >
                                                                    {$t('Status.index.585606-7')}
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
                                        name: $t('Status.index.585606-23'),
                                        desc: $t('Status.index.585606-24'),
                                        status: 'success',
                                        text: $t('Status.index.585606-2'),
                                        info: null,
                                    };
                                } else {
                                    item = {
                                        key: 'parent-device',
                                        name: $t('Status.index.585606-23'),
                                        desc: $t('Status.index.585606-24'),
                                        status: 'error',
                                        text: $t('Status.index.585606-3'),
                                        info: (
                                            <div>
                                                <div class={styles.infoItem}>
                                                    <Badge
                                                        status="default"
                                                        text={<span>{$t('Status.index.585606-29')}</span>}
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
