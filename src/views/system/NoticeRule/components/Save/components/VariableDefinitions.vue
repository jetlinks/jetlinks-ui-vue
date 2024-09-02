<template>
    <div style="padding: 50px 200px">
        <a-form
            v-if="variableDefinitions.length"
            :layout="'vertical'"
            ref="formRef"
            :model="modelRef"
        >
            <a-form-item
                :name="`${item?.id}`"
                :label="item?.name"
                v-for="item in variableDefinitions"
                :key="item.id"
                :rules="[
                    {
                        required: getType(item) !== 'file' ? true : false,
                        validator: (_rule, value) =>
                            checkValue(_rule, value, item),
                        trigger: ['change'],
                    },
                ]"
            >
                <Tag
                    :notify="notify"
                    v-if="getType(item) === 'tag'"
                    v-model:value="modelRef[item.id]"
                />
                <InputFile
                    v-else-if="getType(item) === 'file'"
                    v-model:value="modelRef[item.id]"
                />
                <a-input
                    v-else-if="getType(item) === 'link'"
                    v-model:value="modelRef[item.id]"
                />
                <BuildIn
                    v-else
                    :item="item"
                    :providerId="props.notify?.providerId"
                    v-model:value="modelRef[item.id]"
                />
            </a-form-item>
        </a-form>
        <j-empty v-else style="margin: 20px 0" description="当前模版暂无变量" />
    </div>
</template>

<script lang="ts" setup>
import BuildIn from './variableItem/BuildIn.vue';
import Tag from './variableItem/Tag.vue';
import InputFile from './variableItem/InputFile.vue';
import { PropType } from 'vue';

const props = defineProps({
    variableDefinitions: {
        type: Array as PropType<any>,
        default: () => [],
    },
    value: {
        type: Object,
        default: () => ({}),
    },
    notify: {
        type: Object,
        default: () => ({}),
    },
    template: {
        type: Object,
        default: () => ({}),
    },
});

const formRef = ref();

const modelRef = reactive({});

watchEffect(() => {
    Object.assign(modelRef, props?.value);
});

const getType = (item: any) => {
    return item.expands?.businessType || item.type;
};

const checkValue = (_rule: any, value: any, item: any) => {
    const type = item.expands?.businessType || item?.type;
    if (type === 'file') {
        return Promise.resolve();
    } else if (type === 'string' && !value) {
        return Promise.reject(new Error('请输入' + item.name));
    } else if (type === 'link') {
        if (!value) {
            return Promise.reject(new Error('请输入' + item.name));
        } else if (value.length > 64) {
            return Promise.reject(new Error('最多64个字符'));
        }
    } else if (type === 'tag' && !value) {
        return Promise.reject(new Error('请选择' + item.name));
    } else if (['date'].includes(type)) {
        if (!value) {
            return Promise.reject(new Error('请选择' + item.name));
        } else {
            if (value?.source === 'upper') {
                if (!value?.upperKey) {
                    return Promise.reject(new Error('请选择' + item.name));
                } else {
                    return Promise.resolve();
                }
            } else {
                if (!value?.value) {
                    return Promise.reject(new Error('请选择' + item.name));
                } else {
                    return Promise.resolve();
                }
            }
        }
    } else if (value?.source === 'fixed' && !value?.value) {
        return Promise.reject(new Error('请输入' + item.name));
    } else if (
        value?.source === 'relation' &&
        !value?.value &&
        !value?.relation
    ) {
        return Promise.reject(new Error('请选择' + item.name));
    } else if (value?.source === 'upper' && !value.upperKey) {
        return Promise.reject(new Error('请选择' + item.name));
    }
    return Promise.resolve();
};

const onSave = () =>
    new Promise((resolve, reject) => {
        formRef.value
            ?.validate()
            .then((_data: any) => {
                resolve(_data);
            })
            .catch(() => {
                reject(false);
            });
    });

defineExpose({ onSave });
</script>