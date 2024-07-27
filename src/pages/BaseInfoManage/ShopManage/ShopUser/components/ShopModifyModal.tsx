import { message, Modal } from "antd"
import type { ProFormInstance } from "@ant-design/pro-components"
import { ProForm, ProFormText } from "@ant-design/pro-components"
import type { User } from "@/entity"
import type { Dispatch, SetStateAction } from "react"
import React, { useRef, useState } from "react"
import type { FormProps } from "rc-field-form/lib/Form"
import type { UserModifyPwd } from "@/apis/types/user"
import { putStoreNameAPI, addStoreStaffAPI } from "@/apis/shop"
import type { EditConfigProps } from "@/type"
import styled from "styled-components"

type UserModifyPwdProps = {
  config: {
    modifyPwdConfig: EditConfigProps
    setModifyPwdConfig: Dispatch<SetStateAction<EditConfigProps>>
  }
  item: {
    id: string
  }
}

const Title = styled.div`
  display: flex;
  border-bottom: 1px solid #f0f0f0;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  cursor: pointer;
`

const titleNameActive = {
  background: "#3b6091",
  padding: "0.5rem 1rem",
  borderRadius: "0.3rem",
  color: "white",
}

export function ShopModifyModal(props: UserModifyPwdProps) {
  const formRef = useRef<ProFormInstance>()
  const [showForm, setShowForm] = useState(true)

  /**
   * 修改员工密码
   * @param values
   */
  const onFinish: FormProps<UserModifyPwd>["onFinish"] = async (
    values
  ): Promise<boolean | void> => {
    console.log("values: ", values)
    const result = await putStoreNameAPI({
      ...values,
      id: props.item.id,
    })
    if (result.data) {
      message.success(result.message)
      props.config.setModifyPwdConfig({
        ...props.config.modifyPwdConfig,
        isOpen: false,
      })
      formRef.current?.resetFields()
    } else {
      message.error(result.message)
    }
    console.log(values)
  }

  const onFinishStaffStore: FormProps<{ id: string; userId: string }>["onFinish"] = async (
    values
  ) => {
    const shop = {
      storeId: props.item.id,
      id: values.userId,
    }
    console.log("shop: ", shop)
    const result = await addStoreStaffAPI(shop.id, shop.storeId)
    if (result.data) {
      message.success(result.message)
      // history.push("/user/list")
    }
  }

  return (
    <Modal
      open={props.config.modifyPwdConfig.isOpen}
      title="编辑店铺信息"
      onOk={() => {
        props.config.setModifyPwdConfig({
          ...props.config.modifyPwdConfig,
          isOpen: false,
        })
      }}
      onCancel={() => {
        props.config.setModifyPwdConfig({
          ...props.config.modifyPwdConfig,
          isOpen: false,
        })
      }}
      footer={false}
      form={formRef}
    >
      <Title>
        <h3 style={showForm ? titleNameActive : {}} onClick={() => setShowForm(true)}>
          修改店铺名称
        </h3>
        <h3 style={showForm ? {} : titleNameActive} onClick={() => setShowForm(false)}>
          添加店铺员工
        </h3>
      </Title>
      {showForm ? (
        <>
          <ProForm<User> layout="vertical" onFinish={onFinish} formRef={formRef}>
            <ProFormText
              name="id"
              width="md"
              label="店铺ID"
              fieldProps={{
                disabled: true,
                value: props.item.id,
              }}
            />
            <ProFormText
              name="name"
              width="md"
              label="店铺名称"
              rules={[
                {
                  required: true,
                  message: "请输入店铺名称",
                },
              ]}
            />
          </ProForm>
        </>
      ) : (
        <>
          <ProForm<User> layout="vertical" onFinish={onFinishStaffStore} formRef={formRef}>
            <ProFormText
              name="id"
              width="md"
              label="店铺ID"
              fieldProps={{
                disabled: true,
                value: props.item.id,
              }}
            />
            <ProFormText
              name="userId"
              width="md"
              label="员工ID"
              rules={[
                {
                  required: true,
                  message: "请输入店铺名称",
                },
              ]}
            />
          </ProForm>
        </>
      )}
    </Modal>
  )
}
