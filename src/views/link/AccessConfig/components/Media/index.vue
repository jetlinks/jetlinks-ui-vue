<template>
    <div class="container">
        <div v-if="channel === 'fixed-media'" class="card-last">
            <a-row :gutter="[24, 24]">
                <a-col :span="12">
                    <title-component data="基本信息" />
                    <div>
                        <a-form
                            :model="formState"
                            name="basic"
                            autocomplete="off"
                            layout="vertical"
                            @finish="onFinish"
                        >
                            <a-form-item
                                label="名称"
                                name="name"
                                :rules="[
                                    {
                                        required: true,
                                        message: '请输入名称',
                                        trigger: 'blur',
                                    },
                                    { max: 64, message: '最多可输入64个字符' },
                                ]"
                            >
                                <a-input
                                    placeholder="请输入名称"
                                    v-model:value="formState.name"
                                />
                            </a-form-item>
                            <a-form-item label="说明" name="description">
                                <a-textarea
                                    placeholder="请输入说明"
                                    :rows="4"
                                    v-model:value="formState.description"
                                    show-count
                                    :maxlength="200"
                                />
                            </a-form-item>
                            <a-form-item>
                                <a-button
                                    v-if="modeType !== 'view'"
                                    type="primary"
                                    html-type="submit"
                                    >保存</a-button
                                >
                            </a-form-item>
                        </a-form>
                    </div>
                </a-col>
                <a-col :span="12">
                    <div class="config-right">
                        <div class="config-right-item">
                            <div class="config-right-item-title">接入方式</div>
                            <div class="config-right-item-context">
                                {{ provider.name }}
                            </div>
                            <div class="config-right-item-context">
                                {{ provider.description }}
                            </div>
                        </div>
                        <div class="config-right-item">
                            <div class="config-right-item-title">消息协议</div>
                            <div class="config-right-item-context">
                                {{
                                    provider.id === 'fixed-media'
                                        ? 'URL'
                                        : 'SIP'
                                }}
                            </div>
                        </div>
                    </div>
                </a-col>
            </a-row>
        </div>
        <div v-else-if="channel === 'gb28181'">
            <GB28181 :provider="props.provider" :data="props.data"></GB28181>
        </div>
    </div>
</template>

<script lang="ts" setup name="AccessMedia">
import { message, Form } from 'ant-design-vue';
import type { FormInstance } from 'ant-design-vue';
import GB28181 from './GB28181.vue';
import { update, save } from '@/api/link/accessConfig';

interface FormState {
    name: string;
    description: string;
}
const route = useRoute();
const modeType = route.params.type as string;
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
        !!id && modeType !== 'add'
            ? await update({ ...params, id })
            : await save(params);
    if (resp.status === 200) {
        message.success('操作成功！');
        // if (params.get('save')) {
        // if ((window as any).onTabSaveSuccess) {
        //   if (resp.result) {
        //     (window as any).onTabSaveSuccess(resp.result);
        //     setTimeout(() => window.close(), 300);
        //   }
        // }
        //   } else {
        history.back();
        //   }
    }
};

onMounted(() => {
    if (modeType !== 'add') {
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
.config-right {
    padding: 20px;
    color: rgba(0, 0, 0, 0.8);
    background: rgba(0, 0, 0, 0.04);

    .config-right-item {
        margin-bottom: 10px;

        .config-right-item-title {
            width: 100%;
            margin-bottom: 10px;
            font-weight: 600;
        }

        .config-right-item-context {
            margin: 5px 0;
            color: rgba(0, 0, 0, 0.8);
        }
    }
}
</style>
