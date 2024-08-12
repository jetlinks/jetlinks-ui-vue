<template>
    <div class="value">
        <div
            v-if="value?.formatValue !== 0 && !value?.formatValue"
            :class="valueClass"
        >
            --
        </div>
        <div v-else-if="_data.data?.valueType?.type === 'file'">
            <template v-if="data?.valueType?.bodyType === 'base64'">
                <div :class="valueClass" v-if="!!getType(value?.formatValue)">
                    <img :src="imgMap.get(_type)" @error="onError" />
                </div>
                <div v-else :class="valueClass">
                    <img :src="imgMap.get('other')" />
                </div>
            </template>
            <div
                v-else-if="data?.valueType?.bodyType ===  $t('Property.ValueRender.286662-0')"
                :class="valueClass"
            >
                <img :src="imgMap.get('other')" />
            </div>
            <template v-else>
                <template
                    v-if="
                        imgList.some((item) =>
                            value?.formatValue.includes(item),
                        )
                    "
                >
                    <div :class="valueClass" @click="getDetail('img')">
                        <img :src="value?.formatValue" @error="imgError" />
                    </div>
                </template>
                <template
                    v-else-if="
                        videoList.some((item) =>
                            value?.formatValue.includes(item),
                        )
                    "
                >
                    <div :class="valueClass" @click="getDetail('video')">
                        <img :src="imgMap.get('video')" />
                    </div>
                </template>
                <template
                    v-else-if="
                        fileList.some((item) =>
                            value?.formatValue.includes(item),
                        )
                    "
                >
                    <div :class="valueClass">
                        <img
                            :src="
                                imgMap.get(
                                    fileList
                                        .find((item) =>
                                            value?.formatValue.includes(item),
                                        )
                                        .slice(1),
                                )
                            "
                        />
                    </div>
                </template>
                <template v-else>
                    <div :class="valueClass">
                        <img :src="imgMap.get('other')" />
                    </div>
                </template>
            </template>
        </div>
        <div
            v-else-if="_data.data?.valueType?.type === 'object'"
            @click="getDetail('obj')"
            :class="valueClass"
        >
            <img :src="imgMap.get('obj')" />
        </div>
        <div
            v-else-if="
                _data.data?.valueType?.type === 'geoPoint' ||
                _data.data?.valueType?.type === 'array'
            "
            :class="valueClass"
        >
            <div style='width: 100%; white-space: normal;'>
                <j-ellipsis>{{ JSON.stringify(value?.formatValue) }}</j-ellipsis>
            </div>
        </div>
        <div v-else :class="valueClass">
          <div style='width: 100%;white-space: normal;'>
            <j-ellipsis>
              {{ String(value?.formatValue) }}
            </j-ellipsis>
          </div>
        </div>
        <ValueDetail
            v-if="visible"
            :type="_types"
            :value="value"
            @close="visible = false"
        />
    </div>
</template>

<script lang="ts" setup>
import { getImage, onlyMessage } from '@/utils/comm';
import ValueDetail from './ValueDetail.vue';
import { getType, imgMap, imgList, videoList, fileList } from './index';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();

const _data = defineProps({
    data: {
        type: Object,
        default: () => {},
    },
    value: {
        type: Object,
        default: () => {},
    },
    type: {
        type: String,
        default: 'card',
    },
});

const valueClass = computed(() => {
    return _data.type === 'card' ? 'cardValue' : 'otherValue';
});

const isHttps = document.location.protocol === 'https:';

const _types = ref<string>('');
const visible = ref<boolean>(false);
const temp = ref<boolean>(false);

const onError = (e: any) => {
    e.target.src = imgMap.get('other');
};

const imgError = (e: any) => {
    e.target.src = imgMap.get('error');
    temp.value = true;
};

const getDetail = (_type: string) => {
    const value = _data.value;
    let flag: string = '';
    if (_type === 'img') {
        if (isHttps && value?.formatValue.indexOf('http:') !== -1) {
            onlyMessage($t('Property.ValueRender.286662-1'), 'error');
        } else if (temp.value) {
            onlyMessage($t('Property.ValueRender.286662-2'), 'error');
        } else {
            flag =
                ['.jpg', '.png'].find((item) =>
                    value?.formatValue.includes(item),
                ) || '--';
            _types.value = flag;
            visible.value = true;
        }
    } else if (_type === 'video') {
        if (isHttps && value?.formatValue.indexOf('http:') !== -1) {
            onlyMessage($t('Property.ValueRender.286662-1'), 'error');
        } else if (
            ['.rmvb', '.mvb'].some((item) => value?.formatValue.includes(item))
        ) {
            onlyMessage($t('Property.ValueRender.286662-3'), 'error');
        } else {
            flag =
                ['.m3u8', '.flv', '.mp4'].find((item) =>
                    value?.formatValue.includes(item),
                ) || '--';
            _types.value = flag;
            visible.value = true;
        }
    } else if (_type === 'obj') {
        flag = 'obj';
        _types.value = flag;
        visible.value = true;
    }
};
</script>

<style lang="less" scoped>
.value {
    display: flex;
    align-items: center;
    width: 100%;

    .cardValue {
        display: flex;
        align-items: center;
        width: 100%;
        height: 60px;
        overflow: hidden;
        color: #323130;
        font-weight: 700;
        font-size: 24px;
        white-space: nowrap;
        text-overflow: ellipsis;

        img {
            width: 60px;
        }
    }

    .otherValue {
        img {
            width: 40px;
        }
    }
}
</style>