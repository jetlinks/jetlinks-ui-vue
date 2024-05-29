<template>
    <a-modal
        visible
        title="新增标签"
        @cancel="emit('closeEditTag')"
        @ok="submit"
    >
        <a-form :model="tagInfo" ref="form">
            <a-row :gutter="16">
                <a-col>
                    <a-form-item name="color">
                        <input
                            type="color"
                            :value="tagInfo.color"
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
                            },
                            {
                                max: 16,
                                message: '最多可输入16个字符',
                            },
                        ]"
                    >
                        <a-input
                            v-model:value="tagInfo.name"
                            placeholder="请为标签命名"
                        ></a-input>
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
    </a-modal>
</template>

<script setup name="EditTag">
import { saveTag } from '@/api/system/calendar';
import { onlyMessage } from '@/utils/comm';
import dayjs from 'dayjs';
const props = defineProps({
    editType: {
        type: String,
        default: 'add',
    },
});
const emit = defineEmits(['closeEditTag', 'refresh']);
const tagInfo = reactive({
    color: '#000000',
    name: '',
});
const form = ref();
const changeColor = (event) => {
    tagInfo.color = event.target.value;
};
const submit = () => {
    form.value.validate().then(async () => {
        let id;
        if (props.editType === 'add') {
            id = tagInfo.color + '-' + dayjs().valueOf();
        }
        const submitData = {
            id,
            name: tagInfo.name,
        };
        const res = await saveTag(submitData);
        if (res.status === 200) {
            onlyMessage('操作成功');
            emit('refresh');
        }
    });
};
</script>
<style lang="less" scoped></style>
