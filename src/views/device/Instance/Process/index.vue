<template>
    <j-modal :maskClosable="false" width="800px" :visible="true" :title="type === 'active' ? '启用' : '同步'" :closable="false">
        <div style="margin: 10px 0px 20px 0px; padding-right: 10px;">
            <div v-if="flag">
                <div>{{ type === 'active' ? '正在启用全部设备' : '正在同步设备状态' }}</div>
                <j-progress :percent="_percent" />
            </div>
            <div v-else>
                <p>{{ type === 'active' ? '启用' : '同步' }}成功：{{ count }}条</p>
                <p v-if="type === 'active'">启用失败：{{ errCount }}条<j-tooltip title="实例信息页面中的配置项未完善">
                        <AIcon style="margin-left: 5px" type="QuestionCircleOutlined" />
                    </j-tooltip></p>
            </div>
        </div>
        <template #footer>
            <j-button v-if="!flag" type="primary" @click="handleCancel">完成</j-button>
        </template>
    </j-modal>
</template>

<script lang="ts" setup>
import { getDeviceNumber } from '@/api/device/instance';
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
    data: {
        type: Object,
        default: () => []
    }
});

const count = ref<number>(0);
const total = ref<number>(0);
const flag = ref<boolean>(true);
const errCount = ref<number>(0);
const source = ref<Record<string, any>>({});

const handleCancel = () => {
    emit('close');
    emit('save');
};

const _percent = computed(() => {
    return total.value ? ((errCount.value + count.value) / total.value * 100).toFixed(2) : 0
})

const getData = (api: string) => {
    flag.value = true;
    let dt = 0;
    let dt1 = 0;
    const _source = new EventSourcePolyfill(api);
    source.value = _source;
    _source.onmessage = (e: any) => {
        const res = JSON.parse(e.data);
        switch (props.type) {
            case 'active':
                if (res.success) {
                    dt += res.total;
                    count.value = dt;
                } else {
                    dt1 += res.total;
                    errCount.value = dt1;
                }
                break;
            case 'sync':
                dt += res;
                count.value = dt;
                break;
            default:
                break;
        }
        if ((count.value + errCount.value) >= total.value) {
            setTimeout(() => {
                _source.close();
                flag.value = false;
            }, 500)
        }
    };
    _source.onerror = () => {
        _source.close();
        flag.value = false;
    };
    _source.onopen = () => { };
};

watch(
    () => props.api,
    (newValue) => {
        if (newValue) {
            getDeviceNumber(props.data).then(resp => {
                if (resp.status === 200) {
                    total.value = resp.result
                    getData(newValue);
                }
            })
        }
    },
    { deep: true, immediate: true },
);
</script>