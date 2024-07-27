import { message, Modal } from "antd"
import type { ActionType, ProFormInstance } from "@ant-design/pro-components"
import { ProForm, ProFormText } from "@ant-design/pro-components"
import type { User } from "@/entity"
import type { Dispatch, SetStateAction } from "react"
import React, { useRef } from "react"
import type { FormProps } from "rc-field-form/lib/Form"
import type { UserModifyPwd } from "@/apis/types/user"
import { putShopChannelNameAPI } from "@/apis/shop"
import type { EditConfigProps } from "@/type"

type UserModifyPwdProps = {
    config: {
        modifyEditConfig: EditConfigProps
        setModifyEditConfig: Dispatch<SetStateAction<EditConfigProps>>
    }
    item: {
        id: string
    }
    actionRef: React.Ref<ActionType>
}

export function ShopChannelModifyModal(props: UserModifyPwdProps) {
    const formRef = useRef<ProFormInstance>()

    /**
     * 修改员工密码
     * @param values
     */
    const onFinish: FormProps<UserModifyPwd>["onFinish"] = async (
        values
    ): Promise<boolean | void> => {
        console.log("values: ", values)
        const result = await putShopChannelNameAPI({
            ...values,
            id: props.item.id,
        })
        if (result.data) {
            message.success(result.message)
            props.config.setModifyEditConfig({
                ...props.config.modifyEditConfig,
                isOpen: false,
            })
            formRef.current?.resetFields()
            props.actionRef!.current!.reload()
        } else {
            message.error(result.message)
        }
        console.log(values)
    }
    return (
        <Modal
            open={props.config.modifyEditConfig.isOpen}
            title="修改渠道名字"
            onOk={() => {
                props.config.setModifyEditConfig({
                    ...props.config.modifyEditConfig,
                    isOpen: false,
                })
            }}
            onCancel={() => {
                props.config.setModifyEditConfig({
                    ...props.config.modifyEditConfig,
                    isOpen: false,
                })
            }}
            footer={false}
            form={formRef}
        >
            <ProForm<User> layout="vertical" onFinish={onFinish} formRef={formRef}>
                <ProFormText
                    name="id"
                    width="md"
                    label="修改渠道名字"
                    fieldProps={{
                        disabled: true,
                        value: props.item.id,
                    }}
                />
                <ProFormText name="name" width="md" label="修改渠道名字" />
            </ProForm>
        </Modal>
    )
}
