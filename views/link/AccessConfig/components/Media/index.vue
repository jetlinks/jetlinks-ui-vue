<template>
    <div class="container">
        <div v-if="channel === 'fixed-media'" class="card-last">
            <a-row :gutter="[24, 24]">
                <a-col :span="12">
                    <title-component :data="$t('Media.index.962215-0')" />
                    <div>
                        <a-form
                            :model="formState"
                            name="basic"
                            autocomplete="off"
                            layout="vertical"
                            @finish="onFinish"
                        >
                            <a-form-item
                                :label="$t('Media.index.962215-1')"
                                name="name"
                                :rules="[
                                    {
                                        required: true,
                                        message: $t('Media.index.962215-2'),
                                        trigger: 'blur',
                                    },
                                    {
                                        max: 64,
                                        message: $t('Media.index.962215-3'),
                                        trigger: 'blur',
                                    },
                                ]"
                            >
                                <a-input
                                    :placeholder="$t('Media.index.962215-2')"
                                    v-model:value="formState.name"
                                />
                            </a-form-item>
                            <a-form-item :label="$t('Media.index.962215-4')" name="description">
                                <a-textarea
                                    :placeholder="$t('Media.index.962215-5')"
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
                                    {{ $t('Media.index.962215-6') }}
                                </j-permission-button>
                            </a-form-item>
                        </a-form>
                    </div>
                </a-col>
                <a-col :span="12">
                    <div class="doc">
                        <h1>{{ $t('Media.index.962215-7') }}</h1>
                        <p>
                            {{ provider.name }}
                        </p>
                        <p>
                            {{ provider.description }}
                        </p>
                        <h1>{{ $t('Media.index.962215-8') }}</h1>
                        <p>
                            {{ provider.id === 'fixed-media' ? 'URL' : 'SIP' }}
                        </p>
                    </div>
                </a-col>
            </a-row>
        </div>
        <div v-else-if="channel === 'gb28181'">
            <GB28181 :provider="props.provider" :data="props.data"></GB28181>
        </div>
        <div v-else-if="channel === 'onvif'">
            <Onvif :provider="props.provider" :data="props.data"></Onvif>
        </div>
        <div v-else-if="channel === 'plugin'">
            <Plugin
                :bindProduct="bindProduct"
                :data="data"
                :provider="provider"
            />
        </div>
    </div>
</template>

<script lang="ts" setup name="AccessMedia">
import { onlyMessage } from '@jetlinks-web/utils';
import GB28181 from './GB28181.vue';
import Onvif from './Onvif.vue';
import Plugin from '../Plugin/index.vue';
import { update, save } from '../../../../../api/link/accessConfig';
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

const props = defineProps({
    provider: {
        type: Object,
        default: () => {},
    },
    data: {
        type: Object,
        default: () => {},
    },
    bindProduct: {
        type: Boolean,
        default: false,
    },
});

const loading = ref(false);
const channel = ref(props.provider.channel);

const formState = ref<FormState>({
    name: '',
    description: '',
});
const { onBack } = useTabSaveSuccessBack()

const onFinish = async (values: any) => {
    loading.value = true;
    const params = {
        ...values,
        provider: 'fixed-media',
        transport: 'URL',
        channel: 'fixed-media',
    };
    const resp =
        id === ':id' ? await save(params) : await update({ ...params, id });
    if (resp.status === 200) {
        onlyMessage($t('Media.index.962215-9'), 'success');

        if (route.query.save) {
            // @ts-ignore
            onBack(resp)
        } else {
            history.back();
        }
    }
    loading.value = false;
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
