import {message, Modal} from "antd"
import type {ProFormInstance} from "@ant-design/pro-components"
import {ProForm, ProFormText} from "@ant-design/pro-components"
import type {Role} from "@/entity"
import type {Dispatch, SetStateAction} from "react"
import {useEffect, useRef} from "react"
import type {FormProps} from "rc-field-form/lib/Form"
import {modifyRole} from "@/apis/role"
import type {EditConfigProps} from "@/type"

type RoleEditProps = {
    config: {
        editConfig: EditConfigProps
        setEditConfig: Dispatch<SetStateAction<EditConfigProps>>
    }
    item: Role
}

export default function RoleEditModal(props: RoleEditProps) {
    const formRef = useRef<ProFormInstance>()
    useEffect(() => {
        formRef.current?.resetFields()
    }, [props.item])

    /**
     * 修改角色数据
     * @param values
     */
    const onFinish: FormProps<Role>["onFinish"] = async (values): Promise<boolean | void> => {
        console.log("form: ", values)

        const result = await modifyRole(values)
        if (result.data) {
            message.success(result.message)
            props.config.setEditConfig({
                ...props.config.editConfig,
                isOpen: false,
            })
        }
    }
    return (
        <Modal
            open={props.config.editConfig.isOpen}
            title="编辑角色信息"
            onOk={() => {
                props.config.setEditConfig({
                    ...props.config.editConfig,
                    isOpen: false,
                })
            }}
            onCancel={() => {
                props.config.setEditConfig({
                    ...props.config.editConfig,
                    isOpen: false,
                })
            }}
            footer={false}
        >
            <ProForm<Role> layout="vertical" onFinish={onFinish} formRef={formRef} initialValues={props.item}>
                <ProFormText
                    name="id"
                    width="md"
                    label="角色编号"
                    fieldProps={{
                        disabled: true,
                        value: props.item.id,
                    }}
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                />
                <ProFormText
                    name="name"
                    width="md"
                    label="角色名称"
                    rules={[
                        {
                            required: true,
                            message: "请输入角色名称",
                        },
                    ]}
                />
            </ProForm>
        </Modal>
    )
}
