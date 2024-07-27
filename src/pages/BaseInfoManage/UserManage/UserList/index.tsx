import type { UserListReq } from '@/apis/types/user';
import { listUser } from '@/apis/user';
import type { User } from '@/entity';
import type { PageReq } from '@/type';
import type { ActionType } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { useRef, useState } from 'react';
import { columns } from './config';

import UserAdd from '../UserAdd';
import EditModifyModal from './components/EditModifyModal';
import { UserModifyPwdModal } from './components/UserModifyPwdModal';

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
    isOpen: boolean;
    isLoading: boolean;
    data?: { id: string; username: string; name: string; gender: number; age: number };
  }>({
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

  // const access = useAccess()
  // console.log("access: ", access)

  const { location } = history;

  const handleRequest = async ({ current, pageSize, ...rest }, sort, filter) => {
    const pageReq = {
      current,
      pageSize,
      data: { ...rest },
    } as PageReq<UserListReq>;

    console.log('pageReq: ', pageReq);
    const result = await listUser(pageReq);
    if (result.data) {
      setList(result.data.data);
      return result.data;
    } else {
      return {
        current: 0,
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
          toolBarRender={() => [<UserAdd key={'add'} actionRef={actionRef} />]}
        />
      </>
      <UserModifyPwdModal
        config={{ modifyPwdConfig, setModifyPwdConfig }}
        item={{ id: modifyPwdConfig.id }}
        actionRef={actionRef}
      />

      {editConfig.isOpen && (
        <EditModifyModal
          config={{ modifyConfig: editConfig, setModifyConfig: setEditConfig }}
          actionRef={actionRef}
        />
      )}
    </>
  );
};
