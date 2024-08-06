// import './index.less';
import { Image } from 'ant-design-vue';
import { getImage } from '@/utils/comm';
import i18n from '@/i18n'
const $t = i18n.global.t
const WeixinCorp = () => {
  const agentId = getImage('/notice/doc/template/weixin-corp/01-Agentid.jpg');
  const userId = getImage('/notice/doc/template/weixin-corp/02-userID.jpg');
  const toDept = getImage('/notice/doc/template/weixin-corp/03-toDept.jpg');
  const toTags = getImage('/notice/doc/template/weixin-corp/04-toTags.jpg');

  return (
    <div class="doc">
      <div class="url">
        {$t('doc.WeixinCorp.2146919-0')}
        <a href="https://work.weixin.qq.com" target="_blank" rel="noopener noreferrer">
          https://work.weixin.qq.com
        </a>
      </div>
      <h1>{$t('doc.WeixinCorp.2146919-1')}</h1>
      <div>
        {$t('doc.WeixinCorp.2146919-2')}
      </div>
      <h1>{$t('doc.WeixinCorp.2146919-3')}</h1>
      <div>
        <h2> {$t('doc.WeixinCorp.2146919-4')}</h2>
        <div> {$t('doc.WeixinCorp.2146919-5')}</div>
        <h2> 2、Agentid</h2>
        <div> {$t('doc.WeixinCorp.2146919-6')}</div>
        <div> {$t('doc.WeixinCorp.2146919-7')}</div>
        <div class="image">
          <Image width="100%" src={agentId} />
        </div>
        <h2> {$t('doc.WeixinCorp.2146919-8')}</h2>
        <div>
          {$t('doc.WeixinCorp.2146919-9')}
        </div>
        <div> {$t('doc.WeixinCorp.2146919-10')}</div>
        <div> {$t('doc.WeixinCorp.2146919-11')}</div>
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
