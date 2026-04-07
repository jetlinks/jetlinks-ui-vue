import type { TreeNode } from '@jetlinks-web-core/utils/tree';

interface OperatorItem extends TreeNode {
  id: string;
  name: string;
  key: string;
  description: string;
  code: string;
  children: OperatorItem[];
}
