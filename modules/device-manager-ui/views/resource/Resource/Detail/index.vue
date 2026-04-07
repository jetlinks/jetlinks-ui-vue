<template>
  <j-page-container :showBack="true">
    <template #title>
      <div>{{ $t('Detail.index.473126-0') }}</div>
    </template>
    <FullPage>
      <div class="resource-detail">
        <div class="detail-header">
          <div class="header-title">
            <div class="header-title-img">
              <img :src="detail.photoUrl?.url || imageMap.get(detail.type?.value)"/>
            </div>
            <div class="header-title-center">
              <!--            <j-ellipsis>-->
              <!--              {{ detail.name }}-->
              <!--            </j-ellipsis>-->
              <div class='header-title-text fz-32 fw-b'>
                <DetailHeaderTitle :data='detail'/>
              </div>
              <div class='header-tags'>
                <div class='tags-item' v-for='item in typeList' :style='{
                  color: colorObj?.[item.classificationId],
                  backgroundColor: backgroundObj?.[item.classificationId],
                  fontSize: "14px"
                }'>
                  <j-ellipsis>
                    {{ dataMap.get(item.id)?.fullname || item.name }}
                  </j-ellipsis>
                </div>
              </div>
            </div>
            <div class="header-title-collect">
              <a-space>
                <a-button @click="visible = true"
                >{{ $t('Detail.index.473126-1') }}
                </a-button
                >
                <a-button @click="onApply">{{ $t('Detail.index.473126-2') }}</a-button>
              </a-space>
              <div v-if="detail?.type.value !== 'collector'" class="createdProductNumber">{{ $t('Detail.index.473126-3') }}
                <a-button @click="onJump" type="link">{{ count }}</a-button>
              </div>
            </div>
          </div>
          <div class="header-tags">
            <div class="tags-item" v-for="item in detail.tags">
              {{ item }}
            </div>
          </div>
        </div>
        <div class='detail-preview mb-40' v-if='viewsList.length'>
          <a-carousel
              ref='carouselRef'
              arrows
              :autoplaySpeed='1000'
              :dots='viewsList.length > 1'
              dots-class='slick-dots slick-thumb'
          >
            <template #prevArrow>
              <div class='custom-slick-arrow'>
                <AIcon type='LeftOutlined' />
              </div>
            </template>
            <template #nextArrow>
              <div class='custom-slick-arrow'>
                <AIcon type='RightOutlined' />
              </div>
            </template>
            <template #customPaging='record'>
              <div>
                <img
                    :src="viewsList[record.i].type === 'img' ? viewsList[record.i].url : viewsList[record.i].coverUrl"
                    crossorigin='anonymous'
                />
              </div>
            </template>
            <div class='detail-preview-item' v-for='item in viewsList' :key='item.url'>
              <a-image v-if="item.type === 'img'" :src='item.url' />
              <video v-else class='preview-video' controls :poster='item.coverUrl'>
                <source :src='item.url' type='video/mp4'>
                Your browser does not support the video tag.
              </video>
              <!--              <Player-->
              <!--                v-else-->
              <!--                class='preview-video'-->
              <!--                ref='videoRef'-->
              <!--                :url='item.url'-->
              <!--                :onLoadeddata='onLoadeddata'-->
              <!--                :onCanplay='onCanplay'-->
              <!--                :poster='item.coverUrl'-->
              <!--              />-->
            </div>
          </a-carousel>
        </div>
        <div class="detail-desc mb-16" v-if="detail.describe">
          <p class="module-title">{{ $t('Detail.index.473126-4') }}</p>
          <div>
            {{ detail.describe }}
          </div>
        </div>
        <div
            class="detail-access mb-16"
            v-if="detail?.type?.value === 'device' && detail.source?.length"
        >
          <p class="module-title">{{ $t('Detail.index.473126-5') }}</p>
          <div class="access-item" v-for="item in detail.source">
            {{ item }}
          </div>
        </div>
        <div class="detail-doc mb-16" v-if="detail.docUrl?.length">
          <p class="module-title">{{ $t('Detail.index.473126-6') }}</p>
          <div class="doc-items">
            <div class="doc-item" v-for="item in detail.docUrl">
              <a-space>
                <AIcon type="FileTextOutlined"/>
                <a-button
                    type="link"
                    @click="() => onDownFile(item)"
                >{{ item.name }}
                </a-button
                >
              </a-space>
            </div>
          </div>
        </div>
        <div class="detail-version mb-16" v-if="detail.version">
          <p class='module-title'>{{ $t('Detail.index.473126-7') }}
            <a-tooltip :title="$t('Detail.index.473126-7-1')">
              <AIcon type='QuestionCircleOutlined' />
            </a-tooltip>
          </p>
          <div v-if='detail.model?.length'>
            <div class='model-list' v-for='item in detail.model'>
              <ModelItem :value='item' />
            </div>
          </div>
          <div v-else>--</div>
        </div>
        <div class="detail-info mb-16">
          <p class="module-title">{{ $t('Detail.index.473126-8') }}</p>
          <div class="detail-info-center">
            <a-descriptions layout="vertical" :column="3">
              <a-descriptions-item :label="$t('Detail.index.473126-9')">
                {{
                  detail.version
                      ? detail.version
                      : emptyValue
                }}
              </a-descriptions-item>
              <a-descriptions-item :label="$t('Detail.index.473126-10')">
                {{
                  detail.modifyTime
                      ? dayjs(detail.modifyTime).format(
                          'YYYY-MM-DD HH:mm:ss',
                      )
                      : emptyValue
                }}
              </a-descriptions-item>
              <a-descriptions-item
                  :label="$t('Detail.index.473126-11')"
                  v-if="detail.type.value !== 'collector'"
              >
                <a-space>
                <span> {{
                    hasMetadata ?
                        $t('Detail.index.473126-12') : $t('Detail.index.473126-13')
                  }} </span>
                  <AIcon
                      v-if="hasMetadata"
                      :type="
                                            metadataVisible
                                                ? 'EyeOutlined'
                                                : 'EyeInvisibleOutlined'
                                        "
                      @click="showMetadata"
                  />
                </a-space>
              </a-descriptions-item>
            </a-descriptions>
          </div>
          <div
              :class="{
                            'metadata-warp': true,
                            show: metadataVisible,
                            hidden: !metadataVisible,
                        }"
          >
            <div class="metadata-center">
              <Metadata
                  v-if="metadataVisible"
                  :metadata="JSON.parse(detail.metadata || '{}')"
              />
            </div>
          </div>
        </div>
      </div>
    </FullPage>
    <Update v-if="visible" :data="detail" @refresh="refresh" @close="onClose"/>
    <Apply
        v-if="visibleApply"
        :data="detail"
        @close="onClose"
    />
    <ApplyCollector
        v-if="visibleCollector"
        :data="detail"
        @close="onClose"
    />
  </j-page-container>
</template>

<script setup name="Detail">
import Update from './Update/index.vue';
import Apply from './Apply/index.vue';
import ApplyCollector from './ApplyCollector/index.vue';
import {detailResource, _queryProductNoPaging} from '@device-manager-ui/api/resource/resource';
import Metadata from './Metadata.vue';
import dayjs from 'dayjs';
import {resource} from '@device-manager-ui/assets/resource'
import DetailHeaderTitle from './components/title.vue'
import {omit, cloneDeep} from "lodash-es";
import ModelItem from "./ModelItem.vue";
import { useMenuStore } from '@jetlinks-web-core/store/menu';

const imageMap = new Map([
  ['device', resource.deviceDefaultImage],
  ['collector', resource.collectorDefaultImage],
  ['protocol', resource.protocolDefaultImage]
])
const dataMap = new Map();
const route = useRoute();
const visible = ref(false);
const visibleApply = ref(false);
const visibleCollector = ref(false);
const menuStore = useMenuStore();

const backgroundObj = {
  '1866398366079029248': '#FEEFD0',
  '1866398366091612161': '#EAF7F2',
  '1866398366091612160': '#E7F1FF'
}

const colorObj = {
  '1866398366079029248': '#FAAD14',
  '1866398366091612161': '#34B57C',
  '1866398366091612160': '#1677FF'
}
const detail = ref({
  type: {},
  access: [],
  docUrl: [],
});
const _id = route.params?.id;
const metadataVisible = ref(false);
const emptyValue = '--';
const count = ref(0);
const viewsList = ref([])

const handlePic = () => {
  const arr = []

  if (detail.value.videoUrl?.url) {
    let obj = {
      ...detail.value.videoUrl,
      type: 'video'
    }

    if (detail.value.coverUrl?.url) {
      obj.coverUrl = detail.value.coverUrl.url
    }

    arr.push(obj)
  } else if (detail.value.coverUrl?.url) {
    arr.push({ ...detail.value.coverUrl, type: 'img' })
  }

  if (detail.value.loopPicUrl) {
    arr.push(...detail.value.loopPicUrl.map(src => ({ ...src, type: 'img' })))
  }

  viewsList.value = arr
}

const typeList = computed(() => {
  return detail.value.classification?.reduce((pre, cur) => {
    if (cur.children) {
      pre.push(...cur.children.map(item => item))
    }
    return pre
  }, []) || []
})

const handleData = (arr) => {
  arr.map(i => {
    if (i.children?.length) {
      i.children.map(item => {
        handleTreeMap(item?.classificationTree || [], '')
      })
    }
  })
}
const handleTreeMap = (arr, parentName) => {
  const _name = parentName ? parentName + '/' : ''
  arr.filter(i => i?.id).map((item) => {
    if (!dataMap.get(item.id)) {
      dataMap.set(item.id, {
        ...omit(cloneDeep(item), ['children']),
        fullname: _name + item.name
      })
    }
    if (item.children) {
      handleTreeMap(item.children, _name + item.name)
    }
  })
}
//是否有物模型
const hasMetadata = computed(() => {
  const metadata = JSON.parse(detail.value.metadata || '{}');
  return metadata?.events?.length || metadata?.functions?.length || metadata?.properties?.length || metadata?.tags?.length;
})
// 受协议影响的产品
const getProductNumber = async () => {
  const res = await _queryProductNoPaging(_id, {});
  if (res.success) {
    count.value = res.result.length || 0;
  }
};

const getDetail = async (id) => {
  const res = await detailResource(id);
  if (res.success) {
    detail.value = res.result;
    handleData(detail.value?.classification || [])
    handlePic()
  }
};

const showMetadata = () => {
  const oldValue = metadataVisible.value;
  metadataVisible.value = !oldValue;
};
const onDownFile = (record) => {
  window.open(record.url);
};

const onApply = () => {
  if (detail.value.type.value === 'collector') {
    visibleCollector.value = true;
  } else {
    visibleApply.value = true;
  }
};

const onClose = () => {
  visibleApply.value = false;
  visibleCollector.value = false;
  visible.value = false;
  getDetail(_id);
}

const refresh = () => {
  getDetail(_id)
  visible.value = false
}

const onJump = () => {
  menuStore.jumpPage("device/Product", { params: { resourceId: _id} });
}

watch(
    () => _id,
    () => {
      if (_id) {
        getDetail(_id);
        getProductNumber()
      }
    },
    {
      immediate: true,
      deep: true,
    },
);
</script>

<style lang="less" scoped>
.resource-detail-warp {
  background-color: #fff;
  min-height: 100%;

  .resource-detail-center {
    padding: 40px 0 0;
    margin: 0 auto;
    width: 63.38%;
  }
}

.resource-detail {
  padding: 24px;
  height: 100%;
  overflow-y: auto;
  background: #fff;

  .detail-header {
    margin-bottom: 18px;

    .header-title {
      display: flex;
      gap: 12px;
      align-items: center;
      margin-bottom: 12px;

      .header-title-img {
        background-color: @font-gray-50;

        img {
          width: 80px;
          height: 80px;
        }
      }

      .header-title-center {
        font-size: 32px;
        font-weight: bold;
        flex: 1 1 0;
        min-width: 0;
      }

      .createdProductNumber {
        margin-top: 18px;
        text-align: right;
      }

      .header-type {
        margin: 0 16px;
        padding: 6px 12px;
        background-color: @primary-color;
        border-radius: 6px;
        color: #fff;
      }
    }

    .header-tags {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;

      .tags-item {
        padding: 4px 12px;
        border-radius: 4px;
        color: var(--ant-primary-color);
        background-color: #e7f1ff;
        max-width: 120px;
      }
    }
  }

  .detail-preview {
    width: 904px;

    .detail-preview-item {
      height: 510px;
      border-radius: 6px;

      img, & video {
        height: 100%;
        max-width: 100%;
      }

      :deep(.ant-image) {
        width: 100%;
        height: 100%;

        img {
          height: 100% !important;
          max-width: 100% !important;
        }
      }
    }
  }

  .access-item {
    position: relative;
    padding-left: 20px;

    &::after {
      position: absolute;
      content: ' ';
      width: 8px;
      height: 8px;
      left: 0;
      top: 8px;
      border-radius: 50%;
      background-color: @primary-color;
    }

    &:not(:last-child) {
      margin-bottom: 12px;
    }
  }

  .doc-items {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;

    .doc-item {
      font-size: 16px;
      border-radius: 6px;
      padding: 8px 24px;
      border: 1px solid @font-gray-300;
    }
  }

  .model-list {
    display: flex;
    gap: 12px;

    .item-name {
      padding-top: 8px;
    }
  }

  .module-title {
    font-size: 18px;
    font-weight: bold;
  }

  .mb-16 {
    margin-bottom: 16px;
  }

  .mb-40 {
    margin-bottom: 40px;
  }

  .detail-version {
    .model-list {
      margin-bottom: 16px;
    }
  }

  .recommend {
    padding-top: 24px;
    border-top: 1px solid @font-gray-400;
    margin-bottom: 24px;
  }

  .metadata-warp {
    overflow: hidden;
    position: relative;
    height: 0;

    .metadata-center {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    &.show {
      height: 415px;
      transition: height .5s;

      .metadata-center {
        transition: transform .5s .15s;
        transform: translateY(0);
      }
    }

    &.hidden {
      transition: height .5s .15s;

      .metadata-center {
        transition: transform .5s;
        transform: translateY(-415px);
      }
    }
  }

  :deep(.ant-descriptions-item-label) {
    &::after {
      display: none;
    }
  }
}

.model-list {
  display: flex;
  gap: 12px;

  .item-name {
    padding-top: 8px;
  }
}

.fz-18 {
  font-size: 18px;
}

:deep(.ant-carousel) {
  .slick-dots {
    position: relative;
    height: auto;
  }

  .slick-slide {
    img, & video {
      border: 1px solid #fff;
      display: block;
      margin: auto;
    }
  }

  .slick-thumb {
    bottom: 0;
    margin-top: 12px;

    li {
      width: 104px !important;
      height: 83px;

      > div {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;

        &:hover {
          background-color: @font-gray-200;
        }

        img, & video {
          max-height: 100%;
          display: block;
          width: 104px;
        }
      }

      &.slick-active {
        width: 104px;

        img, & img {
          filter: grayscale(0%);
        }
      }
    }
  }

  .slick-arrow.custom-slick-arrow {
    width: 24px;
    height: 83px;
    display: flex !important;
    align-items: center;
    justify-content: center;
    color: @font-gray-900;
    background-color: @font-gray-50;
    z-index: 1;
    font-size: 20px;
    top: 530px;

    &.slick-prev {
      left: 0;
    }

    &.slick-next {
      right: 0;
    }
  }

  .custom-slick-arrow:before {
    display: none;
  }

  .custom-slick-arrow:hover {
    display: none;
  }

  .slick-thumb {
    bottom: 0px;
    margin-top: 12px;

    li {
      width: 120px;
      height: 80px;

      img,
      & video {
        width: 100%;
        height: 100%;
        display: block;
      }

      &.slick-active {
        img,
        & img {
          filter: grayscale(0%);
        }
      }
    }
  }
}
</style>
