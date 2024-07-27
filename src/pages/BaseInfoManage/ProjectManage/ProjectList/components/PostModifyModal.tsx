import { message, Modal } from "antd"
import type { ProFormInstance } from "@ant-design/pro-components"
import { ProForm, ProFormText, ProFormDatePicker } from "@ant-design/pro-components"
import type { User } from "@/entity"
import type { Dispatch, SetStateAction } from "react"
import React, { useRef, useState } from "react"
import type { FormProps } from "rc-field-form/lib/Form"
import type { UserModifyPwd } from "@/apis/types/user"
import { putProjectNameAPI, addProjectUserAPI } from "@/apis/project"
import Styled from "styled-components"
import type { ActionType } from "@ant-design/pro-components"
import { MyFormSelect } from "@/components/FormSelect"
import dayjs from "dayjs"

interface EditConfigProps {
    id: string | null
    isOpen: boolean
    isLoading: boolean
}

type UserModifyPwdProps = {
    config: {
        modifyPwdConfig: EditConfigProps
        setModifyPwdConfig: Dispatch<SetStateAction<EditConfigProps>>
    }
    item: {
        id: string
        name: string
        startTime: string
    }
    action: React.MutableRefObject<ActionType | undefined>
}

const Title = Styled.div`
display: flex;
justify-content: center;
align-items: center;
font-size: 18px;
gap: 20px;

span {
     cursor: pointer;
}

.active {
    color: #1890ff;
    font-weight: 700;
}
`

export function PostModifyModal(props: UserModifyPwdProps) {
    const formRef = useRef<ProFormInstance>()

    const onFinish: FormProps<UserModifyPwd>["onFinish"] = async (
        values
    ): Promise<boolean | void> => {
        console.log("values: ", values)

        const result = await putProjectNameAPI({
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
            props.action.current?.reload()
        } else {
            message.error(result.message)
        }
    }

    const onClose = () => {
        props.config.setModifyPwdConfig({
            ...props.config.modifyPwdConfig,
            isOpen: false,
        })
        props.action.current?.reload()
    }

    const time = dayjs(props.item.startTime).format("YYYY-MM-DD")

    return (
        <Modal
            open={props.config.modifyPwdConfig.isOpen}
            title="编辑项目信息"
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
            <ProForm<{ id: string; name: string; startTime: string }>
                layout="vertical"
                onFinish={onFinish}
                formRef={formRef}
            >
                <ProFormText
                    name="id"
                    width="md"
                    label="项目编号"
                    fieldProps={{
                        disabled: true,
                        value: props.item.id,
                    }}
                />
                <ProFormText
                    name="name"
                    width="md"
                    label="项目名称"
                    rules={[
                        {
                            required: true,
                            message: "请输入项目名称",
                        },
                    ]}
                    initialValue={props.item.name}
                />
                <ProFormDatePicker
                    name="startTime"
                    label="选择开始时间"
                    rules={[
                        {
                            required: true,
                            message: "请输入开始时间",
                        },
                    ]}
                    initialValue={time}
                    fieldProps={{ format: "YYYY-MM-DD" }}
                />
            </ProForm>
        </Modal>
    )
}

export function ModifyModalProjectUser({ config, setConfig, action }) {
    function onClose() {
        setConfig({ ...config, isOpen: false })
    }

    return (
        <Modal
            open={config.isOpen}
            onOk={() => {
                setConfig({
                    ...config,
                    isOpen: false,
                })
            }}
            onCancel={() => {
                setConfig({
                    ...config,
                    isOpen: false,
                })
            }}
            footer={false}
        >
            <ProjectFormAddUser id={config.id} onClose={onClose} action={action} />
        </Modal>
    )
}

interface ProjectFormPost {
    id: string
    articleId: string
}

function ProjectFormAddUser({ id, onClose, action }: { id: string; onClose: () => void }) {
    const formRef = useRef<ProFormInstance>()

    async function onFinishUser(formData: ProjectFormPost): Promise<void> {
        try {
            const res = await addProjectUserAPI({ id: formData.id, articleId: id })
            if (res.code !== 200) throw new Error(res.message)
            message.success("成功")
            formRef.current?.resetFields()
            onClose()
            action.current.reload()
        } catch (err) {
            message.error("出错了")
        }
    }

    return (
        <ProForm<{ name: string; id: string }> layout="vertical" onFinish={onFinishUser}>
            <ProFormText
                name="stationId"
                width="md"
                label="项目编号"
                fieldProps={{
                    disabled: true,
                    value: id,
                }}
            />
            <MyFormSelect name="id" />
        </ProForm>
    )
}
