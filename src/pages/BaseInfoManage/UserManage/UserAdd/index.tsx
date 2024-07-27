import {
    ProForm,
    ProFormSelect,
    ProFormText,
    ModalForm,
    ActionType,
} from "@ant-design/pro-components"
import React, { MutableRefObject } from "react"
import type { UserAddParam } from "@/apis/types/user"
import { addUser } from "@/apis/user"
import type { FormProps } from "rc-field-form/lib/Form"
import RoleSelect from "@/components/RoleSelect"
import { PlusOutlined } from "@ant-design/icons"
import { Button, Form, message } from "antd"

type UserFormProps = {
    username: string
    name: string
    gender: number
    email: string
    password?: string
    roleIdList: string[]
}

const UserAdd: React.FC = ({
    actionRef,
}: {
    actionRef: MutableRefObject<ActionType | undefined>
}) => {
    /**
     * 提交员工数据
     * @param values
     */
    const onFinish: FormProps<UserFormProps>["onFinish"] = async (values) => {
        const user: UserAddParam = {
            username: values.username,
            name: values.name,
            gender: values.gender,
            email: values.email,
            password: values.password,
            roleIdList: values.roleIdList,
        }
        const result = await addUser({
            ...user,
            password: btoa(user.password),
        })
        if (result.data) {
            message.success(result.message)
            actionRef.current?.reload()
        }
    }

    return (
        <ModalForm<UserFormProps>
            title="新建员工表单"
            trigger={
                <Button type="primary">
                    <PlusOutlined />
                    新建员工
                </Button>
            }
            autoFocusFirstInput
            modalProps={{
                destroyOnClose: true,
            }}
            submitTimeout={2000}
            onFinish={onFinish}
        >
            <ProForm.Group>
                <ProFormText
                    width="md"
                    name="name"
                    label="真实名字"
                    placeholder="请输入真实名字"
                    rules={[
                        {
                            required: true,
                            message: "真实名字是必填项",
                        },
                    ]}
                />
                <ProFormText
                    width="md"
                    name="username"
                    label="登录名"
                    placeholder="请输入员工登录名"
                    rules={[
                        {
                            required: true,
                            message: "员工名是必填项",
                        },
                    ]}
                />
                <ProFormText
                    width="md"
                    name="password"
                    label="密码"
                    placeholder="请输入密码（如未输入，则自动生成）"
                    tooltip="如未输入，则自动生成"
                />
                <RoleSelect />
                <ProFormSelect
                    width="md"
                    name="gender"
                    request={async () => [
                        { label: "男", value: 1 },
                        { label: "女", value: 0 },
                    ]}
                    initialValue={1}
                    label="性别"
                />
            </ProForm.Group>
        </ModalForm>
    )
}

export default UserAdd
