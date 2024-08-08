<template>
    <page-container>
        <j-card>
            <j-row :gutter="24">
                <j-col :span="14">
                    <TitleComponent :data="$t('Detail.index.387412-0')" />
                    <j-form
                        :layout="'vertical'"
                        ref="formRef"
                        :rules="rules"
                        :model="form"
                    >
                        <j-form-item
                            :label="$t('Detail.index.387412-1')"
                            name="operatorName"
                            required
                        >
                            <PlatformType
                                :disabled="showDisabled"
                                :model="'singular'"
                                :itemStyle="{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-around',
                                    minWidth: '130px',
                                }"
                                :options="platformTypeList"
                                v-model:value="form.operatorName"
                                @change="typeChange"
                            ></PlatformType
                        ></j-form-item>
                        <j-form-item :label="$t('Detail.index.387412-2')" name="name">
                            <j-input
                                v-model:value="form.name"
                                :placeholder="$t('Detail.index.387412-3')"
                            />
                        </j-form-item>

                        <!-- onelink -->
                        <div v-if="form.operatorName === 'onelink'">
                            <j-form-item label="App ID" name="appId">
                                <j-input
                                    v-model:value="form.appId"
                                    :disabled="showDisabled"
                                    :placeholder="$t('Detail.index.387412-4')"
                                />
                            </j-form-item>
                            <j-form-item label="Password" name="passWord">
                                <j-input-password
                                    v-model:value="form.passWord"
                                    :disabled="showDisabled"
                                    :placeholder="$t('Detail.index.387412-5')"
                                />
                            </j-form-item>
                            <j-form-item :label="$t('Detail.index.387412-6')" name="apiAddr">
                                <j-input
                                    v-model:value="form.apiAddr"
                                    :disabled="showDisabled"
                                    :placeholder="$t('Detail.index.387412-7')"
                                />
                            </j-form-item>
                        </div>
                        <!-- ctwing -->
                        <div v-if="form.operatorName === 'ctwing'">
                            <j-form-item :label="$t('Detail.index.387412-8')" name="userId">
                                <j-input
                                    v-model:value="form.userId"
                                    :disabled="showDisabled"
                                    :placeholder="$t('Detail.index.387412-9')"
                                />
                            </j-form-item>
                            <j-form-item :label="$t('Detail.index.387412-10')" name="passWord">
                                <j-input-password
                                    v-model:value="form.passWord"
                                    :disabled="showDisabled"
                                    :placeholder="$t('Detail.index.387412-5')"
                                />
                            </j-form-item>
                            <j-form-item label="secretKey" name="secretKey">
                                <j-input
                                    v-model:value="form.secretKey"
                                    :disabled="showDisabled"
                                    :placeholder="$t('Detail.index.387412-11')"
                                />
                            </j-form-item>
                        </div>
                        <!-- unicom -->
                        <div v-if="form.operatorName === 'unicom'">
                            <j-form-item label="App ID" name="appId">
                                <j-input
                                    v-model:value="form.appId"
                                    :disabled="showDisabled"
                                    :placeholder="$t('Detail.index.387412-4')"
                                />
                            </j-form-item>
                            <j-form-item label="App Secret" name="appSecret">
                                <j-input
                                    v-model:value="form.appSecret"
                                    :disabled="showDisabled"
                                    :placeholder="$t('Detail.index.387412-12')"
                                />
                            </j-form-item>
                            <j-form-item :label="$t('Detail.index.387412-13')" name="openId">
                                <j-input
                                    v-model:value="form.openId"
                                    :disabled="showDisabled"
                                    :placeholder="$t('Detail.index.387412-14')"
                                />
                            </j-form-item>
                        </div>

                        <j-form-item :label="$t('Detail.index.387412-15')" name="explain">
                            <j-textarea
                                v-model:value="form.explain"
                                :placeholder="$t('Detail.index.387412-16')"
                                showCount
                                :rows="3"
                                :maxlength="200"
                            />
                        </j-form-item>
                        <j-form-item>
                            <j-divider />
                            <j-button
                                :loading="saveBtnLoading"
                                type="primary"
                                @click="handleSave"
                            >
                                {{ $t('Detail.index.387412-17') }}
                            </j-button>
                        </j-form-item>
                    </j-form>
                </j-col>
                <j-col :span="10">
                    <Doc :type="form.operatorName" />
                </j-col>
            </j-row>
        </j-card>
    </page-container>
</template>

<script lang="ts" setup>
import PlatformType from '@/views/iot-card/components/PlatformType.vue';
import { queryById, save, update } from '@/api/iot-card/platform';
import Doc from '../doc/index.vue';
import { platformTypeList } from '../../data'
import { onlyMessage } from '@/utils/comm';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();

const router = useRouter();
const route = useRoute();

const formRef = ref();
const saveBtnLoading = ref<boolean>(false);

const form = reactive({
    operatorName: 'onelink',
    name: undefined,
    // onelink
    appId: undefined,
    passWord: undefined,
    apiAddr: undefined,
    // ctwing
    userId: undefined,
    secretKey: undefined,
    // unicom
    appSecret: undefined,
    openId: undefined,
    explain: undefined,
});

const rules = {
    name: [
        { required: true, message: $t('Detail.index.387412-3') },
        { max: 64, message: $t('Detail.index.387412-18') },
    ],
    appId: [
        { required: true, message: $t('Detail.index.387412-4') },
        { max: 64, message: $t('Detail.index.387412-18') },
    ],
    passWord: [
        { required: true, message: $t('Detail.index.387412-5') },
        { max: 64, message: $t('Detail.index.387412-18') },
    ],
    apiAddr: [{ required: true, message: $t('Detail.index.387412-7') }],
    userId: [
        { required: true, message: $t('Detail.index.387412-19') },
        { max: 64, message: $t('Detail.index.387412-18') },
    ],
    secretKey: [{ required: true, message: $t('Detail.index.387412-11') }, { max: 64, message: $t('Detail.index.387412-18') },],
    appSecret: [{ required: true, message: $t('Detail.index.387412-12') }, { max: 64, message: $t('Detail.index.387412-18') },],
    openId: [{ required: true, message: $t('Detail.index.387412-14') }, { max: 64, message: $t('Detail.index.387412-18') },],
    explain: [{ required: false, max: 200, message: $t('Detail.index.387412-20') }],
};

const showDisabled = computed(() => {
  return route.params.id !== ':id'
})

const getDetail = async () => {
    console.log(route.params)
    if (route.params.id === ':id') return;
    const resp: any = await queryById(route.params.id);
    if (resp.status === 200) {
        Object.assign(form, resp.result, { ...resp.result.config });
    }
};

const typeChange = (val: any) => {
    formRef.value.resetFields();
    form.operatorName = val;
};

const handleSave = async () => {
    const data: any = await formRef.value.validate();
    const formData = {
        operatorName: data.operatorName,
        name: data.name,
        config: {
            appId: data.appId,
            passWord: data.passWord,
            apiAddr: data.apiAddr,
            userId: data.userId,
            secretKey: data.secretKey,
            appSecret: data.appSecret,
            openId: data.openId,
        },
        explain: data.explain,
    };
    saveBtnLoading.value = true;

    const res: any =
        route.params.id === ':id'
            ? await save(formData)
            : await update({ id: route.params.id, ...formData });
    if (res.status === 200) {
        onlyMessage($t('Detail.index.387412-21'));
        router.back();
    }
    saveBtnLoading.value = false;
};

getDetail();
</script>
