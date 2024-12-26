<template>
    <div class="steps-box">
        <div class="alert">
            <AIcon type="InfoCircleOutlined" />
            配置设备信令参数
        </div>
        <a-form :model="formState" ref="formRef" name="basic" autocomplete="off" layout="vertical">
            <a-row :gutter="[24, 24]">
                <a-col :span="12">
                    <a-form-item label="SIP 域" name="domain" :rules="[
                        {
                            required: true,
                            message: '请输入SIP 域',
                        },
                        {
                            max: 64,
                            message: '最多可输入64个字符',
                            trigger: 'blur',
                        },
                    ]">
                        <a-input v-model:value="formState.domain" placeholder="请输入SIP 域" />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="SIP ID" name="sipId" :rules="[
                        {
                            required: true,
                            message: '请输入SIP ID',
                        },
                        {
                            max: 64,
                            message: '最多可输入64个字符',
                            trigger: 'blur',
                        },
                    ]">
                        <a-input v-model:value="formState.sipId" placeholder="请输入SIP ID" />
                    </a-form-item>
                </a-col>
            </a-row>
            <div class="form-item1">
                <a-row :gutter="[24, 24]">
                    <a-col :span="6">
                        <a-form-item label="SIP 地址" :name="['hostPort', 'host']" :rules="[
                            {
                                required: true,
                                message: '请选择SIP地址',
                            },
                        ]">
                            <a-select v-model:value="formState.hostPort.host" style="width: 105%" :disabled="true"
                                show-search :filter-option="filterOption">
                                <a-select-option value="0.0.0.0">0.0.0.0</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="6">
                        <a-form-item :name="['hostPort', 'port']" :rules="[
                            {
                                required: true,
                                message: '请选择端口',
                            },
                        ]">
                            <div class="form-label"></div>

                            <a-select v-model:value="formState.hostPort.port" :options="sipList" placeholder="请选择端口"
                                allowClear show-search :filter-option="filterOption" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="6">
                        <a-form-item label="公网 Host" :name="['hostPort', 'publicHost']" :rules="[
                            {
                                required: true,
                                message: '请输入IP地址',
                            },
                            {
                                validator: validateUrl,
                                trigger: 'change',
                            },

                        ]" :validateFirst="true">
                            <a-input style="width: 105%" v-model:value="formState.hostPort.publicHost
                                " :max="65535" :min="1" :precision="0" placeholder="请输入IP地址" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="6">
                        <a-form-item :name="['hostPort', 'publicPort']" :rules="rules.publicPort" :validateFirst="true">
                            <div class="form-label"></div>
                            <a-input-number style="width: 100%" placeholder="请输入端口" v-model:value="formState.hostPort.publicPort
                                " :min="1" :max="65535" :precision="0" />
                        </a-form-item>
                    </a-col>
                </a-row>
            </div>
        </a-form>
    </div>
</template>

<script setup>
import { getResourcesCurrent } from '@/api/link/accessConfig';
import { defineExpose } from 'vue';
const formRef = ref()
const rules = {
    publicPort: [
        {
            required: true,
            message: '输入端口',
        }
    ]
}

let formState = ref({
    domain: undefined,
    sipId: undefined,
    shareCluster: true,
    hostPort: {
        port: undefined,
        host: '0.0.0.0',
        publicPort: undefined,
        publicHost: undefined,
    },
});
const sipList = ref([]);
const filterOption = (input, option) => {
    return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};
const getSpiList = async () => {
    const res = await getResourcesCurrent()
    if (res.success) {
        sipList.value = res.result
            .find((i) => i.host === '0.0.0.0')
            ?.portList.map((i) => {
                return {
                    value: i.port,
                    label: `${i.transports.join('/')} (${i.port})`,
                };
            });
    }
}

const submitData = () => {
    return new Promise((res, rej) => {
        formRef.value.validate().then(() => {
            res(formState.value)
        }).catch((err) => {
            rej(err)
        })
    })

}

defineExpose({
    submitData
})

onMounted(() => {
    getSpiList()
})
</script>
<style lang='less' scoped>
.alert {
    height: 40px;
    padding-left: 10px;
    color: rgba(0, 0, 0, 0.55);
    line-height: 40px;
    background-color: #f6f6f6;
}

.form-item1 {
    background-color: #f6f6f6;
    padding: 10px;
}

.form-label {
    height: 30px;
    padding-bottom: 8px;
}
</style>
