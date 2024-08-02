// import './index.less';
import { Image } from 'ant-design-vue';
import { getImage } from '@/utils/comm';
import i18n from '@/i18n'
const $t = i18n.global.t
const WeixinApp = () => {
  const appId = getImage('/notice/doc/template/weixin-official/02-mini-Program-Appid.png');

  return (
    <div class="doc">
      <div class="url">
        {$t('doc.WeixinApp.2146920-0')}
        <a href="https://work.weixin.qq.com" target="_blank" rel="noopener noreferrer">
          https://work.weixin.qq.com
        </a>
      </div>
      <h1>{$t('doc.WeixinApp.2146920-1')}</h1>
      <div>
        {$t('doc.WeixinApp.2146920-2')}
      </div>
      <h1>{$t('doc.WeixinApp.2146920-3')}</h1>
      <div>
        <h2>{$t('doc.WeixinApp.2146920-4')}</h2>
        <div>{$t('doc.WeixinApp.2146920-5')}</div>
      </div>
      <div>
        <h2>{$t('doc.WeixinApp.2146920-6')}</h2>
        <div>{$t('doc.WeixinApp.2146920-7')}</div>
      </div>
      <div>
        <h2>{$t('doc.WeixinApp.2146920-8')}</h2>
        <div>{$t('doc.WeixinApp.2146920-9')}</div>
      </div>
      <div>
        <h2>{$t('doc.WeixinApp.2146920-10')}</h2>
        <div>{$t('doc.WeixinApp.2146920-11')}</div>
      </div>
      <div>
        <h2>{$t('doc.WeixinApp.2146920-12')}</h2>
        <div>{$t('doc.WeixinApp.2146920-13')}</div>
      </div>
      <div>
        <h2>{$t('doc.WeixinApp.2146920-14')}</h2>
        <div>{$t('doc.WeixinApp.2146920-15')}</div>
        <div class="image">
          <Image width="100%" src={appId} />
        </div>
      </div>
      <div>
        <h2>{$t('doc.WeixinApp.2146920-16')}</h2>
        <div>
          {$t('doc.WeixinApp.2146920-17',['${name}'])}
        </div>
      </div>
    </div>
  );
};
export default WeixinApp;
