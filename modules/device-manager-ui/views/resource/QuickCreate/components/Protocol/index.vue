<template>
    <a-modal open title="协议" :width="1000" :maskClosable="false" @ok="submitData"
        @cancel="emits('close')">
        <div class="header">
            <a-input-search allowClear style="margin-right: 8px;" placeholder="请输入"
                @search="protocolSearch"></a-input-search>
            <j-permission-button type="primary" @click="addVisible = true" hasPermission="link/Protocol:add">
                <template #icon>
                    <AIcon type="PlusOutlined" />
                </template>
                新增
            </j-permission-button>
        </div>
        <div class="content">
            <a-row :gutter="[12, 12]" v-if="protocolList.length > 0">
                <a-col v-for="item in protocolList" :key="item.id" :span="8">
                    <AccessCard @checkedChange="protocolChange" :checked="protocolCurrent?.id"
                        :data="{ ...item, type: 'protocol' }">
                      <template #other>
                        <div v-if="item.configuration.version" style="margin-top: 20px">
                          <a-tag>{{'v' + item.configuration.version}}</a-tag>
                        </div>
                      </template>
                    </AccessCard>
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
import { getProtocolList } from '@device-manager-ui/api/link/accessConfig';
import { queryProtocolDetail } from '@device-manager-ui/api/resource/quickCreate';
import { ProtocolMapping } from './data';
import Save from '@device-manager-ui/views/link/Protocol/Save/index.vue'
import { onlyMessage } from "@jetlinks-web/utils";

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
const protocolSearch = (value) => {
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

const saveChange = (value) =>{
    addVisible.value = false;
    if (value) {
        onlyMessage('操作成功', 'success');
        queryProtocolList();
    }
}

const submitData = async() =>{
  if(protocolCurrent.value?.id){
    const res = await queryProtocolDetail(protocolCurrent.value.id)
    if(res.success){
      emits('selectedProtocol', res.result)
    }
  } else {
    onlyMessage('请选择协议', 'error');
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
