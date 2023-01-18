<template>
    <div class="container">
        <div v-if="type === 'channel'" class="card-last">
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
                            <title-component data="配置概览" />
                            <div class="config-right-item-context">
                                接入方式：{{ provider.name }}
                            </div>
                            <div class="config-right-item-context">
                                {{ provider.description }}
                            </div>
                            <div class="config-right-item-context">
                                消息协议：{{ provider.id }}
                            </div>
                        </div>
                        <div class="config-right-item">
                            <title-component data="设备接入指引" />
                            <div class="config-right-item-context">
                                1、配置{{ provider.name }}通道
                            </div>
                            <div class="config-right-item-context">
                                2、创建{{ provider.name }}设备接入网关
                            </div>
                            <div class="config-right-item-context">
                                3、创建产品，并选中接入方式为{{ provider.name }}
                            </div>
                            <div class="config-right-item-context">
                                4、添加设备，单独为每一个设备进行数据点绑定
                            </div>
                        </div>
                    </div>
                </a-col>
            </a-row>
        </div>
    </div>
</template>

<script lang="ts" setup name="AccessMedia">
import { message, Form } from 'ant-design-vue';
import type { FormInstance } from 'ant-design-vue';
import { update, save } from '@/api/link/accessConfig';

interface FormState {
    name: string;
    description: string;
}
const route = useRoute();
const id = route.query.id;

const props = defineProps({
    provider: {
        type: Object,
        default: () => {},
    },
});

const type = ref(props.provider.type);

const formState = reactive<FormState>({
    name: '',
    description: '',
});
const onFinish = async (values: any) => {
    const providerId = props.provider.id;
    const params = {
        ...values,
        provider: providerId,
        protocol: providerId,
        transport: providerId === 'modbus-tcp' ? 'MODBUS_TCP' : 'OPC_UA',
        channel: providerId === 'modbus-tcp' ? 'modbus' : 'opc-ua',
    };
    const resp = !!id ? await update({ ...params, id }) : await save(params);
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
