<template>
    <div class="container">
        <div v-if="channel === 'fixed-media'" class="card-last">
            <j-row :gutter="[24, 24]">
                <j-col :span="12">
                    <title-component :data="$t('Media.index.4283018-0')" />
                    <div>
                        <j-form
                            :model="formState"
                            name="basic"
                            autocomplete="off"
                            layout="vertical"
                            @finish="onFinish"
                        >
                            <j-form-item
                                :label="$t('Media.index.4283018-1')"
                                name="name"
                                :rules="[
                                    {
                                        required: true,
                                        message: $t('Media.index.4283018-2'),
                                        trigger: 'blur',
                                    },
                                    {
                                        max: 64,
                                        message: $t('Media.index.4283018-3'),
                                        trigger: 'blur',
                                    },
                                ]"
                            >
                                <j-input
                                    :placeholder="$t('Media.index.4283018-2')"
                                    v-model:value="formState.name"
                                />
                            </j-form-item>
                            <j-form-item :label="$t('Media.index.4283018-4')" name="description">
                                <j-textarea
                                    :placeholder="$t('Media.index.4283018-5')"
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
                                    {{ $t('Media.index.4283018-6') }}
                                </PermissionButton>
                            </j-form-item>
                        </j-form>
                    </div>
                </j-col>
                <j-col :span="12">
                    <div class="doc">
                        <h1>{{ $t('Media.index.4283018-7') }}</h1>
                        <p>
                            {{ provider.name }}
                        </p>
                        <p>
                            {{ provider.description }}
                        </p>
                        <h1>{{ $t('Media.index.4283018-8') }}</h1>
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
import { onlyMessage } from '@/utils/comm';
import GB28181 from './GB28181.vue';
import Onvif from './Onvif.vue';
import Plugin from '../Plugin/index.vue';
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
        onlyMessage($t('Media.index.4283018-9'), 'success');

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
.container {
    margin: 20px;
}

.card-last {
    padding-right: 5px;
    overflow-y: auto;
    overflow-x: hidden;
}
</style>
