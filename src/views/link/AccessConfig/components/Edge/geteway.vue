<template>
  <div class="card-last">
    <j-row :gutter="[24, 24]">
      <j-col :span="12">
        <title-component data="基本信息" />
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
                                    message: '请输入名称',
                                    trigger: 'blur',
                                },
                                {
                                    max: 64,
                                    message: '最多可输入64个字符',
                                    trigger: 'blur',
                                },
                            ]"
                label="名称"
                name="name"
            >
              <j-input
                  v-model:value="formState.name"
                  placeholder="请输入名称"
              />
            </j-form-item>
            <j-form-item label="说明" name="description">
              <j-textarea
                  v-model:value="formState.description"
                  :maxlength="200"
                  :rows="4"
                  placeholder="请输入说明"
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
          <p>设备接入指引</p>
          <TitleComponent data="设备接入指引" />
          <p>1、数据采集菜单中配置数采通道、点位</p>
          <p>2、创建数采设备接入网关</p>
          <p>3、创建产品，并选中接入方式为数采设备接入</p>
          <p>4、添加设备，单独为每一个设备进行数据点绑定</p>
        </div>
      </j-col>
    </j-row>
  </div>
</template>

<script lang="ts" name="GateWay" setup>
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
    onlyMessage('操作成功', 'success');
    history.back();
    if ((window as any).onTabSaveSuccess) {
      (window as any).onTabSaveSuccess(resp);
      setTimeout(() => window.close(), 300);
    }
  }
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
