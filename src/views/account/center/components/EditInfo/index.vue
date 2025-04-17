<template>
  <a-modal
      visible
      :title="$t('EditInfo.index.557023-0')"
      @ok="handleOk"
      width="770px"
      @cancel="emits('close')"
      :confirmLoading="loading"
      :zIndex="1100"
      :maskClosable='false'
  >
    <a-form :model="form" layout="vertical" ref="formRef">
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item
              :label="$t('EditInfo.index.557023-1')"
              name="name"
              :rules="[
                            { required: true, message: $t('EditInfo.index.557023-2') },
                            { max: 64, message: $t('EditInfo.index.557023-3') },
                        ]"
          >
            <a-input
                v-model:value="form.name"
                :placeholder="$t('EditInfo.index.557023-4')"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item :label="$t('EditInfo.index.557023-5')">
            <a-input
                v-model:value="form.username"
                :placeholder="$t('EditInfo.index.557023-6')"
                disabled
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item :label="$t('EditInfo.index.557023-7')">
            <a-input
                :value="
                                form.roleList.map((item) => item.name).join(',')
                            "
                :placeholder="$t('EditInfo.index.557023-8')"
                disabled
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item :label="$t('EditInfo.index.557023-9')">
            <a-input
                :value="
                                form.orgList.map((item) => item.name).join(',')
                            "
                :placeholder="$t('EditInfo.index.557023-10')"
                disabled
            />
          </a-form-item>
        </a-col>
        <a-col :span="12" v-if="isNoCommunity">
          <a-form-item :label="$t('EditInfo.index.557023-18')">
            <a-input
                :value="
                                (form.positions || []).map((item) => item.name).join(',')
                            "
                :placeholder="$t('EditInfo.index.557023-19')"
                disabled
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
              :label="$t('EditInfo.index.557023-11')"
              name="telephone"
              :rules="[
                            {
                                pattern: /^1[3456789]\d{9}$/,
                                message: $t('EditInfo.index.557023-12'),
                            },
                        ]"
          >
            <a-input
                v-model:value="form.telephone"
                :placeholder="$t('EditInfo.index.557023-13')"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
              :label="$t('EditInfo.index.557023-14')"
              name="email"
              :rules="[
                            {
                                type: 'email',
                                message: $t('EditInfo.index.557023-15'),
                            },
                        ]"
          >
            <a-input
                v-model:value="form.email"
                :placeholder="$t('EditInfo.index.557023-16')"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import {updateMeInfo_api} from '@/api/account/center';
import {onlyMessage} from "@jetlinks-web/utils";
import {cloneDeep} from 'lodash-es';
import {useI18n} from 'vue-i18n';
import {isNoCommunity} from "@/utils";

const {t: $t} = useI18n();
const emits = defineEmits(['save', 'close']);
const props = defineProps({
  data: {
    type: Object,
    default: () => {
    },
  },
});
const loading = ref(false);
const form = ref<any>(cloneDeep(props.data));
const formRef = ref<any>();


const handleOk = () => {
  formRef.value?.validate().then(() => {
    loading.value = true;
    updateMeInfo_api(form.value)
        .then((resp) => {
          if (resp.status === 200) {
            onlyMessage($t('EditInfo.index.557023-17'), 'success');
            emits('save', form.value);
          }
        })
        .finally(() => (loading.value = false));
  });
};
</script>

<style scoped></style>
