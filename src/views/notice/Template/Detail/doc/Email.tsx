// import './index.less';
import i18n from '@/i18n'
const $t = i18n.global.t
const Email = () => {

  const b = '{name}';
  return (
    <div class="doc">
      <h1>{$t('doc.Email.2146917-1')}</h1>
      <div>
        {$t('doc.Email.2146917-2')}
      </div>
      <h1>{$t('doc.Email.2146917-3')}</h1>
      <div>
        {/* <h2> 1、服务器地址</h2>
        <div>服务器地址支持自定义输入</div> */}
        <h2> 1、{$t('doc.Email.2146917-0')}</h2>
        <div>{$t('doc.Email.2146917-5',['${标题}','${title}'])}</div>
        <h2> {$t('doc.Email.2146917-6')}</h2>
        <div> {$t('doc.Email.2146917-7')}</div>
        <h2> {$t('doc.Email.2146917-8')}</h2>
        <div>
          {$t('doc.Email.2146917-9',['${name}'])}
        </div>
      </div>
    </div>
  );
};
export default Email;
