<template>
    <div v-if="type === 'channel'" class="card-last">
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
                                :loading="loading"
                            >
                                保存
                            </PermissionButton>
                        </j-form-item>
                    </j-form>
                </div>
            </j-col>
            <j-col :span="12">
                <div class="doc" style="height: 600px">
                    <TitleComponent data="配置概览" />
                    <p>接入方式：{{ provider.name }}</p>
                    <p>
                        {{ provider.description }}
                    </p>
                    <!-- <p>消息协议：{{ provider.id }}</p> -->
                    <TitleComponent data="设备接入指引" />
                    <p>1、配置{{ provider.name }}通道</p>
                    <p>2、创建{{ provider.name }}设备接入网关</p>
                    <p>3、创建产品，并选中接入方式为{{ provider.name }}</p>
                    <p>4、添加设备，单独为每一个设备进行数据点绑定</p>
                </div>
            </j-col>
        </j-row>
    </div>
</template>

<script lang="ts" setup name="AccessChannel">
import { onlyMessage } from '@/utils/comm';
import { update, save } from '@/api/link/accessConfig';
import { ProtocolMapping } from '../../data';

interface FormState {
    name: string;
    description: string;
}
const route = useRoute();
const view = route.query.view as string;
const id = route.params.id as string;

const loading = ref(false)
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

const type = ref(props.provider.type || props.data.type);

const formState = ref<FormState>({
    name: '',
    description: '',
});
const onFinish = async (values: any) => {
    loading.value = true
    const providerId = props.provider.id;
    const params = {
        ...values,
        provider: providerId,
        protocol: providerId,
        transport: ProtocolMapping.get(providerId),
        channel: providerId === 'modbus-tcp' ? 'modbus' : 'opc-ua',
    };
    const resp =
        id === ':id' ? await save(params) : await update({ ...params, id });
    if (resp.status === 200) {
        onlyMessage('操作成功', 'success');
        history.back();
        if ((window as any).onTabSaveSuccess) {
            (window as any).onTabSaveSuccess(resp);
            setTimeout(() => window.close(), 300);
        }
    }
    loading.value = false
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
.card-last {
    padding-right: 5px;
    overflow-y: auto;
    overflow-x: hidden;
}
</style>
