import './index.less';
import i18n from '@jetlinks-web-core/locales/index'
const $t = i18n.global.t
const Email = () => {
    return (
        <div class={'doc'}>
            <h1>{$t('doc.Email.707707-0')}</h1>
            <div>
                {$t('doc.Email.707707-1')}
            </div>
            <h1>{$t('doc.Email.707707-2')}</h1>
            <h2>{$t('doc.Email.707707-3')}</h2>
            <div>
                {$t('doc.Email.707707-4')}
            </div>
            <div>
                {$t('doc.Email.707707-5')}
            </div>
            <h2>{$t('doc.Email.707707-6')}</h2>
            <div>{$t('doc.Email.707707-7')}</div>
            <h2>{$t('doc.Email.707707-8')}</h2>
            <div>{$t('doc.Email.707707-9')}</div>
            <h2>{$t('doc.Email.707707-10')}</h2>
            <div>{$t('doc.Email.707707-11')}</div>
        </div>
    );
};
export default Email;
