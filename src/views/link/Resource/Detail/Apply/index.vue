<template>
    <a-modal
        title="应用资源"
        visible
        :centered="true"
        @cancel="emits('close')"
        :maskClosable="false"
        :width="1000"
    >
        <div class="content">
            <div v-if="step === 0" style="margin-top: 15%">
                <j-card-select
                    :column="2"
                    v-model:value="type"
                    :options="typeList"
                >
                    <template #image="{ image }">
                        <img :src="image" />
                    </template>
                </j-card-select>
            </div>
            <div v-else>
                <List
                    :productList="productList"
                    :resourceMetadata="resourceMetadata"
                />
                <ProtocolList
                    :protocolList="protocolList"
                    :nowProtocolList="nowProtocolList"
                    :newProtocolList="newProtocolList"
                />
            </div>
        </div>

        <template #footer>
            <a-space>
                <a-button @click="emits('close')">取消</a-button>
                <a-button v-if="step === 0" type="primary" @click="onStep"
                    >下一步</a-button
                >
                <a-button v-else type="primary" @click="onSave">确定</a-button>
            </a-space>
        </template>
    </a-modal>
</template>

<script setup lang="ts" name="Apply">
import { getImage, onlyMessage } from '@/utils/comm';
import List from './List.vue';
import ProtocolList from './ProtocolList.vue';
import {
    _queryProduct,
    saveProduct,
    saveProtocol,
    _queryProtocolNew,
    _queryProtocolNow,
    _queryProtocol,
} from '@/api/link/resource';
const emits = defineEmits(['close']);

const typeList = [
    {
        value: 'create',
        label: '快捷创建',
        subLabel: '引用该资源在IOT或网关中创建产品',
        iconUrl: getImage('/device/instance/device-card.png'),
    },
    {
        value: 'update',
        label: '快捷更新',
        subLabel: '快捷更新使用该资源创建的物模型、协议或插件',
        iconUrl: getImage('/device/instance/device-card.png'),
    },
];

const props = defineProps({
    data: {
        type: Object,
        default: () => ({}),
    },
});

const type = ref();
const step = ref(0);
const productList = ref<any>([]);
const resourceMetadata = ref();
const nowProtocolList = ref<any>([]);
const newProtocolList = ref<any>([]);
const protocolList = ref<any>([]);

const onStep = () => {
    if (!type.value) {
        onlyMessage('请选择更新方式', 'warning');
        return;
    }
    if (type.value === 'create') {
    } else {
        step.value = 1;
        getProduct();
        getNewProtocolList();
        getNowProtocolList()
        getProtocolList()
    }
};

const getProduct = async () => {
    const res = await _queryProduct(props.data.id, {
        paging: false,
    });
    if (res.success) {
        productList.value = [
            {
                id: 'ddd',
                name: 'www',
                metadata:
                    '{"functions":[{"output":{"type":"object","properties":[{"valueType":{"type":"string"},"name":"流ID","id":"streamId"},{"valueType":{"type":"string"},"name":"FLV播放地址","id":"flv"},{"valueType":{"type":"string"},"name":"mp4播放地址","id":"mp4"},{"valueType":{"type":"string"},"name":"hls播放地址","id":"hls"}]},"async":true,"inputs":[{"valueType":{"type":"string"},"name":"通道ID","id":"channel","expands":{"required":true}}],"name":"开始推流","id":"StartPushStreaming"},{"output":{"expands":{},"type":"string"},"async":true,"inputs":[{"valueType":{"type":"string"},"name":"通道ID","id":"channel","expands":{"required":true}},{"valueType":{"type":"string"},"name":"录像名称","id":"name","expands":{"required":false}}],"name":"开始录像","id":"StartRecord"},{"output":{"expands":{},"type":"string"},"async":false,"inputs":[{"valueType":{"type":"string"},"name":"通道ID","id":"channel","expands":{"required":true}},{"valueType":{"type":"string"},"name":"流ID","id":"streamId","expands":{"required":false}}],"name":"停止录像","id":"StopRecord"},{"async":true,"inputs":[{"valueType":{"type":"string"},"name":"通道ID","id":"channel","expands":{"required":true}}],"name":"停止推流","id":"StopPushStreaming"},{"output":{"type":"object","properties":[{"valueType":{"round":"HALF_UP","type":"int"},"name":"数据总量","id":"total"},{"valueType":{"type":"array","elementType":{"type":"object","properties":[{"valueType":{"type":"string"},"name":"通道ID","id":"id"},{"valueType":{"type":"string"},"name":"通道名称","id":"name"},{"valueType":{"type":"object","properties":[]},"name":"其他配置","id":"options"}]}},"name":"通道列表","id":"data"}]},"async":false,"inputs":[{"valueType":{"round":"HALF_UP","type":"int"},"name":"分页索引","description":"从0开始","id":"pageIndex","expands":{"required":false}},{"valueType":{"round":"HALF_UP","type":"int"},"name":"每页数量","id":"pageSize","expands":{"required":false}}],"name":"查询通道列表","id":"QueryChannel"},{"output":{"type":"array","elementType":{"type":"object","properties":[{"valueType":{"expands":{"length":"255"},"type":"string"},"name":"名称","id":"name","expands":{"readOnly":false}},{"valueType":{"tz":"Asia/Shanghai","format":"yyyy-MM-dd\'T\'HH:mm:ss","type":"date"},"name":"开始时间","id":"startTime","expands":{"readOnly":false}},{"valueType":{"tz":"Asia/Shanghai","format":"yyyy-MM-dd\'T\'HH:mm:ss","type":"date"},"name":"结束时间","id":"endTime","expands":{"readOnly":false}},{"valueType":{"falseValue":"false","trueText":"是","trueValue":"true","falseText":"否","type":"boolean"},"name":"包含录像文件","id":"includeFiles","expands":{"readOnly":false}}]}},"async":false,"inputs":[{"valueType":{"tz":"Asia/Shanghai","format":"yyyy-MM-dd\'T\'HH:mm:ss","type":"date"},"name":"开始时间","id":"startTime","expands":{"readOnly":false,"required":true}},{"valueType":{"tz":"Asia/Shanghai","format":"yyyy-MM-dd\'T\'HH:mm:ss","type":"date"},"name":"结束时间","id":"endTime","expands":{"readOnly":false,"required":true}},{"valueType":{"elements":[{"text":"计划录像","value":"time"},{"text":"所有类型","value":"all"},{"text":"报警录像","value":"alarm"},{"text":"主动录像","value":"manual"}],"type":"enum"},"name":"录像类型","id":"type","expands":{"readOnly":false}},{"valueType":{"type":"string"},"name":" 通道ID","id":"channel","expands":{"required":true}}],"name":"查询录像列表","id":"QueryRecordList"}],"properties":[],"events":[],"tags":[]}',
            },
            {
                id: 'ddd',
                name: 'www',
                metadata:
                    '{"functions":[{"output":{"type":"object","properties":[{"valueType":{"type":"string"},"name":"流ID","id":"streamId"},{"valueType":{"type":"string"},"name":"FLV播放地址","id":"flv"},{"valueType":{"type":"string"},"name":"mp4播放地址","id":"mp4"},{"valueType":{"type":"string"},"name":"hls播放地址","id":"hls"}]},"async":true,"inputs":[{"valueType":{"type":"string"},"name":"通道ID","id":"channel","expands":{"required":true}}],"name":"开始推流","id":"StartPushStreaming"},{"output":{"expands":{},"type":"string"},"async":true,"inputs":[{"valueType":{"type":"string"},"name":"通道ID","id":"channel","expands":{"required":true}},{"valueType":{"type":"string"},"name":"录像名称","id":"name","expands":{"required":false}}],"name":"开始录像","id":"StartRecord"},{"output":{"expands":{},"type":"string"},"async":false,"inputs":[{"valueType":{"type":"string"},"name":"通道ID","id":"channel","expands":{"required":true}},{"valueType":{"type":"string"},"name":"流ID","id":"streamId","expands":{"required":false}}],"name":"停止录像","id":"StopRecord"},{"async":true,"inputs":[{"valueType":{"type":"string"},"name":"通道ID","id":"channel","expands":{"required":true}}],"name":"停止推流","id":"StopPushStreaming"},{"output":{"type":"object","properties":[{"valueType":{"round":"HALF_UP","type":"int"},"name":"数据总量","id":"total"},{"valueType":{"type":"array","elementType":{"type":"object","properties":[{"valueType":{"type":"string"},"name":"通道ID","id":"id"},{"valueType":{"type":"string"},"name":"通道名称","id":"name"},{"valueType":{"type":"object","properties":[]},"name":"其他配置","id":"options"}]}},"name":"通道列表","id":"data"}]},"async":false,"inputs":[{"valueType":{"round":"HALF_UP","type":"int"},"name":"分页索引","description":"从0开始","id":"pageIndex","expands":{"required":false}},{"valueType":{"round":"HALF_UP","type":"int"},"name":"每页数量","id":"pageSize","expands":{"required":false}}],"name":"查询通道列表","id":"QueryChannel"},{"output":{"type":"array","elementType":{"type":"object","properties":[{"valueType":{"expands":{"length":"255"},"type":"string"},"name":"名称","id":"name","expands":{"readOnly":false}},{"valueType":{"tz":"Asia/Shanghai","format":"yyyy-MM-dd\'T\'HH:mm:ss","type":"date"},"name":"开始时间","id":"startTime","expands":{"readOnly":false}},{"valueType":{"tz":"Asia/Shanghai","format":"yyyy-MM-dd\'T\'HH:mm:ss","type":"date"},"name":"结束时间","id":"endTime","expands":{"readOnly":false}},{"valueType":{"falseValue":"false","trueText":"是","trueValue":"true","falseText":"否","type":"boolean"},"name":"包含录像文件","id":"includeFiles","expands":{"readOnly":false}}]}},"async":false,"inputs":[{"valueType":{"tz":"Asia/Shanghai","format":"yyyy-MM-dd\'T\'HH:mm:ss","type":"date"},"name":"开始时间","id":"startTime","expands":{"readOnly":false,"required":true}},{"valueType":{"tz":"Asia/Shanghai","format":"yyyy-MM-dd\'T\'HH:mm:ss","type":"date"},"name":"结束时间","id":"endTime","expands":{"readOnly":false,"required":true}},{"valueType":{"elements":[{"text":"计划录像","value":"time"},{"text":"所有类型","value":"all"},{"text":"报警录像","value":"alarm"},{"text":"主动录像","value":"manual"}],"type":"enum"},"name":"录像类型","id":"type","expands":{"readOnly":false}},{"valueType":{"type":"string"},"name":" 通道ID","id":"channel","expands":{"required":true}}],"name":"查询录像列表","id":"QueryRecordList"}],"properties":[],"events":[],"tags":[]}',
            },
            {
                id: 'ddd',
                name: 'www',
                metadata:
                    '{"functions":[{"output":{"type":"object","properties":[{"valueType":{"type":"string"},"name":"流ID","id":"streamId"},{"valueType":{"type":"string"},"name":"FLV播放地址","id":"flv"},{"valueType":{"type":"string"},"name":"mp4播放地址","id":"mp4"},{"valueType":{"type":"string"},"name":"hls播放地址","id":"hls"}]},"async":true,"inputs":[{"valueType":{"type":"string"},"name":"通道ID","id":"channel","expands":{"required":true}}],"name":"开始推流","id":"StartPushStreaming"},{"output":{"expands":{},"type":"string"},"async":true,"inputs":[{"valueType":{"type":"string"},"name":"通道ID","id":"channel","expands":{"required":true}},{"valueType":{"type":"string"},"name":"录像名称","id":"name","expands":{"required":false}}],"name":"开始录像","id":"StartRecord"},{"output":{"expands":{},"type":"string"},"async":false,"inputs":[{"valueType":{"type":"string"},"name":"通道ID","id":"channel","expands":{"required":true}},{"valueType":{"type":"string"},"name":"流ID","id":"streamId","expands":{"required":false}}],"name":"停止录像","id":"StopRecord"},{"async":true,"inputs":[{"valueType":{"type":"string"},"name":"通道ID","id":"channel","expands":{"required":true}}],"name":"停止推流","id":"StopPushStreaming"},{"output":{"type":"object","properties":[{"valueType":{"round":"HALF_UP","type":"int"},"name":"数据总量","id":"total"},{"valueType":{"type":"array","elementType":{"type":"object","properties":[{"valueType":{"type":"string"},"name":"通道ID","id":"id"},{"valueType":{"type":"string"},"name":"通道名称","id":"name"},{"valueType":{"type":"object","properties":[]},"name":"其他配置","id":"options"}]}},"name":"通道列表","id":"data"}]},"async":false,"inputs":[{"valueType":{"round":"HALF_UP","type":"int"},"name":"分页索引","description":"从0开始","id":"pageIndex","expands":{"required":false}},{"valueType":{"round":"HALF_UP","type":"int"},"name":"每页数量","id":"pageSize","expands":{"required":false}}],"name":"查询通道列表","id":"QueryChannel"},{"output":{"type":"array","elementType":{"type":"object","properties":[{"valueType":{"expands":{"length":"255"},"type":"string"},"name":"名称","id":"name","expands":{"readOnly":false}},{"valueType":{"tz":"Asia/Shanghai","format":"yyyy-MM-dd\'T\'HH:mm:ss","type":"date"},"name":"开始时间","id":"startTime","expands":{"readOnly":false}},{"valueType":{"tz":"Asia/Shanghai","format":"yyyy-MM-dd\'T\'HH:mm:ss","type":"date"},"name":"结束时间","id":"endTime","expands":{"readOnly":false}},{"valueType":{"falseValue":"false","trueText":"是","trueValue":"true","falseText":"否","type":"boolean"},"name":"包含录像文件","id":"includeFiles","expands":{"readOnly":false}}]}},"async":false,"inputs":[{"valueType":{"tz":"Asia/Shanghai","format":"yyyy-MM-dd\'T\'HH:mm:ss","type":"date"},"name":"开始时间","id":"startTime","expands":{"readOnly":false,"required":true}},{"valueType":{"tz":"Asia/Shanghai","format":"yyyy-MM-dd\'T\'HH:mm:ss","type":"date"},"name":"结束时间","id":"endTime","expands":{"readOnly":false,"required":true}},{"valueType":{"elements":[{"text":"计划录像","value":"time"},{"text":"所有类型","value":"all"},{"text":"报警录像","value":"alarm"},{"text":"主动录像","value":"manual"}],"type":"enum"},"name":"录像类型","id":"type","expands":{"readOnly":false}},{"valueType":{"type":"string"},"name":" 通道ID","id":"channel","expands":{"required":true}}],"name":"查询录像列表","id":"QueryRecordList"}],"properties":[],"events":[],"tags":[]}',
            },
        ];

        resourceMetadata.value = JSON.parse(props.data.metadata);
    }
};
//获取新协议
const getNewProtocolList = async () => {
    const res = await _queryProtocolNew(props.data.id, { paging: false });
    if (res.success) {
        newProtocolList.value = res.result;
    }
};
// 获取当前协议
const getNowProtocolList = async () => {
    const res = await _queryProtocolNow(props.data.id, { paging: false });
    if (res.success) {
        nowProtocolList.value = res.result;
    }
};
//受协议影响的产品
const getProtocolList = async () => {
    const res = await _queryProtocol(props.data.id, { paging: false });
    if (res.success) {
        productList.value = res.result;
    }
};

const onSave = () => {
    console.log('====', productList.value);
    const _new = productList.value.filter((i: any) => i.newMetaData);
    if (!_new.length) {
        onlyMessage('请先选择处理方式', 'warning');
        return;
    }
};
</script>

<style lang="less" scoped>
.content {
    height: 60vh;
    overflow-y: auto;
    overflow-x: hidden;
}
</style>
