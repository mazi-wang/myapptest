import { addStoreAPI, addStoreStaffAPI } from '@/apis/shop';
import { ProForm, ProFormText } from '@ant-design/pro-components';
import { message } from 'antd';
import type { FormProps } from 'rc-field-form/lib/Form';
import React from 'react';
import styled from 'styled-components';

type ShopFormProps = {
  name: string;
};

type ShopStaffFromProps = {
  id: string;
  storeId: string;
};

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
`;
const Title = styled.div`
  font-weight: 600;
  font-size: 18px;
`;

const UserAdd: React.FC = () => {
  /**
   * 提交员工数据
   * @param values
   */
  const onFinish: FormProps<ShopFormProps>['onFinish'] = async (values) => {
    console.log('表单值为: ', values);
    const shop = {
      name: values.name,
    };
    const result = await addStoreAPI(shop.name);
    if (result.data) {
      message.success(result.message);
      // history.push("/user/list")
    }
  };

  const onFinishStaffStore: FormProps<ShopStaffFromProps>['onFinish'] = async (values) => {
    console.log('表单值为: ', values);
    const shop = {
      id: values.id,
      storeId: values.storeId,
    };
    const result = await addStoreStaffAPI(shop.id, shop.storeId);
    if (result.data) {
      message.success(result.message);
      // history.push("/user/list")
    }
  };

  return (
    <Container>
      <section>
        <Title>添加店铺：</Title>
        <ProForm<ShopFormProps> layout="vertical" onFinish={onFinish}>
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
        </ProForm>
      </section>

      <section>
        <Title>添加员工店铺：</Title>
        <ProForm<ShopFormProps> layout="vertical" onFinish={onFinishStaffStore}>
          <ProFormText
            width="md"
            name="id"
            label="员工ID"
            placeholder="请输入员工ID"
            rules={[
              {
                required: true,
                message: '员工ID是必填项',
              },
            ]}
          />

          <ProFormText
            width="md"
            name="storeId"
            label="店铺ID"
            placeholder="请输入店铺ID"
            rules={[
              {
                required: true,
                message: '店铺ID是必填项',
              },
            ]}
          />
        </ProForm>
      </section>
    </Container>
  );
};

export default UserAdd;
