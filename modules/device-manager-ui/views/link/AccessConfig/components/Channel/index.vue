<template>
    <div v-if="type === 'channel'" class="card-last">
        <a-row :gutter="[24, 24]">
            <a-col :span="12">
                <title-component :data="$t('Channel.index.456223-0')" />
                <div>
                    <a-form
                        :model="formState"
                        name="basic"
                        autocomplete="off"
                        layout="vertical"
                        @finish="onFinish"
                    >
                        <a-form-item
                            :label="$t('Channel.index.456223-1')"
                            name="name"
                            :rules="[
                                {
                                    required: true,
                                    message: $t('Channel.index.456223-2'),
                                    trigger: 'blur',
                                },
                                {
                                    max: 64,
                                    message: $t('Channel.index.456223-3'),
                                    trigger: 'blur',
                                },
                            ]"
                        >
                            <a-input
                                :placeholder="$t('Channel.index.456223-2')"
                                v-model:value="formState.name"
                            />
                        </a-form-item>
                        <a-form-item :label="$t('Channel.index.456223-4')" name="description">
                            <a-textarea
                                :placeholder="$t('Channel.index.456223-5')"
                                :rows="4"
                                v-model:value="formState.description"
                                show-count
                                :maxlength="200"
                            />
                        </a-form-item>
                        <a-form-item>
                            <j-permission-button
                                v-if="view === 'false'"
                                type="primary"
                                html-type="submit"
                                :hasPermission="`link/AccessConfig:${
                                    id === ':id' ? 'add' : 'update'
                                }`"
                                :loading="loading"
                            >
                                {{ $t('Channel.index.456223-6') }}
                            </j-permission-button>
                        </a-form-item>
                    </a-form>
                </div>
            </a-col>
            <a-col :span="12">
                <div class="doc" style="height: 600px">
                    <TitleComponent :data="$t('Channel.index.456223-7')" />
                    <p>{{ $t('Channel.index.456223-8') }}{{ provider.name }}</p>
                    <p>
                        {{ provider.description }}
                    </p>
                    <!-- <p>消息协议：{{ provider.id }}</p> -->
                    <TitleComponent :data="$t('Channel.index.456223-9')" />
                    <p>{{ $t('Channel.index.456223-10') }}{{ provider.name }}{{ $t('Channel.index.456223-11') }}</p>
                    <p>{{ $t('Channel.index.456223-12') }}{{ provider.name }}{{ $t('Channel.index.456223-13') }}</p>
                    <p>{{ $t('Channel.index.456223-14') }}{{ provider.name }}</p>
                    <p>{{ $t('Channel.index.456223-15') }}</p>
                </div>
            </a-col>
        </a-row>
    </div>
</template>

<script lang="ts" setup name="AccessChannel">
import { onlyMessage } from '@jetlinks-web/utils';
import { update, save } from '../../../../../api/link/accessConfig';
import { ProtocolMapping } from '../../data';
import { useI18n } from 'vue-i18n';
import { useTabSaveSuccessBack } from '@jetlinks-web-core/hooks'

const { t: $t } = useI18n();
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

const { onBack } = useTabSaveSuccessBack()

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
        onlyMessage($t('Channel.index.456223-16'), 'success');
        history.back();
        onBack(resp)
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
