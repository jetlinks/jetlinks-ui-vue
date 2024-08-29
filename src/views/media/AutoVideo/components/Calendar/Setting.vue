<template>
    <a-modal
        :maskClosable="false"
        width="750px"
        :visible="true"
        title="设置"
        @ok="handleSave"
        @cancel="handleCancel"
    >
        <div>
            <div style="display: flex">
                <a-checkbox
                    v-model:checked="checkRef.checkAll"
                    :indeterminate="checkRef.indeterminate"
                    style="width: 80px"
                    @change="onCheckAllChange"
                >
                    全部
                </a-checkbox>
                <a-checkbox-group
                    v-model:value="checkRef.checkedList"
                    :options="_options"
                />
            </div>

            <div style="margin-top: 12px">
                <Time :type="type" :value="data.times"  @change="onTime" />
            </div>
        </div>
    </a-modal>
</template>

<script setup lang="ts" name="Setting">
import { onMounted, reactive, ref, watch } from 'vue';
import Time from './Time.vue';

const props = defineProps({
    data: {
        type: Object,
        default: () => ({}),
    },
    options: {
        type: Array,
        default: () => [],
    },
    type: {
        type: String,
        default: 'auto',
    },
    trigger: {
        type: String,
        default: 'week',
    },
});
const emit = defineEmits(['save', 'close']);

const _options = ref();
const checkRef = reactive({
    indeterminate: true,
    checkAll: false,
    checkedList: [],
});
const times = ref(props.data.times || []);

const onCheckAllChange = (e) => {
    const arr = _options.value?.map((item: any) => item.value);
    Object.assign(checkRef, {
        checkedList: e.target.checked ? arr : [props.data?.value],
        indeterminate: false,
    });
};

const onTime = (timeData) => {
    // times.value = data;
    if (props.type === 'auto') {
        const arr = timeData.map((item) => {
            if (item.from) {
                return {
                    trigger: props.trigger,
                    when: [props.data?.value],
                    from: item.from,
                    to: item.to,
                };
            }
        });
        times.value = arr;
    }else{
        const arr = timeData.map((item) => {
            const obj = {
                    trigger: props.trigger,
                    when: [props.data?.value],
                    mod:item.mod,
                }
            if (item.mod === 'period') {
                obj['period'] = item.period
            }
            if(item.mod === 'once'){
                obj['once'] = item.once
            }
            return obj
        });
        times.value = arr;
    }
};

const handleSave = () => {
    const when = checkRef.checkedList.filter((item)=>item!=='all')
    emit('save',times.value,when)
};

const handleCancel = () => {
    emit('close');
};

watch(
    () => checkRef.checkedList,
    (val) => {
        checkRef.indeterminate =
            !!val.length && val.length < _options.value.length;
        checkRef.checkAll = val.length === _options.value.length;
    },
);

onMounted(() => {
    const arr = props.options.map((item: any) => {
        return {
            ...item,
            disabled: item.value === props.data?.value,
        };
    });
    _options.value = arr;
    checkRef.checkedList = [props.data?.value];
});
</script>

<style lang="less"></style>
