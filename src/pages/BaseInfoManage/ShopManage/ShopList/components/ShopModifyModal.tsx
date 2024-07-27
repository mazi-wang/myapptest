import { message, Modal } from "antd"
import type { ProFormInstance } from "@ant-design/pro-components"
import { ProForm, ProFormText } from "@ant-design/pro-components"
import type { User } from "@/entity"
import type { Dispatch, SetStateAction } from "react"
import { useRef } from "react"
import type { FormProps } from "rc-field-form/lib/Form"
import { putStoreNameAPI } from "@/apis/shop"
import type { EditConfigProps } from "@/type"
import { Button } from "antd"

type UserModifyPwdProps = {
    config: {
        modifyPwdConfig: EditConfigProps
        setModifyPwdConfig: Dispatch<SetStateAction<EditConfigProps>>
    }

    actionRef: any
    item: {
        id: string
    }
}

export function ShopModifyModal(props: UserModifyPwdProps) {
    const formRef = useRef<ProFormInstance>()

    const onClose = () => {
        props.config.setModifyPwdConfig({
            ...props.config.modifyPwdConfig,
            isOpen: false,
        })
        formRef.current?.resetFields()
    }

    const onFinish: FormProps<{ id: string; name: string }>["onFinish"] = async (
        values
    ): Promise<boolean | void> => {
        console.log("values: ", values)
        const result = await putStoreNameAPI({
            ...values,
            id: props.item.id,
        })
        if (result.data) {
            message.success(result.message)
            onClose()
            props.actionRef.current.reload()
        }
        console.log(values)
    }

    return (
        <Modal
            open={props.config.modifyPwdConfig.isOpen}
            title="编辑店铺信息"
            onOk={() => onClose()}
            onCancel={() => onClose()}
            footer={false}
            form={formRef}
        >
            <>
                <ProForm<User>
                    layout="vertical"
                    onFinish={onFinish}
                    formRef={formRef}
                    submitter={{
                        // 隐藏默认的重置按钮
                        resetButtonProps: {
                            style: {
                                display: "none",
                            },
                        },
                        render: (props, doms) => {
                            return [
                                ...doms.filter((dom) => dom.key !== "reset"), // 过滤掉默认的重置按钮
                                <Button
                                    key="cancel"
                                    onClick={() => {
                                        message.info("取消操作")
                                        onClose()
                                    }}
                                >
                                    取消
                                </Button>,
                            ]
                        },
                    }}
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
        </Modal>
    )
}
