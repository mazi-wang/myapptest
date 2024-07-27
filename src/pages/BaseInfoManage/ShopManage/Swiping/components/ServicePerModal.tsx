import { message, Modal, Row, Col, ConfigProvider, Button } from "antd"
import type { ProFormInstance } from "@ant-design/pro-components"
import {
    ProForm,
    ProFormText,
    ProFormDigit,
    ProFormDatePicker,
    ProFormTextArea,
    ProFormSelect,
} from "@ant-design/pro-components"
import type { Dispatch, SetStateAction } from "react"
import React, { useRef, useState } from "react"
import type { FormProps } from "rc-field-form/lib/Form"

import zhCN from "antd/es/locale/zh_CN"
import moment from "moment"
import "moment/locale/zh-cn"
import styles from "../tableLits.modules.css"

import { addSwipingAPI, putSwipingListAPI } from "@/apis/swiping"
import type { Swiping } from "@/apis/swiping"
import { MyFormSelect, switchSelectNameFetchFn } from "@/components/FormSelect"

moment.locale("zh-cn")

type EditConfigProps = { data: Swiping; isOpen: boolean; isLoading: boolean; type?: string }

type ServiceIndexModal = {
    config: {
        modifyConfig: EditConfigProps
        setModifyConfig: Dispatch<SetStateAction<EditConfigProps>>
    }
    actionRef: React.MutableRefObject<any>
}

export function EditPerformanceModal(props: ServiceIndexModal) {
    const formRef = useRef<ProFormInstance<Swiping>>(null)

    const handleFinish: FormProps<Swiping>["onFinish"] = async (
        values: Swiping
    ): Promise<boolean | void> => {
        const { id, storeId } = props.config.modifyConfig.data

        // * 格式化日期字段
        const formattedValues = {
            ...values,
            swipingTime: moment(values.swipingTime).format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
        }

        const result = await putSwipingListAPI({
            ...formattedValues,
            id,
            storeId,
        })
        if (result.data) {
            message.success(result.message)

            formRef.current?.resetFields()
            props.actionRef.current.reload()
            props.config.setModifyConfig((modifyConfig) => ({
                ...modifyConfig,
                isOpen: false,
            }))
        }
    }

    async function handleFinishRequest(formData: SwipingList) {
        // * 格式化日期字段
        const formattedValues = {
            ...formData,
            swipingTime: moment(formData.swipingTime).format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
        }

        const result = await addSwipingAPI(formattedValues)

        if (result.code === 200) {
            message.success("添加成功")

            formRef.current?.resetFields()

            props.actionRef.current.reload()
            props.config.setModifyConfig((modifyConfig) => ({
                ...modifyConfig,
                isOpen: false,
            }))
        }
    }

    return (
        <ConfigProvider locale={zhCN}>
            <Modal
                open={props.config.modifyConfig.isOpen}
                onCancel={() => {
                    props.config.setModifyConfig((modifyConfig) => ({
                        ...modifyConfig,
                        isOpen: false,
                    }))
                }}
                title="修改刷单"
                width={800} // 设置Modal的宽度
                footer={null}
            >
                <ServiceIndexForm
                    formData={{
                        ...props.config.modifyConfig.data,
                    }}
                    handleFinish={
                        props.config.modifyConfig.type === "add"
                            ? handleFinishRequest
                            : handleFinish
                    }
                    formRef={formRef}
                    type={props.config.modifyConfig.type || "edit"}
                />
            </Modal>
        </ConfigProvider>
    )
}

interface ServiceIndexFormProps {
    formData: Swiping
    handleFinish: (values: Swiping, formRef: React.RefObject<ProFormInstance<Swiping>>) => void
    formRef: React.RefObject<ProFormInstance<Swiping>>
    type?: string
}

// FIXME: This component is too big, consider splitting it into smaller components
export function ServiceIndexForm({
    formData,
    handleFinish,
    formRef,
    type = "edit",
}: ServiceIndexFormProps) {
    return (
        <div className={styles.tableStyle}>
            <ProForm<Swiping>
                layout="vertical"
                onFinish={(values) => handleFinish(values, formRef)}
                formRef={formRef}
                initialValues={{ ...formData }}
                submitter={{
                    render: (_, dom) => {
                        return (
                            <Row>
                                <Col span={8} offset={4}>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        style={{
                                            backgroundColor: "#1890ff",
                                            borderColor: "#1890ff",
                                            width: "100%",
                                        }}
                                    >
                                        提交
                                    </Button>
                                </Col>
                                <Col span={8}>
                                    <Button
                                        onClick={() => {
                                            formRef.current?.resetFields()
                                        }}
                                        style={{ width: "100%" }}
                                    >
                                        重置
                                    </Button>
                                </Col>
                            </Row>
                        )
                    },
                }}
            >
                <Row gutter={24}>
                    {type === "add" ? (
                        ""
                    ) : (
                        <Col span={8}>
                            <ProFormText name="id" label="刷单ID" fieldProps={{ disabled: true }} />
                        </Col>
                    )}
                    <Col span={8}>
                        {type === "add" ? (
                            <MyFormSelect name="storeId" label="选择店铺" type="store" />
                        ) : (
                            <ProFormText
                                name="storeId"
                                label="店铺ID"
                                fieldProps={{ disabled: true }}
                            />
                        )}
                    </Col>
                    <Col span={16}>
                        <ProFormSelect
                            name="userName"
                            label="用户名"
                            fieldProps={{
                                showSearch: true,
                                filterOption: false,
                            }}
                            debounceTime={300}
                            request={async (params) =>
                                await switchSelectNameFetchFn("user", params.keyWords)
                            }
                            initialValue={"羊羊"}
                        />
                    </Col>
                    <Col span={6}>
                        <ProFormDatePicker
                            name="swipingTime"
                            label="刷单时间"
                            fieldProps={{ format: "YYYY-MM-DD" }}
                            rules={[{ required: true, message: "请选择刷单时间" }]}
                        />
                    </Col>

                    <Col>
                        <ProFormSelect
                            name="name"
                            label="链接属性"
                            options={[
                                {
                                    value: "副",
                                    label: "副链接",
                                },
                                {
                                    value: "主",
                                    label: "主链接",
                                },
                            ]}
                            initialValue={"副"}
                        />
                    </Col>

                    <Col span={8}>
                        <ProFormDigit
                            name="refund"
                            label="返款金额"
                            fieldProps={{ precision: 2 }}
                            initialValue={0}
                        />
                    </Col>

                    <Col span={8}>
                        <ProFormText
                            name="number"
                            label="订单号"
                            fieldProps={{}}
                            initialValue={0}
                        />
                    </Col>
                    <Col span={8}>
                        <ProFormDigit
                            name="money"
                            label="佣金"
                            fieldProps={{ precision: 2 }}
                            initialValue={0}
                        />
                    </Col>
                    <Col span={6}>
                        <ProFormText
                            name="degree"
                            label="次数"
                            fieldProps={{}}
                            placeholder="3次"
                            initialValue={"3次"}
                        />
                    </Col>

                    <Col span={6}>
                        <ProFormText
                            name="refundTime"
                            label="返款日期"
                            placeholder={"返款日期: 4.1返款"}
                            initialValue={""}
                        />
                    </Col>
                    <Col span={8}>
                        <ProFormTextArea name="remark" label="备注" fieldProps={{}} />
                    </Col>
                </Row>
            </ProForm>
        </div>
    )
}
