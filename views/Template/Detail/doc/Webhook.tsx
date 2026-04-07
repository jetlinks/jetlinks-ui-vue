import './index.less';
import i18n from '@jetlinks-web-core/locales/index'
const $t = i18n.global.t
const Webhook = () => {
  return (
    <div class="doc">
      <h1>{$t('doc.Webhook.640103-0')}</h1>
      <div>
        {$t('doc.Webhook.640103-1')}
      </div>
      <h1>{$t('doc.Webhook.640103-2')}</h1>
      <div>
        {$t('doc.Webhook.640103-3')}
        {$t('doc.Webhook.640103-4')}
      </div>
    </div>
  );
};
export default Webhook;
