<template>
    <div class="card-last">
        <j-row :gutter="[24, 24]">
            <j-col :span="12">
                <title-component :data="$t('Media.Onvif.4283017-0')" />
                <div>
                    <j-form
                        :model="formState"
                        name="basic"
                        autocomplete="off"
                        layout="vertical"
                        @finish="onFinish"
                    >
                        <j-form-item
                            :label="$t('Media.Onvif.4283017-1')"
                            name="name"
                            :rules="[
                                {
                                    required: true,
                                    message: $t('Media.Onvif.4283017-2'),
                                    trigger: 'blur',
                                },
                                {
                                    max: 64,
                                    message: $t('Media.Onvif.4283017-3'),
                                    trigger: 'blur',
                                },
                            ]"
                        >
                            <j-input
                                :placeholder="$t('Media.Onvif.4283017-2')"
                                v-model:value="formState.name"
                            />
                        </j-form-item>
                        <j-form-item :label="$t('Media.Onvif.4283017-4')" name="description">
                            <j-textarea
                                :placeholder="$t('Media.Onvif.4283017-5')"
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
                                {{ $t('Media.Onvif.4283017-6') }}
                            </PermissionButton>
                        </j-form-item>
                    </j-form>
                </div>
            </j-col>
            <j-col :span="12">
                <div class="doc">
                    <h1>{{ $t('Media.Onvif.4283017-7') }}</h1>
                    <p>
                        {{ $t('Media.Onvif.4283017-8') }}
                    </p>
                    <h1>{{ $t('Media.Onvif.4283017-9') }}</h1>
                    <p>
                        {{ $t('Media.Onvif.4283017-10') }}
                    </p>
                </div>
            </j-col>
        </j-row>
    </div>
</template>

<script lang="ts" setup>
import { onlyMessage } from '@/utils/comm';
import { update, save } from '@/api/link/accessConfig';
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()
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
        onlyMessage($t('Media.Onvif.4283017-11'), 'success');

        if (route.query.save) {
            // @ts-ignore
            if ((window as any).onTabSaveSuccess) {
                (window as any).onTabSaveSuccess(resp.result);
                setTimeout(() => window.close(), 300);
            }
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
