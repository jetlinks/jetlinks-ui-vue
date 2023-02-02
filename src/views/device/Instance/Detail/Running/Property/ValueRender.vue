<template>
    <div class="value">
        {{value}}
    </div>
</template>

<script lang="ts" setup>
import { getImage } from "@/utils/comm";

const _data = defineProps({
    data: {
        type: Object,
        default: () => {},
    },
    value: {
        type: [Object, String, Number],
        default: '--'
    },
    type: {
        type: String,
        default: 'card'
    }
});

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