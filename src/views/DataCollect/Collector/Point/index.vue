<template>
    <j-spin :spinning="spinning">
        <pro-search :columns="columns" target="search-point" @search="handleSearch" />
        <FullPage>
            <j-scrollbar height="680">
                <j-pro-table
                    ref="tableRef"
                    model="CARD"
                    :columns="columns"
                    :gridColumn="2"
                    :gridColumns="[1, 2]"
                    :request="queryPoint"
                    :defaultParams="defaultParams"
                    :params="params"
                    :rowSelection="{
                        selectedRowKeys: _selectedRowKeys,
                        onChange: onSelectChange,
                    }"
                >
                    <template #headerTitle>
                        <j-space>
                            <PermissionButton
                                v-if="['MODBUS_TCP', 'COLLECTOR_GATEWAY','snap7', 'iec104'].includes(data?.provider)"
                                type="primary"
                                @click="handlAdd"
                                hasPermission="DataCollect/Collector:add"
                            >
                                <template #icon
                                    ><AIcon type="PlusOutlined"
                                /></template>
                                新增点位
                            </PermissionButton>
                            <PermissionButton
                                v-if="['MODBUS_TCP', 'COLLECTOR_GATEWAY','snap7', 'iec104'].includes(data?.provider)"
                                type="primary"
                                @click="handleImport"
                                hasPermission="DataCollect/Collector:add"
                            >
                                <!-- <template #icon
                                    ><AIcon type="PlusOutlined"
                                /></template> -->
                                批量导入
                            </PermissionButton>
                            <PermissionButton
                                v-if="data?.provider === 'OPC_UA'"
                                type="primary"
                                @click="handlScan"
                                hasPermission="DataCollect/Collector:add"
                            >
                                <template #icon
                                    ><AIcon type="PlusOutlined"
                                /></template>
                                扫描
                            </PermissionButton>
                            <j-dropdown
                                v-if="data?.provider === 'OPC_UA'"
                                :trigger="['click']"
                            >
                                <j-button @click.prevent="clickBatch"
                                    >批量操作 <AIcon type="DownOutlined"
                                /></j-button>
                                <template #overlay>
                                    <j-menu v-if="showBatch">
                                        <j-menu-item>
                                            <PermissionButton
                                                hasPermission="DataCollect/Collector:update"
                                                @click="handlBatchUpdate()"
                                            >
                                                <template #icon
                                                    ><AIcon type="FormOutlined"
                                                /></template>
                                                编辑
                                            </PermissionButton>
                                        </j-menu-item>
                                        <j-menu-item>
                                            <PermissionButton
                                                hasPermission="DataCollect/Collector:delete"
                                                :popConfirm="{
                                                    title: `确定删除？`,
                                                    onConfirm: () =>
                                                        handlBatchDelete(),
                                                }"
                                            >
                                                <template #icon
                                                    ><AIcon type="EditOutlined"
                                                /></template>
                                                删除
                                            </PermissionButton>
                                        </j-menu-item>
                                    </j-menu>
                                </template>
                            </j-dropdown>
                        </j-space>
                        <div
                            v-if="data?.provider === 'OPC_UA'"
                            style="margin-top: 15px"
                        >
                            <j-checkbox
                                v-model:checked="checkAll"
                                @change="onCheckAllChange"
                                >全选</j-checkbox
                            >
                        </div>
                    </template>
                    <template #card="slotProps">
                        <PointCardBox
                            :showStatus="true"
                            :value="slotProps"
                            @click="handleClick"
                            :active="_selectedRowKeys.includes(slotProps.id)"
                            class="card-box"
                            :status="slotProps?.runningState?.value"
                            :statusText="slotProps?.runningState?.text"
                            :statusNames="
                                Object.fromEntries(colorMap.entries())
                            "
                        >
                            <template #title>
                                <slot name="title">
                                    <Ellipsis style="width: calc(100% - 10px)">
                                        <div class="card-box-title">
                                            {{ slotProps.name }}
                                        </div>
                                    </Ellipsis>
                                </slot>
                            </template>
                            <template #action>
                                <div class="card-box-action">
                                    <PermissionButton
                                        type="text"
                                        :tooltip="{
                                            title: '删除',
                                        }"
                                        hasPermission="DataCollect/Collector:delete"
                                        :popConfirm="{
                                            title: `确定删除？`,
                                            onConfirm: () =>
                                                handlDelete(slotProps.id),
                                        }"
                                    >
                                        <a
                                            style="
                                                font-size: 20px;
                                                margin-top: -10px;
                                            "
                                            ><AIcon type="DeleteOutlined"
                                        /></a>
                                    </PermissionButton>

                                    <PermissionButton
                                        class="add-btn"
                                        type="text"
                                        @click="handlEdit(slotProps)"
                                        hasPermission="DataCollect/Collector:update"
                                    >
                                        <a style="font-size: 20px"
                                            ><AIcon type="FormOutlined"
                                        /></a>
                                    </PermissionButton>
                                </div>
                            </template>
                            <template #img>
                                <img :src="ImageMap.get(slotProps.provider)"/>
                            </template>
                            <template #content>
                                <div class="card-box-content">
                                    <div class="card-box-content-left">
                                        <div class="card-box-content-left-1">
                                            <div
                                                class="ard-box-content-left-1-title"
                                                v-if="
                                                    propertyValue.has(
                                                        slotProps.id,
                                                    )
                                                "
                                            >
                                                <j-ellipsis
                                                    style="max-width: 150px"
                                                >
                                                    {{
                                                        getParseData(slotProps)
                                                    }}
                                                </j-ellipsis>
                                            </div>
                                            <div
                                                class="ard-box-content-left-1-title"
                                                v-else
                                            >
                                                <j-ellipsis
                                                    style="max-width: 150px"
                                                >
                                                    {{
                                                        getReadParseData(
                                                            slotProps,
                                                        )
                                                    }}
                                                </j-ellipsis>
                                            </div>
                                            <a
                                                v-if="
                                                    getAccessModes(
                                                        slotProps,
                                                    ).includes('write')
                                                "
                                                @click.stop="
                                                    clickEdit(slotProps)
                                                "
                                                ><AIcon type="EditOutlined"
                                            /></a>
                                            <a
                                                v-if="
                                                    getAccessModes(
                                                        slotProps,
                                                    ).includes('read')
                                                "
                                                @click.stop="
                                                    clickRead(slotProps)
                                                "
                                                ><AIcon type="RedoOutlined"
                                            /></a>
                                        </div>
                                        <div
                                            v-if="
                                                propertyValue.has(slotProps.id)
                                            "
                                            class="card-box-content-right-2"
                                        >
                                            <p>
                                                {{
                                                    propertyValue.get(
                                                        slotProps.id,
                                                    )?.hex || ''
                                                }}
                                            </p>
                                            <p>
                                                {{
                                                    dayjs(
                                                        propertyValue.get(
                                                            slotProps.id,
                                                        )?.timestamp,
                                                    ).format(
                                                        'YYYY-MM-DD HH:mm:ss',
                                                    )
                                                }}
                                            </p>
                                        </div>
                                    </div>

                                    <div class="card-box-content-right">
                                        <Ellipsis
                                            style="
                                                width: calc(100% - 10px);
                                                margin-bottom: 10px;
                                            "
                                        >
                                            <div
                                                v-if="getRight1(slotProps)"
                                                class="card-box-content-right-1"
                                            >
                                                <span>
                                                    {{ getQuantity(slotProps) }}
                                                </span>
                                                <span>
                                                    {{ getAddress(slotProps) }}
                                                </span>
                                                <span>
                                                    {{
                                                        getScaleFactor(
                                                            slotProps,
                                                        )
                                                    }}
                                                </span>
                                            </div>
                                        </Ellipsis>
                                        <Ellipsis
                                            style="
                                                width: calc(100% - 10px);
                                                margin-bottom: 10px;
                                            "
                                        >
                                            <div
                                                class="card-box-content-right-2"
                                            >
                                                <span>{{
                                                    getText(slotProps)
                                                }}</span>
                                                <span
                                                    v-if="
                                                        getInterval(slotProps)
                                                    "
                                                    >{{
                                                        getInterval(slotProps)
                                                    }}</span
                                                >
                                            </div>
                                        </Ellipsis>
                                    </div>
                                </div>
                            </template>
                        </PointCardBox>
                    </template>
                </j-pro-table>
            </j-scrollbar>
        </FullPage>

        <SaveModBus
            v-if="visible.saveModBus"
            :data="current"
            @change="saveChange"
        />
        <SaveOPCUA
            v-if="visible.saveOPCUA"
            :data="current"
            @change="saveChange"
        />
        <WritePoint
            v-if="visible.writePoint"
            :data="current"
            @change="saveChange"
        />
        <BatchUpdate
            v-if="visible.batchUpdate"
            :data="current"
            @change="saveChange"
        />
        <SaveS7 v-if="visible.saveS7"  :data="current" @change="saveChange"/>
        <SaveIEC104 v-if="visible.saveIEC104" :data="current" @change="saveChange"/>
        <Scan v-if="visible.scan" :data="current" @change="saveChange" />
        <Import v-if="visible.import" :data="current" @close-import="closeImport"/>
    </j-spin>
</template>
<script lang="ts" setup name="PointPage">
import { getImage } from '@/utils/comm';
import {
    queryPoint,
    batchDeletePoint,
    removePoint,
    readPoint,
    getProviders,
    getStates
} from '@/api/data-collect/collector';
import { onlyMessage } from '@/utils/comm';
import PointCardBox from './components/PointCardBox/index.vue';
import WritePoint from './components/WritePoint/index.vue';
import BatchUpdate from './components/BatchUpdate/index.vue';
import SaveModBus from './Save/SaveModBus.vue';
import SaveOPCUA from './Save/SaveOPCUA.vue';
import Scan from './Scan/index.vue';
import { colorMap } from '../data';
import { cloneDeep, isBoolean, isNumber, throttle } from 'lodash-es';
import { getWebSocket } from '@/utils/websocket';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs';
import { responsiveArray } from 'ant-design-vue/lib/_util/responsiveObserve';
import SaveS7 from './Save/SaveS7.vue';
import SaveIEC104 from './Save/SaveIEC104.vue';
import Import from './components/Import/index.vue'
const props = defineProps({
    data: {
        type: Object,
        default: {},
    },
});

const tableRef = ref<Record<string, any>>({});
const params = ref<Record<string, any>>({});
const opcImage = getImage('/DataCollect/device-opcua.png');
const modbusImage = getImage('/DataCollect/device-modbus.png');
const s7Image = getImage('/DataCollect/s7.png')
const gatewayImage = getImage('/DataCollect/gateway.png')
const iecImage = getImage('/DataCollect/IEC104.png')
const ImageMap = new Map()
ImageMap.set('OPC_UA',opcImage)
ImageMap.set('MODBUS_TCP',modbusImage)
ImageMap.set('snap7',s7Image)
ImageMap.set('iec104',iecImage)
ImageMap.set('COLLECTOR_GATEWAY',gatewayImage)


const visible = reactive({
    saveModBus: false,
    saveOPCUA: false,
    writePoint: false,
    batchUpdate: false,
    scan: false,
    saveS7:false,
    import:false,
    saveIEC104: false
});
const current: any = ref({});
const accessModesOption = ref();
const _selectedRowKeys = ref<string[]>([]);
const checkAll = ref(false);
const spinning = ref(false);
const ReadIdMap = new Map();

const defaultParams = ref({
    sorts: [{ name: 'id', order: 'desc' }],
    terms: [
        {
            terms: [
                {
                    column: 'collectorId',
                    termType: 'eq',
                    value: !props.data?.id ? 'undefined' : (props.data.id === '*' ? undefined : props.data.id),
                },
            ],
        },
    ],
});

const accessModesMODBUS_TCP = [
    {
        label: '读',
        value: 'read',
    },
    {
        label: '写',
        value: 'write',
    },
];

const columns = [
    {
        title: '点位名称',
        dataIndex: 'name',
        key: 'name',
        search: {
            type: 'string',
        },
    },
    {
        title: '通讯协议',
        dataIndex: 'provider',
        key: 'provider',
        search: {
            type: 'select',
            options: async () =>{
              const resp:any = await getProviders();
              if(resp.success){
                return resp.result.map((item: any) => ({ label: item.name, value: item.id }))
              }else{
                return []
              }
            }
        },
    },
    {
        title: '访问类型',
        dataIndex: 'accessModes$in$any',
        key: 'accessModes$in$any',
        search: {
            type: 'select',
            options: accessModesOption,
        },
    },
    {
        title: '运行状态',
        dataIndex: 'runningState',
        key: 'runningState',
        search: {
            type: 'select',
            options: async() =>{
                const resq:any = await getStates();
                if(resq.status === 200){
                    return resq.result.map((item:any)=>(
                        {label:item.text,value:item.value}
                    ))
                }else{
                    return []
                }
            }
        },
    },
    {
        title: '说明',
        dataIndex: 'description',
        key: 'description',
        search: {
            type: 'string',
        },
    },
];

const subRef = ref();
const propertyValue = ref(new Map());
const cacheIds = ref<string>()
const showBatch = ref(false);

const clickBatch = () => {
    if (_selectedRowKeys.value.length === 0) {
        onlyMessage('请先选择', 'warning');
        showBatch.value = false;
    } else {
        showBatch.value = true;
    }
};

const handlAdd = () => {
    if( props.data?.provider === 'snap7'){
        console.log(props.data)
        visible.saveS7 = true
        current.value = {
            collectorId: props.data?.id,
            provider: props.data?.provider,
            deviceType:props.data?.configuration.type,
        }
    }else if (props.data?.provider === 'iec104'){
        visible.saveIEC104 = true;
        current.value = {
            collectorId: props.data?.id,
            provider: props.data?.provider,
        }
    } else {
        visible.saveModBus = true;
        current.value = {
            collectorId: props.data?.id,
            provider: props.data?.provider || 'MODBUS_TCP',
        };
    }
   
};
const handlEdit = (data: any) => {
    if (data?.provider === 'OPC_UA') {
        visible.saveOPCUA = true;
    } else if(data?.provider === 'snap7'){
        visible.saveS7 = true
    } else if(data?.provider === 'iec104') {
        visible.saveIEC104 = true
    } else {
        visible.saveModBus = true;
    }
    current.value = cloneDeep({
        ...data,
        deviceType:props.data?.configuration.type,
    });
};

const handlDelete = async (id: string | undefined = undefined) => {
    spinning.value = true;
    const res = !id
        ? await batchDeletePoint(_selectedRowKeys.value).catch(() => {})
        : await removePoint(id as string).catch(() => {});
    if (res?.status === 200) {
        cancelSelect();
        tableRef.value?.reload();
        onlyMessage('操作成功', 'success');
    }
    spinning.value = false;
};

const handlBatchDelete = () => {
    handlDelete();
};

const handlBatchUpdate = () => {
    const dataSet = new Set(_selectedRowKeys.value);
    const dataMap = new Map();
    tableRef?.value?._dataSource.forEach((i: any) => {
        dataSet.has(i.id) && dataMap.set(i.id, i);
    });
    current.value = [...dataMap.values()];
    visible.batchUpdate = true;
};
const handlScan = () => {
    visible.scan = true;
    current.value = cloneDeep(props.data);
};
const handleImport = () =>{
    visible.import = true
    current.value = cloneDeep(props.data)
}
const clickEdit = async (data: object) => {
    visible.writePoint = true;
    current.value = cloneDeep(data);
};

// ReadIdMap
const clickRead = async (data: any) => {
    console.log('------')
    const res: any = await readPoint(data?.collectorId, [data?.id]);
    if (res.status === 200) {
        const readData: any = res.result[0];
        const _data = ReadIdMap.get(data?.id);
        ReadIdMap.set(data?.id, { ..._data, ...readData });
        console.log('====',ReadIdMap.get(data.id))
        cancelSelect();
        tableRef.value?.reload();
        onlyMessage('操作成功', 'success');
    }
};

const getQuantity = (item: Partial<Record<string, any>>) => {
    const { quantity } = item.configuration?.parameter || '';
    return !!quantity ? quantity + '(寄存器数量)' : '';
};
const getAddress = (item: Partial<Record<string, any>>) => {
    const { address } = item.configuration?.parameter || '';
    return (!!address || address === 0) ? address + '(地址)' : '';
};
const getScaleFactor = (item: Partial<Record<string, any>>) => {
    const { scaleFactor } = item.configuration?.codec?.configuration || '';
    return !!scaleFactor ? scaleFactor + '(缩放因子)' : '';
};
const getRight1 = (item: Partial<Record<string, any>>) => {
    return !!getQuantity(item) || getAddress(item) || getScaleFactor(item);
};
const getText = (item: Partial<Record<string, any>>) => {
    return (item?.accessModes || []).map((i: any) => i?.text).join(',');
};
const getInterval = (item: Partial<Record<string, any>>) => {
    const { interval } = item.configuration || '';
    return !!interval ? '采集频率' + interval + 'ms' : '';
};

const getAccessModes = (item: Partial<Record<string, any>>) => {
    return item?.accessModes?.map((i: any) => i?.value);
};

const getParseData = (item: any) => {
    const { parseData, dataType } = propertyValue.value.get(item.id);
    const data = isNumber(parseData) ? parseData || 0 : parseData;
    const _data = `${data}(${dataType}) `;
    return _data;
};
const getReadParseData = (item: any) => {
    let _data = '--';
    if (ReadIdMap.has(item.id)) {
        const { parseData, dataType } = ReadIdMap.get(item.id);
        if(isBoolean(parseData)){
            _data =  `${parseData}(${dataType || '-'}) `;
        }else{
            _data = !!parseData ? `${parseData}(${dataType || '-'}) ` : '--';
        }
        
    }
    return _data;
};

const saveChange = (value: object) => {
    for (let key in visible) {
        visible[key] = false;
    }
    current.value = {};
    if (value) {
        tableRef.value?.reload();
        onlyMessage('操作成功', 'success');
    }
};

const onSelectChange = (keys: string[]) => {
    _selectedRowKeys.value = [...keys];
};

const cancelSelect = () => {
    _selectedRowKeys.value = [];
};

const handleClick = (dt: any) => {
    if (props.data?.provider !== 'OPC_UA') return;
    if (_selectedRowKeys.value.includes(dt.id)) {
        const _index = _selectedRowKeys.value.findIndex((i) => i === dt.id);
        _selectedRowKeys.value.splice(_index, 1);
        checkAll.value = false;
    } else {
        _selectedRowKeys.value = [..._selectedRowKeys.value, dt.id];
        if (
            _selectedRowKeys.value.length === tableRef.value?._dataSource.length
        ) {
            checkAll.value = true;
        }
    }
};

const handleSubscribeValue = throttle((payload: any) => {
  propertyValue.value.set(payload.pointId, payload);
})

const subscribeProperty = (value: any) => {
    const list = value.map((item: any) => item.id);
    const id = `collector-${props.data?.channelId || 'channel'}-${
        (props.data?.id || (props.data && props.data.id === '*')) ? 'point' : props.data?.id
    }-data-${list.join('-')}`;
    const topic = `/collector/${props.data?.channelId || '*'}/${
      (props.data?.id || (props.data && props.data.id === '*')) ? '*' : props.data?.id
    }/data`;
    subRef.value = getWebSocket(id, topic, {
        pointId: list.join(','),
    })
        ?.pipe(map((res: any) => res.payload))
        .subscribe((payload: any) => {
            //防止刷新过快
          handleSubscribeValue(payload)
        });
};

const onCheckAllChange = (e: any) => {
    if (e.target.checked) {
        _selectedRowKeys.value = [
            ...tableRef.value?._dataSource.map((i: any) => i.id),
        ];
    } else {
        cancelSelect();
        checkAll.value = false;
    }
};

const closeImport = () =>{
    visible.import = false
    tableRef.value.reload()
}

watch(
    () => tableRef?.value?._dataSource,
    (value) => {
        subRef.value?.unsubscribe();
        if (value.length !== 0) {
            setTimeout(() => {
              subscribeProperty(value);
              value.forEach((item: any) => {
                  item?.accessModes?.forEach((i: any) => {
                      if (i?.value === 'read') {
                          ReadIdMap.set(item.id, item);
                      }
                  });
              });
            }, 100)
        }
        cancelSelect();
        checkAll.value = false;
    },
);
watch(
    () => _selectedRowKeys.value,
    (value) => {
        if (value.length === 0) {
            checkAll.value = false;
        }
    },
);

watch(
    () => props.data,
    (value) => {
        if (!!value) {
            accessModesOption.value =
                value?.provider === 'MODBUS_TCP'
                    ? accessModesMODBUS_TCP
                    : accessModesMODBUS_TCP.concat({
                          label: '订阅',
                          value: 'subscribe',
                      });
            defaultParams.value.terms[0].terms[0].value = !value.id ? 'undefined' : (value.id === '*' ? undefined : value.id);
            tableRef?.value?.reload && tableRef?.value?.reload();
            cancelSelect();
            checkAll.value = false;
        }
    },
    { immediate: true, deep: true },
);

onUnmounted(() => {
  subRef.value?.unsubscribe();
});

/**
 * 搜索
 * @param params
 */
const handleSearch = (e: any) => {
    params.value = e;
};
</script>
<style lang="less" scoped>
.card-box {
    // min-width: 480px;
    a {
        color: #474747;
        z-index: 1;
    }
    a:hover {
        color: #315efb;
        z-index: 1;
    }
    .card-box-title {
        font-size: 18px;
        color: #474747;
    }
    .card-box-action {
        width: 90px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: -10px;
    }
    .card-box-content {
        margin-top: 20px;
        display: flex;
        .card-box-content-left {
            max-width: 220px;
            border-right: 1px solid #e0e4e8;
            height: 68px;
            padding-right: 10px;
            .card-box-content-left-1 {
                display: flex;
                justify-content: flex-start;
                .card-box-content-left-1-title {
                    color: #000;
                    font-size: 20px;
                    opacity: 0.85;
                }
            }
            a {
                margin-left: 10px;
            }
        }
        .card-box-content-right {
            flex: 0.8;
            margin-left: 20px;
            .card-box-content-right-1 {
                span {
                    margin: 0 5px 0 0;
                }
            }
            .card-box-content-right-2 {
                span {
                    margin: 0 5px 0 0;
                    padding: 3px 12px;
                    background: #f3f3f3;
                    color: #616161;
                }
            }
        }
    }
}
</style>
