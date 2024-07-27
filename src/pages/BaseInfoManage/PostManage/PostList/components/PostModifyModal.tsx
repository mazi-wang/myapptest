import { Button, message, Modal } from "antd"
import type { ProFormInstance } from "@ant-design/pro-components"
import { ProForm, ProFormSelect, ProFormText } from "@ant-design/pro-components"
import type { User } from "@/entity"
import type { Dispatch, SetStateAction } from "react"
import React, { useRef, useState } from "react"
import type { FormProps } from "rc-field-form/lib/Form"
import type { UserModifyPwd } from "@/apis/types/user"
import { putPostNameAPI, addUserPostAPI } from "@/apis/post"
import Styled from "styled-components"

import { MyFormSelect } from "@/components/FormSelect"

const Title = Styled.div`
display: flex;
align-items: center;
gap: 2rem;
justify-content: center;
cursor: pointer;
`

interface EditConfigProps {
    id: string | null
    isOpen: boolean
    isLoading: boolean
}

type UserModifyPwdProps = {
    config: {
        modifyConfig: EditConfigProps
        setModifyConfig: Dispatch<SetStateAction<EditConfigProps>>
    }
    item: {
        id: string
    }
    actionRef: React.MutableRefObject<any>
}

export function PostModifyModal(props: UserModifyPwdProps) {
    const formRef = useRef<ProFormInstance>()

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
            props.config.setModifyConfig({
                ...props.config.modifyConfig,
                isOpen: false,
            })
            formRef.current?.resetFields()
            props.actionRef.current?.reload()
        } else {
            message.error(result.message)
        }
        console.log(values)
    }

    function closeModify() {
        props.config.setModifyConfig({
            ...props.config.modifyConfig,
            isOpen: false,
        })
        formRef.current?.resetFields()
    }

    return (
        <Modal
            open={props.config.modifyConfig.isOpen}
            title="编辑岗位信息"
            onOk={() => closeModify()}
            onCancel={() => closeModify()}
            footer={false}
            form={formRef}
        >
            <PostForm id={props.item.id} onFinish={onFinish} formRef={formRef} />
        </Modal>
    )
}

interface PostFromProps {
    id: string
    onFinish: (formData: User) => Promise<boolean | void>
    formRef: React.MutableRefObject<ProFormInstance | undefined>
}

function PostForm({ id, onFinish, formRef }: PostFromProps) {
    return (
        <ProForm<User> layout="vertical" onFinish={onFinish} formRef={formRef}>
            <ProFormText
                name="id"
                width="md"
                label="岗位编号"
                fieldProps={{
                    disabled: true,
                    value: id,
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
    )
}

interface UserFormPost {
    stationId: string
    id: string
}

export function PostAddUserModifyModal(props: UserModifyPwdProps) {
    const formRef = useRef<ProFormInstance>()

    function closeModify() {
        props.config.setModifyConfig({
            ...props.config.modifyConfig,
            isOpen: false,
        })
        formRef.current?.resetFields()
    }

    return (
        <Modal
            open={props.config.modifyConfig.isOpen}
            title="编辑岗位信息"
            onOk={() => closeModify()}
            onCancel={() => closeModify()}
            footer={false}
            form={formRef}
        >
            <PostFormAddUser id={props.item.id} formRef={formRef} onClose={closeModify} />
        </Modal>
    )
}

function PostFormAddUser({
    id,
    onClose,
    formRef,
}: {
    id: string
    onClose: () => void
    formRef: React.MutableRefObject<ProFormInstance | undefined>
}) {
    async function onFinishUser(formData: UserFormPost): Promise<void> {
        try {
            const res = await addUserPostAPI(formData.userId, id)
            if (res.code !== 200) throw new Error(res.message)
            message.success("成功")
            onClose()
        } catch (err) {
            message.error("出错了")
        }
    }

    return (
        <ProForm<UserFormPost> layout="vertical" onFinish={onFinishUser} formRef={formRef}>
            <ProFormText
                name="stationId"
                width="md"
                label="岗位编号"
                fieldProps={{
                    disabled: true,
                    value: id,
                }}
            />
            <MyFormSelect name="userId" label="选择用户" type="user" />
        </ProForm>
    )
}
