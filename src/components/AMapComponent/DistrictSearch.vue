<template></template>

<script setup>
import { useMap } from "./useMap";
import { pick } from "lodash-es";

defineOptions({
  name: "DistrictSearch",
});

const instance = useMap();

const props = defineProps({
  subdistrict: {
    type: Number,
    default: 0,
  },
  extensions: {
    type: String,
    default: "all",
  },
  level: {
    type: String,
    default: "district",
  },
  view: {
    type: Boolean,
    default: true,
  },
  styles: {
    type: Object,
    default: () => ({}),
  },
  adcode: {
    type: String,
    default: undefined,
  },
});

let district;
let polygon;

const remove = () => {
  if (polygon && instance.$amapComponent) {
    if (instance.$amapComponent.getLayers().length) {
      instance.$amapComponent.remove(polygon);
    }
    polygon = null;
  }
};

const drawBounds = (paths) => {
  if (polygon && instance.$amapComponent?.remove) {
    instance.$amapComponent.remove(polygon);
    polygon = null;
  }
  for (let i = 0; i < paths.length; i += 1) {
    //构造MultiPolygon的path
    paths[i] = [paths[i]];
  }

  const _styles = Object.assign(
    {
      strokeWeight: 1,
      path: paths,
      fillOpacity: 0.25,
      fillColor: "#80d8ff",
      strokeColor: "#0091ea",
    },
    props.styles,
  );

  polygon = new AMap.Polygon(_styles);

  instance.$amapComponent.add(polygon);

  if (props.view) {
    instance.$amapComponent.setFitView(polygon);
  }
};

const queryDistrict = (code) => {
  const opts = {
    subdistrict: 0, //获取边界不需要返回下级行政区
    extensions: "all", //返回行政区边界坐标组等具体信息
    level: "district", //查询行政级别为 市
  };

  const options = Object.assign(
    opts,
    pick(props, ["subdistrict", "extensions", "level"]),
  );

  if (!district) {
    district = new AMap.DistrictSearch(options);
  }

  if (!code) return;
  district.search(code, (status, result) => {
    if (!result || !result.districtList || !result.districtList[0]) {
      console.warn("请正确填写名称或更新其他名称");
      return;
    }
    const bounds = result.districtList[0].boundaries;
    drawBounds(bounds);
  });
};

onBeforeUnmount(() => {
  remove();
});

watch(
  () => props.adcode,
  () => {
    queryDistrict(props.adcode);
  },
  { immediate: true },
);
</script>

<style scoped></style>
