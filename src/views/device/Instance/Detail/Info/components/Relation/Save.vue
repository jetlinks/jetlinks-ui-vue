<template>
    <a-drawer placement="right" :closable="false" :visible="true">
        <template #title>
            <div
                style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                "
            >
                <span
                    ><AIcon
                        type="CloseOutlined"
                        style="margin-right: 5px"
                        @click="onClose"
                    />编辑</span
                >
                <a-button type="primary" @click="saveBtn">保存</a-button>
            </div>
        </template>
        <a-form layout="vertical" ref="formRef" :model="modelRef">
            <a-form-item
                :name="item.relation"
                :label="item.relationName"
                v-for="(item, index) in dataSource"
                :key="index"
            >
                <a-select
                    showSearch
                    mode="multiple"
                    v-model:value="modelRef[item.relation]"
                    :placeholder="`请选择${item.relationName}`"
                >
                    <a-select-option
                        :value="item.value"
                        v-for="item in userList"
                        :key="item.id"
                        >{{ item.name }}</a-select-option
                    >
                </a-select>
            </a-form-item>
        </a-form>
    </a-drawer>
</template>

<script lang="ts" setup>
import { queryUserListNoPaging, saveRelations } from '@/api/device/instance';
import { useInstanceStore } from '@/store/instance';
import { message } from 'ant-design-vue';

const emit = defineEmits(['close', 'save']);

const formRef = ref();
const modelRef = reactive({});
const userList = ref<Record<string, any>[]>([]);

const instanceStore = useInstanceStore();

const dataSource = ref<Record<any, any>[]>([]);

watchEffect(() => {
    const arr = (instanceStore.current?.relations || [])
    dataSource.value = arr as Record<any, any>[];
    arr.map((item) => {
        modelRef[item.relation] = [
            ...(item?.related || []).map((i: any) => JSON.stringify(i)),
        ];
    });
});

onMounted(() => {
    queryUserListNoPaging().then((resp) => {
        if (resp.status === 200) {
            userList.value = (resp.result as Record<string, any>[]).map(
                (item) => {
                    return {
                        ...item,
                        label: item.name,
                        value: JSON.stringify({
                            id: item.id,
                            name: item.name,
                        }),
                    };
                },
            );
        }
    });
});

const onClose = () => {
    emit('close');
    formRef.value.resetFields();
};

const saveBtn = () => {
    formRef.value.validate().then(async () => {
        const values = toRaw(modelRef);
        if (Object.keys(values).length > 0) {
            const param: any[] = [];
            Object.keys(values).forEach((key) => {
                const item = dataSource.value.find((i) => i.relation === key);
                const items = (values[key] || []).map((i: string) =>
                    JSON.parse(i),
                );
                if (item) {
                    param.push({
                        relatedType: 'user',
                        relation: item.relation,
                        description: '',
                        related: [...items],
                    });
                }
            });
            if(param.length && instanceStore.current.id){
                const resp = await saveRelations(instanceStore.current.id, param);
                if (resp.status === 200) {
                    message.success('操作成功！');
                    emit('save');
                    formRef.value.resetFields();
                }
            }
        }
    });
};
</script>