<template>
    <div class="card-last">
        <a-row :gutter="[24, 24]">
            <a-col :span="12">
                <title-component :data="$t('Media.Onvif.507446-0')" />
                <div>
                    <a-form
                        :model="formState"
                        name="basic"
                        autocomplete="off"
                        layout="vertical"
                        @finish="onFinish"
                    >
                        <a-form-item
                            :label="$t('Media.Onvif.507446-1')"
                            name="name"
                            :rules="[
                                {
                                    required: true,
                                    message: $t('Media.Onvif.507446-2'),
                                    trigger: 'blur',
                                },
                                {
                                    max: 64,
                                    message: $t('Media.Onvif.507446-3'),
                                    trigger: 'blur',
                                },
                            ]"
                        >
                            <a-input
                                :placeholder="$t('Media.Onvif.507446-2')"
                                v-model:value="formState.name"
                            />
                        </a-form-item>
                        <a-form-item :label="$t('Media.Onvif.507446-4')" name="description">
                            <a-textarea
                                :placeholder="$t('Media.Onvif.507446-5')"
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
                                {{ $t('Media.Onvif.507446-6') }}
                            </j-permission-button>
                        </a-form-item>
                    </a-form>
                </div>
            </a-col>
            <a-col :span="12">
                <div class="doc">
                    <h1>{{ $t('Media.Onvif.507446-7') }}</h1>
                    <p>
                        {{ $t('Media.Onvif.507446-8') }}
                    </p>
                    <h1>{{ $t('Media.Onvif.507446-9') }}</h1>
                    <p>
                        {{ $t('Media.Onvif.507446-10') }}
                    </p>
                </div>
            </a-col>
        </a-row>
    </div>
</template>

<script lang="ts" setup>
import { onlyMessage } from '@jetlinks-web/utils';
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
        provider: 'onvif',
        transport: 'ONVIF',
        channel: 'onvif',
    };
    const resp =
        id === ':id' ? await save(params) : await update({ ...params, id });
    if (resp.status === 200) {
        onlyMessage($t('Media.Onvif.507446-11'), 'success');

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
.card-last {
    padding-right: 5px;
    overflow-y: auto;
    overflow-x: hidden;
}
</style>
