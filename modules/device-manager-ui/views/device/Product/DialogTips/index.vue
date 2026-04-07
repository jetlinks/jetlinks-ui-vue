<!-- 产品保存成功后的提示框 -->
<template>
    <a-modal
        :maskClosable="false"
        destroy-on-close
        v-model:open="visible"
        @cancel="cancel"
        width="650px"
    >
        <template #title>
            <span>{{ $t('DialogTips.index.379211-0') }}</span>
        </template>
        <template #footer>
            <a-button @click="cancel">{{ $t('DialogTips.index.379211-1') }}</a-button>
        </template>
        <div class="product-tips">
            <div style="display: flex">
                <div class="product-icon">
                    <AIcon
                        type="CheckCircleOutlined"
                        class="icon-style"
                    ></AIcon>
                </div>
                <div class="product-title">{{ $t('DialogTips.index.379211-0') }}</div>
            </div>
            <div style="display: flex">
                <div class="product-id">{{ $t('DialogTips.index.379211-2') }} {{ idValue }}</div>
                <div
                    class="product-btn"
                    @click="showDetail"
                    style="cursor: pointer"
                >
                    {{ $t('DialogTips.index.379211-3') }}
                </div>
            </div>
            <div>{{ $t('DialogTips.index.379211-4') }}</div>
            <div class="product-main">{{ $t('DialogTips.index.379211-5') }}</div>
            <div class="product-text">
                {{ $t('DialogTips.index.379211-6') }}
            </div>
            <div class="product-main">{{ $t('DialogTips.index.379211-7') }}</div>
            <div class="product-text">
                {{ $t('DialogTips.index.379211-8') }}
            </div>
            <div class="product-main">{{ $t('DialogTips.index.379211-9') }}</div>
            <div class="product-text">
                {{ $t('DialogTips.index.379211-10') }}
            </div>
            <div class="product-main">{{ $t('DialogTips.index.379211-11') }}</div>
            <div class="product-text">
                {{ $t('DialogTips.index.379211-12') }}
            </div>
        </div>
    </a-modal>
</template>
<script lang="ts" setup name="DialogTips">
import { useProductStore } from '../../../../store/product';
import { useMenuStore } from '@jetlinks-web-core/store';

const visible = ref<boolean>(false);
const productStore = useProductStore();
const router = useRouter();
const idValue = ref({});
const menuStore = useMenuStore();
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
    menuStore.jumpPage('device/Product/Detail', { params: { id: idValue.value }});
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
        max-width: 520px;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
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
