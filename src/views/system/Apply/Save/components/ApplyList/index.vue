<template>
    <j-radio-group
        :value="_value"
        class="radio-container"
        :disabled="disabled"
        @change="onChange"
    >
        <j-radio-button
            v-for="item in options"
            :value="item.value"
            :key="item.value"
        >
            <div class="radio-container-item" @click.stop>
                <div>
                    <MUpload
                        :defaultValue="defaultImg[item.value]"
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
                <span>{{ item.label }}</span>
            </div>
        </j-radio-button>
    </j-radio-group>
</template>

<script lang="ts" setup>
import { getImage } from '@/utils/comm';
import { PropType } from 'vue';
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
    options: {
        type: Array as PropType<any[]>,
        default: () => []
    }
});

const emit = defineEmits(['update:value', 'update:photoUrl']);

const defaultImg = {
    'internal-standalone': getImage('/apply/provider1.png'),
    'internal-integrated': getImage('/apply/provider2.png'),
    'wechat-webapp': getImage('/apply/provider4.png'),
    'dingtalk-ent-app': getImage('/apply/provider3.png'),
    'third-party': getImage('/apply/provider5.png'),
    'wechat-miniapp': getImage('/apply/provider1.png'),
}

const urlValue = ref<any>({...defaultImg});
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