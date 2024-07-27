import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';

const Footer: React.FC = () => {
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright="Powered by YangYang"
      links={[
        {
          key: 'Ant Design Pro',
          title: '羊羊',
          href: '',
          blankTarget: true,
        },
        {
          key: 'github',
          title: 'de',
          href: '',
          blankTarget: true,
        },
        {
          key: 'Ant Design',
          title: '财务系统',
          href: '',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
