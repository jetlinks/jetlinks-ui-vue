<template>
    <div>
        <j-select v-model:value="propertyId" show-search style="width: 80%" placeholder="请选择">
            <j-select-option
                v-for="item in propertyIdListInUse"
                :key="item"
                :value="item"
                >{{ item }}</j-select-option
            >
        </j-select>
    </div>
</template>
<script setup lang="ts" name="propertyId">
import { getBacnetPropertyIdNotUse } from '@/api/data-collect/collector';
const props = defineProps({
    value: {
        type: String,
        default: '',
    },
    collectorId: {
        type: String,
        default: '',
    },
    objectId: {
        type: Object,
        default: () => {},
    },
    checkedList: {
        type: Array,
        default: () => [],
    },
    index: {
        type: Number,
        default: 0,
    },
    valueTypeList: {
        type: Array,
        default: () => []
    }
});
const emit = defineEmits(['update:value']);

const propertyId = computed({
    get: () => {
        return props.value;
    },
    set: (val) => {
        emit('update:value', val);
    }
})

const propertyIdList = ref<Record<string, any>[]>([]);
const getBacnetProperty = async () => {
    const params = {
        collectorId: props.collectorId,
        objectId: props.objectId,
    };
    const res: any = await getBacnetPropertyIdNotUse(params);
    if (res.success) {
        propertyIdList.value = res.result;
    }
};

getBacnetProperty();

const propertyIdListInUse = computed(() => {
    const result = props.checkedList
        .filter((item: any, index: number) => {
            return (
                item.nodeId ==
                    `${props.objectId.type}:${props.objectId.instanceNumber}` &&
                props.index != index
            );
        })
        .map((item: any) => item.propertyId);
    return propertyIdList.value.filter((item: any) => {
        return !result.includes(item);
    });
});
</script>
