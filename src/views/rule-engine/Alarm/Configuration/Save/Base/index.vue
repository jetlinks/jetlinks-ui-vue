<template>
    <FullPage>
        <div>
            <j-form layout="vertical" :rules="rule" :model="form" ref="formRef">
                <j-row :gutter="24">
                    <j-col :span="12">
                        <j-form-item :label="$t('Base.index.4265418-0')" name="name">
                            <j-input
                                :placeholder="$t('Base.index.4265418-1')"
                                v-model:value="form.name"
                            ></j-input> </j-form-item
                    ></j-col>
                    <j-col :span="12">
                        <j-form-item name="targetType">
                            <template #label>
                                <j-space>
                                    {{ $t('Base.index.4265418-2') }}
                                    <j-tooltip>
                                        <template #title>
                                            <div>{{ $t('Base.index.4265418-3') }}</div>
                                            <div>{{ $t('Base.index.4265418-4') }}</div>
                                            <div>{{ $t('Base.index.4265418-5') }}</div>
                                            <div>{{ $t('Base.index.4265418-6') }}</div>
                                        </template>
                                        <AIcon
                                            type="QuestionCircleOutlined"
                                            style="
                                                color: rgb(136, 136, 136);
                                                font-size: 12px;
                                            "
                                        />
                                    </j-tooltip>
                                </j-space>
                            </template>
                            <j-select
                                :options="options"
                                v-model:value="form.targetType"
                                :disabled="selectDisable"
                            ></j-select>
                        </j-form-item>
                    </j-col>
                </j-row>
                <j-form-item :label="$t('Base.index.4265418-7')" name="level">
                    <j-radio-group
                        v-model:value="form.level"
                        class="levelSelect"
                    >
                        <j-radio-button
                            v-for="(item, index) in levelOption"
                            :key="index"
                            :value="item.value"
                        >
                            <Ellipsis
                                style="
                                    text-align: center;
                                    margin-top: 10px;
                                    font-size: 15px;
                                    width: 90%;
                                "
                            >
                                <img
                                    :src="
                                        getImage(`/alarm/alarm${index + 1}.png`)
                                    "
                                    style="height: 40px"
                                    alt=""
                                />{{ item.label }}
                            </Ellipsis>
                        </j-radio-button>
                    </j-radio-group>
                </j-form-item>
                <j-form-item :label="$t('Base.index.4265418-8')" name="description">
                    <j-textarea
                        v-model:value="form.description"
                        showCount
                        :maxlength="200"
                    ></j-textarea>
                </j-form-item>
                <PermissionButton
                    type="primary"
                    :loading="loading"
                    @click="handleSave"
                    :hasPermission="[
                        'rule-engine/Alarm/Configuration:add',
                        'rule-engine/Alarm/Configuration:update',
                    ]"
                    >{{ $t('Base.index.4265418-9') }}</PermissionButton
                >
            </j-form>
        </div>
    </FullPage>
</template>

<script lang="ts" setup>
import {
    getTargetTypes,
    save,
    detail,
    updata,
} from '@/api/rule-engine/configuration';
import { queryLevel } from '@/api/rule-engine/config';
import { query } from '@/api/rule-engine/scene';
import { getImage, onlyMessage } from '@/utils/comm';
import { useMenuStore } from '@/store/menu';
import { useRoute } from 'vue-router';
import { useAlarmConfigurationStore } from '@/store/alarm';
import { storeToRefs } from 'pinia';
import { usePermissionStore } from '@/store/permission';
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()
const route = useRoute();
let selectDisable = ref(false);
const alarmConfigurationStore = useAlarmConfigurationStore();
let { configurationData } = storeToRefs(alarmConfigurationStore);

const emit = defineEmits(['change']);

const queryData = () => {
    if (route.query?.id) {
        detail(route.query?.id).then((res) => {
            if (res.status === 200) {
                emit('change', res?.result?.targetType);
                form.value = res?.result;
                // form.level = res?.result?.level;
                // form.name = res?.result?.name;
                // form.targetType = res?.result?.targetType;
                // form.description = res?.result?.description;
                configurationData.value.current = res.result;
                query({
                    terms: [
                        {
                            terms: [
                                {
                                    column: 'id',
                                    termType: 'alarm-bind-rule',
                                    value: route.query?.id,
                                },
                            ],
                            type: 'and',
                        },
                    ],
                    sorts: [
                        {
                            name: 'createTime',
                            order: 'desc',
                        },
                    ],
                }).then((resq) => {
                    if (resq.status === 200) {
                        selectDisable.value = !!resq.result.data?.length;
                    }
                });
            }
        });
    }
};
const rule = {
    name: [
        {
            required: true,
            message: $t('Base.index.4265418-1'),
        },
        {
            max: 64,
            message: $t('Base.index.4265418-10'),
        },
    ],
    targetType: [
        {
            required: true,
            message: $t('Base.index.4265418-11'),
        },
    ],
    level: [
        {
            required: true,
            message: $t('Base.index.4265418-12'),
        },
    ],
    description: [
        {
            max: 200,
            message: $t('Base.index.4265418-13'),
        },
    ],
};
let form = ref({
    level: '',
    targetType: '',
    name: '',
    description: '',
});
let options = ref();
let levelOption = ref();
let loading = ref(false);
const formRef = ref();
const menuStory = useMenuStore();
const getSupports = async () => {
    let res = await getTargetTypes();
    if (res.status === 200) {
        options.value = res.result.map(
            (item: { id: string; name: string }) => ({
                label: item.name,
                value: item.id,
            }),
        );
    }
};
getSupports();
const getLevel = () => {
    queryLevel().then((res) => {
        if (res.status === 200) {
            levelOption.value = res.result?.levels
                ?.filter((i: any) => i?.level && i?.title)
                .map((item: { level: number; title: string }) => ({
                    label: item.title,
                    value: item.level,
                }));
        }
    });
};
getLevel();
const handleSave = async () => {
    loading.value = true;
    formRef.value
        .validate()
        .then(async () => {
            const res = route.query?.id
                ? await updata(form.value)
                : await save(form.value);
            if (res.status === 200) {
                onlyMessage($t('Base.index.4265418-14'));
                loading.value = false;
                emit('change', form.value.targetType);
                if (res.result?.id) {
                    menuStory.jumpPage(
                        'rule-engine/Alarm/Configuration/Save',
                        {},
                        { id: res.result?.id },
                    );
                }
                if (!route.query?.id) {
                    configurationData.value.current = res.result;
                }
            }
        })
        .catch((error) => {
            loading.value = false;
            console.log(error);
        });
};
queryData();
watch(
    () => route.query?.id,
    () => {
        queryData();
    },
);
</script>
<style lang="less" scoped>
.ant-radio-button-wrapper {
    margin: 10px 15px 0 0;
    width: 20%;
    height: 100%;
}
.levelSelect {
    display: flex;
    width: 100%;
}
</style>