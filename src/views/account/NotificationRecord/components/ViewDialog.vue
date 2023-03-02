<template>
    <a-modal
        visible
        title="详情"
        width="1000px"
        @ok="emits('update:visible', false)"
        @cancel="emits('update:visible', false)"
    >
        <a-row v-if="data?.targetType === 'device'">
            <a-col :span="6" class="label">告警设备</a-col>
            <a-col :span="6" class="value">
                {{ data?.targetName || '' }}
            </a-col>
            <a-col :span="6" class="label">设备ID</a-col>
            <a-col :span="6" class="value">
                {{ data?.targetId || '' }}
            </a-col>
        </a-row>
        <a-row>
            <a-col :span="6" class="label">告警名称</a-col>
            <a-col :span="6" class="value">
                {{ data?.alarmName || data?.alarmConfigName || '' }}
            </a-col>
            <a-col :span="6" class="label">告警时间</a-col>
            <a-col :span="6" class="value">
                {{ moment(data?.alarmTime).format('YYYY-MM-DD HH:mm:ss') }}
            </a-col>

            <a-col :span="6" class="label">告警级别</a-col>
            <a-col :span="6" class="value">
                {{ (levelList.length > 0 && getLevelLabel(data.level)) || '' }}
            </a-col>
            <a-col :span="6" class="label">告警说明</a-col>
            <a-col :span="6" class="value">{{ data?.description || '' }}</a-col>

            <a-col :span="6" class="label">告警流水</a-col>
            <a-col :span="18" class="value">
                <!-- <MonacoEditor
                    style="width: 100%; height: 370px"
                    theme="vs"
                    v-model="jsonData"
                /> -->
                <JsonViewer :value="jsonData" copyable boxed sort />
            </a-col>
        </a-row>
    </a-modal>
</template>

<script setup lang="ts">
import MonacoEditor from '@/components/MonacoEditor/index.vue';
import {JsonViewer} from 'vue3-json-viewer';
import { queryLevel as queryLevel_api } from '@/api/rule-engine/config';
import moment from 'moment';

const emits = defineEmits(['update:visible']);
const props = defineProps<{
    visible: boolean;
    data: any;
}>();
const levelList = ref<any[]>([]);
const data = computed(() => {
    if (props.data.detailJson) return JSON.parse(props.data.detailJson);
    else return props.data?.detail || props.data;
});

const getLevel = () => {
    queryLevel_api().then((resp: any) => {
        if (resp.status === 200) levelList.value = resp.result.levels;
    });
};
getLevel();
const getLevelLabel = (id: string) => {
    if (levelList.value.length < 1 || !id) return '';
    const obj = levelList.value.find((item) => item.id === id);
    return obj.title;
};

const jsonData = JSON.stringify({
    name: 'qiu', 
    age: 18, 
    isMan: false, 
    arr: [1, 2, 5],
});
</script>

<style scoped></style>
