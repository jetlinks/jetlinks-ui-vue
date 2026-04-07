<template>
    <a-modal open title="协议" :width="1000" :maskClosable="false" @ok="onSave"
        @cancel="emits('close')">
        <div class="header">
            <a-input-search allowClear style="margin-right: 8px;" placeholder="请输入"
                @search="pluginSearch"></a-input-search>
            <j-permission-button type="primary" @click="addVisible = true" hasPermission="link/plugin:add">
                <template #icon>
                    <AIcon type="PlusOutlined" />
                </template>
                新增
            </j-permission-button>
        </div>
        <div class="content">
            <a-row :gutter="[12, 12]" v-if="pluginList.length > 0">
                <a-col v-for="item in pluginList" :key="item.id" :span="8">
                    <AccessCard @checkedChange="pluginChange" :checked="pluginCurrent?.id"
                        :data="{ ...item, type: 'plugin' }">
                      <template #other>
                        <div v-if="item.version" style="margin-top: 20px">
                          <a-tag>{{'v' + item.version}}</a-tag>
                        </div>
                      </template>
                    </AccessCard>
                </a-col>
            </a-row>
            <a-empty v-else style="margin-top: 10%" description="暂无数据" />
        </div>
        <Save v-if="addVisible" :data="{}" @cancel="addVisible = false" @ok="saveChange" />
    </a-modal>
</template>

<script setup>
import { cloneDeep } from 'lodash-es';
import AccessCard from '../AccessCard/index.vue'
import { getPluginList } from '@device-manager-ui/api/link/accessConfig';
import Save from '@device-manager-ui/views/link/plugin/Save.vue'
import {onlyMessage} from "@jetlinks-web/utils";
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
const emits = defineEmits(['close', 'selectedPlugin'])
const pluginList = ref([])
const addVisible = ref(false)
const pluginCurrent = ref()

const queryPlugin = (params = {}) => {
    getPluginList({
        terms: [
            {
                terms: [
                    {
                        column: 'type',
                        value: props.type === 'media-plugin' ? 'media' : 'deviceGateway',
                        termType: 'eq',
                    },
                ],
            },
            params,
        ],
        sorts: [{ name: 'createTime', order: 'desc' }],
        paging: false,
    }).then((res) => {
        pluginList.value = [];
        if (res.success) {
            pluginList.value = res.result || [];
        }
    });
};
const pluginSearch = () => {
    queryPlugin({
        terms: [
            {
                column: 'name',
                termType: 'like',
                value: `%${val}%`,
            },
        ],
        type: 'and',
    });
}
const pluginChange = (data) => {
    pluginCurrent.value = data
}

const onSave = () => {
  if(pluginCurrent.value?.id){
    emits('selectedPlugin', pluginCurrent.value)
  } else {
    onlyMessage('请选择插件', 'error');
  }
}

const saveChange = (value) => {
    visible.value = false;
    if (value) {
        onlyMessage('操作成功', 'success');
        queryPlugin();
    }
}

onMounted(() => {
    pluginCurrent.value = cloneDeep(props.data)
    queryPlugin()
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
