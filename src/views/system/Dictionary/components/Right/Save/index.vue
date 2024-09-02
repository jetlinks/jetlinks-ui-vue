<template>
    <a-modal visible :title="type === 'add' ? '新增' : '编辑'" @cancel="close" @ok="submitData" :maskClosable="false"
        :confirmLoading="loading">
        <a-form :model="form" layout="vertical" :rules="rules" ref="formRef">
            <a-form-item label="name" name="name">
                <a-input placeholder="请输入name" v-model:value="form.name"></a-input>
            </a-form-item>
            <a-form-item label="value" name="value">
                <a-input placeholder="请输入value" v-model:value="form.value"></a-input>
            </a-form-item>
            <a-form-item label="text" name="text">
                <a-input placeholder="请输入text" v-model:value="form.text"></a-input>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script lang="ts" setup name="DictionaryItemEdit">
import type { Rule } from 'ant-design-vue/es/form';
import { saveDicItem, verifyValue } from '@/api/system/dictionary';
import {regular, onlyMessage } from '@jetlinks-web/utils';
import { cloneDeep } from 'lodash-es';
const props = defineProps({
    type: {
        type: String,
        default: 'add'
    },
    dicId: {
        type: String,
        default: ''
    },
    sort: {
        type: Number,
        default: 1
    },
    data: {
        type: Object,
        default: {}
    }
})
const emit = defineEmits(['closeModal', 'refresh'])
const form: any = ref({
    dictId: '',
    name: '',
    value: '',
    text: '',
    ordinal: 0,
    searchCode:''
})
const lastValue = ref()
const loading = ref(false)
const formRef = ref()
/*
* 校验name
 */
const validateInput = async (_rule: Rule, value: string) => {
    if (value) {
        if (!regular.isInputReg(value)) {
            return Promise.reject('请输入英文或者数字或者-或者_');
        }
    } else {
        return Promise.resolve();
    }
};
/**
 * 校验value唯一
 */
const validateValue = async (_rule: Rule, value: string) => {
    if (value && lastValue.value !== value) {
        const res:any = await verifyValue({
            terms: [
                {
                    terms: [
                        {
                            value: value,
                            termType: "eq",
                            column: "value"
                        },
                        {
                            value: form.value.dictId,
                            termType: "eq",
                            column: "dictId"
                        }
                    ]
                }
            ]
        })
        if (res.success && res.result) {
                    return Promise.reject('value重复');
                } else {
                    return Promise.resolve();
        }
    } else {
        return Promise.resolve();
    }
}
const rules = {
    name: [
        { required: true, message: '请输入name' },
        { validator: validateInput, trigger: 'change' },
        { max: 64, message: '最多可输入64位字符', trigger: 'change' },
    ],
    value: [
        { required: true, message: '请输入value', trigger: 'blur' },
        { max: 64, message: '最多可输入64位字符', trigger: 'change' },
        { validator: validateValue, trigger: 'blur' }
    ],
    text: [
        { required: true, message: '请输入text', trigger: 'blur' },
        { max: 64, message: '最多可输入64位字符', trigger: 'change' },
    ]
}
const submitData = () => {
    formRef.value.validate().then(async () => {
        loading.value = true
        form.value.searchCode = form.value.name + ':' + form.value.value + ':' + form.value.text
        const res = await saveDicItem(form.value)
        if (res.status === 200) {
            onlyMessage('操作成功!')
            emit('refresh')
        } else {
            onlyMessage('操作失败!', 'error')
        }
        loading.value = false
    })
}
const close = () => {
    emit('closeModal')
}

onMounted(() => {
    if (props.type === 'add') {
        form.value.dictId = props.dicId
        form.value.ordinal = props.sort
    } else {
        form.value = cloneDeep(props.data)
        lastValue.value = props.data.value
    }
})
</script>
<style lang="less" scoped></style>
