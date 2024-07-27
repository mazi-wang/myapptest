import { message, Modal } from "antd"
import type { ActionType, ProFormInstance } from "@ant-design/pro-components"
import { ProForm, ProFormText } from "@ant-design/pro-components"
import type { User } from "@/entity"
import type { Dispatch, SetStateAction } from "react"
import React, { useRef } from "react"
import type { FormProps } from "rc-field-form/lib/Form"
import type { UserModifyPwd } from "@/apis/types/user"
import type { EditConfigProps } from "@/pages/UserManage/UserList"
import { modifyUserPwd } from "@/apis/user"

type UserModifyPwdProps = {
    config: {
        modifyPwdConfig: EditConfigProps
        setModifyPwdConfig: Dispatch<SetStateAction<EditConfigProps>>
    }
    item: {
        id: string
    }
    actionRef: React.MutableRefObject<ActionType | undefined>
}

export function UserModifyPwdModal(props: UserModifyPwdProps) {
    const formRef = useRef<ProFormInstance>()

    const onFinish: FormProps<UserModifyPwd>["onFinish"] = async (
        values
    ): Promise<boolean | void> => {
        console.log("values: ", values)
        const result = await modifyUserPwd({
            uid: props.item.id,
            password: btoa(values.password),
        })
        if (result.data) {
            message.success(result.message)
            props.config.setModifyPwdConfig({
                ...props.config.modifyPwdConfig,
                isOpen: false,
            })
            formRef.current?.resetFields()
            props.actionRef.current?.reload()
        } else {
            message.error(result.message)
        }
        // console.log(values)
    }
    return (
        <Modal
            open={props.config.modifyPwdConfig.isOpen}
            title="编辑员工信息"
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
        >
            <ProForm<User> layout="vertical" onFinish={onFinish} formRef={formRef}>
                <ProFormText
                    name="id"
                    width="md"
                    label="员工编号"
                    fieldProps={{
                        disabled: true,
                        value: props.item.id,
                    }}
                />
                <ProFormText.Password
                    name="password"
                    width="md"
                    label="新密码"
                    fieldProps={{
                        type: "password",
                    }}
                    rules={[
                        {
                            required: true,
                            message: "请输入员工的新密码",
                        },
                    ]}
                />
            </ProForm>
        </Modal>
    )
}
