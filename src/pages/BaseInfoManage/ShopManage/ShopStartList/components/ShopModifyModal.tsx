import { Button, Divider, Input, InputRef, message, Modal, Select, Space } from "antd"
import type { ProFormInstance } from "@ant-design/pro-components"
import { ProForm, ProFormText, ProFormSelect } from "@ant-design/pro-components"
import type { Dispatch, SetStateAction } from "react"
import React, { useRef, useState } from "react"
import type { FormProps } from "rc-field-form/lib/Form"
import { addStoreDitchAPI } from "@/apis/shop"
import type { ActionType } from "@ant-design/pro-table"
import type { ModifyConfigProps, TableListItem } from "../index"
import { PlusOutlined } from "@ant-design/icons"

type EditConfigProps = ModifyConfigProps<TableListItem>

type ModifyProps = {
    config: {
        modifyConfig: EditConfigProps
        setModifyConfig: Dispatch<SetStateAction<EditConfigProps>>
    }
    actionRef: React.Ref<ActionType | undefined>
    setRefreshKey: Dispatch<SetStateAction<number>>
}

export function ShopModifyModal({ config, setRefreshKey }: ModifyProps) {
    const formRef = useRef<ProFormInstance>()
    const [showForm, setShowForm] = useState("ditch")
    const { modifyConfig, setModifyConfig } = config

    const [items, setItems] = useState(["电商渠道", "其它渠道"])
    const [name, setName] = useState("")
    const inputRef = useRef<InputRef>(null)

    const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value)
    }

    const addItem = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault()
        setItems((currItems) => {
            if (name && !currItems.includes(name)) {
                return [...items, name]
            }
            return currItems
        })
        setName("")
        setTimeout(() => {
            inputRef.current?.focus()
        }, 0)
    }

    const onClose = () => {
        setModifyConfig({
            ...modifyConfig,
            isOpen: false,
        })
        formRef.current?.resetFields()
    }

    const onFinishDitchStore: FormProps<{ id: string; name: string }>["onFinish"] = async (
        values
    ) => {
        const shop = {
            id: modifyConfig.data!.storeId,
            ditchName: values.name,
        }
        const result = await addStoreDitchAPI(shop.id, shop.ditchName)
        if (result.data) {
            message.success(result.message)
            onClose()
            setRefreshKey((prev) => prev + 1)
        }
    }

    return (
        <Modal
            open={modifyConfig.isOpen}
            title="编辑店铺信息"
            onOk={() => onClose()}
            onCancel={() => onClose()}
            footer={false}
        >
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
                                value: modifyConfig.data!.storeId,
                            }}
                        />
                        {/* [ ] 待处理 */}
                        <ProForm.Item label="渠道名称" name={"name"}>
                            <Select
                                style={{ width: 300 }}
                                placeholder="请选择渠道"
                                dropdownRender={(menu) => (
                                    <>
                                        {menu}
                                        <Divider style={{ margin: "8px 0" }} />
                                        <Space style={{ padding: "0 8px 4px" }}>
                                            <Input
                                                placeholder="请输入渠道"
                                                ref={inputRef}
                                                value={name}
                                                onChange={onNameChange}
                                                onKeyDown={(e) => e.stopPropagation()}
                                            />
                                            <Button
                                                type="text"
                                                icon={<PlusOutlined />}
                                                onClick={addItem}
                                            >
                                                添加渠道
                                            </Button>
                                        </Space>
                                    </>
                                )}
                                options={items.map((item) => ({ label: item, value: item }))}
                            />
                        </ProForm.Item>
                    </ProForm>
                </>
            )}
        </Modal>
    )
}
