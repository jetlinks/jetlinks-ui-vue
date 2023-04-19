<!-- 设备接入 -->
<template>
    <div v-if="access.id === undefined || null" style='margin-top: 20%; transform: translateY(-50%);'>
        <j-empty :image="simpleImage">
            <template #description>
                <span
                    v-if="
                        permissionStore.hasPermission('device/Product:update')
                    "
                >
                    请先<j-button type="link" @click="showModal">选择</j-button
                    >设备接入网关，用以提供设备接入能力
                </span>
                <span v-else>请联系管理员配置产品接入方式</span>
            </template>
        </j-empty>
    </div>
    <div v-else>
        <j-row :gutter="24">
            <j-col :span="12">
                <Title data="接入方式">
                    <template #extra>
                        <PermissionButton
                            style="margin: 0 0 0 20px"
                            type="primary"
                            size="small"
                            :tooltip="{
                                title: tooltip
                            }"
                            :disabled="checkDisabled"
                            ghost
                            @click="showDevice"
                            hasPermission="device/Product:update"
                        >
                            更换
                        </PermissionButton>
                    </template>
                </Title>
                <div>
                    <div>
                        {{ access?.name }}
                    </div>
                    <div>
                        {{
                            access?.description ||
                            dataSource.find(
                                (item) => item?.id === access?.provider,
                            )?.description
                        }}
                    </div>
                </div>
                <div class="item-style">
                    <Title data="消息协议"></Title>
                    <div>
                        {{ access?.protocolDetail?.name }}
                    </div>
                    <!-- 显示md文件内容 -->
                    <div v-if="config?.document" v-html="markdownToHtml"></div>
                </div>
                <div class="item-style">
                    <Title data="连接信息"></Title>
                    <div v-if="access?.channelInfo?.addresses.length > 0">
                        <div
                            v-for="item in access?.channelInfo?.addresses"
                            :key="item.address"
                        >
                            <j-badge
                                :color="item.health === -1 ? 'red' : 'green'"
                                :text="item.address"
                            >
                            </j-badge>
                        </div>
                    </div>
                    <div v-else>{{ '暂无连接信息' }}</div>
                </div>
                <Title
                    v-if="metadata?.name"
                    :data="metadata?.name"
                    class="config"
                >
                    <template #extra>
                        <j-tooltip title="此配置来自于产品接入方式所选择的协议">
                            <AIcon
                                type="QuestionCircleOutlined"
                                style="margin-left: 2px"
                            />
                        </j-tooltip>
                    </template>
                </Title>
                <j-form ref="formRef" :model="formData.data" layout="vertical">
                    <j-form-item
                        :name="item.property"
                        v-for="item in metadata?.properties || []"
                        :key="item"
                        :label="item.name"
                        :rules="[
                            {
                                required: !!item?.type?.expands?.required,
                                message: `${
                                    item.type.type === 'enum'
                                        ? '请选择'
                                        : '请输入'
                                }${item.name}`,
                            },
                        ]"
                    >
                        <j-input
                            placeholder="请输入"
                            v-if="item.type.type === 'string'"
                            v-model:value="formData.data[item.property]"
                        ></j-input>
                        <j-input-password
                            placeholder="请输入"
                            v-if="item.type.type === 'password'"
                            v-model:value="formData.data[item.property]"
                        ></j-input-password>
                        <j-select
                            placeholder="请选择"
                            v-if="item.type.type === 'enum'"
                            v-model:value="formData.data[item.name]"
                        >
                            <j-select-option
                                v-for="el in item?.type?.type === 'enum' &&
                                item?.type?.elements
                                    ? item?.type?.elements
                                    : []"
                                :key="el"
                                :value="el.value"
                            >
                                {{ el.text }}
                            </j-select-option>
                        </j-select>
                    </j-form-item>
                </j-form>
                <Title data="存储策略">
                    <template #extra>
                        <j-tooltip
                            title="若修改存储策略,需要手动做数据迁移,平台只能搜索最新存储策略中的数据"
                        >
                            <AIcon
                                type="QuestionCircleOutlined"
                                style="margin-left: 2px"
                            />
                        </j-tooltip>
                    </template>
                </Title>
                <j-form layout="vertical">
                    <j-form-item>
                        <j-select ref="select" v-model:value="form.storePolicy">
                            <j-select-option
                                v-for="(item, index) in storageList"
                                :key="index"
                                :value="item.id"
                                >{{ item.name }}</j-select-option
                            >
                        </j-select>
                    </j-form-item>
                </j-form>
                <PermissionButton
                    type="primary"
                    @click="submitDevice"
                    hasPermission="device/Instance:update"
                    >保存</PermissionButton
                >
            </j-col>
            <j-col
                :span="12"
                v-if="config?.routes && config?.routes?.length > 0"
            >
                <div class="info">
                    <div>
                        <div style="font-weight: 600; margin: 0 0 10px 0">
                            {{
                                access?.provider === 'mqtt-server-gateway' ||
                                access?.provider === 'mqtt-client-gateway'
                                    ? 'topic'
                                    : 'URL信息'
                            }}
                        </div>
                        <j-table
                            :columns="
                                config.id === 'MQTT' ? columnsMQTT : columnsHTTP
                            "
                            :data-source="config?.routes"
                            :pagination="false"
                            :scroll="{ y: 500 }"
                        >
                            <template #bodyCell="{ text, column, record }">
                                <template v-if="column?.key === 'topic'">
                                    <j-tooltip
                                        placement="topLeft"
                                        :title="text"
                                    >
                                        <div class="ellipsis-style">
                                            {{ text }}
                                        </div>
                                    </j-tooltip>
                                </template>
                                <template v-if="column?.key === 'stream'">
                                    <div>{{ getStream(record) }}</div>
                                </template>
                                <template v-if="column.key === 'description'">
                                    <j-tooltip
                                        placement="topLeft"
                                        :title="text"
                                    >
                                        <div class="ellipsis-style">
                                            {{ text }}
                                        </div>
                                    </j-tooltip>
                                </template>
                                <template v-if="column?.key === 'address'">
                                    <j-tooltip
                                        placement="topLeft"
                                        :title="text"
                                    >
                                        <div class="ellipsis-style">
                                            {{ text }}
                                        </div>
                                    </j-tooltip>
                                </template>
                                <template v-if="column?.key === 'example'">
                                    <j-tooltip
                                        placement="topLeft"
                                        :title="text"
                                    >
                                        <div class="ellipsis-style">
                                            {{ text }}
                                        </div>
                                    </j-tooltip>
                                </template>
                            </template>
                        </j-table>
                    </div>
                </div>
            </j-col>
        </j-row>
    </div>
    <!-- 选择设备 -->
    <AccessModal
      v-if='visible'
      :product-id='productStore.current.id'
      :deviceType='productStore.current.deviceType'
      :accessId='accessId'
      :providersList='dataSource'
      @cancel=' visible = false'
      @submit='checkAccess'
    />
</template>

<script lang="ts" setup name='AccessConfig'>
import { useProductStore } from '@/store/product';
import { ConfigMetadata } from '@/views/device/Product/typings';
import { Empty, message } from 'jetlinks-ui-components';
import Title from '../Title/index.vue';
import { usePermissionStore } from '@/store/permission';
import { steps, steps1 } from './util';
import './index.less';
import {
    getProviders,
    _deploy,
    _undeploy,
    queryList,
    getConfigView,
    getConfigMetadata,
    productGuide,
    productGuideSave,
    getStoragList,
    saveDevice,
    updateDevice,
    detail,
    modify,
} from '@/api/device/product';

import Driver from 'driver.js';
import 'driver.js/dist/driver.min.css';
import { marked } from 'marked';
import type { TableColumnType } from 'ant-design-vue';
import { useMenuStore } from '@/store/menu';
import _ from 'lodash';
import { accessConfigTypeFilter } from '@/utils/setting';
import AccessModal from './accessModal.vue'

const productStore = useProductStore();
const tableRef = ref();
const formRef = ref();
const menuStore = useMenuStore();
const permissionStore = usePermissionStore();
const render = new marked.Renderer();
marked.setOptions({
    renderer: render,
    gfm: true,
    pedantic: false,
    snaitize: false,
});
const simpleImage = ref(Empty.PRESENTED_IMAGE_SIMPLE);
const visible = ref<boolean>(false);
const access = ref<Record<string, any>>({});
const accessId = ref<string>(productStore.current.accessId)
const config = ref<any>({});
const metadata = ref<ConfigMetadata>({ properties: [] });
const dataSource = ref<string[]>([]);
const storageList = ref<any[]>([]);
const markdownToHtml = shallowRef('');
const current = ref({
    id: productStore.current?.accessId,
    name: productStore.current?.accessName,
    protocol: productStore.current?.messageProtocol,
    transport: productStore.current?.transportProtocol,
    protocolDetail: {
        name: productStore.current?.protocolName,
    },
});
//存储数据
const form = reactive<Record<string, any>>({
    storePolicy: 'default-row' || productStore.current?.storePolicy || '',
});
// 表单数据
const formData = reactive<Record<string, any>>({
    data: productStore.current?.configuration || {},
});
/**
 * 显示弹窗
 */
const showModal = () => {
    visible.value = true;
};

/**
 * 关闭弹窗
 */
const cancel = () => {
    queryParams.value = {};
    visible.value = false;
};
/**
 * 打开设备弹窗
 */
const showDevice = () => {
    visible.value = true;
};

const param = ref<Record<string, any>>({
    pageSize: 4,
    terms: [],
});
const queryParams = ref<Record<string, any>>({});

const currentForm = ref({});

const search = (e: any) => {
    queryParams.value = {
        ...e,
    };
};

const stepsRef = reactive({ current: 0 });

/**
 * 保存引导页数据
 */
const guide = (data: any) => {
    productGuideSave(data);
};
/**
 * 显示引导页
 */
const driver = new Driver({
    allowClose: false,
    doneBtnText: '我知道了',
    closeBtnText: '不再提示',
    nextBtnText: '下一步',
    prevBtnText: '上一步',
    onNext: () => {
        stepsRef.current = stepsRef.current + 1;
    },
    onPrevious: () => {
        stepsRef.current = stepsRef.current - 1;
    },
    onReset: () => {
        if (stepsRef.current !== 3) {
            guide({
                name: 'guide',
                content: 'skip',
            });
        }
        stepsRef.current = 0;
    },
});

const driver1 = new Driver({
    allowClose: false,
    doneBtnText: '我知道了',
    closeBtnText: '不再提示',
    nextBtnText: '下一步',
    prevBtnText: '上一步',
    onNext: () => {
        stepsRef.current = stepsRef.current + 1;
    },
    onPrevious: () => {
        stepsRef.current = stepsRef.current - 1;
    },
    onReset: () => {
        if (stepsRef.current !== 4) {
            guide({
                name: 'guide',
                content: 'skip',
            });
        }
        stepsRef.current = 0;
    },
});

let columnsMQTT = ref(<TableColumnType>[]);
const ColumnsMQTT = [
    {
        title: 'topic',
        dataIndex: 'topic',
        key: 'topic',
        ellipsis: true,
    },
    {
        title: '上下行',
        dataIndex: 'stream',
        key: 'stream',
        ellipsis: true,
        align: 'center',
        width: 100,
        scopedSlots: { customRender: 'stream' },
    },
    {
        title: '说明',
        dataIndex: 'description',
        key: 'description',
        ellipsis: true,
    },
];
const columnsHTTP = ref(<TableColumnType>[]);
const ColumnsHTTP = [
    {
        title: '地址',
        dataIndex: 'address',
        key: 'address',
        ellipsis: true,
        // scopedSlots: { customRender: 'address' },
    },
    {
        title: '示例',
        dataIndex: 'example',
        key: 'example',
        ellipsis: true,
        // scopedSlots: { customRender: 'example' },
    },
    {
        title: '说明',
        dataIndex: 'description',
        key: 'description',
        ellipsis: true,
        // scopedSlots: { customRender: 'description' },
    },
];
/**
 * 获取上下行数据
 */
const getStream = (record: any) => {
    const list = [];
    if (record?.upstream) {
        list.push('上行');
    }
    if (record?.downstream) {
        list.push('下行');
    }
    return `${list.join(',')}`;
};
/**
 * 查询接入方式
 */
const queryAccessDetail = async (id: string) => {
    const res = await queryList({
        terms: [
            {
                column: 'id',
                value: id,
            },
        ],
    }).then((res: any) => {
        if (res.status === 200) {
            access.value = res.result.data[0];
        }
    });
};

const handleColumns = () => {
  const Group = {
    title: '分组',
    dataIndex: 'group',
    key: 'group',
    ellipsis: true,
    align: 'center',
    width: 100,
    customCell: (record: any, rowIndex: number) => {
      const obj = {
        children: record,
        rowSpan: 0,
      };
      const list = config.value?.routes || [];

      const arr = list.filter(
        (res: any) => res.group === record.group,
      );

      const isRowIndex =
        rowIndex === 0 ||
        list[rowIndex - 1].group !== record.group;
      isRowIndex && (obj.rowSpan = arr.length);

      return obj;
    },
  };
  columnsMQTT.value = [Group, ...ColumnsMQTT];
  columnsHTTP.value = [Group, ...ColumnsHTTP];
}

/**
 * 查询协议信息
 */
const getConfigDetail = (
    messageProtocol: string,
    transportProtocol: string,
) => {
    getConfigView(messageProtocol, transportProtocol).then((resp) => {
        if (resp.status === 200) {
            config.value = resp.result;
            handleColumns()
            if (config.value?.document) {
                markdownToHtml.value = marked(config.value.document);
            }
        }
    });
};

const modifyArray = (oldData: any[], newData: any[]) => {
    newData.map((item) => {
        if (!_.map(oldData, 'id').includes(item.id)) {
            oldData.push(item);
        }
    });
    return oldData.map((item, index) => {
        return { ...item, sortsIndex: index };
    });
};
/**
 *
 */
const getGuide = async (isDriver1: boolean = false) => {
    const res: any = await productGuide();
    if (res.result && res.result?.content === 'skip') {
        return;
    } else {
        if (isDriver1) {
            driver1.defineSteps(steps1);
            driver1.start();
        } else {
            driver.defineSteps(steps);
            driver.start();
        }
    }
};

const checkAccess = async (data: any) => {
  visible.value = false
  accessId.value = data.access.id
  access.value = data.access
  metadata.value = data.metadata[0]
  config.value = data.access?.transportDetail || {}
  handleColumns()
  markdownToHtml.value = config.value?.document ? marked(config.value.document) : '';
  getGuide(!!data.metadata.length); //
}

/**
 * 获取协议类型名称
 */
const getProvidersList = async () => {
  const res: any = await getProviders();
  dataSource.value = res.result;
};

/**
 * 查询保存数据信息
 */
const getData = async (accessId?: string) => {
    const _accessId = accessId || productStore.current?.accessId;
    if (productStore.current?.id) {
        getConfigMetadata(productStore.current?.id).then((resp: any) => {
            metadata.value = (resp?.result[0] as ConfigMetadata) || {
                properties: [],
            };
            // 流传输模式 初始为udp模式
            if (metadata.value?.properties) {
                metadata.value?.properties.forEach((item) => {
                    if (
                        item.name === '流传输模式' &&
                        (!productStore.current?.configuration ||
                            !productStore.current?.configuration.hasOwnProperty(
                                item.name,
                            ))
                    ) {
                        formData.data[item.name] =
                            item.type.expands?.defaultValue;
                    }
                });
            }
            if (accessId) {
                // 切换接入方式之后获取是否显示引导
                getGuide(resp?.result.length); //
            }
        });
    }
    if (_accessId) {
        // 有设备接入
        // const metadataResp = await getConfigMetadata(productStore.current!.id)
        // if (metadataResp.success) {
        //   metadata.value = (metadataResp.result?.[0] as ConfigMetadata[]) || [];
        // }
        queryAccessDetail(_accessId);
        getConfigDetail(
            productStore.current?.messageProtocol || '',
            productStore.current?.transportProtocol || '',
        );

    }
    // else {
    //   if (productStore.current?.id) {
    //     getConfigMetadata(productStore.current?.id).then((resp: any) => {
    //       metadata.value = resp?.result[0] as ConfigMetadata[];
    //     });
    //   }
    // }
    getStoragList().then((resp: any) => {
        if (resp.status === 200) {
            storageList.value = resp.result;
        }
    });
};

/**
 * 保存设备接入
 */
const submitDevice = async () => {
    const res = await formRef.value.validate();
    const values = { storePolicy: form.storePolicy, ...formData.data };
    const result: any = {};
    flatObj(values, result);
    const { storePolicy, ...extra } = result;
    const id = productStore.current?.id;
    //TODO 二次确认是否覆盖物模型
    // 更新选择设备(设备接入)
    const accessObj = {
      ...productStore.current,
      transportProtocol: access.value?.transport,
      protocolName: access.value?.protocolDetail?.name,
      accessId: access.value?.id,
      accessName: access.value?.name,
      accessProvider: access.value?.provider,
      messageProtocol: access.value?.protocol,
    }
    const updateDeviceResp = await updateDevice(accessObj)

    if (!updateDeviceResp.success) return

    // 更新产品配置信息
    const resp = await modify(id || '', {
        id: id,
        configuration: { ...extra },
        storePolicy: storePolicy,
    });
    if (resp.status === 200) {
        message.success('操作成功！');
        productStore.current!.storePolicy = storePolicy;
        if ((window as any).onTabSaveSuccess) {
            if (resp.result) {
                (window as any).onTabSaveSuccess(resp);
                setTimeout(() => window.close(), 300);
            }
        } else {
            getDetailInfo();
        }
    }
};

const flatObj = (obj: any, result: any) => {
    Object.keys(obj).forEach((key: string) => {
        if (typeof obj[key] === 'string') {
            result[key] = obj[key];
        } else {
            flatObj(obj[key], result);
        }
    });
};

const getDetailInfo = () => {};


getProvidersList()
/**
 * 初始化
 */
watchEffect(() => {
    if (productStore.current?.storePolicy) {
        form.storePolicy = productStore.current!.storePolicy;
    }
});

const tooltip = computed(() => {
  if (productStore.current?.count > 0) {
    return '产品下有设备实例时不能更换接入方式'
  }
  if (productStore.current.state === 1) {
    return '停用产品后才可更换接入方式'
  }
  return ''
})

const checkDisabled = computed(() => {
  if (productStore.current?.count > 0 || productStore.current.state === 1) {
    return true
  }
  return false
})

nextTick(() => {
    getData();
});
watch(
    () => productStore.current,
    () => {
        getData();
        formData.data = productStore.current?.configuration || {};
    },
);
</script>
<style lang="less" scoped>
:deep(
        ._jtable-body_1eyxz_1
            ._jtable-body-header_1eyxz_6
            ._jtable-body-header-right_1eyxz_12
            ._jtable-body-header-right-button_1eyxz_17
    ) {
    display: none;
    margin-left: 10px;
    gap: 8px;
}

.item-style {
    margin-bottom: 10px;
}
.ellipsis-style {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.context-access {
    margin-right: 10px;
    color: #666;
    font-weight: 400;
    font-size: 12px;
}
.changeBtn {
    margin: 0 0 0 20px;
}
</style>
