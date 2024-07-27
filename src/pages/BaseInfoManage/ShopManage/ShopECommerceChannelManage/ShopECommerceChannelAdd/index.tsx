import { addShopChannelAPI } from '@/apis/shop';
import type { UserAddParam } from '@/apis/types/user';
import { ProForm, ProFormText } from '@ant-design/pro-components';
import { message } from 'antd';
import type { FormProps } from 'rc-field-form/lib/Form';
import React from 'react';

type UserFormProps = {
  username: string;
  name: string;
  gender: number;
  email: string;
  password?: string;
  roleIdList: string[];
};

const UserAdd: React.FC = () => {
  /**
   * 提交员工数据
   * @param values
   */
  const onFinish: FormProps<UserFormProps>['onFinish'] = async (values) => {
    console.log('表单值为: ', values);
    const user: UserAddParam = {
      name: values.name,
    };
    const result = await addShopChannelAPI({
      ...user,
    });
    if (result.data) message.success(result.message);
  };

  return (
    <ProForm<UserFormProps> layout="vertical" onFinish={onFinish}>
      <ProFormText
        width="md"
        name="name"
        label="渠道名字"
        placeholder="请输入渠道名字"
        rules={[
          {
            required: true,
            message: '渠道名字是必填项',
          },
        ]}
      />
    </ProForm>
  );
};

export default UserAdd;
