// import './index.less';
import i18n from '@/i18n'
const $t = i18n.global.t
const Webhook = () => {
    return (
        <div class={'doc'}>
            <h1>{$t('doc.Webhook.7374413-0')}</h1>
            <div>
                {$t('doc.Webhook.7374413-1')}
                {$t('doc.Webhook.7374413-2')}
            </div>
            <h1>{$t('doc.Webhook.7374413-3')}</h1>
            <h2>1、WebHook</h2>
            <div>{$t('doc.Webhook.7374413-4')}</div>

            <h2>{$t('doc.Webhook.7374413-5')}</h2>
            <div>
                {$t('doc.Webhook.7374413-6')}
                、Content-Type
            </div>
        </div>
    );
};
export default Webhook;
