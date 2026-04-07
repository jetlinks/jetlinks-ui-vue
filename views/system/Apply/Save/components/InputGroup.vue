<template>
    <div>
        <a-input
            @change="onChange"
            :placeholder="$t('components.InputGroup.573743-0')"
            v-model:value="_value.last"
        >
            <template #addonBefore>
                <a-select
                    @change="onChange"
                    v-model:value="_value.first"
                    :options="options"
                    style="width: 100px"
                    :placeholder="$t('components.InputGroup.573743-1')"
                />
            </template>
        </a-input>
    </div>
</template>

<script setup name="InputGroup">
const props = defineProps({
    value: {
        type: String,
    },
});
const emits = defineEmits(['update:value']);

const options = [
    {
        label: 'https://',
        value: 'https://',
    },
    {
        label: 'http://',
        value: 'http://',
    },
];

const _value = reactive({
    first: 'https://',
    last: undefined,
});
const onChange = () => {
    emits('update:value', `${_value.first || ''}${_value.last || ''}`);
};

watch(
    () => props.value,
    (val) => {
        if (val && typeof val === 'string') {
            options.forEach((i) => {
                if (val.startsWith(i.value)) {
                    _value.first = i.value;
                    _value.last = val.replace(i.value, '');
                }
            });
        } else {
            _value.first = 'https://';
            _value.last = undefined;
        }
    },
    {
        immediate: true,
    },
);
</script>

<style lang="less" scoped></style>
