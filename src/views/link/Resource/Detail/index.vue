<template>
    <page-container :showBack="true">
        <template #title>
            <div>资源详情</div>
        </template>
        <FullPage>
            <!-- {{ detail.metadata }} -->
            <div class="resource-detail">
                <div class="detail-header">
                    <div class="header-title">
                        <div class="header-title-img">
                            <img :src="detail.photoUrl?.url || imageMap.get(detail.type?.value)" />
                        </div>
                        <div class="header-title-center">
                            <j-ellipsis>
                                {{ detail.name }}
                            </j-ellipsis>
                        </div>
                        <div class="header-type">
                            {{ detail.type?.text || '--' }}
                        </div>
                        <div class="header-title-collect">
                            <a-space>
                                <a-button @click="visible = true"
                                    >检查更新</a-button
                                >
                                <a-button @click="onApply">应用资源</a-button>
                            </a-space>
                        </div>
                    </div>
                    <div class="header-tags">
                        <div class="tags-item" v-for="item in detail.tags">
                            {{ item }}
                        </div>
                    </div>
                </div>
                <div class="detail-preview mb-40"  v-if="viewsList.length">
                    <a-carousel arrows dots-class="slick-dots slick-thumb">
                        <template #prevArrow>
                        <div class="custom-slick-arrow">
                            <AIcon type='LeftOutlined' />
                        </div>
                        </template>
                        <template #nextArrow>
                        <div class="custom-slick-arrow">
                            <AIcon type='RightOutlined' />
                        </div>
                        </template>
                        <template #customPaging="record">
                            <a>
                                <img
                                    v-if="viewsList[record.i].type === 'img' || viewsList[record.i]?.coverUrl?.url"
                                    :src="viewsList[record.i].type === 'img' ? viewsList[record.i].url : viewsList[record.i].coverUrl.url"
                                />
                            </a>
                        </template>
                        <div class='detail-preview-item' v-for="item in viewsList" :key="item.url">
                            <img v-if="item.type === 'img'" :src="item.url" />
                            <div v-else class="video">
                                <LivePlayer  
                                    class='preview-video'
                                    ref='videoRef'
                                    :url='item.url'
                                    :onLoadeddata='onLoadeddata'
                                    :onCanplay='onCanplay'
                                    :poster='item.coverUrl.url'></LivePlayer>
                            </div>
                        </div>
                    </a-carousel>
                </div>
                <div class="detail-desc mb-16" v-if="detail.describe">
                    <p class="module-title">描述</p>
                    <div>
                        {{ detail.describe }}
                    </div>
                </div>
                <div
                    class="detail-access mb-16"
                    v-if="detail?.type?.value === 'device' && detail.source?.length"
                >
                    <p class="module-title">接入途径</p>
                        <div class="access-item" v-for="item in detail.source">
                            {{ item }}
                        </div>
                </div>
                <div class="detail-doc mb-16" v-if="detail.docUrl?.length">
                    <p class="module-title">技术文档</p>
                    <div class="doc-items">
                        <div class="doc-item" v-for="item in detail.docUrl">
                            <a-space>
                                <AIcon type="FileTextOutlined" />
                                <a-button
                                    type="link"
                                    @click="() => onDownFile(item)"
                                    >{{ item.name }}</a-button
                                >
                            </a-space>
                        </div>
                    </div>
                </div>
                <div class="detail-version mb-16" v-if="detail.version">
                    <p class="module-title">适用型号</p>
                    <div>
                        {{ detail.version }}
                    </div>
                </div>
                <div class="detail-info mb-16">
                    <p class="module-title">详情</p>
                    <div class="detail-info-center">
                        <a-descriptions layout="vertical" :column="3">
                            <a-descriptions-item label="版本">
                                {{
                                    detail.version
                                        ? detail.version
                                        : emptyValue
                                }}
                            </a-descriptions-item>
                            <a-descriptions-item label="更新时间">
                                {{
                                    detail.modifyTime
                                        ? dayjs(detail.modifyTime).format(
                                              'YYYY-MM-DD HH:mm:ss',
                                          )
                                        : emptyValue
                                }}
                            </a-descriptions-item>
                            <a-descriptions-item
                                label="物模型"
                                v-if="detail.type.value !== 'collector'"
                            >
                                <a-space>
                                    <span> 已就绪 </span>
                                    <AIcon
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
        <Update v-if="visible" :data="detail" @close="onClose" />
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
    </page-container>
</template>

<script setup name="Detail">
import Update from './Update/index.vue';
import Apply from './Apply/index.vue';
import ApplyCollector from './ApplyCollector/index.vue';
import { detailResource } from '@/api/link/resource';
import Metadata from './Metadata.vue';
import dayjs from 'dayjs';
import { resource } from '@/assets'
import LivePlayer from '@/components/Player/index.vue';


const imageMap = new Map([
    ['device',resource.deviceDefaultImage],
    ['collector',resource.collectorDefaultImage],
    ['protocol',resource.protocolDefaultImage]
])
const route = useRoute();
const visible = ref(false);
const visibleApply = ref(false);
const visibleCollector = ref(false);
const detail = ref({
    type: {},
    access: [],
    docUrl: [],
});
const _id = route.params?.id;
const metadataVisible = ref(false);
const emptyValue = '--';

const viewsList = computed(() => {
    const arr = [];

    if (detail.value.videoUrl) {
        let obj = {
            ...detail.value.videoUrl,
            type: 'video',
        };

        if (detail.value.coverUrl) {
            obj.coverUrl = detail.value.coverUrl;
        }

        arr.push(obj);
    }

    if (detail.value.loopPicUrl) {
        arr.push(
            ...detail.value.loopPicUrl.map((src) => ({ ...src, type: 'img' })),
        );
    }
    return arr;
});

const getDetail = async (id) => {
    const res = await detailResource(id);
    if (res.success) {
        detail.value = res.result;
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


const onLoadeddata = () => {
  if (!viewsList.value[0].coverUrl) {
    const video = document.querySelector('video')
    video.currentTime = 1
  }
}


const onCanplay = () => {
    console.log(viewsList.value[0].coverUrl,'test')
  if (!viewsList.value[0].coverUrl) {
    setTimeout(() => {
      const video = document.querySelector('.slick-active video')

      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      const ctx = canvas.getContext('2d')
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

      try {
        viewsList.value[0].coverUrl = canvas.toDataURL('image/png')
      } catch (e) {
        console.error(e)
      }
    }, 300)
  }
}


watch(
    () => _id,
    () => {
        if (_id) {
            getDetail(_id);
        }
    },
    {
        immediate: true,
        deep: true,
    },
);
</script>

<style lang="less" scoped>
.resource-detail {
    padding: 12px;
    .detail-header {
        margin-bottom: 18px;

        .header-title {
            display: flex;
            gap: 12px;
            align-items: center;
            margin-bottom: 12px;

            .header-title-img {
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

            .tags-item {
                padding: 2px 8px;
                border-radius: 4px;
                color: #fff;
                background-color: @primary-color;
                max-width: 120px;
            }
        }
    }
    .detail-preview{
        width: 904px;
        margin: 0 auto;
        .detail-preview-item{
            height: 510px;
            border-radius: 6px;
            .video{
                height: 100%;
            }

            img, & video {
                height: 100%;
                max-width: 100%;
            }
        }
    }
    .access-item {
        position: relative;
        padding-left: 20px;
        font-size: 16px;
        color: @font-gray-600;

        &::after {
            position: absolute;
            content: ' ';
            width: 14px;
            height: 14px;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            border-radius: 50%;
            background-color: @success-color;
        }

        &:not(:last-child) {
            margin-bottom: 12px;
        }
    }

    .doc-items {
        display: flex;
        .doc-item {
            font-size: 18px;
        }
    }

    .module-title {
        font-size: 18px;
        font-weight: bold;
    }

    .mb-16 {
        margin-bottom: 16px;
    }
    .mb-40{
        margin-bottom: 40px;
    }

    .recommend {
        padding-top: 24px;
        border-top: 1px solid @font-gray-400;
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
            transition: height 0.5s;

            .metadata-center {
                transition: transform 0.5s 0.15s;
                transform: translateY(0);
            }
        }

        &.hidden {
            transition: height 0.5s 0.15s;
            .metadata-center {
                transition: transform 0.5s;
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
:deep(.ant-carousel) {
    .slick-dots {
        position: relative;
        height: auto;
    }

    .slick-slide {
        img,
        & video {
            border: 5px solid #fff;
            display: block;
            margin: auto;
        }
    }

    .slick-arrow {
        display: none !important;
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
