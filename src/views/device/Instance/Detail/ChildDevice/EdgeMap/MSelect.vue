<template>
    <j-select allowClear v-model:value="_value" @change="onChange" :placeholder="$t('EdgeMap.MSelect.423143-0')" style="width: 100%">
        <j-select-option
            v-for="item in list"
            :key="item.id"
            :value="item.id"
            :label="item.name"
            :filter-option="filterOption"
            >{{ item.name }}</j-select-option
        >
    </j-select>
</template>

<script lang="ts" setup>
import {
    edgeCollector,
    edgePoint,
} from '@/api/device/instance';
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

const _props = defineProps({
    modelValue: {
        type: String,
        default: undefined,
    },
    type: {
        type: String,
        default: 'POINT',
    },
    id: {
        type: String,
        default: '',
    },
    edgeId: {
        type: String,
        default: '',
    }
});

const filterOption = (input: string, option: any) => {
    return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

type Emits = {
    (e: 'update:modelValue', data: string | undefined): void;
};
const emit = defineEmits<Emits>();

const list = ref<any[]>([]);
const _value = ref<string | undefined>(undefined);

watchEffect(() => {
    _value.value = _props.modelValue;
});

const onChange = (_val: string) => {
    emit('update:modelValue', _val);
};

const getCollector = async (_val: string) => {
    if (!_val) {
        return [];
    } else {
        const resp = await edgeCollector(_props.edgeId, {
            terms: [
                {
                    terms: [
                        {
                            column: 'channelId',
                            value: _val,
                        },
                    ],
                },
            ],
        });
        if (resp.status === 200) {
            list.value = (resp.result as any[])?.[0] || []
        }
    }
};

const getPoint = async (_val: string) => {
    if (!_val) {
        return [];
    } else {
        const resp = await edgePoint(_props.edgeId, {
            terms: [
                {
                    terms: [
                        {
                            column: 'collectorId',
                            value: _val,
                        },
                    ],
                },
            ],
        });
        if (resp.status === 200) {
            list.value = (resp.result as any[])?.[0] || []
        }
    }
};

watchEffect(() => {
    if (_props.id) {
        if (_props.type === 'POINT') {
            getPoint(_props.id);
        } else {
            getCollector(_props.id);
        }
    } else {
        list.value = [];
    }
});
</script>

<style lang="less" scoped>
</style>