<template>
  <div class="cardInfo">
    <div>
      <p >设备数量</p>
      <p>{{ productNum }}</p>
    </div>
    <div>
      <p>发布状态</p>
      <p><a-badge :status="productState === 0 ? 'error' :'success'" />{{ productState === 0 ? "未发布" : "已发布" }}</p>
    </div>
    <div>
      <p>产品类型</p>
      <p style="font-size: 14px; font-weight: 600;">{{ productType }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CardInfo',
  props: {
    productNum: {
      type: [String, Number],
      default: 10
    },
    productState: {
      type: [String, Number],
      default: 0
    },
    productType: {
      type: [String, Number],
      default: 0
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";
@import "~@/utils/utils.less";

.cardInfo {

  .clearfix();

  margin-top: 16px;
  & > div {
    position: relative;
    float: left;
    width: 33%;
    text-align: left;
    text-align: center;
    p {
      margin: 0;
      font-size: 14px;
      line-height: 32px;
    }
    p:first-child {
      margin-bottom: 4px;
      color: @text-color-secondary;
      font-size: 14px;
      line-height: 20px;
    }
  }
}
</style>
