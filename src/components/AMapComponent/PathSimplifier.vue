<template>
</template>

<script lang="ts">
import { registerMixin } from '@vuemap/vue-amap';
import { defineComponent, PropType } from 'vue';
import type { PathSimplifier, PathDataItemType, PathNavigator } from './types';

export default defineComponent({
    name: 'PathSimplifier',
    mixins: [registerMixin],
    props: {
        pathData: Array as PropType<PathDataItemType[]>,
    },
    data(): {
        pathSimplifierRef: PathSimplifier | null,
        PathNavigatorRef: PathNavigator | null,
        distance: number
    }{
        return {
            pathSimplifierRef: null,
            PathNavigatorRef: null,
            distance: 0,
        };
    },
    methods: {
        pathSimplifier(PathObj: PathSimplifier) {
            this.pathSimplifierRef = new PathObj({
                zIndex: 100,
                getPath: (_pathData: any) => {
                    return _pathData.path;
                },
                getHoverTitle: (_pathData: any) => {
                    return _pathData.name;
                },
                map: this.parentInstance?.$amapComponent
            });

            this.PathNavigatorRef?.destroy();

            if (this.pathData) {
                this.pathSimplifierRef?.setData(
                    this.pathData.map((item) => ({
                        name: item.name || '路线',
                        path: item.path,
                    })),
                );

                const pathData = this.pathSimplifierRef?.getPathData(0);

                if (pathData?.path && pathData?.path.length) {
                    this.PathNavigatorRef =
                        this.pathSimplifierRef?.createPathNavigator(0, {
                            speed: this.distance
                                ? (this.distance / 5) * 3.6
                                : 10,
                        }) as any;
                }
            }
        },
        loadUI() {
            if ((window as any).AMapUI) {
                (window as any).AMapUI.load(
                    ['ui/misc/PathSimplifier', 'lib/$'],
                    (path: PathSimplifier) => {
                        if (!path.supportCanvas) {
                            console.warn('当前环境不支持 Canvas！');
                            return;
                        }
                        this.pathSimplifier(path);
                    },
                );
            }
        },
        start() {
            this.PathNavigatorRef?.start();
        },
        stop() {
            this.PathNavigatorRef?.moveToPoint(0, 0);
            this.PathNavigatorRef?.stop();
        },
        pause() {
            this.PathNavigatorRef?.pause()
        },
        resume() {
            this.PathNavigatorRef?.resume()
        }
    },
    watch: {
        pathData: {
            handler(newVal) {
                if (
                    this.parentInstance.$amapComponent &&
                    newVal?.[0]?.path &&
                    newVal?.[0]?.path.length >= 2
                ) {
                    this.loadUI()
                    // 计算速度
                    const pointArr = newVal?.[0]?.path.map(
                        (point: number[]) => new (AMap as any).LngLat(point[0], point[1]),
                    );
                    const distanceOfLine = (AMap as any).GeometryUtil.distanceOfLine(pointArr);
                    this.distance = Math.round(distanceOfLine);
                }
            },
            immediate: true,
            deep: true,
        },
    },
    expose: ['start', 'stop', 'pause', 'resume']
});
</script>