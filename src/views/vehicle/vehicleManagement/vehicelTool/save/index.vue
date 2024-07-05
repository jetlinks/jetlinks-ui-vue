<!-- 新增、编辑物模型 -->
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
        width="690px"
        :confirmLoading="loading"
    >
        <div style="margin-top: 5px">
            <j-form
                layout="vertical"
                :model="form"
                :rules="rules"
                ref="formRef"
            >
                <j-row type="flex">
                    <j-col flex="180px">
                        <j-form-item name="pictureUrl">
                            <j-pro-upload
                                v-model="form.pictureUrl"
                                :accept="
                                    imageTypes && imageTypes.length
                                        ? imageTypes.toString()
                                        : 'typeImageTypes'
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
                <j-form-item label="所属大类" name="category">
                    <j-radio-group
                        name="category"
                        v-model:value="form.category"
                    >
                        <j-radio value="0">燃油车</j-radio>
                        <j-radio value="1">电车</j-radio>
                    </j-radio-group>
                </j-form-item>
                <j-form-item label="车辆类型" name="vehicleTypeEnum">
                    <j-select
                        showSearch
                        v-model:value="form.vehicleTypeEnum"
                        placeholder="请选择车辆类型"
                    >
                        <j-select-option
                            v-for="item in vehicleTypeList"
                            :value="item.value"
                            :key="item.value"
                            :label="item.name"
                            >{{ item.name }}</j-select-option
                        >
                    </j-select>
                </j-form-item>
                <j-form-item label="所属组织" name="orgName">
                    <j-tree-select
                        showSearch
                        v-model:value="form.orgName"
                        placeholder="请选择物模型分类"
                        :tree-data="treeList"
                        @change="valueChange"
                        allow-clear
                        :fieldNames="{
                            label: 'name',
                            value: 'id',
                            children: 'children',
                        }"
                        :filterTreeNode="
                            (v:any, option:any) => filterSelectNode(v, option, 'name')
                        "
                    >
                        <template> </template>
                    </j-tree-select>
                </j-form-item>
                <j-form-item label="设备号" name="deviceId">
                    <j-input
                        v-model:value="form.deviceId"
                        placeholder="请输入设备号(=车辆简称)"
                    />
                </j-form-item>
                <j-form-item label="车辆状态" name="vehicleStatus">
                    <j-radio-group
                        name="vehicleStatus"
                        v-model:value="form.vehicleStatus"
                    >
                        <j-radio :value="0">正常</j-radio>
                        <j-radio :value="1">停用</j-radio>
                        <j-radio :value="2">维修</j-radio>
                    </j-radio-group>
                </j-form-item>
                <j-form-item label="出厂日期" name="vehicleDate">
                    <j-date-picker
                        style="width: 100%"
                        placeholder="请选择出厂日期"
                        v-model:value="form.vehicleDate"
                        value-format="x"
                    />
                </j-form-item>
                <j-form-item label="关联设备" name="deviceIds">
                    <div class="j-select-but">
                        <j-select
                            v-model:value="form.deviceIds"
                            mode="multiple"
                            placeholder="请选择关联设备"
                            :max-tag-count="maxTagCount"
                            :open="false"
                        >
                            <template #maxTagPlaceholder="omittedValues">
                                <span>+ {{ omittedValues.length }} ...</span>
                            </template>
                        </j-select>
                        <j-button
                            style="width: 90px"
                            class="input-but"
                            @click="funSelectDevices"
                            type="primary"
                            block
                            >选择设备</j-button
                        >
                    </div>
                </j-form-item>
                <j-form-item label="关联零部件" name="spareParts">
                    <div class="j-select-but">
                        <j-select
                            v-model:value="form.spareParts"
                            mode="multiple"
                            label-in-value
                            placeholder="请选择关联零部件"
                            :open="false"
                        >
                        </j-select>
                        <j-button
                            style="width: 110px"
                            class="input-but"
                            type="primary"
                            block
                            >选择零部件</j-button
                        >
                    </div>
                </j-form-item>
                <j-form-item label="保修到期" name="warrantyDate">
                    <j-date-picker
                        style="width: 100%"
                        v-model:value="form.warrantyDate"
                        value-format="x"
                    />
                </j-form-item>
                <j-form-item label="车牌号" name="vehicleNumber">
                    <j-input
                        v-model:value="form.vehicleNumber"
                        placeholder="请输入车牌号"
                    />
                </j-form-item>
                <j-form-item label="发动机编号" name="engineNumber">
                    <j-input
                        v-model:value="form.engineNumber"
                        placeholder="请输入发动机编号"
                    />
                </j-form-item>
                <j-form-item label="年审日期" name="annualReviewDate">
                    <j-date-picker
                        style="width: 100%"
                        v-model:value="form.annualReviewDate"
                        value-format="x"
                    />
                </j-form-item>
                <j-form-item label="SIM卡" name="networkCardId">
                    <j-input
                        v-model:value="form.networkCardId"
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
    <Modal ref="deviceRef" @success="updateDevices" />
</template>

<script lang="ts" setup>
import {
    getDepartmentList,
    addVehicle,
    saveVehicleDevices,
    queryNoPagingPostDevice,
} from '@/api/vehicle/vehicleManagement';
import Modal from './Modal/index.vue';
import { getImage } from '@/utils/comm';
import { filterSelectNode, onlyMessage } from '@/utils/comm';
import dayjs, { Dayjs } from 'dayjs';

const maxTagCount = ref(5);

const emit = defineEmits(['success']);
const props = defineProps({
    title: {
        type: String,
        default: '',
    },
    isAdd: {
        type: Number,
        default: 0,
    },
});

const vehicleTypeList = [
    {
        name: '内燃柴油机',
        value: 'ICDieselEngine',
    },
    {
        name: '内燃汽油机',
        value: 'ICGasolineEngine',
    },
    {
        name: '内燃牵引车',
        value: 'ICTractor',
    },
    {
        name: '机械柴油机',
        value: 'MachineDieselEngine',
    },
    {
        name: '其他',
        value: 'other',
    },
];
const loading = ref<boolean>(false);
const visible = ref<boolean>(false);
const formRef = ref();
const idDisabled = ref<boolean>(false);
const treeList = ref<Record<string, any>[]>([]);
const imageTypes = reactive([
    'image/jpeg',
    'image/png',
    'image/jpg',
    'image/jfif',
    'image/pjp',
]);

const deviceRef = ref();

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
    category: [{ required: true, message: '请选择所属大类', trigger: 'blur' }],
    vehicleTypeEnum: [
        { required: true, message: '请选择车辆类型', trigger: 'blur' },
    ],
    orgName: [{ required: true, message: '请选择所属组织', trigger: 'blur' }],
    vehicleDate: [
        { required: true, message: '请选择出厂日期', trigger: 'blur' },
    ],
    deviceId: [
        { required: true, message: '请输入设备号(=车辆简称)', trigger: 'blur' },
        { max: 64, message: '最多可输入64位字符', trigger: 'change' },
    ],
    vehicleStatus: [
        { required: true, message: '请选择车辆状态', trigger: 'blur' },
    ],
    networkCardId: [
        { max: 64, message: '最多可输入64位字符', trigger: 'change' },
    ],
    vehicleNumber: [
        { max: 64, message: '最多可输入64位字符', trigger: 'change' },
    ],
    engineNumber: [
        { max: 64, message: '最多可输入64位字符', trigger: 'change' },
    ],
    describe: [{ max: 250, message: '最多可输入250位字符', trigger: 'change' }],
});

const funSelectDevices = () => {
    nextTick(() => {
        deviceRef.value.show(form.value.deviceIds);
    });
};

//更新关联设备
const updateDevices = (data: any) => {
    form.value.deviceIds = data || [];
};

/**
 * 查询组织
 */
const queryOrgTree = async () => {
    getDepartmentList({ paging: false }).then((resp: any) => {
        if (resp.status === 200) {
            treeList.value = resp.result;
            treeList.value = dealOrgTree(treeList.value);
        }
    });
};
/**
 * 处理物模型分类key
 */
const dealOrgTree = (arr: any) => {
    return arr.map((element: any) => {
        element.key = element.id;
        if (element.children) {
            element.children = dealOrgTree(element.children);
        }
        return element;
    });
};

const valueChange = (value: string, label: string) => {
    form.value.orgName = label[0];
    form.value.orgId = value;
};

//时间格式转为时间戳
const setTimestamp = (date: any) => {
    const dayjsDate = dayjs(date);
    // 转换为时间戳（毫秒）
    const timestamp = dayjsDate.valueOf();
    return timestamp;
};

const reset = () => {
    form.value = {
        id: '',
        factoryNumber: '', //出厂编号
        pictureUrl: getImage('/device/instance/device-card.png'),
        simpleName: '', //车辆简称
        vehicleNumber: '', //车牌号
        engineNumber: '', //发动机编号
        category: '0', //所属大类 0-燃油车 1-电车
        modelNumber: '', //型号
        orgId: '', //所属组织id
        orgName: '', //所属组织
        vehicleDate: setTimestamp(new Date()), //出厂日期
        deviceId: '', //主设备id
        devices: [],
        deviceIds: [], //关联设备
        spareParts: [], //关联零部件
        vehicleStatus: 0, //车辆状态0-正常 1-停用 2-维修
        status: 1, //状态 0-在线 1-离线
        vehicleTypeEnum: '', //车辆类型,可用值:ICDieselEngine,ICGasolineEngine,ICTractor,MachineDieselEngine,other
        networkCardId: '', //SIM
        warrantyDate: setTimestamp(new Date()), //保修到期
        annualReviewDate: setTimestamp(new Date()), //年审日期
        describe: '',
    };
};
/**
 * 显示弹窗
 */
const show = (data: any) => {
    if (props.isAdd === 2) {
        form.value = {
            ...data,
            deviceIds: data.devices?.map((item: any) => {
                return item.id;
            }),
        };
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
                const { deviceIds, ...params } = form.value;
                saveVehicleDevices({ vehicleEntity: params, deviceIds })
                    .then((res: any) => {
                        if (res.status === 200) {
                            onlyMessage('添加成功！');
                        }
                        loading.value = false;
                        visible.value = false;
                        emit('success');
                    })
                    .catch((err) => {
                        console.log(err);
                        onlyMessage('添加失败！', 'error');
                        loading.value = false;
                    });
                //新增
            } else if (props.isAdd === 2) {
                const { deviceIds, ...params } = form.value;
                saveVehicleDevices({ vehicleEntity: params, deviceIds })
                    .then((res: any) => {
                        if (res.status === 200) {
                            onlyMessage('修改成功！');
                        }
                        loading.value = false;
                        visible.value = false;
                        emit('success');
                    })
                    .catch((err) => {
                        console.log(err);
                        onlyMessage('修改失败！', 'error');
                        loading.value = false;
                    });
                //更新
            }
        })
        .catch((err: any) => {});
};

defineExpose({
    show: show,
});

onMounted(() => {
    queryOrgTree();
});
</script>
<style scoped lang="less">
.card-style {
    position: relative;
    top: 19px;
}
.j-select-but {
    display: flex;
    flex-direction: row;
}
.input-but {
    margin: 0;
    padding: 3px 0px;
    height: 100%;
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
