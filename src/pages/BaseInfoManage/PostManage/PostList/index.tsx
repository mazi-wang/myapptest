import { addPostAPI, listPostAPI } from '@/apis/post';
import type { UserListReq } from '@/apis/types/user';
import MyModalForm from '@/components/ModalForm';
import type { User } from '@/entity';
import type { ActionType, FormProps } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { history, useAccess } from '@umijs/max';
import { useRef, useState } from 'react';
import PostAdd from '../PostAdd';
import { PostAddUserModifyModal, PostModifyModal } from './components/PostModifyModal';
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

  const [modifyConfig, setModifyConfig] = useState<{
    id: string | null;
    isOpen: boolean;
    isLoading: boolean;
  }>({
    id: null,
    isOpen: false,
    isLoading: false,
  });

  const [addModifyConfig, setAddModifyConfig] = useState<{
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

  const { location } = history;

  // * 添加岗位
  const onFinish: FormProps<{ name: string }>['onFinish'] = async (values) => {
    const user: { name: string } = {
      name: values.name,
    };
    const result = await addPostAPI({
      ...user,
    });
    if (result.data) {
      actionRef.current?.reload();
      return true;
    } else return false;
  };

  const handleRequest = async (params, sort, filter) => {
    console.log(params, sort, filter);
    const pageReq: UserListReq = {
      current: params.current as number,
      pageSize: params.pageSize as number,
      data: {
        id: params.id,
        name: params.name,
      },
    };
    console.log('获取员工列表参数： ', pageReq);
    const result = await listPostAPI(pageReq);
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
        <ProTable<User>
          form={{ initialValues: location.query }}
          columns={columns(modifyConfig, setModifyConfig, setAddModifyConfig)}
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
          headerTitle="岗位列表"
          toolBarRender={() => [
            <MyModalForm
              key={'add'}
              title="添加员工岗位"
              btnName="添加岗位"
              onFormSubmit={onFinish}
            >
              <PostAdd />
            </MyModalForm>,
          ]}
        />
      </>
      <PostModifyModal
        config={{ modifyConfig, setModifyConfig }}
        item={{ id: modifyConfig!.id }}
        actionRef={actionRef}
      />

      <PostAddUserModifyModal
        config={{ modifyConfig: addModifyConfig, setModifyConfig: setAddModifyConfig }}
        item={{ id: addModifyConfig!.id || '' }}
      />
    </>
  );
};
