<template>
    <div v-if="type === 'channel'" class="card-last">
        <j-row :gutter="[24, 24]">
            <j-col :span="12">
                <title-component :data="$t('Channel.index.4283022-0')" />
                <div>
                    <j-form
                        :model="formState"
                        name="basic"
                        autocomplete="off"
                        layout="vertical"
                        @finish="onFinish"
                    >
                        <j-form-item
                            :label="$t('Channel.index.4283022-1')"
                            name="name"
                            :rules="[
                                {
                                    required: true,
                                    message: $t('Channel.index.4283022-2'),
                                    trigger: 'blur',
                                },
                                {
                                    max: 64,
                                    message: $t('Channel.index.4283022-3'),
                                    trigger: 'blur',
                                },
                            ]"
                        >
                            <j-input
                                :placeholder="$t('Channel.index.4283022-2')"
                                v-model:value="formState.name"
                            />
                        </j-form-item>
                        <j-form-item :label="$t('Channel.index.4283022-4')" name="description">
                            <j-textarea
                                :placeholder="$t('Channel.index.4283022-5')"
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
                                {{ $t('Channel.index.4283022-6') }}
                            </PermissionButton>
                        </j-form-item>
                    </j-form>
                </div>
            </j-col>
            <j-col :span="12">
                <div class="doc" style="height: 600px">
                    <TitleComponent :data="$t('Channel.index.4283022-7')" />
                    <p>{{ $t('Channel.index.4283022-8') }}{{ provider.name }}</p>
                    <p>
                        {{ provider.description }}
                    </p>
                    <!-- <p>消息协议：{{ provider.id }}</p> -->
                    <TitleComponent :data="$t('Channel.index.4283022-9')" />
                    <p>{{ $t('Channel.index.4283022-10') }}{{ provider.name }}{{ $t('Channel.index.4283022-11') }}</p>
                    <p>{{ $t('Channel.index.4283022-12') }}{{ provider.name }}{{ $t('Channel.index.4283022-13') }}</p>
                    <p>{{ $t('Channel.index.4283022-14') }}{{ provider.name }}</p>
                    <p>{{ $t('Channel.index.4283022-15') }}</p>
                </div>
            </j-col>
        </j-row>
    </div>
</template>

<script lang="ts" setup name="AccessChannel">
import { onlyMessage } from '@/utils/comm';
import { update, save } from '@/api/link/accessConfig';
import { ProtocolMapping } from '../../data';
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

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
        onlyMessage($t('Channel.index.4283022-16'), 'success');
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
