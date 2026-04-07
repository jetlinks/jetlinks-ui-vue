import './index.less';
import i18n from '@jetlinks-web-core/locales/index'
const $t = i18n.global.t
const Webhook = () => {
    return (
        <div class={'doc'}>
            <h1>{$t('doc.Webhook.707694-0')}</h1>
            <div>
                {$t('doc.Webhook.707694-1')}
                {$t('doc.Webhook.707694-2')}
            </div>
            <h1>{$t('doc.Webhook.707694-3')}</h1>
            <h2>1、WebHook</h2>
            <div>{$t('doc.Webhook.707694-4')}</div>

            <h2>{$t('doc.Webhook.707694-5')}</h2>
            <div>
                {$t('doc.Webhook.707694-6')}
            </div>
        </div>
    );
};
export default Webhook;
