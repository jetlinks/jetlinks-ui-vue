<!-- 新增、编辑产品 -->
<template>
    <j-modal
        :title="props.title"
        :maskClosable="false"
        destroy-on-close
        v-model:visible="visible"
        @ok="submitData"
        @cancel="close"
        okText="确定"
        cancelText="取消"
        width="650px"
        :confirmLoading="loading"
    >
        <div style="margin-top: 10px">
            <j-form
                layout="vertical"
                :model="form"
                :rules="rules"
                ref="formRef"
            >
                <j-row type="flex">
                    <j-col flex="180px">
                        <j-form-item name="photoUrl">
                            <j-pro-upload
                                v-model="form.photoUrl"
                                :accept="
                                    imageTypes && imageTypes.length
                                        ? imageTypes.toString()
                                        : ''
                                "
                            />
                        </j-form-item>
                    </j-col>
                    <j-col flex="auto">
                        <j-form-item label="出厂编号" name="factoryNumber">
                            <j-input
                                v-model:value="form.factoryNumber"
                                placeholder="请输入出厂编号"
                                :disabled="idDisabled"
                            />
                        </j-form-item>
                        <j-form-item label="车辆简称" name="simpleName">
                            <j-input
                                v-model:value="form.simpleName"
                                placeholder="请输入车辆简称"
                            />
                        </j-form-item>
                    </j-col>
                </j-row>
                <j-form-item label="所属大类" name="classifiedId">
                    <j-radio-group
                        name="classifiedId"
                        v-model:value="form.classifiedId"
                    >
                        <j-radio value="1">燃油车</j-radio>
                        <j-radio value="2">电车</j-radio>
                    </j-radio-group>
                </j-form-item>
                <j-form-item label="车辆类型" name="vehicleTypeEnum">
                    <!-- <j-select showSearch v-model:value="form.vehicleTypeEnum"
                                placeholder="请选择工厂">
                                <j-select-option v-for="item in factoryList" :value="item.id" :key="item.id"
                                    :label="item.name">{{ item.name
                                    }}</j-select-option>
                            </j-select> -->
                </j-form-item>
                <j-form-item label="所属组织" name="orgName"> </j-form-item>
                <j-form-item label="主设备" name="deviceId">
                    <j-select showSearch v-model:value="form.deviceId">
                        <j-select-option
                            v-for="item in vehicleTypeList"
                            :value="item.value"
                            :key="item.value"
                            :label="item.name"
                            >{{ item.name }}</j-select-option
                        >
                    </j-select>
                </j-form-item>
                <j-form-item label="状态" name="status">
                    <j-radio-group name="status" v-model:value="form.status">
                        <j-radio value="1">正常</j-radio>
                        <j-radio value="0">停用</j-radio>
                        <j-radio value="2">维修</j-radio>
                    </j-radio-group>
                </j-form-item>
                <j-form-item label="出厂日期" name="ccDate">
                    <j-date-picker
                        style="width: 100%"
                        v-model:value="form.ccDate"
                        value-format="YYYY-MM-DD"
                    />
                </j-form-item>
                <j-form-item label="保修到期" name="description"> </j-form-item>
                <j-form-item label="车牌号" name="description"> </j-form-item>
                <j-form-item label="发动机编号" name="description">
                </j-form-item>
                <j-form-item label="年审日期" name="description"> </j-form-item>
                <j-form-item label="SIM卡" name="description">
                    <j-input
                        v-model:value="form.simNumber"
                        placeholder="请填写SIM卡号"
                    />
                </j-form-item>
                <j-form-item label="说明" name="description">
                    <j-textarea
                        :maxlength="160"
                        showCount
                        :auto-size="{ minRows: 4, maxRows: 5 }"
                        v-model:value="form.description"
                        placeholder="请输入说明"
                    />
                </j-form-item>
            </j-form>
        </div>
    </j-modal>
</template>

<script lang="ts" setup>
import { getImage } from '@/utils/comm';
import { useProductStore } from '@/store/product';
import { filterSelectNode, onlyMessage } from '@/utils/comm';
import { queryProductId, addProduct, editProduct } from '@/api/device/product';

const productStore = useProductStore();
const emit = defineEmits(['success']);

const props = defineProps({
    title: {
        type: String,
        defult: '',
    },
    isAdd: {
        type: Number,
        default: 0,
    },
});

const vehicleTypeList = [
    {
        name: '正常',
        value: 1,
    },
    {
        name: '停用',
        value: 0,
    },
    {
        name: '维修',
        value: 2,
    },
];
const loading = ref<boolean>(false);
const visible = ref<boolean>(false);
const formRef = ref();
const idDisabled = ref<boolean>(false);
const imageTypes = reactive([
    'image/jpeg',
    'image/png',
    'image/jfif',
    'image/pjp',
]);

const data = reactive({
    form: {} as Partial<Record<string, any>>,
});

const { form } = toRefs(data);
const rules = reactive({
    factoryNumber: [
        { required: true, message: '请输入出厂编号', trigger: 'blur' },
        { max: 64, message: '最多可输入64位字符', trigger: 'change' },
    ],
    simpleName: [
        { required: true, message: '请输入车辆简称', trigger: 'blur' },
        { max: 64, message: '最多可输入64位字符', trigger: 'change' },
    ],
    classifiedId: [
        { required: true, message: '请选择所属大类', trigger: 'blur' },
    ],
    ccDate: [{ required: true, message: '请选择出厂日期', trigger: 'blur' }],
});

const reset = () => {
    form.value = {
        id: '',
        factoryNumber: undefined, //出厂编号
        photoUrl: getImage('/device/instance/device-card.png'),
        simpleName: '', //车辆简称
        modelNumber: '', //型号
        orgName: '', //所属组织
        vehicleDate: '', //日期
        deviceId: '', //主设备id
        status: 1, //状态 0-在线 1-离线
        orgId: '', //所属组织id
        vehicleTypeEnum: '', //车辆类型,可用值:ICDieselEngine,ICGasolineEngine,ICTractor,MachineDieselEngine,other
        mileage: 0, //行驶里程
        idleDuration: 0, //闲置
        simNumber: '', //SIM
        ccDate: '', //出厂日期
        description: '',
    };
};
/**
 * 显示弹窗
 */
const show = (data: any) => {
    console.log('data', data);
    if (props.isAdd === 2) {
        idDisabled.value = true;
    } else if (props.isAdd === 1) {
        reset();
        idDisabled.value = false;
    }
    visible.value = true;
};

/**
 * 关闭弹窗
 */
const close = () => {
    visible.value = false;
};
/**
 * 提交表单数据
 */
const submitData = () => {
    formRef.value
        .validate()
        .then(async () => {
            // 新增
            loading.value = true;
            if (props.isAdd === 1) {
                if (form.value.id === '') {
                    form.value.id = undefined;
                }
                const res: any = await addProduct(form).finally(() => {
                    loading.value = false;
                });
                if (res.status === 200) {
                    onlyMessage('保存成功！');
                    visible.value = false;
                    emit('success');
                } else {
                    onlyMessage('操作失败', 'error');
                }
            } else if (props.isAdd === 2) {
            }
        })
        .catch((err: any) => {});
};

const changeDeviceType = (value: Array<string>) => {
    // form.deviceType = value[0];
};
defineExpose({
    show: show,
});
</script>
<style scoped lang="less">
.card-style {
    position: relative;
    top: 19px;
}
.upload-image-warp-logo {
    display: flex;
    justify-content: flex-start;
    .upload-image-border-logo {
        position: relative;
        overflow: hidden;
        border: 1px dashed #d9d9d9;
        transition: all 0.3s;
        width: 160px;
        height: 150px;
        &:hover {
            border: 1px dashed #1890ff;
            display: flex;
        }
        .upload-image-content-logo {
            align-items: center;
            justify-content: center;
            position: relative;
            display: flex;
            flex-direction: column;
            width: 160px;
            height: 150px;
            padding: 8px;
            background-color: rgba(0, 0, 0, 0.06);
            cursor: pointer;
            .loading-logo {
                position: absolute;
                top: 50%;
            }
            .loading-icon {
                position: absolute;
            }
            .upload-image {
                width: 100%;
                height: 100%;
                background-repeat: no-repeat;
                background-position: 50%;
                background-size: cover;
            }
            .upload-image-icon {
                width: 100%;
                height: 100%;
                background-repeat: no-repeat;
                background-position: 50%;
                background-size: inherit;
            }
            .upload-image-mask {
                align-items: center;
                justify-content: center;
                position: absolute;
                top: 0;
                left: 0;
                display: none;
                width: 100%;
                height: 100%;
                color: #fff;
                font-size: 16px;
                background-color: rgba(0, 0, 0, 0.35);
            }
            &:hover .upload-image-mask {
                display: flex;
            }
        }
    }
}
.button-style {
    background-color: #fff;
    height: 66px;
    overflow: hidden;
    .card-content {
        width: 100%;
        .img-style {
            position: relative;
            top: 16px;
        }
        .checked-icon {
            position: absolute;
            right: -22px;
            bottom: -22px;
            z-index: 2;

            width: 44px;
            height: 44px;
            color: #fff;
            background-color: @primary-color-active;
            transform: rotate(-45deg);

            > div {
                position: relative;
                height: 100%;
                transform: rotate(45deg);

                > span {
                    position: absolute;
                    top: 6px;
                    left: 6px;
                    font-size: 12px;
                }
            }
        }
        &.checked {
            position: relative;
            color: @primary-color-active;
            border-color: @primary-color-active;

            > .checked-icon {
                display: block;
            }
        }
    }
}
</style>
