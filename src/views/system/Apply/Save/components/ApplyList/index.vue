<template>
    <div :value="_value" class="radio-container" :disabled="disabled">
        <div
            v-for="item in options"
            :value="item.value"
            :key="item.value"
            class="radio-container-item"
            @click="onChange(item.value)"
            :class="{ active: item.value === _value }"
        >
            <div v-if="type === 'edit'">
                <MUpload
                    :defaultValue="defaultImg[item.value]"
                    :borderStyle="{
                        width: '64px',
                        height: '64px',
                        border: 'none',
                    }"
                    :disabled="!(item.value === _value)"
                    accept="image/jpeg,image/png"
                    :modelValue="urlValue[item.value]"
                    @change="(_url) => onImgChange(_url, item.value)"
                />
            </div>
            <div v-else>
                <a-avatar :src="urlValue[item.value] || defaultImg[item.value]" shape="square" :size="64" />
            </div>
            <j-ellipsis style="margin-top: 8px">{{ item.label }}</j-ellipsis>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';
import MUpload from './MUpload.vue';
import {systemImg} from "@/assets";

const props = defineProps({
    disabled: {
        type: Boolean,
        default: false,
    },
    value: {
        type: String,
        default: 'internal-standalone',
    },
    photoUrl: {
        type: String,
        default: systemImg.internalStandaloneImg,
    },
    options: {
        type: Array as PropType<any[]>,
        default: () => [],
    },
    type: {
        type: String,
        default: 'edit'
    }
});

const emit = defineEmits(['update:value', 'update:photoUrl']);

const defaultImg = {
    'internal-standalone': systemImg.internalStandaloneImg,
    'internal-integrated': systemImg.internalIntegratedImg,
    'wechat-webapp': systemImg.wechatWebapp,
    'dingtalk-ent-app': systemImg.dingTalkEntAppImg,
    'third-party': systemImg.thirdParty,
    'wechat-miniapp': systemImg.wechatMiniapp,
};

const urlValue = ref<any>({ ...defaultImg });
const _value = ref<string>('');

watchEffect(() => {
    _value.value = props.value;
});

watch(
    () => props.photoUrl,
    (newValue) => {
        urlValue.value[props.value] = newValue;
    },
    {
        deep: true,
        immediate: true,
    },
);

const onChange = (e: any) => {
    emit('update:value', e);
};

const onImgChange = (url: string, _key: string) => {
    if (_key === _value.value) {
        emit('update:photoUrl', url);
    } else {
        urlValue.value[_key] = url;
    }
};
</script>

<style lang="less" scoped>
.radio-container {
    display: flex;
    flex-wrap: wrap;
    .radio-container-item {
        display: flex;
        padding: 8px 0;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        width: 120px;
        border-radius: 6px;
        margin-right: 8px;
        margin-top: 8px;
        cursor: pointer;

        span {
            color: #333333;
            opacity: 0.85;
            margin-top: 8px;
        }

        &.active {
            background: #f2f4f7;
            border: 1px solid #adb8c7;
        }
    }

    .radio-container-item:hover {
        background-color: #f2f4f7;
    }
}
</style>