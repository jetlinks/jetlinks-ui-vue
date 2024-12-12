<template>
    <a-modal
        visible
        :title="editType === 'add' ? $t('components.editTag.984859-0') : $t('components.editTag.984859-1')"
        @cancel="emit('closeEditTag')"
        @ok="submit"
        :confirmLoading="loading"
    >
        <a-form :model="tagInfo" ref="form">
            <a-row :gutter="16">
                <a-col>
                    <a-form-item name="color">
                        <ColorPicker
                            type="color"
                            :hex="tagInfo.color"
                            :rgba="tagInfo.color"
                            :themeColor="themeColor"
                            :show-opacity="false"
                            @change="changeColor"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="20">
                    <a-form-item
                        name="name"
                        :rules="[
                            {
                                required: true,
                                message:$t('components.editTag.984859-2')
                            },
                            {
                                max: 16,
                                message: $t('components.editTag.984859-3'),
                            },
                        ]"
                    >
                        <a-input
                            v-model:value="tagInfo.name"
                            :placeholder="$t('components.editTag.984859-2')"
                        ></a-input>
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
    </a-modal>
</template>

<script setup name="EditTag">
import { saveTag, saveTagsColor, getTagsColor } from '@/api/system/calendar';
import { onlyMessage } from '@jetlinks-web/utils';
import { randomString } from '@jetlinks-web/utils';
import ColorPicker from 'colorpicker-v3';
import 'colorpicker-v3/style.css';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const props = defineProps({
    editType: {
        type: String,
        default: 'add',
    },
    editData: {
        type: Object,
        default: {},
    },
});
const emit = defineEmits(['closeEditTag', 'refresh']);
const tagInfo = reactive({
    color: '#000000',
    name: '',
});
const form = ref();
const colorData = ref();
const changeColor = ({rgba}) => {
    tagInfo.color = rgba;
};
const loading = ref(false)
const themeColor =  [
    '#69B1FF',
    '#5CDBD3',
    '#FFAF6E',
    '#85A5FF',
    '#F4D160',
    '#95DE64',
    '#B37FEB',
    '#FFEC3D',
    '#FF7875',
    '#FF85C0'
]
const submit = () => {
    form.value.validate().then(async () => {
        loading.value = true
        let id;
        if (props.editType === 'add') {
            id = randomString();
        } else {
            id = props.editData?.id;
        }
        const submitData = {
            id,
            name: tagInfo.name,
        };
        const res = await saveTag(submitData).finally(()=>{
            loading.value = false
        });
        if (res.success) {
            colorData.value[id] = tagInfo.color;
            const saveRes = await saveTagsColor(colorData.value).catch(()=>{
                loading.value = false
            });
            if (saveRes.success) {
                onlyMessage($t('components.editTag.984859-4'));
                emit('refresh');
            }
        }
    });
};
//获取全量标签颜色 保存接口是覆盖
const queryTagsColor = async () => {
    const res = await getTagsColor();
    if (res.success) {
        colorData.value = res.result;
    }
};
onMounted(() => {
    queryTagsColor();
    if (props.editType === 'edit') {
        tagInfo.color = props.editData?.color || '#000000';
        tagInfo.name = props.editData?.name || '';
    }
});
</script>
<style lang="less" scoped></style>
