<template>
  <div class="card-last">
    <j-row :gutter="[24, 24]">
      <j-col :span="12">
        <title-component :data="$t('Edge.geteway.4282914-0')" />
        <div>
          <j-form
              :model="formState"
              autocomplete="off"
              layout="vertical"
              name="basic"
              @finish="onFinish"
          >
            <j-form-item
                :rules="[
                                {
                                    required: true,
                                    message: $t('Edge.geteway.4282914-1'),
                                    trigger: 'blur',
                                },
                                {
                                    max: 64,
                                    message: $t('Edge.geteway.4282914-2'),
                                    trigger: 'blur',
                                },
                            ]"
                :label="$t('Edge.geteway.4282914-3')"
                name="name"
            >
              <j-input
                  v-model:value="formState.name"
                  :placeholder="$t('Edge.geteway.4282914-1')"
              />
            </j-form-item>
            <j-form-item :label="$t('Edge.geteway.4282914-4')" name="description">
              <j-textarea
                  v-model:value="formState.description"
                  :maxlength="200"
                  :rows="4"
                  :placeholder="$t('Edge.geteway.4282914-5')"
                  show-count
              />
            </j-form-item>
            <j-form-item>
              <PermissionButton
                  v-if="view === 'false'"
                  :hasPermission="`link/AccessConfig:${
                                    id === ':id' ? 'add' : 'update'
                                }`"
                  html-type="submit"
                  type="primary"
                  :loading="loading"
              >
                {{ $t('Edge.geteway.4282914-6') }}
              </PermissionButton>
            </j-form-item>
          </j-form>
        </div>
      </j-col>
      <j-col :span="12">
        <div class="doc" style="height: 600px">
          <TitleComponent :data="$t('Edge.geteway.4282914-7')" />
          <p>{{ $t('Edge.geteway.4282914-8') }}{{ provider.name }}</p>
          <p>
            {{ provider.description }}
          </p>
          <p>{{ $t('Edge.geteway.4282914-9') }}</p>
          <TitleComponent :data="$t('Edge.geteway.4282914-9')" />
          <p>{{ $t('Edge.geteway.4282914-10') }}</p>
          <p>{{ $t('Edge.geteway.4282914-11') }}</p>
          <p>{{ $t('Edge.geteway.4282914-12') }}</p>
          <p>{{ $t('Edge.geteway.4282914-13') }}</p>
        </div>
      </j-col>
    </j-row>
  </div>
</template>

<script lang="ts" name="GateWay" setup>
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
    channel: props.provider.channel,
  };
  const resp =
      id === ':id' ? await save(params) : await update({ ...params, id });
  if (resp.status === 200) {
    onlyMessage($t('Edge.geteway.4282914-14'), 'success');
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
