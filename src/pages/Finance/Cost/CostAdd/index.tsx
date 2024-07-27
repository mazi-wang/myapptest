import { addPostAPI } from '@/apis/post';
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
    const result = await addPostAPI({
      ...user,
    });
    if (result.data) {
      message.success(result.message);
    }
  };

  return (
    <ProForm<UserFormProps> layout="vertical" onFinish={onFinish}>
      <ProFormText
        width="md"
        name="name"
        label="岗位名称"
        placeholder="岗位名称"
        rules={[
          {
            required: true,
            message: '岗位名称是必填项',
          },
        ]}
      />
    </ProForm>
  );
};

export default UserAdd;
