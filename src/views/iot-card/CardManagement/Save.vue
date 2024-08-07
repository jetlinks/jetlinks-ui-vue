<template>
    <j-modal
        :maskClosable="false"
        width="600px"
        :visible="true"
        :title="type === 'add' ? $t('CardManagement.Save.237327-0') : $t('CardManagement.Save.237327-1')"
        :okText="$t('CardManagement.Save.237327-2')"
        :cancelText="$t('CardManagement.Save.237327-3')"
        @ok="handleOk"
        @cancel="handleCancel"
        :confirmLoading="btnLoading"
    >
        <div style="margin-top: 10px">
            <j-form
                :layout="'vertical'"
                ref="formRef"
                :rules="rules"
                :model="modelRef"
            >
                <j-form-item :label="$t('CardManagement.Save.237327-4')" name="id">
                    <j-input
                        v-model:value="modelRef.id"
                        :placeholder="$t('CardManagement.Save.237327-5')"
                        :disabled="type === 'edit'"
                    ></j-input>
                </j-form-item>
                <j-form-item name="iccId">
                    <template #label>
                        <span>
                            ICCID
                            <j-tooltip :title="$t('CardManagement.Save.237327-6')">
                                <AIcon
                                    type="QuestionCircleOutlined"
                                    style="margin-left: 2px"
                                />
                            </j-tooltip>
                        </span>
                    </template>
                    <j-input
                        v-model:value="modelRef.iccId"
                        :placeholder="$t('CardManagement.Save.237327-7')"
                        :disabled="type === 'edit'"
                    />
                </j-form-item>
                <j-form-item :label="$t('CardManagement.Save.237327-8')" name="operatorName">
                  <j-select
                    allowClear
                    showSearch
                    :filter-option="filterOption"
                    :disabled="type === 'edit'"
                    :options="OperatorList"
                    v-model:value="modelRef.operatorName"
                    :placeholder="$t('CardManagement.Save.237327-9')"
                    @select='() => {
                      modelRef.platformConfigId = undefined
                    }'
                  >
                  </j-select>
                </j-form-item>
                <j-form-item :label="$t('CardManagement.Save.237327-10')" name="platformConfigId">
                    <j-select
                        showSearch
                        :filter-option="filterOption"
                        :disabled="type === 'edit'"
                        allowClear
                        :options="platformConfigList"
                        v-model:value="modelRef.platformConfigId"
                        :placeholder="$t('CardManagement.Save.237327-11')"
                    >
                </j-select>
                </j-form-item>


                <j-form-item :label="$t('CardManagement.Save.237327-12')" name="cardType">
                    <j-select
                        allowClear
                        showSearch
                        :disabled="type === 'edit'"
                        :filter-option="filterOption"
                        :options="TypeList"
                        v-model:value="modelRef.cardType"
                        :placeholder="$t('CardManagement.Save.237327-13')"
                    >
                    </j-select>
                </j-form-item>
                <j-form-item :label="$t('CardManagement.Save.237327-14')" name="describe">
                    <j-textarea
                        v-model:value="modelRef.describe"
                        :placeholder="$t('CardManagement.Save.237327-15')"
                        showCount
                        :maxlength="200"
                    />
                </j-form-item>
            </j-form>
        </div>
    </j-modal>
</template>

<script lang="ts" setup>
import {
    queryPlatformNoPage,
    validateId,
    add,
    edit,
} from '@/api/iot-card/cardManagement';
import { onlyMessage } from '@/utils/comm';
import { OperatorList, TypeList } from '@/views/iot-card/data';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();

const emit = defineEmits(['change']);
const props = defineProps({
    type: {
        type: String,
    },
    data: {
        type: Object,
        default: undefined,
    },
});

const btnLoading = ref<boolean>(false);
const platformConfigCacheList = ref<Record<string, any>[]>([]);

const formRef = ref();

const modelRef = reactive({
    id: '',
    iccId: '',
    platformConfigId: undefined,
    operatorName: undefined,
    cardType: undefined,
    describe: '',
});

const isValidateId = async (id: string) => {
    const res: any = await validateId(id);
    if (res.status === 200) {
        if (res.result?.passed) {
            return '';
        } else {
            return res.result.reason;
        }
    } else {
        return $t('CardManagement.Save.237327-16');
    }
};

const vailIccId = async (_: Record<string, any>, value: string) => {
    if (value) {
        const validateId =
            props.type === 'add' ? await isValidateId(value) : '';
        if (validateId === '') {
            return Promise.resolve();
        } else {
            return Promise.reject(new Error(`${validateId}`));
        }
        // } else {
        //     return Promise.reject(new Error($t('CardManagement.Save.237327-5')));
    }
};

const rules = {
    id: [
        {
            required: true,
            message: $t('CardManagement.Save.237327-5'),
        },
        {
            max: 64,
            message: $t('CardManagement.Save.237327-17'),
        },
        {
            validator: vailIccId,
            trigger: 'blur',
        },
    ],
    iccId: [
        {
            required: true,
            message: $t('CardManagement.Save.237327-7'),
        },
        {
            max: 64,
            message: $t('CardManagement.Save.237327-17'),
        },
    ],
    platformConfigId: [
        {
            required: true,
            message: $t('CardManagement.Save.237327-11'),
        },
    ],
    operatorName: [
      {
        required: true,
        message: $t('CardManagement.Save.237327-9'),
      },
    ],
    cardType: [
        {
            required: true,
            message: $t('CardManagement.Save.237327-13'),
        },
    ],
};

const filterOption = (input: string, option: any) => {
    return (
        option.componentOptions.children[0].text
            .toLowerCase()
            .indexOf(input.toLowerCase()) >= 0
    );
};

const platformConfigList = computed(() => {
  return platformConfigCacheList.value.filter(item => item.operatorName === modelRef.operatorName).map(item => ({ label: item.name, value: item.id }))
})

watch(
    () => props.data,
    (newValue) => {
        queryPlatformNoPage({
            paging: false,
            sorts: [{ name: 'createTime', order: 'desc' }],
            terms: [{ column: 'state', value: 'enabled' }],
        }).then((resp: any) => {
            if (resp.status === 200) {
              platformConfigCacheList.value = resp.result
            }
        });
        Object.assign(modelRef, newValue);
    },
    { immediate: true, deep: true },
);

const handleCancel = () => {
    emit('change', false);
    formRef.value.resetFields();
};

const handleOk = () => {
    formRef.value
        .validate()
        .then(async () => {
            btnLoading.value = true;
            const resp =
                props.type === 'add'
                    ? await add(toRaw(modelRef)).catch(err => err)
                    : await edit(toRaw(modelRef)).catch(err => err);
            btnLoading.value = false;
            if (resp.status === 200) {
                onlyMessage($t('CardManagement.Save.237327-18'))
                emit('change', true);
                formRef.value.resetFields();
            }
        })
        .catch((err: any) => {
            console.log('error', err);
        });
};
</script>
