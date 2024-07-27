import { message, Modal } from "antd"
import type { ProFormInstance } from "@ant-design/pro-components"
import { ProForm, ProFormText } from "@ant-design/pro-components"
import type { User } from "@/entity"
import type { Dispatch, SetStateAction } from "react"
import React, { useRef } from "react"
import type { FormProps } from "rc-field-form/lib/Form"
import type { UserModifyPwd } from "@/apis/types/user"
import type { EditConfigProps } from "@/pages/UserManage/UserList"
import { putPostNameAPI } from "@/apis/post"

type UserModifyPwdProps = {
    config: {
        modifyPwdConfig: EditConfigProps
        setModifyPwdConfig: Dispatch<SetStateAction<EditConfigProps>>
    }
    item: {
        id: string
    }
}

export function PostModifyModal(props: UserModifyPwdProps) {
    const formRef = useRef<ProFormInstance>()

    /**
     * 修改员工密码
     * @param values
     */
    const onFinish: FormProps<UserModifyPwd>["onFinish"] = async (
        values
    ): Promise<boolean | void> => {
        console.log("values: ", values)
        const result = await putPostNameAPI({
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
    return (
        <Modal
            open={props.config.modifyPwdConfig.isOpen}
            title="编辑岗位信息"
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
            <ProForm<User> layout="vertical" onFinish={onFinish} formRef={formRef}>
                <ProFormText
                    name="id"
                    width="md"
                    label="岗位编号"
                    fieldProps={{
                        disabled: true,
                        value: props.item.id,
                    }}
                />
                <ProFormText
                    name="name"
                    width="md"
                    label="岗位名称"
                    rules={[
                        {
                            required: true,
                            message: "请输入岗位名称",
                        },
                    ]}
                />
            </ProForm>
        </Modal>
    )
}
