<template>
    <a-modal visible title="协议" :width="1000" :maskClosable="false" @ok="submitData"
        @cancel="emits('close')">
        <div class="header">
            <j-input-search allowClear style="margin-right: 8px;" placeholder="请输入"
                @search="protocolSearch"></j-input-search>
            <PermissionButton type="primary" @click="addVisible = true" hasPermission="link/Protocol:add">
                <template #icon>
                    <AIcon type="PlusOutlined" />
                </template>
                新增
            </PermissionButton>
        </div>
        <div class="content">
            <a-row :gutter="[12, 12]" v-if="protocolList.length > 0">
                <a-col v-for="item in protocolList" :key="item.id" :span="8">
                    <AccessCard @checkedChange="protocolChange" :checked="protocolCurrent?.id"
                        :data="{ ...item, type: 'protocol' }"></AccessCard>
                </a-col>
            </a-row>
            <a-empty v-else style="margin-top: 10%" description="暂无数据" />
        </div>
        <Save v-if="addVisible" :data="{}" @change="saveChange" />
    </a-modal>
</template>

<script setup>
import { cloneDeep } from 'lodash-es';
import AccessCard from '../AccessCard/index.vue'
import { getProtocolList } from '@/api/link/accessConfig';
import { queryProtocolDetail } from '@/api/device/quickCreate';
import { ProtocolMapping } from './data';
import Save from '@/views/link/Protocol/Save/index.vue'
const props = defineProps({
    type: {
        type: String,
        default: ''
    },
    data: {
        type: Object,
        default: () => {
        }
    }
})
const emits = defineEmits(['close', 'selectedProtocol'])
const protocolList = ref([])
const allProtocolList = ref([])
const addVisible = ref(false)
const protocolCurrent = ref()
const protocolSearch = () => {
    protocolList.value = value
        ? allProtocolList.value.filter(
            (i) =>
                i.name &&
                i.name
                    .toLocaleLowerCase()
                    .includes(value.toLocaleLowerCase()),
        )
        : allProtocolList.value;
}
const protocolChange = (data) => {
    protocolCurrent.value = data
}

const queryProtocolList = async () => {
    const resp = await getProtocolList(ProtocolMapping.get(props.type), {
        'sorts[0].name': 'createTime',
        'sorts[0].order': 'desc',
        paging: false,
    });
    if (resp.status === 200) {
        protocolList.value = resp.result;
        allProtocolList.value = resp.result;
    }
};

const saveChange = () =>{
    visible.value = false;
    if (value) {
        onlyMessage('操作成功', 'success');
        queryProtocolList();
    }
}

const submitData = async() =>{
    const res = await queryProtocolDetail(protocolCurrent.value.id)
    if(res.success){
        emits('selectedProtocol', res.result)
    }
    
}

onMounted(() => {
    protocolCurrent.value = cloneDeep(props.data)
    queryProtocolList()
})
</script>
<style lang='less' scoped>
.header {
    display: flex;
    padding: 0 20px;
}

.content {
    margin: 12px 0;
    padding: 10px 20px;
    max-height: 400px;
    overflow: auto
}
</style>