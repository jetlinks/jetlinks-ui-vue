<template>
    <a-modal
        visible
        :title="modalType ==='add' ? $t('components.AddDialog.956922-0') : $t('components.AddDialog.956922-1')"
        width="670px"
        @cancel="emits('update:visible', false)"
        @ok="confirm"
        :confirm-loading="loading"
    >
        <a-form ref="formRef" :model="form" layout="vertical">
            <a-form-item
                name="name"
                :label="$t('components.AddDialog.956922-2')"
                :rules="[
                    { required: true, message: $t('components.AddDialog.956922-3') },
                    { max: 64, message: $t('components.AddDialog.956922-4') },
                ]"
            >
                <a-input
                    v-model:value="form.name"
                    :placeholder="$t('components.AddDialog.956922-5')"
                    allow-clear
                />
            </a-form-item>
            <a-form-item
                name="groupId"
                :label="$t('components.AddDialog.956922-6')"
                :rules="[
                    { required: true, message: $t('components.AddDialog.956922-7') },
                ]"
            >
                <a-select
                    show-search
                    v-model:value="form.groupId"
                    :placeholder="$t('components.AddDialog.956922-7')"
                    :options="groupOptions"
                    optionFilterProp="label"
                />
            </a-form-item>
            <a-form-item name="name" :label="$t('components.AddDialog.956922-8')">
                <a-textarea
                    v-model:value="form.description"
                    :placeholder="$t('components.AddDialog.956922-9')"
                    allow-clear
                    :maxlength="200"
                    show-count
                />
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script setup lang="ts" name="RoleAddDialog">
import { saveRole_api , queryRoleGroup , updateRole_api} from '@/api/system/role';
import { useMenuStore } from '@/store/menu';
import { onlyMessage } from '@jetlinks-web/utils';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const route = useRoute();
const { jumpPage } = useMenuStore();

const emits = defineEmits(['update:visible', 'save']);
const props = defineProps({
    visible: {
        type:Boolean,
        default:false
    },
    groupId:{
        type:String,
        default: undefined
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
    groupId:undefined,
    description:''
});
const formRef = ref<any>();
const groupOptions = ref<any>([])
const confirm = async() => {
    loading.value = true;
    formRef.value
        ?.validate()
        .then(() => {
            if(props.modalType === 'add'){
                saveRole_api(form.value).then((resp:any)=>{
                    if (resp.status === 200) {
                    onlyMessage($t('components.AddDialog.956922-10'));
                    emits('update:visible', false);
                    if (route.query.save) {
                        // @ts-ignore
                        if((window as any).onTabSaveSuccess){
                            (window as any).onTabSaveSuccess(resp.result.id);
                            setTimeout(() => window.close(), 300);
                        }
                } else jumpPage(`system/Role/Detail`, {params:{ id: resp.result.id }});
            }
                }).catch(() => (loading.value = false));
            }else{
                updateRole_api(form.value).then((resp:any)=>{
                    if (resp.status === 200) {
                    onlyMessage($t('components.AddDialog.956922-10'));
                    emits('update:visible', false);
                    emits('save');
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
        form.value = props.current
    }
})
</script>

<style scoped></style>
