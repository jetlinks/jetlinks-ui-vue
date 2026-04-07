
import './index.less';
import { Image } from 'ant-design-vue';
import { templateImages } from '../../../../assets/notice/index';
import i18n from '@jetlinks-web-core/locales/index'
const $t = i18n.global.t
const DingTalk = () => {
  const agentId = templateImages.AgentId;
  // const userId = getImage('/notice/doc/template/dingTalk-message/02-user-id.jpg');
  // const dept = getImage('/notice/doc/template/dingTalk-message/03-dept.jpg');
  const a = '{name}';
  return (
    <div class="doc">
      <div class="url">
        {$t('doc.DingTalk.640108-0')}
        <a href="https://open-dev.dingtalk.com" target="_blank" rel="noopener noreferrer">
          https://open-dev.dingtalk.com
        </a>
        <br />
        {$t('doc.DingTalk.640108-1')}
        <a href="https://www.dingtalk.com" target="_blank" rel="noopener noreferrer">
          https://www.dingtalk.com
        </a>
      </div>
      <h1>{$t('doc.DingTalk.640108-2')}</h1>
      <div>
        {$t('doc.DingTalk.640108-3')}
        <div>{$t('doc.DingTalk.640108-4')}</div>
      </div>
      <h1> {$t('doc.DingTalk.640108-5')}</h1>
      <h2> {$t('doc.DingTalk.640108-6')}</h2>
      <div> {$t('doc.DingTalk.640108-7')}</div>
      <h2> 2、Agentid</h2>
      <div> {$t('doc.DingTalk.640108-8')}</div>
      <div> {$t('doc.DingTalk.640108-9')}</div>
      <div class="image">
        <Image width="100%" src={agentId} />
      </div>
      <h2> {$t('doc.DingTalk.640108-10')}</h2>
      <div>{$t('doc.DingTalk.640108-11')}</div>
      {/*<div> 收信人ID获取路径：“钉钉管理后台”--“通讯录”--“查看用户”</div>*/}
      {/*<div> 收信部门ID获取路径：“钉钉管理后台”--“通讯录”--“编辑部门”</div>*/}
      {/*<div class="image">*/}
      {/*  <Image width="100%" src={userId} />*/}
      {/*  <Image width="100%" src={dept} />*/}
      {/*</div>*/}
      <h2> {$t('doc.DingTalk.640108-12')}</h2>
      <div>
        {$t('doc.DingTalk.640108-13')}{a}
        {$t('doc.DingTalk.640108-14')}
      </div>
    </div>
  );
};
export default DingTalk;
