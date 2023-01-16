<template>
    <div class="container">
        <div v-if="channel==='fixed-media'" class="card-last">
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
                                        message: '请输入证书名称',
                                        trigger: 'blur',
                                    },
                                    { max: 64, message: '最多可输入64个字符' },
                                ]"
                            >
                                <a-input v-model:value="formState.name" />
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
                                <a-button type="primary" html-type="submit"
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
        <div v-else>123</div>
    </div>
</template>

<script lang="ts" setup name="AccessMedia">
import { message, Form } from 'ant-design-vue';
import type { FormInstance } from 'ant-design-vue';

interface FormState {
    name: string;
    description: string;
}

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
console.log(211, channel.value, props);

const formState = reactive<FormState>({
    name: '',
    description: '',
});
const onFinish = (values: any) => {
    console.log('Success:', values);
};

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
