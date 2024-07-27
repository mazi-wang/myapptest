import { message, Modal, Row, Col, ConfigProvider, Button } from "antd"
import type { ActionType, ProFormInstance } from "@ant-design/pro-components"
import { ProForm, ProFormText, ProFormDigit, ProFormDatePicker } from "@ant-design/pro-components"
import type { Dispatch, SetStateAction } from "react"
import React, { useRef } from "react"
import type { FormProps } from "rc-field-form/lib/Form"

import { addServiceIndexAPI, putServiceIndexAPI } from "@/apis/shop"
import type { PutUserPerformance } from "@/apis/shop"

import zhCN from "antd/es/locale/zh_CN"
import moment from "moment"
import "moment/locale/zh-cn"
import styles from "./ServiceModal.modules.css"
import dayjs from "dayjs"
import { MyFormSelect } from "@/components/FormSelect"
import { ModifyConfig } from ".."

moment.locale("zh-cn")

type ServiceIndexModal = {
    config: {
        modifyConfig: ModifyConfig
        setModifyConfig: Dispatch<SetStateAction<ModifyConfig>>
    }
    actionRef: React.MutableRefObject<ActionType | undefined>
}

export function EditPerformanceModal(props: ServiceIndexModal) {
    const { type } = props.config.modifyConfig

    const handleFinish: FormProps<PutUserPerformance>["onFinish"] = async (
        values: PutUserPerformance,
        formRef: React.RefObject<ProFormInstance> | null
    ): Promise<boolean | void> => {
        const { id, userId } = props.config.modifyConfig.data

        const result = await putServiceIndexAPI({
            ...values,
            id,
            userId,
        })
        if (result.code === 200) {
            message.success(result.message)

            formRef.current!.resetFields()
            props.actionRef.current?.reload()
            props.config.setModifyConfig({
                ...props.config.modifyConfig,
                isOpen: false,
            })
        } else {
            message.error(result.message)
        }
    }

    async function handleAddService(values, _) {
        const result = await addServiceIndexAPI({
            ...values,
        })

        if (result.code === 200) {
            message.success("添加成功")
            props.actionRef.current?.reload()
            props.config.setModifyConfig({
                ...props.config.modifyConfig,
                isOpen: false,
            })
        } else message.error("添加失败")
    }

    return (
        <ConfigProvider locale={zhCN}>
            <Modal
                key={props.config.modifyConfig.data?.id}
                open={props.config.modifyConfig.isOpen}
                title="编辑客服指标信息"
                onCancel={() => {
                    props.config.setModifyConfig({
                        ...props.config.modifyConfig,
                        isOpen: false,
                    })
                }}
                footer={null}
                width={800} // 设置Modal的宽度
            >
                <ServiceIndexForm
                    formData={{ ...props.config.modifyConfig.data }}
                    handleFinish={type === "add" ? handleAddService : handleFinish}
                    type={props.config.modifyConfig.type}
                />
            </Modal>
        </ConfigProvider>
    )
}

interface ServiceIndexFormProps {
    formData: any
    handleFinish: (values: PutUserPerformance, formRef: React.RefObject<ProFormInstance>) => void
    type: string
}

export function ServiceIndexForm({ formData, handleFinish, type }: ServiceIndexFormProps) {
    const formRef = useRef<ProFormInstance>()

    let dateTime = dayjs(new Date()).format("YYYY-MM")
    if (formData?.indexTime) {
        const date = new Date(formData.indexTime)
        dateTime = dayjs(date).format("YYYY-MM")
    }

    return (
        <div className={styles.tableStyle}>
            <ProForm<PutUserPerformance>
                layout="vertical"
                onFinish={(values) => handleFinish(values, formRef)}
                formRef={formRef}
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
                initialValues={{ ...formData, indexTime: dateTime }}
            >
                <Row gutter={24}>
                    {type === "add" ? (
                        ""
                    ) : (
                        <Col span={8}>
                            <ProFormText
                                name="id"
                                label="客服指标ID"
                                fieldProps={{ disabled: true }}
                            />
                        </Col>
                    )}

                    <Col span={12}>
                        {type === "add" ? (
                            <MyFormSelect name="userId" label="选择用户" type="user" />
                        ) : (
                            <ProFormText
                                name="userId"
                                label="客服ID"
                                fieldProps={type === "add" ? {} : { disabled: true }}
                            />
                        )}
                    </Col>

                    <Col span={8}>
                        <ProFormDatePicker.Month
                            name="indexTime"
                            label="选择月份"
                            fieldProps={{ format: "YYYY-MM" }}
                            rules={[{ required: true, message: "请选择指标完成月份" }]}
                        />
                    </Col>
                </Row>

                <Row gutter={24}>
                    <Col span={12}>
                        <ProFormText
                            name="avgAnswer"
                            label="平均响应时间"
                            rules={[{ required: true, message: "请输入平均响应时间" }]}
                            placeholder={"平均响应时间: 10s"}
                        />
                    </Col>
                    <Col span={12}>
                        <ProFormDigit
                            name="answerSingle"
                            label="平均响应时间单项分值"
                            rules={[{ required: true, message: "请输入平均响应时间单项分值" }]}
                            placeholder={"平均响应时间单项分值: 80"}
                        />
                    </Col>
                </Row>

                <Row gutter={24}>
                    <Col span={12}>
                        <ProFormText
                            name="satisfaction"
                            label="客户满意率"
                            rules={[{ required: true, message: "请输入客户满意率" }]}
                            placeholder={"客户满意率: 90%"}
                        />
                    </Col>
                    <Col span={12}>
                        <ProFormDigit
                            name="satisfactionSingle"
                            label="客户满意率单项分值"
                            rules={[
                                { required: true, message: "请输入客户满意率单项分值" },
                                { type: "number", min: 0, message: "分值不能小于0" },
                                { type: "number", max: 100, message: "分值不能大于100" },
                            ]}
                            placeholder={"客户满意率单项分值: 80"}
                        />
                    </Col>
                </Row>

                <Row gutter={24}>
                    <Col span={12}>
                        <ProFormText
                            name="playAt"
                            label="敷衍回复次数"
                            rules={[{ required: true, message: "请输入敷衍回复次数" }]}
                            placeholder={"敷衍回复次数: 3次"}
                        />
                    </Col>
                    <Col span={12}>
                        <ProFormDigit
                            name="playAtSingle"
                            label="敷衍回复单项分值"
                            rules={[{ required: true, message: "请输入敷衍回复单项分值" }]}
                            placeholder={"敷衍回复单项分值: 3次"}
                        />
                    </Col>
                </Row>

                <Row gutter={24}>
                    <Col span={12}>
                        <ProFormText
                            name="unsent"
                            label="未正确发送次数"
                            rules={[{ required: true, message: "请输入未正确发送次数" }]}
                            placeholder={"未正确发送次数: 3次"}
                        />
                    </Col>
                    <Col span={12}>
                        <ProFormDigit
                            name="unsentSingle"
                            label="未正确发送单项分值"
                            rules={[{ required: true, message: "请输入未正确发送单项分值" }]}
                            placeholder={"未正确发送单项分值: 80"}
                        />
                    </Col>
                </Row>

                <Row gutter={24}>
                    <Col span={12}>
                        <ProFormText
                            name="undone"
                            label="未完成连带销售次数"
                            rules={[{ required: true, message: "请输入未完成连带销售次数" }]}
                            placeholder={"未完成连带销售次数: 3次"}
                        />
                    </Col>
                    <Col span={12}>
                        <ProFormDigit
                            name="undoneSingle"
                            label="未完成连带销售单项分值"
                            rules={[{ required: true, message: "请输入未完成连带销售单项分值" }]}
                            placeholder={"未完成连带销售单项分值: 80"}
                        />
                    </Col>
                </Row>

                <Row gutter={24}>
                    <Col span={8}>
                        <ProFormDigit
                            name="deduct"
                            label="货品扣分"
                            rules={[{ required: true, message: "请输入货品扣分" }]}
                            placeholder={"货品扣分: 10"}
                        />
                    </Col>
                    <Col span={8}>
                        <ProFormText
                            name="rate"
                            label="最终评级"
                            rules={[{ required: true, message: "请输入最终评级" }]}
                            placeholder={"最终评级: A"}
                        />
                    </Col>
                    <Col span={8}>
                        <ProFormDigit
                            name="bonus"
                            label="奖金"
                            min={-500}
                            max={500}
                            rules={[{ required: true, message: "请输入奖金" }]}
                            placeholder={"奖金: 100"}
                        />
                    </Col>
                </Row>
            </ProForm>
        </div>
    )
}
