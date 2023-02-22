<template>
    <div class="value">
        <div v-if="value?.formatValue !== 0 && !value?.formatValue" :class="valueClass">--</div>
        <div v-else-if="data?.valueType?.type === 'file'">
          <template v-if="data?.valueType?.fileType === 'base64'">
            <div :class="valueClass" v-if="!!getType(value?.formatValue)">
              <img :src="imgMap.get(_type)" @error="onError" />
            </div>
            <div v-else :class="valueClass">
              <img :src="imgMap.get('other')" />
            </div>
          </template>
          <div v-else-if="data?.valueType?.fileType === 'Binary(二进制)'" :class="valueClass">
            <img :src="imgMap.get('other')" />
          </div>
          <template v-else>
            <template v-if="imgList.some((item) => value?.formatValue.includes(item))">
              <div :class="valueClass" @click="getDetail('img')">
                <img :src="value?.formatValue" @error="imgError" />
              </div>
            </template>
            <template v-else-if="videoList.some((item) => value?.formatValue.includes(item))">
              <div :class="valueClass" @click="getDetail('video')">
                <img :src="imgMap.get('video')" />
              </div>
            </template>
            <template v-else-if="fileList.some((item) => value?.formatValue.includes(item))">
              <div :class="valueClass">
                <img :src="imgMap.get(fileList.find((item) => value?.formatValue.includes(item)).slice(1))" />
              </div>
            </template>
            <template v-else>
              <div :class="valueClass">
                <img :src="imgMap.get('other')" />
              </div>
            </template>
          </template>
        </div>
        <div v-else-if="data?.valueType?.type === 'object'" @click="getDetail('obj')" :class="valueClass">
          <img :src="imgMap.get('obj')" />
        </div>
        <div v-else-if="data?.valueType?.type === 'geoPoint' || data?.valueType?.type === 'array'" :class="valueClass">
          {{JSON.stringify(value?.formatValue)}}
        </div>
        <div v-else :class="valueClass">
          {{String(value?.formatValue)}}
        </div>
        <ValueDetail v-if="visible" :type="_types" :value="value" @close="visible = false" />
    </div>
</template>

<script lang="ts" setup>
import { getImage } from "@/utils/comm";
import { message } from "ant-design-vue";
import ValueDetail from './ValueDetail.vue'

const _data = defineProps({
    data: {
        type: Object,
        default: () => {},
    },
    value: {
        type: Object,
        default: () => {}
    },
    type: {
        type: String,
        default: 'card'
    }
});

const valueClass = computed(() => {
  return _data.type === 'card' ? 'cardValue' : 'otherValue'
})

const imgMap = new Map<any, any>();
imgMap.set('txt', getImage('/running/txt.png'));
imgMap.set('doc', getImage('/running/doc.png'));
imgMap.set('xls', getImage('/running/xls.png'));
imgMap.set('ppt', getImage('/running/ppt.png'));
imgMap.set('docx', getImage('/running/docx.png'));
imgMap.set('xlsx', getImage('/running/xlsx.png'));
imgMap.set('pptx', getImage('/running/pptx.png'));
imgMap.set('pdf', getImage('/running/pdf.png'));
imgMap.set('img', getImage('/running/img.png'));
imgMap.set('error', getImage('/running/error.png'));
imgMap.set('video', getImage('/running/video.png'));
imgMap.set('other', getImage('/running/other.png'));
imgMap.set('obj', getImage('/running/obj.png'));

const imgList = ['.jpg', '.png', '.swf', '.tiff'];
const videoList = ['.m3u8', '.flv', '.mp4', '.rmvb', '.mvb'];
const fileList = ['.txt', '.doc', '.xls', '.pdf', '.ppt', '.docx', '.xlsx', '.pptx'];

const isHttps = document.location.protocol === 'https:';

const _types = ref<string>('')
const visible = ref<boolean>(false)
const temp = ref<boolean>(false)

const getType = (url: string) => {
  let t: string = '';
  [...imgList, ...videoList, ...fileList].map((item) => {
    const str = item.slice(1, item.length);
    if (url && String(url).indexOf(str) !== -1) {
      if (imgList.includes(item)) {
        t = 'img';
      } else if (videoList.includes(item)) {
        t = 'video';
      } else {
        t = str;
      }
    }
  });
  return t;
};

const onError = (e: any) => {
  e.target.src = imgMap.get('other')
}

const imgError = (e: any) => {
  e.target.src = imgMap.get('error')
  temp.value = true
}

const getDetail = (_type: string) => {
  const value = _data.value
  let flag: string = ''
  if(_type === 'img'){
    if (isHttps && value?.formatValue.indexOf('http:') !== -1) {
      message.error('域名为https时，不支持访问http地址');
    } else if (temp.value) {
      message.error('该图片无法访问');
    } else {
      flag = ['.jpg', '.png'].find((item) => value?.formatValue.includes(item)) || '--';
    }
  } else if(_type === 'video'){
    if (isHttps && value?.formatValue.indexOf('http:') !== -1) {
      message.error('域名为https时，不支持访问http地址');
    } else if (['.rmvb', '.mvb'].some((item) => value?.formatValue.includes(item))) {
      message.error('当前仅支持播放.mp4,.flv,.m3u8格式的视频');
    } else {
      flag = ['.m3u8', '.flv', '.mp4'].find((item) => value?.formatValue.includes(item)) || '--';
    }
  }else if(_type === 'obj'){
    flag = 'obj'
  }
  _types.value = flag
  visible.value = true
}

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