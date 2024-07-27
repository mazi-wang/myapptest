import { addStoreAPI, addStoreStaffAPI, listStoreAPI } from '@/apis/shop';
import type { UserListReq } from '@/apis/types/user';
import type { User } from '@/entity';
import type { ActionType, FormProps } from '@ant-design/pro-components';
import { ProFormText, ProTable } from '@ant-design/pro-components';
import { history, useAccess } from '@umijs/max';
import { useRef, useState } from 'react';
import { ShopModifyModal } from './components/ShopModifyModal';
import { columns } from './config';

import MyModalForm from '@/components/ModalForm';
import { message } from 'antd';

import { MyFormSelect } from '@/components/FormSelect';

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

const ShopTable = () => {
  const [list, setList] = useState<User[]>([]);
  const actionRef = useRef<ActionType>();
  const [editConfig, setEditConfig] = useState<EditConfigProps>({
    id: null,
    isOpen: false,
    isLoading: false,
  });
  const [modifyPwdConfig, setModifyPwdConfig] = useState<ModifyPwdConfigProps>({
    id: null,
    isOpen: false,
    isLoading: false,
  });
  const access = useAccess();
  const { location } = history;

  const handleRequest = async (params, sort, filter) => {
    const pageReq: UserListReq = {
      current: params.current as number,
      pageSize: params.pageSize as number,
      data: {
        id: params.id,
        name: params.name,
      },
    };

    const result = await listStoreAPI(pageReq);

    if (result.data) {
      setList(result.data.data);
      return {
        current: result.data.current,
        pageSize: result.data.pageSize,
        data: result.data.data,
        total: result.data.total,
      };
    } else {
      return {
        current: 0,
        pageSize: 10,
        data: [],
      };
    }
  };

  const onFinish: FormProps<ShopFormProps>['onFinish'] = async (values) => {
    // console.log("表单值为: ", values)
    const shop = {
      name: values.name,
    };
    const result = await addStoreAPI(shop.name);
    if (result.data) {
      message.success(result.message);
      actionRef.current?.reload();
      return true;
    } else return false;
  };

  const onFinishStaffStore: FormProps<{ id: string; storeId: string }>['onFinish'] = async (
    values,
  ) => {
    // console.log("表单值为: ", values)
    const shop = {
      id: values.id,
      storeId: values.storeId,
    };
    const result = await addStoreStaffAPI(shop.id, shop.storeId);
    if (result.data) {
      message.success(result.message);
      return true;
    } else return false;
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
          editable={{ type: 'multiple' }}
          rowKey="id"
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
          search={{ labelWidth: 'auto' }}
          pagination={{
            pageSize: 10,
            onChange: (page) => console.log(page),
          }}
          dateFormatter="string"
          headerTitle="店铺列表"
          toolBarRender={() => [
            <MyModalForm
              key={'addStore'}
              title="添加店铺"
              btnName="添加店铺"
              onFormSubmit={onFinish}
            >
              <ProFormText
                width="md"
                name="name"
                label="店铺名称"
                placeholder="请输入店铺名称"
                rules={[
                  {
                    required: true,
                    message: '店铺名称是必填项',
                  },
                ]}
              />
            </MyModalForm>,
            <MyModalForm
              key={'addUser'}
              title="添加店铺员工"
              btnName="店铺添加员工"
              onFormSubmit={onFinishStaffStore}
            >
              <>
                <MyFormSelect name="id" label="选择员工" type="user" />
                <MyFormSelect name="storeId" label="选择店铺" type="store" />
              </>
            </MyModalForm>,
          ]}
        />
      </>
      <ShopModifyModal
        config={{ modifyPwdConfig, setModifyPwdConfig }}
        item={{ id: modifyPwdConfig.id ?? '' }}
        actionRef={actionRef}
      />
    </>
  );
};

export default ShopTable;
