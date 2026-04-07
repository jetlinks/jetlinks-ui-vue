<template>
  <div class="card-last">
    <a-row :gutter="[24, 24]">
      <a-col :span="12">
        <title-component :data="$t('Edge.geteway.598238-0')" />
        <div>
          <a-form
            :model="formState"
            autocomplete="off"
            layout="vertical"
            name="basic"
            @finish="onFinish"
          >
            <a-form-item
              :rules="[
                {
                  required: true,
                  message: $t('Edge.geteway.598238-1'),
                  trigger: 'blur',
                },
                {
                  max: 64,
                  message: $t('Edge.geteway.598238-2'),
                  trigger: 'blur',
                },
              ]"
              :label="$t('Edge.geteway.598238-3')"
              name="name"
            >
              <a-input
                v-model:value="formState.name"
                :placeholder="$t('Edge.geteway.598238-1')"
              />
            </a-form-item>
            <a-form-item :label="$t('Edge.geteway.598238-4')" name="description">
              <a-textarea
                v-model:value="formState.description"
                :maxlength="200"
                :rows="4"
                :placeholder="$t('Edge.geteway.598238-5')"
                show-count
              />
            </a-form-item>
            <a-form-item>
              <j-permission-button
                v-if="view === 'false'"
                :hasPermission="`link/AccessConfig:${
                  id === ':id' ? 'add' : 'update'
                }`"
                html-type="submit"
                type="primary"
                :loading="loading"
              >
                {{ $t('Edge.geteway.598238-6') }}
              </j-permission-button>
            </a-form-item>
          </a-form>
        </div>
      </a-col>
      <a-col :span="12">
        <div class="doc" style="height: 600px">
          <TitleComponent :data="$t('Edge.geteway.598238-7')" />
          <p>{{ $t('Edge.geteway.598238-8') }}{{ provider.name }}</p>
          <p>
            {{ provider.description }}
          </p>
          <p>{{ $t('Edge.geteway.598238-9') }}</p>
          <TitleComponent :data="$t('Edge.geteway.598238-9')" />
          <p>{{ $t('Edge.geteway.598238-10') }}</p>
          <p>{{ $t('Edge.geteway.598238-11') }}</p>
          <p>{{ $t('Edge.geteway.598238-12') }}</p>
          <p>{{ $t('Edge.geteway.598238-13') }}</p>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" name="GateWay" setup>
import { onlyMessage } from "@jetlinks-web/utils";
import { update, save } from "../../../../../api/link/accessConfig";
import { ProtocolMapping } from "../../data";
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

const loading = ref(false);
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
  name: "",
  description: "",
});
const { onBack } = useTabSaveSuccessBack()

const onFinish = async (values: any) => {
  loading.value = true;
  const providerId = props.provider.id;
  const params = {
    ...values,
    provider: providerId,
    protocol: providerId,
    transport: ProtocolMapping.get(providerId),
    channel: props.provider.channel,
  };
  if(route.query.provider) {
    onBack({...params})
    return
  }
  const resp =
    id === ":id" ? await save(params) : await update({ ...params, id });
  if (resp.status === 200) {
    onlyMessage($t('Edge.geteway.598238-14'), "success");
    history.back();
    onBack(resp)
  }
  loading.value = false;
};

onMounted(() => {
  if (id !== ":id") {
    formState.value = {
      name: props.data.name,
      description: props.data?.description || "",
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
