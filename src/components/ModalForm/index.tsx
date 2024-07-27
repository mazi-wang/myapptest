import { PlusOutlined } from "@ant-design/icons"
import { ModalForm, ProFormInstance } from "@ant-design/pro-components"
import { Button, Form, message } from "antd"
import React, { useRef } from "react"

interface ModalFormProps<T> {
    title: string
    btnName?: string
    onFormSubmit: (values: T) => Promise<boolean>
    children: React.ReactNode
}

const MyModalForm = <T extends Record<string, any>>({
    title,
    btnName,
    onFormSubmit,
    children,
}: ModalFormProps<T>) => {
    const restFormRef = useRef<ProFormInstance>()
    return (
        <ModalForm<T>
            title={title}
            trigger={
                <Button type="link">
                    <PlusOutlined />
                    {btnName || title || "新建"}
                </Button>
            }
            autoFocusFirstInput
            modalProps={{
                destroyOnClose: true,
                onCancel: () => console.log("run"),
            }}
            submitTimeout={2000}
            onFinish={onFormSubmit}
            formRef={restFormRef}
        >
            {children}
        </ModalForm>
    )
}

export default MyModalForm
