<!-- 产品保存成功后的提示框 -->
<template>
    <j-modal
        :maskClosable="false"
        destroy-on-close
        v-model:visible="visible"
        @cancel="cancel"
        v-bind="layout"
        width="650px"
    >
        <template #title>
            <span>产品创建成功</span>
        </template>
        <template #footer>
            <j-button @click="cancel">关闭</j-button>
        </template>
        <div class="product-tips">
            <div style="display: flex">
                <div class="product-icon">
                    <check-circle-outlined class="icon-style" />
                </div>
                <div class="product-title">产品创建成功</div>
            </div>
            <div style="display: flex">
                <div class="product-id">产品ID: {{ idValue.value }}</div>
                <div class="product-btn" @click="showDetail">查看详情</div>
            </div>
            <div>接下来推荐操作:</div>
            <div class="product-main">1、配置产品接入方式</div>
            <div class="product-text">
                点击具体产品的查看按钮,进入“设备接入”tab页，并参照设备铭牌说明选择匹配的接入方式
            </div>
            <div class="product-main">2、添加测试设备</div>
            <div class="product-text">
                进入设备列表，添加单个设备，用于验证产品模型是否配置正确
            </div>
            <div class="product-main">3、功能调试</div>
            <div class="product-text">
                点击查看具体设备，进入“设备诊断”对添加的测试设备进行功能调试，验证能否连接到平台，设备功能是否配置正确
            </div>
            <div class="product-main">4、批量添加设备</div>
            <div class="product-text">
                进入设备列表页面，点击批量导入设备，批量添加同一产品下的设备
            </div>
        </div>
    </j-modal>
</template>
<script lang="ts" setup name="DialogTips">
import { getImage } from '@/utils/comm.ts';
import { useProductStore } from '@/store/product';
import { CheckCircleOutlined } from '@ant-design/icons-vue';
const visible = ref<boolean>(false);
const productStore = useProductStore();
const router = useRouter();
const idValue = ref({});
/**
 * 弹窗关闭
 */
const cancel = () => {
    visible.value = false;
};
/**
 * 显示弹窗
 */
const show = (id: string) => {
    visible.value = true;
    idValue.value = id;
};
/**
 * 查看详情
 */
const showDetail = () => {
    jump(idValue.value);
};
/**
 * 跳转页面
 */
const jump = (id: string) => {
    router.push('/iot/device/product/detail/' + id);
};
defineExpose({
    show: show,
});
</script>
<style lang="less" scoped>
.product-tips {
    .product-icon {
        .icon-style {
            color: #52c41a;
            font-size: 25px;
        }
    }
    .product-title {
        margin-left: 10px;
        margin-top: 2px;
        font-weight: 600;
    }
    .product-id {
        margin: 10px 15px 10px 0px;
    }
    .product-btn {
        margin: 10px 0px 10px 0;
        color: #0297d7;
    }
    .product-text {
        color: #757575;
    }
    .product-main {
        font-weight: 600;
    }
}
</style>
