<template>
    <div class="container">
        <div v-if="channel === 'fixed-media'" class="card-last">
            <j-row :gutter="[24, 24]">
                <j-col :span="12">
                    <title-component data="基本信息" />
                    <div>
                        <j-form
                            :model="formState"
                            name="basic"
                            autocomplete="off"
                            layout="vertical"
                            @finish="onFinish"
                        >
                            <j-form-item
                                label="名称"
                                name="name"
                                :rules="[
                                    {
                                        required: true,
                                        message: '请输入名称',
                                        trigger: 'blur',
                                    },
                                    {
                                        max: 64,
                                        message: '最多可输入64个字符',
                                        trigger: 'blur',
                                    },
                                ]"
                            >
                                <j-input
                                    placeholder="请输入名称"
                                    v-model:value="formState.name"
                                />
                            </j-form-item>
                            <j-form-item label="说明" name="description">
                                <j-textarea
                                    placeholder="请输入说明"
                                    :rows="4"
                                    v-model:value="formState.description"
                                    show-count
                                    :maxlength="200"
                                />
                            </j-form-item>
                            <j-form-item>
                                <PermissionButton
                                    v-if="view === 'false'"
                                    type="primary"
                                    html-type="submit"
                                    :hasPermission="`link/AccessConfig:${
                                        id === ':id' ? 'add' : 'update'
                                    }`"
                                >
                                    保存
                                </PermissionButton>
                            </j-form-item>
                        </j-form>
                    </div>
                </j-col>
                <j-col :span="12">
                    <div class="doc">
                        <h1>接入方式</h1>
                        <p>
                            {{ provider.name }}
                        </p>
                        <p>
                            {{ provider.description }}
                        </p>
                        <h1>消息协议</h1>
                        <p>
                            {{ provider.id === 'fixed-media' ? 'URL' : 'SIP' }}
                        </p>
                    </div>
                </j-col>
            </j-row>
        </div>
        <div v-else-if="channel === 'gb28181'">
            <GB28181 :provider="props.provider" :data="props.data"></GB28181>
        </div>
    </div>
</template>

<script lang="ts" setup name="AccessMedia">
import { onlyMessage } from '@/utils/comm';
import GB28181 from './GB28181.vue';
import { update, save } from '@/api/link/accessConfig';

interface FormState {
    name: string;
    description: string;
}
const route = useRoute();
const view = route.query.view as string;
const id = route.params.id as string;

const props = defineProps({
    provider: {
        type: Object,
        default: () => {},
    },
    data: {
        type: Object,
        default: () => {},
    },
});

const channel = ref(props.provider.channel);

const formState = ref<FormState>({
    name: '',
    description: '',
});
const onFinish = async (values: any) => {
    const params = {
        ...values,
        provider: 'fixed-media',
        transport: 'URL',
        channel: 'fixed-media',
    };
    const resp =
        id === ':id' ? await save(params) : await update({ ...params, id });
    if (resp.status === 200) {
        onlyMessage('操作成功', 'success');
        history.back();
    }
};

onMounted(() => {
    if (id !== ':id') {
        formState.value = {
            name: props.data.name,
            description: props.data?.description || '',
        };
    }
});
</script>

<style lang="less" scoped>
.container {
    margin: 20px;
}

.card-last {
    padding-right: 5px;
    overflow-y: auto;
    overflow-x: hidden;
}
</style>
