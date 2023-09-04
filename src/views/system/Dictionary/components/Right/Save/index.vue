<template>
  <j-modal visible :title="type ==='add' ? '新增':'编辑'" @cancel="close" @ok="submitData" :maskClosable="false" :confirmLoading="loading">
    <j-form :model="form" layout="vertical" :rules="rules" ref="formRef">
        <j-form-item label="name"  name="name">
            <j-input placeholder="con_type" v-model:value="form.name"></j-input>
        </j-form-item>
        <j-form-item label="value" name="value">
            <j-input placeholder="con_type" v-model:value="form.value"></j-input>
        </j-form-item>
        <j-form-item label="text" name="text">
            <j-input placeholder="连接失败" v-model:value="form.text"></j-input>
        </j-form-item>
    </j-form>
  </j-modal>
</template>

<script lang="ts" setup>
import { isInput } from '@/utils/regular';
import type { Rule } from 'ant-design-vue/es/form';
import { saveDicItem } from '@/api/system/dictionary';
import { onlyMessage } from '@/utils/comm';
const props = defineProps({
    type:{
        type:String,
        default:'add'
    },
    dicId:{
        type:String,
        default:''
    },
    sort:{
        type:Number,
        default:1
    }
})
const emit = defineEmits(['closeModal','refresh'])
const form = ref({
    dictId:'',
    name:'',
    value:'',
    text:'',
    ordinal:0
})

const loading = ref(false)
const formRef = ref()
/*
* 校验id
 */
 const validateInput = async (_rule: Rule, value: string) => {
    if (value) {
        if (!isInput(value)) {
            return Promise.reject('请输入英文或者数字或者-或者_');
        }
    } else {
        return Promise.resolve();
    }
};
const rules = {
    name: [
        { required:true,message:'请输入name'},
        { validator: validateInput, trigger: 'blur' },
        { max: 64, message: '最多可输入64位字符', trigger: 'change' },
    ],
    value: [
        { required: true, message: '请输入value', trigger: 'blur' },
        { max: 64, message: '最多可输入64位字符', trigger: 'change' },
    ],
    text: [
        { required: true, message: '请输入text', trigger: 'blur' },
        { max: 64, message: '最多可输入64位字符', trigger: 'change' },
    ]
}
const submitData = () =>{
    formRef.value.validate().then(async()=>{
        loading.value = true
        const res = await saveDicItem(form.value)
        if(res.status ===200){
            onlyMessage('操作成功!')
            emit('refresh')
        }else{
            onlyMessage('操作失败!','error')
        }
        loading.value = false
    })
}
const close = () =>{
    emit('closeModal')
}

watch(()=>props.dicId,()=>{
    form.value.dictId = props.dicId
},{
    immediate:true
})

watch(()=>props.sort,()=>{
    form.value.ordinal = props.sort
},{
    immediate:true
})
</script>
<style lang="less" scoped>
</style>