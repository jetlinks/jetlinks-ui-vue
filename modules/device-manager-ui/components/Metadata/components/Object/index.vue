<template>
    <PopoverModal
        v-model:visible="visible"
        :placement="placement"
        @ok="onOk"
        @cancel="onCancel"
    >
        <template #content>
            <div style="width: 750px">
                <Item
                  v-if="visible"
                  ref="tableRef"
                  :value="myValue"
                  :type="type"
                  :level="level"
                />
            </div>
        </template>
        <slot>
            <a-button type="link" :disabled="disabled" style="padding: 0">
                <template #icon>
                    <AIcon
                        type="EditOutlined"
                        :class="{ 'table-form-required-aicon': !value.length }"
                    />
                </template>
            </a-button>
        </slot>
    </PopoverModal>
</template>

<script setup name="MetadataObject">
import { PopoverModal } from '../index';
import { Form } from 'ant-design-vue';
import Item from './Item.vue'

const props = defineProps({
    value: {
        type: Array,
        default: () => [],
    },
    placement: {
        type: String,
        default: 'top',
    },
    type: {
        type: String,
        default: 'properties',
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    level: {
      type: Number,
      default: 1
    }
});


const emit = defineEmits(['update:value', 'confirm', 'cancel']);
const formItemContext = Form.useInjectFormItemContext();

const tableRef = ref();
const visible = ref(false);
const myValue = ref([])

const onOk = async () => {
    const data = await tableRef.value.validate();
    if (data) {
        visible.value = false;
        emit('update:value', data);
        emit('confirm', data);
        formItemContext.onFieldChange();
    }
};

const onCancel = () => {
    emit('cancel');
};

watch(() => JSON.stringify(props.value), () => {
  myValue.value = props.value
}, { immediate: true })
</script>

<style scoped></style>
