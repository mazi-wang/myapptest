import { addProjectAPI, listProjectAPI } from '@/apis/project';
import type { UserListReq } from '@/apis/types/user';
import MyModalForm from '@/components/ModalForm';
import type { User } from '@/entity';
import type { ActionType, FormProps } from '@ant-design/pro-components';
import { ProFormDatePicker, ProFormText, ProTable } from '@ant-design/pro-components';
import { history, useAccess } from '@umijs/max';
import { message } from 'antd';
import { useRef, useState } from 'react';
import { ModifyModalProjectUser, PostModifyModal } from './components/PostModifyModal';
import { columns } from './config';

import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN'; // 导入 Ant Design 的中文配置
import moment from 'moment';
import 'moment/locale/zh-cn'; // 导入中文语言包

moment.locale('zh-cn');

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
  const [addUserConfig, setAddUserConfig] = useState({
    isOpen: false,
    id: '',
  });

  const [modifyPwdConfig, setModifyPwdConfig] = useState<{
    id: string | null;
    name?: string;
    startTime?: string;
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

  const handleRequest = async (params, sort, filter) => {
    const pageReq: UserListReq = {
      current: params.current as number,
      pageSize: params.pageSize as number,
      data: {
        id: params.id,
        name: params.name,
      },
    };

    const result = await listProjectAPI(pageReq);
    // console.log("result:", result)
    if (result.data) {
      result.data.data.forEach(
        (item) =>
          (item.articleCreatedTime = new Date(item.articleCreatedTime)
            .toLocaleString()
            .split(' ')[0]),
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

  const onAddProjectFinish: FormProps<{ name: string; startTime: string }>['onFinish'] = async (
    values,
  ) => {
    const result = await addProjectAPI({
      ...values,
    });
    if (result.data) {
      message.success('提交成功');
      actionRef.current?.reload();

      return true;
    }
    return false;
  };

  return (
    <>
      <ConfigProvider locale={zhCN}>
        <>
          <ProTable<User>
            form={{ initialValues: location.query }}
            columns={columns(modifyPwdConfig, setModifyPwdConfig, setAddUserConfig)}
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
                // console.log("value: ", value)
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
            headerTitle="项目列表"
            toolBarRender={() => [
              <MyModalForm title="添加项目" onFormSubmit={onAddProjectFinish} key={'addProject'}>
                <>
                  <ProFormText
                    width="md"
                    name="name"
                    label="项目名称"
                    placeholder="请输入项目名称"
                    rules={[
                      {
                        required: true,
                        message: '项目名称是必填项',
                      },
                    ]}
                  />

                  <ProFormDatePicker
                    name="startTime"
                    label="选择开始时间"
                    tooltip="请选择一个日期"
                    placeholder="请选择日期"
                  />
                </>
              </MyModalForm>,
            ]}
          />
        </>
        <PostModifyModal
          key={modifyPwdConfig.id ?? ''}
          config={{ modifyPwdConfig, setModifyPwdConfig }}
          item={{
            id: modifyPwdConfig.id ?? '',
            name: modifyPwdConfig.name ?? '',
            startTime: modifyPwdConfig.startTime ?? '',
          }}
          action={actionRef}
        />
        {addUserConfig.isOpen && (
          <ModifyModalProjectUser
            config={addUserConfig}
            setConfig={setAddUserConfig}
            action={actionRef}
          />
        )}
      </ConfigProvider>
    </>
  );
};
