<template>
    <a-modal
        title="网络组件"
        visible
        :width="1000"
        :maskClosable="false"
        @ok="emits('selectedNetWork', networkCurrent)"
        @cancel="emits('close')"
    >
        <div class="header">
            <j-input-search
                allowClear
                style="margin-right: 8px"
                placeholder="请输入"
                @search="networkSearch"
            ></j-input-search>
            <a-button @click="addVisible = true">新增</a-button>
        </div>
        <div class="content">
            <a-row :gutter="[12, 12]" v-if="networkList.length > 0">
                <a-col v-for="item in networkList" :key="item.id" :span="8">
                    <AccessCard
                        @checkedChange="checkedChange"
                        :checked="networkCurrent?.id"
                        :data="{
                            ...item,
                            description: item.description
                                ? item.description
                                : descriptionList[type],
                            type: 'network',
                        }"
                    ></AccessCard>
                </a-col>
            </a-row>
            <a-empty v-else style="margin-top: 10%" description="暂无数据" />
        </div>
        <AddNetWork
            v-if="addVisible"
            :type="NetworkTypeMapping.get(type)"
            @close="addVisible = false"
            @refresh="queryNetworkList"
        />
    </a-modal>
</template>

<script setup>
import { queryNetWork } from '@/api/device/quickCreate';
import AccessCard from '../AccessCard/index.vue';
import { cloneDeep } from 'lodash-es';
import { NetworkTypeMapping, descriptionList } from './data';
import AddNetWork from './AddNetWork.vue';
const props = defineProps({
    type: {
        type: String,
        default: '',
    },
    data: {
        type: Object,
        default: () => {},
    },
});
const emits = defineEmits(['close', 'selectedNetWork']);

const networkList = ref([]);
const allNetworkList = ref([]);
const addVisible = ref(false);
const networkCurrent = ref();

const queryNetworkList = async (data = {}) => {
    addVisible.value = false
    const params = {
        paging: false,
        sorts: [
            {
                name: 'createTime',
                order: 'desc',
            },
        ],
        terms: [
            {
                terms: [
                    {
                        type: 'or',
                        value: NetworkTypeMapping.get(props.type),
                        termType: 'eq',
                        column: 'type',
                    },
                ],
            },
        ],
    };
    const resp = await queryNetWork(params);
    if (resp.status === 200) {
        networkList.value = resp.result;
        allNetworkList.value = resp.result;
    }
};

const networkSearch = (val) => {
    networkList.value = val
        ? allNetworkList.value.filter(
              (i) =>
                  i.name &&
                  i.name.toLocaleLowerCase().includes(val.toLocaleLowerCase()),
          )
        : allNetworkList.value;
};

const checkedChange = (data) => {
    networkCurrent.value = data;
};

onMounted(() => {
    networkCurrent.value = cloneDeep(props.data);
    queryNetworkList();
});
</script>
<style lang="less" scoped>
.header {
    display: flex;
    padding: 0 20px;
}

.content {
    margin: 12px 0;
    padding: 10px 20px;
    max-height: 400px;
    overflow: auto;
}
</style>
