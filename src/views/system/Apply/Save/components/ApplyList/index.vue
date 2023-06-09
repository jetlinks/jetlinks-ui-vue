<template>
    <j-radio-group
        :value="_value"
        class="radio-container"
        :disabled="disabled"
        @change="onChange"
    >
        <j-radio-button
            v-for="item in list"
            :value="item.value"
            :key="item.value"
        >
            <div class="radio-container-item" @click.stop>
                <div>
                    <MUpload
                        :defaultValue="item.imgUrl"
                        :borderStyle="{
                            width: '90px',
                            height: '90px',
                            border: 'none',
                        }"
                        :disabled="!disabled ? false : (item.value === _value ? false : true)"
                        accept="image/jpeg,image/png"
                        :modelValue="urlValue[item.value]"
                        @change="(_url) => onImgChange(_url, item.value)"
                    />
                </div>
                <span>{{ item.text }}</span>
            </div>
        </j-radio-button>
    </j-radio-group>
</template>

<script lang="ts" setup>
import { getImage } from '@/utils/comm';
import MUpload from './MUpload.vue';

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
        default: getImage('/apply/provider1.png'),
    },
});

const emit = defineEmits(['update:value', 'update:photoUrl']);
const list = [
    {
        value: 'internal-standalone',
        text: '内部独立应用',
        imgUrl: getImage('/apply/provider1.png'),
    },
    {
        value: 'internal-integrated',
        text: '内部集成应用',
        imgUrl: getImage('/apply/provider2.png'),
    },
    {
        value: 'wechat-webapp',
        text: '微信网站应用',
        imgUrl: getImage('/apply/provider4.png'),
    },
    {
        value: 'dingtalk-ent-app',
        text: '钉钉企业内部应用',
        imgUrl: getImage('/apply/provider3.png'),
    },
    {
        value: 'third-party',
        text: '第三方应用',
        imgUrl: getImage('/apply/provider5.png'),
    },
    {
        value: 'wechat-miniapp',
        text: '小程序应用',
        imgUrl: getImage('/apply/provider1.png'),
    },
];

const urlValue = ref({
    'internal-standalone': getImage('/apply/provider1.png'),
    'internal-integrated': getImage('/apply/provider2.png'),
    'wechat-webapp': getImage('/apply/provider4.png'),
    'dingtalk-ent-app': getImage('/apply/provider3.png'),
    'third-party': getImage('/apply/provider5.png'),
    'wechat-miniapp': getImage('/apply/provider1.png'),
});
const _value = ref<string>('');

watchEffect(() => {
    _value.value = props.value;
});

watch(
    () => props.photoUrl,
    (newValue) => {
        urlValue.value[props.value] = newValue
    },
    {
        deep: true,
        immediate: true,
    },
);

const onChange = (e: any) => {
    emit('update:value', e.target.value);
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
    .radio-container-item {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .ant-radio-button-wrapper {
        height: auto;
        width: 120px;
        padding: 12px 6px;
        box-sizing: content-box;
        margin: 20px 20px 0 0;
        color: #000;
    }
}
</style>