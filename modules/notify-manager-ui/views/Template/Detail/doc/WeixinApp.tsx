import './index.less';
import { Image } from 'ant-design-vue';
import { templateImages } from '../../../../assets/notice/index';
import i18n from '@jetlinks-web-core/locales/index'
const $t = i18n.global.t
const WeixinApp = () => {
  const appId = templateImages.miniProgramAppid;

  return (
    <div class="doc">
      <div class="url">
        {$t('doc.WeixinApp.640102-0')}
        <a href="https://work.weixin.qq.com" target="_blank" rel="noopener noreferrer">
          https://work.weixin.qq.com
        </a>
      </div>
      <h1>{$t('doc.WeixinApp.640102-1')}</h1>
      <div>
        {$t('doc.WeixinApp.640102-2')}
      </div>
      <h1>{$t('doc.WeixinApp.640102-3')}</h1>
      <div>
        <h2>{$t('doc.WeixinApp.640102-4')}</h2>
        <div>{$t('doc.WeixinApp.640102-5')}</div>
      </div>
      <div>
        <h2>{$t('doc.WeixinApp.640102-6')}</h2>
        <div>{$t('doc.WeixinApp.640102-7')}</div>
      </div>
      <div>
        <h2>{$t('doc.WeixinApp.640102-8')}</h2>
        <div>{$t('doc.WeixinApp.640102-9')}</div>
      </div>
      <div>
        <h2>{$t('doc.WeixinApp.640102-10')}</h2>
        <div>{$t('doc.WeixinApp.640102-11')}</div>
      </div>
      <div>
        <h2>{$t('doc.WeixinApp.640102-12')}</h2>
        <div>{$t('doc.WeixinApp.640102-13')}</div>
      </div>
      <div>
        <h2>{$t('doc.WeixinApp.640102-14')}</h2>
        <div>{$t('doc.WeixinApp.640102-15')}</div>
        <div class="image">
          <Image width="100%" src={appId} />
        </div>
      </div>
      <div>
        <h2>{$t('doc.WeixinApp.640102-16')}</h2>
        <div>
          {$t('doc.WeixinApp.640102-17')}{name}
          {$t('doc.WeixinApp.640102-18')}
        </div>
      </div>
    </div>
  );
};
export default WeixinApp;
