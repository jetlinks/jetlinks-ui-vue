<template>
  <j-modal 
    :title="type==='add'?$t('save.index.464662-0'):$t('save.index.464662-1')" 
    visible 
    @cancel="closeModal"
    @ok="submitData"  
    width="650px" 
    :maskClosable="false"
    :confirmLoading="loading"
  >
    <j-form layout="vertical" :rules="rules" ref="formRef" :model="form" >
        <j-form-item :label="$t('save.index.464662-2')" name="id">
            <j-input v-model:value="form.id" :disabled="type ==='edit'"></j-input>
        </j-form-item>
        <j-form-item :label="$t('save.index.464662-3')" name="name">
            <j-input v-model:value="form.name"></j-input>
        </j-form-item>
        <j-form-item :label="$t('save.index.464662-4')" name="status">
            <j-radio-group v-model:value="form.status">
                <j-radio-button :value="1">{{ $t('save.index.464662-5') }}</j-radio-button>
                <j-radio-button :value="0">{{ $t('save.index.464662-6') }}</j-radio-button>
            </j-radio-group>
        </j-form-item>
        <j-form-item :label="$t('save.index.464662-7')" name="describe">
            <j-textarea :rows="4" :maxlength="200" v-model:value="form.describe"></j-textarea>
        </j-form-item>
    </j-form>
  </j-modal>
</template>

<script lang="ts" setup>
import { isInput } from '@/utils/regular';
import type { Rule } from 'ant-design-vue/es/form';
import { verifyId,addDictionary } from '@/api/system/dictionary'
import { onlyMessage } from '@/utils/comm';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const props = defineProps({
    type:{
        type:String,
        default:'add'
    },
    data:{
        type:Object,
        default:{}
    }
})
const emit = defineEmits(['closeSave','success'])
const loading = ref(false)
const formRef = ref()
const form = reactive({
    id:'',
    name:'',
    describe:'',
    status:1,
})
/**
 * 校验id
 */
 const validateInput = async (_rule: Rule, value: string) => {
    if (value) {
        if (!isInput(value)) {
            return Promise.reject($t('save.index.464662-8'));
        } else {
            if (props.type === 'add') {
                const res:any = await verifyId(value);
                if (res.status === 200 && res.result) {
                    return Promise.reject($t('save.index.464662-9'));
                } else {
                    return Promise.resolve();
                }
            }
        }
    } else {
        return Promise.resolve();
    }
};

const rules = {
    id: [
        { required:true,message:$t('save.index.464662-10'),trigger: 'blur' },
        { max: 64, message: $t('save.index.464662-11'), trigger: 'change' },
        {  validator: (rule: Rule, value: string) => {
                // 判断是否满足执行后续验证逻辑的条件
                if (value && value.length <= 64) {
                    return validateInput(rule, value);
                } else {
                    return Promise.reject();
                }
            },  trigger: 'blur' },
    ],
    name: [
        { required: true, message: $t('save.index.464662-12'), trigger: 'blur' },
        { max: 64, message: $t('save.index.464662-11'), trigger: 'change' },
    ],
    status: [
        {
            required: true,
            message:$t('save.index.464662-13'),
            trigger: 'blur',
        },
    ],
    description: [
        { max: 200, message: $t('save.index.464662-14'), trigger: 'blur' },
    ],
}

const submitData = () =>{
    formRef.value.validate().then(async()=>{
        loading.value = true
        const res = await addDictionary(form)
            if(res.status === 200){
                onlyMessage($t('save.index.464662-15'))
                emit('success')
            }else{
                onlyMessage($t('save.index.464662-16'),'error')
            }
        loading.value = false
    })
}
const closeModal = ()=>{
    emit('closeSave')
}
onMounted(()=>{
    if(props.type==='edit' && props.data){
        form.describe = props.data.describe
        form.id = props.data.id
        form.name = props.data.name
        form.status = props.data.status
    }
})
</script>
<style lang="less" scoped>
</style>