import { message, Modal } from "antd"
import type { ProFormInstance } from "@ant-design/pro-components"
import { ProForm, ProFormText } from "@ant-design/pro-components"
import type { Dispatch, SetStateAction } from "react"
import React, { useRef, useState } from "react"
import type { FormProps } from "rc-field-form/lib/Form"
import { putStoreNameAPI, addStoreStaffAPI, addStoreDitchAPI, putSellListAPI } from "@/apis/shop"
import type { EditConfigProps } from "@/type"
import styled from "styled-components"

type ModifyProps = {
  config: {
    modifyConfig: EditConfigProps
    setModifyConfig: Dispatch<SetStateAction<EditConfigProps>>
  }

  actionRef: any
  item: {
    id: string
  }
}

interface ShopModify {
  name: string
  id: string
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

export function ShopModifyModal(props: ModifyProps) {
  const formRef = useRef<ProFormInstance>()
  const [showForm, setShowForm] = useState("name")

  const onClose = () => {
    props.config.setModifyConfig({
      ...props.config.modifyConfig,
      isOpen: false,
    })
    formRef.current?.resetFields()
    props.actionRef.current.reset()
  }

  /**
   * 修改店
   * @param values
   */
  const onFinish: FormProps<ShopModify>["onFinish"] = async (values): Promise<boolean | void> => {
    console.log("values: ", values)
    const result = await putSellListAPI(props.item.id, values.name)
    if (result.data) {
      message.success(result.message)

      onClose()
    } else {
      message.error(result.message)
    }
    console.log(values)
  }

  const onFinishStaffStore: FormProps<{ id: string; userId: string }>["onFinish"] = async (
    values
  ): Promise<boolean | void> => {
    const shop = {
      storeId: props.item.id,
      id: values.userId,
    }
    console.log("shop: ", shop)
    try {
      const result = await addStoreStaffAPI(shop.id, shop.storeId)
      if (result.data) {
        message.success(result.message)
        onClose() // 关闭窗口
        return true // Return true to indicate success
      } else {
        message.error(result.message)
        return false // Return false to indicate failure
      }
    } catch (error) {
      console.error("Error adding store staff:", error)
      message.error("Failed to add store staff. Please try again.")
      return false // Return false to indicate failure
    }
  }

  const onFinishDitchStore: FormProps<{ id: string; name: string }>["onFinish"] = async (
    values
  ) => {
    const shop = {
      id: props.item.id,
      ditchName: values.name,
    }
    console.log("shop: ", shop)
    const result = await addStoreDitchAPI(shop.id, shop.ditchName)
    if (result.data) {
      message.success(result.message)
      onClose()
    }
  }

  return (
    <Modal
      open={props.config.modifyConfig.isOpen}
      title="编辑平台信息"
      onOk={() => onClose()}
      onCancel={() => onClose()}
      footer={false}
    >
      {/* <Title>
        <h3 style={showForm === "name" ? titleNameActive : {}} onClick={() => setShowForm("name")}>
          修改店铺名称
        </h3>
        <h3 style={showForm === "user" ? titleNameActive : {}} onClick={() => setShowForm("user")}>
          添加店铺员工
        </h3>
        <h3
          style={showForm === "ditch" ? titleNameActive : {}}
          onClick={() => setShowForm("ditch")}
        >
          添加店铺渠道
        </h3>
      </Title> */}
      {showForm === "name" && (
        <>
          <ProForm<ShopModify> layout="vertical" onFinish={onFinish} formRef={formRef}>
            <ProFormText
              name="id"
              width="md"
              label="平台ID"
              fieldProps={{
                disabled: true,
                value: props.item.id,
              }}
            />
            <ProFormText
              name="name"
              width="md"
              label="平台名称"
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
      {showForm === "user" && (
        <>
          <ProForm<{ id: string; userId: string }>
            layout="vertical"
            onFinish={onFinishStaffStore}
            formRef={formRef}
          >
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
                  message: "请输入员工ID",
                },
              ]}
            />
          </ProForm>
        </>
      )}

      {showForm === "ditch" && (
        <>
          <ProForm<{ id: string; name: string }>
            layout="vertical"
            onFinish={onFinishDitchStore}
            formRef={formRef}
          >
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
              label="渠道名"
              rules={[
                {
                  required: true,
                  message: "请输入渠道名称",
                },
              ]}
            />
          </ProForm>
        </>
      )}
    </Modal>
  )
}
