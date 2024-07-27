import { ProForm, ProFormText } from "@ant-design/pro-components"
import React from "react"
import { message } from "antd"
import { addSellListAPI, addSellDitchListAPI } from "@/apis/shop"
import type { FormProps } from "rc-field-form/lib/Form"
import styled from "styled-components"

type ShopFormProps = {
  name: string
}

type SellFromProps = {
  ditch_id: string
  sell_id: string
}

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
`
const Title = styled.div`
  font-weight: 600;
  font-size: 18px;
`

const SellAdd: React.FC = () => {
  /**
   * 提交员工数据
   * @param values
   */
  const onFinish: FormProps<{ name: string }>["onFinish"] = async (values) => {
    console.log("表单值为: ", values)
    const shop = {
      name: values.name,
    }
    const result = await addSellListAPI(shop.name)
    if (result.data) {
      message.success(result.message)
    }
  }

  const onFinishStaffStore: FormProps<SellFromProps>["onFinish"] = async (values) => {
    console.log("表单值为: ", values)
    const result = await addSellDitchListAPI(values.ditch_id, values.sell_id)
    if (result.data) {
      message.success(result.message)
    }
  }

  return (
    <Container>
      <section>
        <Title>添加平台：</Title>
        <ProForm<ShopFormProps> layout="vertical" onFinish={onFinish}>
          <ProFormText
            width="md"
            name="name"
            label="店铺名称"
            placeholder="请输入平台名称"
            rules={[
              {
                required: true,
                message: "店铺名称是必填项",
              },
            ]}
          />
        </ProForm>
      </section>

      <section>
        <Title>添加渠道平台：</Title>
        <ProForm<ShopFormProps> layout="vertical" onFinish={onFinishStaffStore}>
          <ProFormText
            width="md"
            name="ditch_id"
            label="渠道ID"
            placeholder="渠道ID"
            rules={[
              {
                required: true,
                message: "渠道ID是必填项",
              },
            ]}
          />

          <ProFormText
            width="md"
            name="sell_id"
            label="平台ID"
            placeholder="平台ID"
            rules={[
              {
                required: true,
                message: "平台ID是必填项",
              },
            ]}
          />
        </ProForm>
      </section>
    </Container>
  )
}

export default SellAdd
