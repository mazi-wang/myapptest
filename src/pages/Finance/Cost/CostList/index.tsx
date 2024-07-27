import type { CostListReq } from '@/apis/cost';
import { listCostAPI } from '@/apis/cost';
import type { User } from '@/entity';
import type { ActionType } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { history, useAccess } from '@umijs/max';
import { useRef, useState } from 'react';
import CostAdd from '../CostAdd';
import { PostModifyModal } from './components/PostModifyModal';
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
  const [list, setList] = useState<User[]>([]);
  const actionRef = useRef<ActionType>();
  const [editConfig, setEditConfig] = useState<{
    id: string | null;
    isOpen: boolean;
    isLoading: boolean;
  }>({
    id: null,
    isOpen: false,
    isLoading: false,
  });
  const [modifyPwdConfig, setModifyPwdConfig] = useState<{
    id: string | null;
    isOpen: boolean;
    isLoading: boolean;
  }>({
    id: null,
    isOpen: false,
    isLoading: false,
  });
  const access = useAccess();
  console.log('access: ', access);

  console.log(editConfig.id);

  const { location } = history;

  const handleRequest = async (params, sort, filter) => {
    console.log(params, sort, filter);
    const pageReq: CostListReq = {
      current: params.current as number,
      pageSize: params.pageSize as number,
      data: {
        cost_id: params.id,
        type: params.name,
      },
    };
    console.log('获取员工列表参数： ', pageReq);
    const result = await listCostAPI(pageReq);
    console.log('result:', result);
    if (result.data) {
      result.data.data.forEach(
        (item) => (item.articleCreatedTime = new Date(item.articleCreatedTime).toLocaleString()),
      );

      setList(result.data.data);
      return result.data;
    } else {
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
        <div style={{ marginBottom: '1rem', padding: '2rem', backgroundColor: 'white' }}>
          <CostAdd />
        </div>

        <ProTable<User>
          form={{ initialValues: location.query }}
          columns={columns(editConfig, setEditConfig, modifyPwdConfig, setModifyPwdConfig)}
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
          rowKey="id"
          search={{
            labelWidth: 'auto',
          }}
          pagination={{
            pageSize: 10,
            onChange: (page) => console.log(page),
          }}
          dateFormatter="string"
          headerTitle="员工列表"
        />
      </>
      <PostModifyModal
        config={{ modifyPwdConfig, setModifyPwdConfig }}
        item={{ id: modifyPwdConfig.id }}
      />
    </>
  );
};
