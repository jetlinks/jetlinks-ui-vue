import './index.less';
import { Image } from 'ant-design-vue';
import { templateImages } from '../../../../assets/notice/index';
import i18n from '@jetlinks-web-core/locales/index'
const $t = i18n.global.t
const WeixinCorp = () => {
  const agentId = templateImages.weixinAgentId;
  const userId = templateImages.weixinUserID;
  const toDept = templateImages.weixinToDept;
  const toTags = templateImages.weixinToTags;

  return (
    <div class="doc">
      <div class="url">
        {$t('doc.WeixinCorp.640101-0')}
        <a href="https://work.weixin.qq.com" target="_blank" rel="noopener noreferrer">
          https://work.weixin.qq.com
        </a>
      </div>
      <h1>{$t('doc.WeixinCorp.640101-1')}</h1>
      <div>
        {$t('doc.WeixinCorp.640101-2')}
      </div>
      <h1>{$t('doc.WeixinCorp.640101-3')}</h1>
      <div>
        <h2> {$t('doc.WeixinCorp.640101-4')}</h2>
        <div> {$t('doc.WeixinCorp.640101-5')}</div>
        <h2> 2、Agentid</h2>
        <div> {$t('doc.WeixinCorp.640101-6')}</div>
        <div> {$t('doc.WeixinCorp.640101-7')}</div>
        <div class="image">
          <Image width="100%" src={agentId} />
        </div>
        <h2> {$t('doc.WeixinCorp.640101-8')}</h2>
        <div>
          {$t('doc.WeixinCorp.640101-9')}
        </div>
        <div> {$t('doc.WeixinCorp.640101-10')}{'>'}{$t('doc.WeixinCorp.640101-11')}</div>
        <div> {$t('doc.WeixinCorp.640101-12')}{'>'}{$t('doc.WeixinCorp.640101-13')}</div>
        <div class="image">
          <Image width="100%" src={userId} />
          <Image width="100%" src={toDept} />
          <Image width="100%" src={toTags} />
        </div>
      </div>
    </div>
  );
};
export default WeixinCorp;
