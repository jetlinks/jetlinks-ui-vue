<template>
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
            :required="getType(item) !== 'file' ? true : false"
            :rules="[
                {
                    validator: (_rule, value) => checkValue(_rule, value, item),
                    trigger: 'change',
                },
            ]"
        >
            <User
                :notify="notify"
                v-if="getType(item) === 'user'"
                v-model:value="modelRef[item.id]"
            />
            <Org
                :notify="notify"
                v-else-if="getType(item) === 'org'"
                v-model:value="modelRef[item.id]"
            />
            <Tag
                :notify="notify"
                v-else-if="getType(item) === 'tag'"
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
            <BuildIn v-else :item="item" v-model:value="modelRef[item.id]" />
        </a-form-item>
    </a-form>
</template>

<script lang="ts" setup>
import BuildIn from './variableItem/BuildIn.vue';
import Org from './variableItem/Org.vue';
import Tag from './variableItem/Tag.vue';
import InputFile from './variableItem/InputFile.vue';
import User from './variableItem/User.vue';
import { PropType } from 'vue';

const props = defineProps({
    variableDefinitions: {
        type: Array as PropType<any>,
        default: () => [],
    },
    value: {
        type: Object,
        default: () => {},
    },
    notify: {
        type: Object,
        default: () => {},
    },
});

const formRef = ref();

const modelRef = reactive({});

watchEffect(() => {
    Object.assign(modelRef, props.value);
});

const getType = (item: any) => {
    return item.expands?.businessType || item.type;
};

const checkValue = (_rule: any, value: any, item: any) => {
    const type = item.expands?.businessType || item?.type;
    if (type === 'file') {
        return Promise.resolve();
    } else if (type === 'link') {
        if (!value) {
            return Promise.reject(new Error('请输入' + item.name));
        } else if (value.length > 64) {
            return Promise.reject(new Error('最多64个字符'));
        }
    } else if (type === 'tag' && !value) {
        return Promise.reject(new Error('请选择' + item.name));
    } else if (['date', 'org'].includes(type)) {
        if (!value) {
            return Promise.reject(new Error('请选择' + item.name));
        } else {
            if (value?.source === 'upper') {
                if (!value.upperKey) {
                    return Promise.reject(new Error('请选择' + item.name));
                } else {
                    return Promise.resolve();
                }
            } else {
                if (!value.value) {
                    return Promise.reject(new Error('请选择' + item.name));
                } else {
                    return Promise.resolve();
                }
            }
        }
    } else if (value.source === 'fixed' && !value.value) {
        return Promise.reject(new Error('请输入' + item.name));
    } else if (value.source === 'relation' && !value.value && !value.relation) {
        return Promise.reject(new Error('请选择' + item.name));
    } else if (value.source === 'upper' && !value.upperKey) {
        return Promise.reject(new Error('请选择' + item.name));
    } else if (type === 'user') {
        if (props.notify.notifyType === 'email') {
            if (Array.isArray(value.value)) {
                if (!value.value.length) {
                    return Promise.reject(new Error('请输入收件人'));
                }
                const reg =
                    /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
                const flag = value.value.every((it: string) => {
                    return reg.test(it);
                });
                if (!flag) {
                    return Promise.reject(new Error('请输入正确的邮箱地址'));
                } else {
                    return Promise.resolve();
                }
            } else {
                return Promise.resolve();
            }
        }
        if (
            props.notify.notifyType &&
            ['sms', 'voice'].includes(props?.notify?.notifyType)
        ) {
            const reg = /^[1][3-9]\d{9}$/;
            if (!reg.test(value.value)) {
                return Promise.reject(new Error('请输入正确的手机号码'));
            } else {
                return Promise.resolve();
            }
        }
    }
    return Promise.resolve();
};
</script>