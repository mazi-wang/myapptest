import { message, Modal } from "antd"
import type { ProFormInstance } from "@ant-design/pro-components"
import { ProForm, ProFormText, ProFormDigit } from "@ant-design/pro-components"
import type { Dispatch, SetStateAction } from "react"
import React, { useEffect, useRef, useState } from "react"
import type { FormProps } from "rc-field-form/lib/Form"
import { putCost, addStoreStaffAPI, addStoreDitchAPI, putSellListAPI } from "@/apis/shop"
import type { EditConfigProps } from "@/type"
import styled from "styled-components"

type ModifyProps = {
    config: {
        modifyConfig: {
            id: string | null
            isOpen: boolean
            isLoading: boolean
            name?: string
            type: number | null
        }
        seCostModifyConfig: Dispatch<
            SetStateAction<{
                id: string | null
                isOpen: boolean
                isLoading: boolean
                name?: string
                type: number | null
            }>
        >
    }

    actionRef: any
    item: {
        id: string
        name?: string
        type: number | null
        allId: { store_id: string; ditch_id: string; sell_id: string } | null
    }
}

interface ShopModify {
    name: string
    id: string
    money: number
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
    const showForm = props.item.type

    const onClose = () => {
        props.config.seCostModifyConfig({
            ...props.config.modifyConfig,
            isOpen: false,
        })
        formRef.current?.resetFields()
    }

    /**
     * 修改店
     * @param values
     */
    const onFinish: FormProps<ShopModify>["onFinish"] = async (values): Promise<boolean | void> => {
        const reqData: { id: string; money: number; name?: string } = {
            id: props.item.id,
            money: values.money,
        }

        if (props.item.name) reqData.name = props.item.name

        const result = await putCost(reqData)
        if (result.data) {
            message.success(result.message)
            props.actionRef.current.reset()

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
            title="修改成本信息"
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

            {showForm !== 2 && (
                <>
                    <ProForm<ShopModify> layout="vertical" onFinish={onFinish} formRef={formRef}>
                        <ProFormText
                            name="id"
                            width="md"
                            label="成本ID"
                            fieldProps={{
                                disabled: true,
                                value: props.item.id,
                            }}
                        />
                        <ProFormDigit
                            name="money"
                            width="md"
                            label="成本"
                            rules={[
                                {
                                    required: true,
                                    message: "请输入成本",
                                },
                                {
                                    type: "number",
                                    min: 0,
                                    message: "请输入有效的成本",
                                },
                            ]}
                        />
                    </ProForm>
                </>
            )}
            {showForm === 2 && (
                <>
                    <ProForm<ShopModify> layout="vertical" onFinish={onFinish} formRef={formRef}>
                        <ProFormText
                            name="id"
                            width="md"
                            label="成本ID"
                            fieldProps={{
                                disabled: true,
                                value: props.item.id,
                            }}
                        />
                        <ProFormText
                            name="name"
                            width="md"
                            label="成本名称"
                            fieldProps={{
                                disabled: true,
                                value: props.item.name,
                            }}
                        />
                        <ProFormDigit
                            name="money"
                            width="md"
                            label="成本价格"
                            rules={[
                                {
                                    required: true,
                                    message: "请输入成本价格",
                                },
                                {
                                    type: "number",
                                    min: 0,
                                    message: "请输入有效的成本价格",
                                },
                            ]}
                        />
                    </ProForm>
                </>
            )}

            {showForm === 7 && (
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
