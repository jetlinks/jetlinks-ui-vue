<template>
    <a-modal title="编辑物模型" visible :width="600" :maskClosable="false" @ok="submitData" @cancel="emits('close')">
        <a-tabs v-model:activeKey="activeKey">
            <a-tab-pane key="property" tab="属性">
                <SelectMetadata v-model:value="metadataData.properties" :data="metadata?.properties" />
            </a-tab-pane>
            <a-tab-pane key="function" tab="功能">
                <SelectMetadata v-model:value="metadataData.functions" :data="metadata?.functions" />
            </a-tab-pane>
            <a-tab-pane key="event" tab="事件">
                <SelectMetadata v-model:value="metadataData.events" :data="metadata?.events" />
            </a-tab-pane>
            <a-tab-pane key="tag" tab="标签">
                <SelectMetadata v-model:value="metadataData.tags" :data="metadata?.tags" />
            </a-tab-pane>
        </a-tabs>
    </a-modal>
</template>

<script setup>
import { cloneDeep } from 'lodash-es';
import SelectMetadata from './SelectMetadata.vue';
const props = defineProps({
    metadata: {
        type: Object,
        default: () => {

        }
    },
    data:{
        type:Object,
        default: ()=>{

        }
    }
})
const emits = defineEmits(['close', 'complete']);
const activeKey = ref('property');
const metadataData = ref({
    properties: [],
    events: [],
    functions: [],
    tags: []
})
const submitData = () => {
    emits('complete', metadataData.value)
}

onMounted(() => {
    metadataData.value = cloneDeep(props.data) || {
        properties: [],
        events: [],
        functions: [],
        tags: []
    }
})
</script>
<style lang='less' scoped></style>