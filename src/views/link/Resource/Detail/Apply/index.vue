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
                    v-if="protocolList.length"
                    :protocolList="protocolList"
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
    _queryProtocolNowNoPaging,
    _queryProductNoPaging,
} from '@/api/link/resource';
import { useMenuStore } from '@/store/menu';
const emits = defineEmits(['close']);
const menuStory = useMenuStore();
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
const protocolList = ref<any>([]);

const onStep = () => {
    if (!type.value) {
        onlyMessage('请选择更新方式', 'warning');
        return;
    }
    console.log('type.value====',type.value);
    if (type.value[0] === 'create') {
        menuStory.jumpPage('device/Product/QuickCreate',{
            id: props.data.id
        })
    } else {
        step.value = 1;
        getProduct();
        getProtocolList();
    }
};

const getProduct = async () => {
    const res = await _queryProductNoPaging(props.data.id, {
        paging: false,
    });
    if (res.success) {
        productList.value = res.result;
        resourceMetadata.value = JSON.parse(props.data.metadata);
    }
};

// 获取当前协议
const getProtocolList = async () => {
    const res: any = await _queryProtocolNowNoPaging(props.data.id, {
        paging: false,
    });
    if (res.success) {
        const resp: any = await _queryProtocolNew(props.data.id);
        if (resp.success) {
            console.log('now====',res.result);
            console.log('new====',resp.result);
            const arr = res.result.map((item: any) => {
                const obj = resp.result?.find(
                    (i: any) => i.id === item.configuration.sourceId  
                );
                if (obj) {
                    item.newProtocol = obj;
                    return item;
                }
            });
            
            protocolList.value = arr.filter((item: any) => item.configuration.version!==item.newProtocol.version);
        }
    }
};

const onSave = async () => {
    // console.log('====', productList.value, protocolList.value);
    const _new = productList.value.filter((i: any) => i.newMetaData);
    const _newProtocol = protocolList.value.filter((i: any) => i.handle);
    if (!_new.length || !_newProtocol.length) {
        onlyMessage('请先选择处理方式', 'warning');
        return;
    }
    if (_new.length) {
        const res = await saveProduct(productList.value);
    }
    if (_newProtocol) {
        const arr = protocolList.value.filter((i: any) => i.handle === 'cover').map(item=>({
            id:item.id,
            name:item.newProtocol.name,
            type:'jar',
            configuration:{
                location:item.newProtocol.location,
                version:item.newProtocol.version,
                sourceId:item.configuration.sourceId
            }
        }));
        const res = await saveProtocol(arr);
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
