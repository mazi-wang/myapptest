import { getProjectAllUserAPI } from '@/apis/project';
import type { User } from '@/entity';
import type { ActionType } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { history, useAccess } from '@umijs/max';
import { useRef } from 'react';
import { columns } from './config';

export type EditConfigProps = {
  id: string | null;
  isOpen: boolean;
  isLoading: boolean;
};

export type ModifyPwdConfigProps = {
  id: string | null;
  isOpen: boolean;
  isLoading: boolean;
};

export default () => {
  const actionRef = useRef<ActionType>();

  const access = useAccess();
  console.log('access: ', access);

  const { location } = history;

  const handleRequest = async (params, sort, filter) => {
    console.log(params, sort, filter);
    const pageReq: { current: number; pageSize: number; data: { userId: string } } = {
      current: params.current,
      pageSize: params.pageSize,
      data: params.id && { userId: params.id },
    };
    try {
      const result = await getProjectAllUserAPI(pageReq);
      if (result.code !== 200) throw new Error(`${result.message}`);

      result.data.data.forEach((item) => {
        item.articleCreatedTime = new Date(item.articleCreatedTime).toLocaleString().split(' ')[0];

        item.key = item.id + '-' + item.articleId;
      });

      return result.data;
    } catch (err) {
      console.log('获取数据出错', err);
      return {
        current: 1,
        pageSize: 10,
        data: [],
      };
    }
  };

  return (
    <>
      <>
        <ProTable<User>
          form={{ initialValues: location.query }}
          columns={columns()}
          actionRef={actionRef}
          cardBordered
          scroll={{ x: 1300 }}
          request={handleRequest}
          editable={{
            type: 'multiple',
          }}
          columnsState={{
            persistenceKey: 'pro-table-singe-demos',
            persistenceType: 'localStorage',
            defaultValue: {
              option: { fixed: 'right', disable: true },
            },
            onChange(value) {
              console.log('value: ', value);
            },
          }}
          rowKey="key"
          search={{
            labelWidth: 'auto',
          }}
          pagination={{
            pageSize: 10,
            onChange: (page) => console.log(page),
          }}
          dateFormatter="string"
          headerTitle="员工列表"
          toolBarRender={() => []}
        />
      </>
    </>
  );
};
