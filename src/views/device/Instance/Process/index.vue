<template>
    <j-modal
        :maskClosable="false"
        width="800px"
        :visible="true"
        :title="type === 'active' ? '启用' : '同步'"
        :closable="false"
    >
        <div style="margin: 10px 0px 20px 0px">
            <div v-if="flag">
                <div>{{ type === 'active' ? '正在启用全部设备' : '正在同步设备状态' }}</div>
                <j-progress :percent="50" />
            </div>
            <div v-else>
                <p>{{ type === 'active' ? '启用' : '同步' }}成功：{{ count }}条</p>
                <p v-if="type === 'active'">启用失败：{{ errCount }}条<j-tooltip title="实例信息页面中的配置项未完善"><AIcon style="margin-left: 5px" type="QuestionCircleOutlined" /></j-tooltip></p>
            </div>
        </div>
        <template #footer>
            <j-button v-if="!flag" type="primary" @click="handleCancel">完成</j-button>
        </template>
    </j-modal>
</template>

<script lang="ts" setup>
import { EventSourcePolyfill } from 'event-source-polyfill';

const emit = defineEmits(['close', 'save']);
const props = defineProps({
    api: {
        type: String,
        default: '',
    },
    type: {
        type: String,
        default: '',
    },
});
// const eventSource = ref<Record<string, any>>({})
const count = ref<number>(0);
const flag = ref<boolean>(true);
const errCount = ref<number>(0);
const isSource = ref<boolean>(false);
const id = ref<string>('');
const source = ref<Record<string, any>>({});

const handleCancel = () => {
    emit('close');
    emit('save');
};

const getData = (api: string) => {
    flag.value = true;
    let dt = 0;
    const _source = new EventSourcePolyfill(api);
    source.value = _source;
    _source.onmessage = (e: any) => {
        const res = JSON.parse(e.data);
        switch (props.type) {
            case 'active':
                if (res.success) {
                    _source.close();
                    dt += res.total;
                    count.value = dt;
                    flag.value = false;
                } else {
                    if (res.source) {
                        errCount.value = 1
                        id.value = res.source.id;
                        isSource.value = true;
                    } else {
                        errCount.value = 1
                    }
                }
                break;
            case 'sync':
                dt += res;
                count.value = dt;
                flag.value = false;
                break;
            default:
                break;
        }
    };
    _source.onerror = () => {
        _source.close();
        flag.value = false;
    };
    _source.onopen = () => {};
};

watch(
    () => props.api,
    (newValue) => {
        if (newValue) {
            getData(newValue);
        }
    },
    { deep: true, immediate: true },
);
</script>