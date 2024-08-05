<template>
    <j-modal
        visible
        :title="modalType ==='add' ? $t('components.AddDialog.529972-0') : $t('components.AddDialog.529972-1')"
        width="670px"
        @cancel="emits('update:visible', false)"
        @ok="confirm"
        :confirm-loading="loading"
    >
        <j-form ref="formRef" :model="form" layout="vertical">
            <j-form-item
                name="name"
                :label="$t('components.AddDialog.529972-2')"
                :rules="[
                    { required: true, message: $t('components.AddDialog.529972-3') },
                    { max: 64, message: $t('components.AddDialog.529972-4') },
                ]"
            >
                <j-input
                    v-model:value="form.name"
                    :placeholder="$t('components.AddDialog.529972-5')"
                    allow-clear
                />
            </j-form-item>
            <j-form-item
                name="groupId"
                :label="$t('components.AddDialog.529972-6')"
                :rules="[
                    { required: true, message: $t('components.AddDialog.529972-7') },
                ]"
            >
                <j-select
                    v-model:value="form.groupId"
                    :placeholder="$t('components.AddDialog.529972-7')"
                    :options="groupOptions"
                />
            </j-form-item>
            <j-form-item name="name" :label="$t('components.AddDialog.529972-8')">
                <j-textarea
                    v-model:value="form.description"
                    :placeholder="$t('components.AddDialog.529972-9')"
                    allow-clear
                    :maxlength="200"
                    show-count
                />
            </j-form-item>
        </j-form>
    </j-modal>
</template>

<script setup lang="ts">
import { FormInstance } from 'ant-design-vue';
import { saveRole_api , queryRoleGroup , updateRole_api} from '@/api/system/role';
import { useMenuStore } from '@/store/menu';
import { onlyMessage } from '@/utils/comm';
import { cloneDeep } from 'lodash-es'
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const route = useRoute();
const { jumpPage } = useMenuStore();

const emits = defineEmits(['update:visible','refresh']);
const props = defineProps({
    visible: {
        type:Boolean,
        default:false
    },
    groupId:{
        type:String,
        default:""
    },
    modalType:{
        type:String,
        default:'add'
    },
    current:{
        type:Object,
        default:{}
    }
})
// 弹窗相关
const loading = ref(false);
const form = ref<any>({
    name:'',
    groupId:'',
    description:''
});
const formRef = ref<FormInstance>();
const groupOptions = ref<any>([])
const confirm = async() => {
    loading.value = true;
    formRef.value
        ?.validate()
        .then(() => {
            if(props.modalType === 'add'){
                saveRole_api(form.value).then((resp:any)=>{
                    if (resp.status === 200) {
                    onlyMessage($t('components.AddDialog.529972-10'));
                    emits('update:visible', false);
                    if (route.query.save) {
                        // @ts-ignore
                        if((window as any).onTabSaveSuccess){
                            (window as any).onTabSaveSuccess(resp.result.id);
                            setTimeout(() => window.close(), 300);
                        }
                } else jumpPage(`system/Role/Detail`, { id: resp.result.id });
            }
                }).catch(() => (loading.value = false));
            }else{
                updateRole_api(form.value).then((resp:any)=>{
                    if (resp.status === 200) {
                    onlyMessage($t('components.AddDialog.529972-10'));
                    emits('refresh');
                    emits('update:visible', false);
                    }
                }).catch(() => (loading.value = false));
            }
        })
       .catch(() => (loading.value = false));
};
// 表单相关
const  getGroupOptions = ()=>{
    queryRoleGroup({sorts: [{ name: 'createTime', order: 'desc' }]}).then((res:any)=>{
        if(res.status ===200){
           groupOptions.value = res.result.map((item:any)=>{
                return {
                    label:item.name,
                    value:item.id
                } 
            })
        }
    })
}
onMounted(()=>{
    getGroupOptions()
    form.value.groupId = props.groupId
    if(props.modalType === 'edit'){
        // Object.assign(form.value,props.current)
        form.value=cloneDeep(props.current)
    }
})
</script>

<style scoped></style>
