import { Badge, Button, message, Popconfirm, Space } from "ant-design-vue"
import TitleComponent from '@/components/TitleComponent/index.vue'
import styles from './index.module.less'
import type { ListProps } from './util'
import { networkInitList, childInitList, cloudInitList, mediaInitList, TextColorMap, StatusMap, modifyArrayList, isExit, gatewayList, urlMap } from './util'
import { useInstanceStore } from "@/store/instance"
import { startNetwork, startGateway, getGatewayDetail, queryGatewayState, queryProtocolDetail, detail, queryProductState, queryProductConfig, queryDeviceConfig, _deploy } from '@/api/device/instance'
import { PropType, VNode } from "vue"
import { _deploy as _deployProduct } from "@/api/device/product"
import _ from "lodash"
import DiagnosticAdvice from './DiagnosticAdvice'
import ManualInspection from './ManualInspection'
import { deployDevice } from "@/api/initHome"

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

        // TODO
        const jumpAccessConfig = () => {
            // const purl = getMenuPathByCode(MENUS_CODE['device/Product/Detail']);
            // if (purl) {
            //   history.push(
            //     `${getMenuPathByParams(MENUS_CODE['device/Product/Detail'], device.productId)}`,
            //     {
            //       tab: 'access',
            //     },
            //   );
            // } else {
            //   message.error('规则可能有加密处理，请联系管理员');
            // }
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
                        name: '网络组件',
                        desc: '诊断网络组件配置是否正确，配置错误将导致设备连接失败',
                        status: 'success',
                        text: '正常',
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
                                name: '网络组件',
                                desc: '诊断网络组件配置是否正确，配置错误将导致设备连接失败',
                                status: 'success',
                                text: '正常',
                                info: null,
                            };
                        } else {
                            _item = {
                                key: 'network',
                                name: '网络组件',
                                desc: '诊断网络组件配置是否正确，配置错误将导致设备连接失败',
                                status: 'error',
                                text: '异常',
                                info: health === -1 ? (
                                    <div>
                                        <div class={styles.infoItem}>
                                            <Badge
                                                status="default"
                                                text={
                                                    <span>网络组件已禁用，请先<Popconfirm
                                                        title="确认启用"
                                                        onConfirm={async () => {
                                                            const res = await startNetwork(
                                                                unref(gateway)?.channelId,
                                                            );
                                                            if (res.status === 200) {
                                                                message.success('操作成功！');
                                                                list.value = modifyArrayList(
                                                                    list.value,
                                                                    {
                                                                        key: 'network',
                                                                        name: '网络组件',
                                                                        desc: '诊断网络组件配置是否正确，配置错误将导致设备连接失败',
                                                                        status: 'success',
                                                                        text: '正常',
                                                                        info: null,
                                                                    },
                                                                );
                                                            }
                                                        }}
                                                    >
                                                        <Button type="link" style="padding: 0">启用</Button>
                                                    </Popconfirm></span>
                                                }
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <div class={styles.infoItem}>
                                            <Badge
                                                status="default"
                                                text="请检查服务器端口是否开放，如未开放，请开放后尝试重新连接"
                                            />
                                        </div>
                                        <div class={styles.infoItem}>
                                            <Badge
                                                status="default"
                                                text="请检查服务器防火策略，如有开启防火墙，请关闭防火墙或调整防火墙策略后重试"
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
                        message.error('请求发生错误')
                    }
                } else {
                    message.error('设备不含accessId')
                }
            }
        })

        // 设备接入网关
        const diagnoseGateway = () => new Promise(async (resolve) => {
            const desc = props.providerType && ['child-device', 'cloud'].includes(props.providerType)
                ? '诊断设备接入网关状态是否正常，网关配置是否正确'
                : '诊断设备接入网关状态是否正常，禁用状态将导致连接失败';
            if (unref(device).state.value === 'online') {
                setTimeout(() => {
                    list.value = modifyArrayList(list.value, {
                        key: 'gateway',
                        name: '设备接入网关',
                        desc: desc,
                        status: 'success',
                        text: '正常',
                        info: null,
                    });
                    resolve({});
                }, time);
            } else {
                let _item: ListProps | undefined = undefined
                if (!unref(gateway)) {
                    const accessId = unref(device)?.accessId
                    if (accessId) {
                        const response: Record<string, any> = await queryGatewayState(accessId)
                        if (response.status === 200) {
                            gateway.value = response.result
                            if (response.result?.state?.value === 'enabled') {
                                if (props.providerType === 'cloud' || unref(device)?.accessProvider === 'gb28181-2016') {
                                    _item = {
                                        key: 'gateway',
                                        name: '设备接入网关',
                                        desc: desc,
                                        status: 'warning',
                                        text: '可能存在异常',
                                        info: (
                                            <div>
                                                <div class={styles.infoItem}>
                                                    <Badge
                                                        status="default"
                                                        text={
                                                            <span>
                                                                请<Button type="link" style="padding: 0" onClick={async () => {
                                                                    const config: any = await getGatewayDetail(
                                                                        response.result?.id || '',
                                                                    );
                                                                    if (config.status === 200) {
                                                                        manualInspection({
                                                                            type: props.providerType,
                                                                            key: `gateway`,
                                                                            name: `设备接入网关`,
                                                                            desc: desc,
                                                                            data: { name: `${unref(device)?.accessProvider}配置` },
                                                                            configuration: { ...config.result },
                                                                        });
                                                                    }
                                                                }}>人工检查</Button>网关配置是否已填写正确，若您确定该项无需诊断可
                                                                <Popconfirm
                                                                    title="确认忽略？"
                                                                    onConfirm={() => {
                                                                        list.value = modifyArrayList(
                                                                            list.value,
                                                                            {
                                                                                key: 'gateway',
                                                                                name: '设备接入网关',
                                                                                desc: desc,
                                                                                status: 'success',
                                                                                text: '正常',
                                                                                info: null,
                                                                            },
                                                                        );
                                                                    }}
                                                                >
                                                                    <Button type="link" style="padding: 0">忽略</Button>
                                                                </Popconfirm>
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
                                        name: '设备接入网关',
                                        desc: desc,
                                        status: 'success',
                                        text: '正常',
                                        info: null,
                                    };
                                }
                            } else {
                                _item = {
                                    key: 'gateway',
                                    name: '设备接入网关',
                                    desc: desc,
                                    status: 'error',
                                    text: '异常',
                                    info: (
                                        <div>
                                            <div class={styles.infoItem}>
                                                <Badge
                                                    status="default"
                                                    text={<span>设备接入网关已禁用，请先
                                                        <Popconfirm
                                                            title="确认启用"
                                                            onConfirm={async () => {
                                                                const resp = await startGateway(unref(device).accessId || '');
                                                                if (resp.status === 200) {
                                                                    message.success('操作成功！');
                                                                    list.value = modifyArrayList(
                                                                        list.value,
                                                                        {
                                                                            key: 'gateway',
                                                                            name: '设备接入网关',
                                                                            desc: desc,
                                                                            status: 'success',
                                                                            text: '正常',
                                                                            info: null,
                                                                        },
                                                                    );
                                                                }
                                                            }}
                                                        >
                                                            <Button type="link" style="padding: 0">启用</Button>
                                                        </Popconfirm>
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
                            message.error('请求发生错误')
                        }
                    } else {
                        message.error('设备不含accessId')
                    }
                } else {
                    if (unref(gateway)?.state?.value === 'enabled') {
                        if (props.providerType === 'cloud' || unref(device)?.accessProvider === 'gb28181-2016') {
                            _item = {
                                key: 'gateway',
                                name: '设备接入网关',
                                desc: desc,
                                status: 'warning',
                                text: '可能存在异常',
                                info: (
                                    <div>
                                        <div class={styles.infoItem}>
                                            <Badge
                                                status="default"
                                                text={
                                                    <span>
                                                        请<Button type="link" style="padding: 0"
                                                            onClick={async () => {
                                                                const config: any = await getGatewayDetail(
                                                                    unref(gateway)?.id || '',
                                                                );
                                                                if (config.status === 200) {
                                                                    manualInspection({
                                                                        type: props.providerType,
                                                                        key: `gateway`,
                                                                        name: `设备接入网关`,
                                                                        desc: desc,
                                                                        data: { name: `${unref(device)?.accessProvider}配置` },
                                                                        configuration: { ...config.result },
                                                                    });
                                                                }
                                                            }}
                                                        >人工检查</Button>
                                                        网关配置是否已填写正确，若您确定该项无需诊断可
                                                        <Popconfirm
                                                            title="确认忽略？"
                                                            onConfirm={() => {
                                                                list.value = modifyArrayList(
                                                                    list.value,
                                                                    {
                                                                        key: 'gateway',
                                                                        name: '设备接入网关',
                                                                        desc: desc,
                                                                        status: 'success',
                                                                        text: '正常',
                                                                        info: null,
                                                                    },
                                                                );
                                                            }}
                                                        >
                                                            <Button type="link" style="padding: 0">忽略</Button>
                                                        </Popconfirm>
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
                                name: '设备接入网关',
                                desc: desc,
                                status: 'success',
                                text: '正常',
                                info: null,
                            };
                        }
                    } else {
                        _item = {
                            key: 'gateway',
                            name: '设备接入网关',
                            desc: desc,
                            status: 'error',
                            text: '异常',
                            info: (
                                <div>
                                    <div class={styles.infoItem}>
                                        <Badge
                                            status="default"
                                            text={
                                                <span>
                                                    设备接入网关已禁用，请先<Popconfirm
                                                        title="确认启用"
                                                        onConfirm={async () => {
                                                            const resp = await startGateway(unref(device).accessId || '');
                                                            if (resp.status === 200) {
                                                                message.success('操作成功！');
                                                                list.value = modifyArrayList(
                                                                    list.value,
                                                                    {
                                                                        key: 'gateway',
                                                                        name: '设备接入网关',
                                                                        desc: desc,
                                                                        status: 'success',
                                                                        text: '正常',
                                                                        info: null,
                                                                    },
                                                                );
                                                            }
                                                        }}
                                                    >
                                                        <Button type="link" style="padding: 0">启用</Button>
                                                    </Popconfirm>
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
        const diagnoseParentDevice = new Promise(async (resolve) => {
            if (unref(device).state.value === 'online') {
                setTimeout(() => {
                    list.value = modifyArrayList(unref(list), {
                        key: 'parent-device',
                        name: '网关父设备',
                        desc: '诊断网关父设备状态是否正常，禁用或离线将导致连接失败',
                        status: 'success',
                        text: '正常',
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
                            name: '网关父设备',
                            desc: '诊断网关父设备状态是否正常，禁用或离线将导致连接失败',
                            status: 'error',
                            text: '异常',
                            info: (
                                <div>
                                    <div class={styles.infoItem}>
                                        <Badge
                                            status="default"
                                            text={
                                                <span>
                                                    未绑定父设备，请先
                                                    <Button type="link" style="padding: 0"
                                                        onClick={() => {
                                                            bindParentVisible.value = true
                                                        }}
                                                    >
                                                        绑定
                                                    </Button>
                                                    父设备后重试
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
                                name: '网关父设备',
                                desc: '诊断网关父设备状态是否正常，禁用或离线将导致连接失败',
                                status: 'error',
                                text: '异常',
                                info: (
                                    <div>
                                        <div class={styles.infoItem}>
                                            <Badge
                                                status="default"
                                                text={
                                                    <span>
                                                        网关父设备已禁用，请先<Popconfirm
                                                            title="确认启用"
                                                            onConfirm={async () => {
                                                                const resp = await _deploy(response?.result?.id || '');
                                                                if (resp.status === 200) {
                                                                    message.success('操作成功！');
                                                                    list.value = modifyArrayList(
                                                                        list.value,
                                                                        {
                                                                            key: 'parent-device',
                                                                            name: '网关父设备',
                                                                            desc: '诊断网关父设备状态是否正常，禁用或离线将导致连接失败',
                                                                            status: 'success',
                                                                            text: '正常',
                                                                            info: null,
                                                                        },
                                                                    );
                                                                }
                                                            }}
                                                        >
                                                            <Button type="link" style="padding: 0">启用</Button>
                                                        </Popconfirm>
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
                                name: '网关父设备',
                                desc: '诊断网关父设备状态是否正常，禁用或离线将导致连接失败',
                                status: 'success',
                                text: '正常',
                                info: null,
                            };
                        } else {
                            _item = {
                                key: 'parent-device',
                                name: '网关父设备',
                                desc: '诊断网关父设备状态是否正常，禁用或离线将导致连接失败',
                                status: 'error',
                                text: '异常',
                                info: (
                                    <div>
                                        <div class={styles.infoItem}>
                                            <Badge
                                                status="default"
                                                text={<span>网关父设备已离线，请先排查网关设备故障</span>}
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
                        name: '产品状态',
                        desc: '诊断产品状态是否正常，禁用状态将导致设备连接失败',
                        status: 'success',
                        text: '正常',
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
                            name: '产品状态',
                            desc: '诊断产品状态是否正常，禁用状态将导致设备连接失败',
                            status: state === 1 ? 'success' : 'error',
                            text: state === 1 ? '正常' : '异常',
                            info:
                                state === 1 ? null : (
                                    <div>
                                        <div class={styles.infoItem}>
                                            <Badge
                                                status="default"
                                                text={
                                                    <span>
                                                        产品已禁用，请<Popconfirm
                                                            title="确认启用"
                                                            onConfirm={async () => {
                                                                const resp = await _deployProduct(unref(device).productId || '');
                                                                if (resp.status === 200) {
                                                                    message.success('操作成功！');
                                                                    list.value = modifyArrayList(
                                                                        list.value,
                                                                        {
                                                                            key: 'product',
                                                                            name: '产品状态',
                                                                            desc: '诊断产品状态是否正常，禁用状态将导致设备连接失败',
                                                                            status: 'success',
                                                                            text: '正常',
                                                                            info: null,
                                                                        },
                                                                    );
                                                                }
                                                            }}
                                                        >
                                                            <Button type="link" style="padding: 0">启用</Button>
                                                        </Popconfirm>
                                                        产品
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
                        name: '设备状态',
                        desc: '诊断设备状态是否正常，禁用状态将导致设备连接失败',
                        status: 'success',
                        text: '正常',
                        info: null,
                    });
                    resolve({});
                }, time);
            } else {
                let item: ListProps | undefined = undefined;
                if (_device.state?.value === 'notActive') {
                    item = {
                        key: 'device',
                        name: '设备状态',
                        desc: '诊断设备状态是否正常，禁用状态将导致设备连接失败',
                        status: 'error',
                        text: '异常',
                        info: (
                            <div>
                                <div class={styles.infoItem}>
                                    <Badge
                                        status="default"
                                        text={
                                            <span>
                                                设备已禁用，请<Popconfirm
                                                    title="确认启用"
                                                    onConfirm={async () => {
                                                        const resp = await _deploy(unref(device)?.id || '');
                                                        if (resp.status === 200) {
                                                            instanceStore.current.state = { value: 'offline', text: '离线' }
                                                            message.success('操作成功！');
                                                            list.value = modifyArrayList(
                                                                list.value,
                                                                {
                                                                    key: 'device',
                                                                    name: '设备状态',
                                                                    desc: '诊断设备状态是否正常，禁用状态将导致设备连接失败',
                                                                    status: 'success',
                                                                    text: '正常',
                                                                    info: null,
                                                                },
                                                            );
                                                        }
                                                    }}
                                                >
                                                    <Button type="link" style="padding: 0">启用</Button>
                                                </Popconfirm>设备
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
                        name: '设备状态',
                        desc: '诊断设备状态是否正常，禁用状态将导致设备连接失败',
                        status: 'success',
                        text: '正常',
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
                        if (!_.map(_list, 'key').includes(`product-auth${i}`)) {
                            list.value = modifyArrayList(
                                list.value,
                                {
                                    key: `product-auth${i}`,
                                    name: `产品-${item?.name}`,
                                    desc: '诊断产品MQTT认证配置是否正确，错误的配置将导致连接失败',
                                    status: 'loading',
                                    text: '正在诊断中...',
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
                                    name: `产品-${item?.name}`,
                                    desc: '诊断产品MQTT认证配置是否正确，错误的配置将导致连接失败',
                                    status: 'success',
                                    text: '正常',
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
                                    name: `产品-${item?.name}`,
                                    desc: '诊断产品MQTT认证配置是否正确，错误的配置将导致连接失败',
                                    status: 'error',
                                    text: '异常',
                                    info: (
                                        <div>
                                            <div class={styles.infoItem}>
                                                <Badge
                                                    status="default"
                                                    text={
                                                        <span>
                                                            请根据设备接入配置需要
                                                            <Button type="link" style="padding: 0"
                                                                onClick={() => {
                                                                    jumpAccessConfig();
                                                                }}
                                                            >
                                                                填写
                                                            </Button>
                                                            ，若您确定该项无需诊断可
                                                            <Popconfirm
                                                                title="确认忽略？"
                                                                onConfirm={() => {
                                                                    list.value = modifyArrayList(
                                                                        list.value,
                                                                        {
                                                                            key: `product-auth${i}`,
                                                                            name: `产品-${item?.name}`,
                                                                            desc: '诊断产品MQTT认证配置是否正确，错误的配置将导致连接失败',
                                                                            status: 'success',
                                                                            text: '正常',
                                                                            info: null,
                                                                        },
                                                                    );
                                                                }}
                                                            >
                                                                <Button type="link" style="padding: 0">忽略</Button>
                                                            </Popconfirm>
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
                                    name: `产品-${item?.name}`,
                                    desc: '诊断产品MQTT认证配置是否正确，错误的配置将导致连接失败',
                                    status: 'warning',
                                    text: '可能存在异常',
                                    info: (
                                        <div>
                                            <div class={styles.infoItem}>
                                                <Badge
                                                    status="default"
                                                    text={
                                                        <span>
                                                            请
                                                            <Button type="link" style="padding: 0"
                                                                onClick={() => {
                                                                    manualInspection({
                                                                        type: 'product',
                                                                        key: `product-auth${i}`,
                                                                        name: `产品-${item?.name}`,
                                                                        desc: '诊断产品MQTT认证配置是否正确，错误的配置将导致连接失败',
                                                                        data: { ...item },
                                                                        configuration,
                                                                        productId: unref(device).productId,
                                                                    });
                                                                }}
                                                            >
                                                                人工检查
                                                            </Button>
                                                            产品{item.name}
                                                            配置是否已填写正确,若您确定该项无需诊断可
                                                            <Popconfirm
                                                                title="确认忽略？"
                                                                onConfirm={() => {
                                                                    list.value = modifyArrayList(
                                                                        list.value,
                                                                        {
                                                                            key: `product-auth${i}`,
                                                                            name: `产品-${item?.name}`,
                                                                            desc: '诊断产品MQTT认证配置是否正确，错误的配置将导致连接失败',
                                                                            status: 'success',
                                                                            text: '正常',
                                                                            info: null,
                                                                        },
                                                                    );
                                                                }}
                                                            >
                                                                <Button type="link" style="padding: 0">忽略</Button>
                                                            </Popconfirm>
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
                        if (!_.map(_list, 'key').includes(`device-auth${i}`)) {
                            list.value = modifyArrayList(
                                list.value,
                                {
                                    key: `device-auth${i}`,
                                    name: `设备-${item?.name}`,
                                    desc: '诊断设备MQTT认证配置是否正确，错误的配置将导致连接失败',
                                    status: 'loading',
                                    text: '正在诊断中...',
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
                                    name: `设备-${item?.name}`,
                                    desc: '诊断设备MQTT认证配置是否正确，错误的配置将导致连接失败',
                                    status: 'success',
                                    text: '正常',
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
                                    name: `设备-${item?.name}`,
                                    desc: '诊断设备MQTT认证配置是否正确，错误的配置将导致连接失败',
                                    status: 'error',
                                    text: '异常',
                                    info: (
                                        <div>
                                            <div class={styles.infoItem}>
                                                <Badge
                                                    status="default"
                                                    text={
                                                        <span>
                                                            请根据设备接入配置需要
                                                            <Button type="link" style="padding: 0"
                                                                onClick={() => {
                                                                    jumpDeviceConfig();
                                                                }}
                                                            >
                                                                填写
                                                            </Button>
                                                            ，若您确定该项无需诊断可
                                                            <Popconfirm
                                                                title="确认忽略？"
                                                                onConfirm={() => {
                                                                    list.value = modifyArrayList(
                                                                        list.value,
                                                                        {
                                                                            key: `device-auth${i}`,
                                                                            name: `设备-${item?.name}`,
                                                                            desc: '诊断设备MQTT认证配置是否正确，错误的配置将导致连接失败',
                                                                            status: 'success',
                                                                            text: '正常',
                                                                            info: null,
                                                                        },
                                                                    );
                                                                }}
                                                            >
                                                                <Button type="link" style="padding: 0">忽略</Button>
                                                            </Popconfirm>
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
                                    name: `设备-${item?.name}`,
                                    desc: '诊断设备MQTT认证配置是否正确，错误的配置将导致连接失败',
                                    status: 'warning',
                                    text: '可能存在异常',
                                    info: (
                                        <div>
                                            <div class={styles.infoItem}>
                                                <Badge
                                                    status="default"
                                                    text={
                                                        <span>
                                                            请
                                                            <Button type="link" style="padding: 0"
                                                                onClick={() => {
                                                                    manualInspection({
                                                                        type: 'device',
                                                                        key: `device-auth${i}`,
                                                                        name: `设备-${item?.name}`,
                                                                        desc: '诊断设备MQTT认证配置是否正确，错误的配置将导致连接失败',
                                                                        data: { ...item },
                                                                        configuration,
                                                                        productId: unref(device).productId,
                                                                    });
                                                                }}
                                                            >
                                                                人工检查
                                                            </Button>
                                                            设备{item.name}
                                                            配置是否已填写正确,若您确定该项无需诊断可
                                                            <Popconfirm
                                                                title="确认忽略？"
                                                                onConfirm={() => {
                                                                    list.value = modifyArrayList(
                                                                        list.value,
                                                                        {
                                                                            key: `device-auth${i}`,
                                                                            name: `设备-${item?.name}`,
                                                                            desc: '诊断设备MQTT认证配置是否正确，错误的配置将导致连接失败',
                                                                            status: 'success',
                                                                            text: '正常',
                                                                            info: null,
                                                                        },
                                                                    );
                                                                }}
                                                            >
                                                                <Button type="link" style="padding: 0">忽略</Button>
                                                            </Popconfirm>
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
                        name: `设备-OneNet配置`,
                        desc: '诊断设备OneNet是否已配置，未配置将导致连接失败',
                        status: 'warning',
                        text: '可能存在异常',
                        info: (
                            <div>
                                <div class={styles.infoItem}>
                                    请
                                    <Button type="link" style="padding: 0"
                                        onClick={() => {
                                            manualInspection({
                                                type: 'device',
                                                key: `onenet`,
                                                name: `设备-OneNet配置`,
                                                desc: '诊断设备OneNet是否已配置，未配置将导致连接失败',
                                                data: { ...response.result[0] },
                                                configuration: _configuration,
                                            });
                                        }}
                                    >
                                        人工检查
                                    </Button>
                                    设备-OneNet配置是否已填写正确,若您确定该项无需诊断可
                                    <Popconfirm
                                        title="确认忽略？"
                                        onConfirm={() => {
                                            list.value = modifyArrayList(list.value, {
                                                key: `onenet`,
                                                name: `设备-OneNet配置`,
                                                desc: '诊断设备OneNet是否已配置，未配置将导致连接失败',
                                                status: 'success',
                                                text: '正常',
                                                info: null,
                                            });
                                        }}
                                    >
                                        <Button type="link" style="padding: 0">忽略</Button>
                                    </Popconfirm>
                                </div>
                            </div>
                        ),
                    };
                } else {
                    item = {
                        key: `onenet`,
                        name: `设备-OneNet配置`,
                        desc: '诊断设备OneNet是否已配置，未配置将导致连接失败',
                        status: 'error',
                        text: '异常',
                        info: (
                            <div>
                                <div class={styles.infoItem}>
                                    请根据设备接入配置需要
                                    <Button type="link" style="padding: 0"
                                        onClick={() => {
                                            jumpDeviceConfig();
                                        }}
                                    >
                                        填写
                                    </Button>
                                    ，若您确定该项无需诊断可
                                    <Popconfirm
                                        title="确认忽略？"
                                        onConfirm={() => {
                                            list.value = modifyArrayList(list.value, {
                                                key: `onenet`,
                                                name: `设备-OneNet配置`,
                                                desc: '诊断设备OneNet是否已配置，未配置将导致连接失败',
                                                status: 'success',
                                                text: '正常',
                                                info: null,
                                            });
                                        }}
                                    >
                                        <Button type="link" style="padding: 0">忽略</Button>
                                    </Popconfirm>
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
                        name: `设备-CTWing配置`,
                        desc: '诊断设备CTWing是否已配置，未配置将导致连接失败',
                        status: 'warning',
                        text: '可能存在异常',
                        info: (
                            <div>
                                <div class={styles.infoItem}>
                                    请
                                    <Button type="link" style="padding: 0"
                                        onClick={() => {
                                            manualInspection({
                                                type: 'device',
                                                key: `ctwing`,
                                                name: `设备-CTWing配置`,
                                                desc: '诊断设备CTWing是否已配置，未配置将导致连接失败',
                                                data: { ...response.result[0] },
                                                configuration: _configuration,
                                            });
                                        }}
                                    >
                                        人工检查
                                    </Button>
                                    设备-CTWing配置是否已填写正确,若您确定该项无需诊断可
                                    <Popconfirm
                                        title="确认忽略？"
                                        onConfirm={() => {
                                            list.value = modifyArrayList(list.value, {
                                                key: `ctwing`,
                                                name: `设备-CTWing配置`,
                                                desc: '诊断设备CTWing是否已配置，未配置将导致连接失败',
                                                status: 'success',
                                                text: '正常',
                                                info: null,
                                            });
                                        }}
                                    >
                                        <Button type="link" style="padding: 0">忽略</Button>
                                    </Popconfirm>
                                </div>
                            </div>
                        ),
                    };
                } else {
                    item = {
                        key: `ctwing`,
                        name: `设备-CTWing配置`,
                        desc: '诊断设备CTWing是否已配置，未配置将导致连接失败',
                        status: 'error',
                        text: '异常',
                        info: (
                            <div>
                                <div class={styles.infoItem}>
                                    请根据设备接入配置需要
                                    <Button type="link" style="padding: 0"
                                        onClick={() => {
                                            jumpDeviceConfig();
                                        }}
                                    >
                                        填写
                                    </Button>
                                    ，若您确定该项无需诊断可
                                    <Popconfirm
                                        title="确认忽略？"
                                        onConfirm={() => {
                                            list.value = modifyArrayList(list.value, {
                                                key: `ctwing`,
                                                name: `设备-CTWing配置`,
                                                desc: '诊断设备CTWing是否已配置，未配置将导致连接失败',
                                                status: 'success',
                                                text: '正常',
                                                info: null,
                                            });
                                        }}
                                    >
                                        <Button type="link" style="padding: 0">忽略</Button>
                                    </Popconfirm>
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
                item.push(<Badge status="default" text="请检查设备运行状态是否正常" />);
                if (props.providerType === 'network') {
                    item.push(
                        <Badge
                            status="default"
                            text={
                                (unref(gateway)?.channelInfo?.addresses || []).length > 1 ? (
                                    <>
                                        请检查设备网络是否畅通，并确保设备已连接到以下地址之一:
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
                                        请检查设备网络是否畅通，并确保设备已连接到:
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
                                                请根据
                                                <Button type="link" style="padding: 0"
                                                    onClick={() => {
                                                        jumpAccessConfig();
                                                    }}
                                                >
                                                    设备接入配置
                                                </Button>
                                                中${urlMap.get(unref(device)?.accessProvider) || ''}信息，任意上报一条数据
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
                                                请联系管理员提供${urlMap.get(unref(device)?.accessProvider) || ''}
                                                信息，并根据URL信息任意上报一条数据
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
                                            请检查设备网络是否畅通，并确保设备已连接到：SIP{' '}
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
                                            请检查设备网络是否畅通，并确保设备已连接到：SIP{' '}
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
                            text="需要三方云平台主动发送一条消息通知到本平台，触发设备状态为在线"
                        />,
                    );
                    item.push(<Badge status="default" text="请检查三方平台配置项是否填写正确" />);
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
                message.error('未开发');
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
                <TitleComponent data="连接详情" />
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
                                        name: '设备接入网关',
                                        desc: '诊断设备接入网关状态是否正常，禁用状态将导致连接失败',
                                        status: 'success',
                                        text: '正常',
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
                                        name: '产品状态',
                                        desc: '诊断产品状态是否正常，禁用状态将导致设备连接失败',
                                        status: 'success',
                                        text: '正常',
                                        info: null,
                                    });
                                } else {
                                    flag = false;
                                }
                            }
                            if (unref(device)?.state?.value === 'notActive') {
                                const resp = await deployDevice(unref(device)?.id || '');
                                if (resp.status === 200) {
                                    unref(device).state = { value: 'offline', text: '离线' };
                                    list.value = modifyArrayList(list.value, {
                                        key: 'device',
                                        name: '设备状态',
                                        desc: '诊断设备状态是否正常，禁用状态将导致设备连接失败',
                                        status: 'success',
                                        text: '正常',
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
                                            name: '网络组件',
                                            desc: '诊断网络组件配置是否正确，配置错误将导致设备连接失败',
                                            status: 'success',
                                            text: '正常',
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
                                            name: '网关父设备',
                                            desc: '诊断网关父设备状态是否正常，禁用或离线将导致连接失败',
                                            status: 'success',
                                            text: '正常',
                                            info: null,
                                        });
                                    } else {
                                        flag = false;
                                    }
                                }
                            }
                            if (flag) {
                                message.success('操作成功！');
                            }
                        }}>一键修复</Button>
                    }
                    <Button onClick={() => {
                        handleSearch()
                    }}>重新诊断</Button>
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
                            text: '正常',
                            info: null,
                        });
                        artificialVisible.value = false
                    }}
                />
            )}
        </div>
    },
})

export default Status