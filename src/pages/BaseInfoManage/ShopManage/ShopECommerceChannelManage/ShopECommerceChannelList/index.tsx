import { addShopChannelAPI, listShopChannelAPI } from '@/apis/shop';
import type { UserListReq } from '@/apis/types/user';
import MyModalForm from '@/components/ModalForm';
import type { User } from '@/entity';
import type { ActionType, FormProps } from '@ant-design/pro-components';
import { ProFormText, ProTable } from '@ant-design/pro-components';
import { history, useAccess } from '@umijs/max';
import { message } from 'antd';
import { useRef, useState } from 'react';
import { ShopChannelModifyModal } from '../../ShopList/components/ShopECommerceChannelModifyModal';
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

export interface DitchListData<T = SellListData> {
  id: string;
  name: string;
  sellList: T[];
}

interface SellListData {
  id: string;
  name: string;
  articleCreatedTime: string;
  articleLastModifiedTime: string;
}

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

  const { location } = history;

  // * 编辑渠道名字
  const onFinish: FormProps<UserFormProps>['onFinish'] = async (values) => {
    console.log('表单值为: ', values);
    const user: UserAddParam = {
      name: values.name,
    };
    const result = await addShopChannelAPI({
      ...user,
    });
    if (result.data) {
      actionRef.current!.reload();
      message.success(result.message);
      return true;
    } else return false;
  };

  const handleRequest = async (params) => {
    const pageReq: UserListReq = {
      current: params.current as number,
      pageSize: params.pageSize as number,
      data: {
        id: params.id,
      },
    };

    const result = await listShopChannelAPI(pageReq);
    console.log('result:', result);
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
        <ProTable<DitchListData>
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
            persistenceType: 'sessionStorage',
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
          headerTitle="渠道列表"
          toolBarRender={() => [
            <MyModalForm
              btnName="添加渠道"
              title="编辑渠道"
              onFormSubmit={onFinish}
              key={'putDitchName'}
            >
              <ProFormText
                width="md"
                name="name"
                label="添加渠道"
                placeholder="请输入渠道名字"
                rules={[
                  {
                    required: true,
                    message: '渠道名字是必填项',
                  },
                ]}
              />
            </MyModalForm>,
          ]}
        />
      </>
      <ShopChannelModifyModal
        config={{ modifyPwdConfig, setModifyPwdConfig }}
        item={{ id: modifyPwdConfig.id }}
        actionRef={actionRef}
      />
    </>
  );
};
