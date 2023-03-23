<template>
    <page-container>
        <j-card>
            <j-row :gutter="24">
                <j-col :span="14">
                    <TitleComponent data="详情" />
                    <j-form
                        :layout="'vertical'"
                        ref="formRef"
                        :rules="rules"
                        :model="form"
                    >
                        <j-form-item
                            label="平台类型"
                            name="operatorName"
                            required
                        >
                            <PlatformType
                                :disabled="false"
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
                        <j-form-item label="名称" name="name">
                            <j-input
                                v-model:value="form.name"
                                placeholder="请输入名称"
                            />
                        </j-form-item>

                        <!-- onelink -->
                        <div v-if="form.operatorName === 'onelink'">
                            <j-form-item label="App ID" name="appId">
                                <j-input
                                    v-model:value="form.appId"
                                    placeholder="请输入App ID"
                                />
                            </j-form-item>
                            <j-form-item label="Password" name="passWord">
                                <j-input-password
                                    v-model:value="form.passWord"
                                    placeholder="请输入密码"
                                />
                            </j-form-item>
                            <j-form-item label="接口地址" name="apiAddr">
                                <j-input
                                    v-model:value="form.apiAddr"
                                    placeholder="请输入接口地址"
                                />
                            </j-form-item>
                        </div>
                        <!-- ctwing -->
                        <div v-if="form.operatorName === 'ctwing'">
                            <j-form-item label="用户id" name="userId">
                                <j-input
                                    v-model:value="form.userId"
                                    placeholder="请输入用户id"
                                />
                            </j-form-item>
                            <j-form-item label="密码" name="passWord">
                                <j-input-password
                                    v-model:value="form.passWord"
                                    placeholder="请输入密码"
                                />
                            </j-form-item>
                            <j-form-item label="secretKey" name="secretKey">
                                <j-input
                                    v-model:value="form.secretKey"
                                    placeholder="请输入secretKey"
                                />
                            </j-form-item>
                        </div>
                        <!-- unicom -->
                        <div v-if="form.operatorName === 'unicom'">
                            <j-form-item label="App ID" name="appId">
                                <j-input
                                    v-model:value="form.appId"
                                    placeholder="请输入App ID"
                                />
                            </j-form-item>
                            <j-form-item label="App Secret" name="appSecret">
                                <j-input
                                    v-model:value="form.appSecret"
                                    placeholder="请输入App Secret"
                                />
                            </j-form-item>
                            <j-form-item label="创建者ID" name="openId">
                                <j-input
                                    v-model:value="form.openId"
                                    placeholder="请输入创建者ID"
                                />
                            </j-form-item>
                        </div>

                        <j-form-item label="说明" name="explain">
                            <j-textarea
                                v-model:value="form.explain"
                                placeholder="请输入说明"
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
                                保存
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
import { getImage } from '@/utils/comm';
import PlatformType from '@/views/iot-card/components/PlatformType.vue';
import { queryById, save, update } from '@/api/iot-card/platform';
import { message } from 'jetlinks-ui-components';
import Doc from '../doc/index.vue';

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

const platformTypeList = [
    {
        label: '移动OneLink',
        value: 'onelink',
        imgUrl: getImage('/iot-card/onelink.png'),
        imgSize: ['78px', '20px'],
    },
    {
        label: '电信Ctwing',
        value: 'ctwing',
        imgUrl: getImage('/iot-card/ctwingcmp.png'),
        imgSize: ['52px', '25px'],
    },
    {
        label: '联通Unicom',
        value: 'unicom',
        imgUrl: getImage('/iot-card/unicom.png'),
        imgSize: ['56px', '41px'],
    },
];

const rules = {
    name: [
        { required: true, message: '请输入名称' },
        { max: 64, message: '最多可输入64个字符' },
    ],
    appId: [
        { required: true, message: '请输入App ID' },
        { max: 64, message: '最多可输入64个字符' },
    ],
    passWord: [
        { required: true, message: '请输入密码' },
        { max: 64, message: '最多可输入64个字符' },
    ],
    apiAddr: [{ required: true, message: '请输入接口地址' }],
    userId: [
        { required: true, message: '请输入用户 ID' },
        { max: 64, message: '最多可输入64个字符' },
    ],
    secretKey: [{ required: true, message: '请输入secretKey' }],
    appSecret: [{ required: true, message: '请输入App Secret' }],
    openId: [{ required: true, message: '请输入创建者ID' }],
    explain: [{ required: false, max: 200, message: '最多可输入200个字符' }],
};

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
        message.success('保存成功！');
        router.back();
    }
    saveBtnLoading.value = false;
};

getDetail();
</script>
