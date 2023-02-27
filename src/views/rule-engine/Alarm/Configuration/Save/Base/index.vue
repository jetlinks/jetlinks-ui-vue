<template>
    <div>
        <a-form layout="vertical" :rules="rule" :model="form" ref="formRef">
            <a-row :gutter="24">
                <a-col :span="12">
                    <a-form-item label="名称" name="name">
                        <a-input
                            placeholder="请输入名称"
                            v-model:value="form.name"
                        ></a-input> </a-form-item
                ></a-col>
                <a-col :span="12">
                    <a-form-item label="类型" name="targetType">
                        <a-select
                            :options="options"
                            v-model:value="form.targetType"
                            :disabled="selectDisable"
                        ></a-select>
                    </a-form-item>
                </a-col>
            </a-row>
            <a-form-item label="级别" name="level">
                <a-radio-group v-model:value="form.level">
                    <a-radio-button
                        v-for="(item, index) in levelOption"
                        :key="index"
                        :value="item.value"
                    >
                        <div
                            style="
                                text-align: center;
                                margin-top: 10px;
                                font-size: 15px;
                                width: 90%;
                            "
                        >
                            <img
                                :src="getImage(`/alarm/alarm${index + 1}.png`)"
                                style="height: 40px"
                                alt=""
                            />{{ item.label }}
                        </div>
                    </a-radio-button>
                </a-radio-group>
            </a-form-item>
            <a-form-item label="说明" name="description">
                <a-textarea v-model:value="form.description"></a-textarea>
            </a-form-item>
            <a-button type="primary" @click="handleSave" :loading="loading"
                >保存</a-button
            >
        </a-form>
    </div>
</template>

<script lang="ts" setup>
import { getTargetTypes, save, detail } from '@/api/rule-engine/configuration';
import { queryLevel } from '@/api/rule-engine/config';
import { query } from '@/api/rule-engine/scene';
import { getImage } from '@/utils/comm';
import { message } from 'ant-design-vue';
import { useMenuStore } from '@/store/menu';
import { useRoute } from 'vue-router';
import { Store } from 'jetlinks-store';
const route = useRoute();
const id = route.query?.id;
let selectDisable = ref(false);
const queryData = () => {
    if (id) {
        detail(id).then((res) => {
            if (res.status === 200) {
                form.level = res?.result?.level;
                form.name = res?.result?.name;
                form.targetType = res?.result?.targetType;
                form.description = res?.result?.description;
                Store.set('configuration-data', res.result);
                query({
                    terms: [
                        {
                            terms: [
                                {
                                    column: 'id',
                                    termType: 'alarm-bind-rule',
                                    value: id,
                                },
                            ],
                            type: 'and',
                        },
                    ],
                    sorts: [
                        {
                            name: 'createTime',
                            order: 'desc',
                        },
                    ],
                }).then((resq) => {
                    if (resq.status === 200) {
                        selectDisable.value = !!resq.result.data?.length;
                    }
                });
            }
        });
    }
};
const rule = {
    name: [
        {
            required: true,
            message: '请输入名称',
        },
        {
            max: 64,
            message: '最多输入64个字符',
        },
    ],
    targetType: [
        {
            required: true,
            message: '请选择类型',
        },
    ],
    level: [
        {
            required: true,
            message: '请选择级别',
        },
    ],
    description: [
        {
            max: 200,
            message: '最多可输入200个字符',
        },
    ],
};
let form = reactive({
    level: '',
    targetType: '',
    name: '',
    description: '',
});
let options = ref();
let levelOption = ref();
let loading = ref(false);
const formRef = ref();
const menuStory = useMenuStore();
const getSupports = async () => {
    let res = await getTargetTypes();
    if (res.status === 200) {
        options.value = res.result.map(
            (item: { id: string; name: string }) => ({
                label: item.name,
                value: item.id,
            }),
        );
    }
};
getSupports();
const getLevel = () => {
    queryLevel().then((res) => {
        if (res.status === 200) {
            levelOption.value = res.result?.levels
                ?.filter((i: any) => i?.level && i?.title)
                .map((item: { level: number; title: string }) => ({
                    label: item.title,
                    value: item.level,
                }));
        }
    });
};
getLevel();
const handleSave = async () => {
    loading.value = true;
    formRef.value
        .validate()
        .then(async () => {
            const res = await save(form);
            loading.value = false;
            if (res.status === 200) {
                message.success('操作成功');
                menuStory.jumpPage(
                    'rule-engine/Alarm/Configuration/Save',
                    {},
                    { id: res.result?.id },
                );
                if (!id) {
                    Store.set('configuration-data', res.result);
                }
            }
        })
        .catch((error) => {
            loading.value = false;
            console.log(error);
        });
};
queryData();
</script>
<style lang="less" scoped>
.ant-radio-button-wrapper {
    margin: 10px 15px 0 0;
    width: 125px;
    height: 100%;
}
</style>