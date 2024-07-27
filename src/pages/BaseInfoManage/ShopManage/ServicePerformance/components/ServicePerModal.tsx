import { message, Modal, Row, Col, ConfigProvider, Button, Input } from "antd"
import type { ProColumns, ProFormInstance } from "@ant-design/pro-components"
import {
    ProForm,
    ProFormText,
    ProFormDigit,
    ProFormDatePicker,
    ProFormSelect,
    EditableProTable,
} from "@ant-design/pro-components"
import type { Dispatch, SetStateAction } from "react"
import React, { useRef, useState } from "react"
import type { FormProps } from "rc-field-form/lib/Form"

import zhCN from "antd/es/locale/zh_CN"
import moment from "moment"
import "moment/locale/zh-cn"
import dayjs from "dayjs"

import { putServiceListAPI, addServiceListAPI } from "@/apis/shop"
import { MyFormSelect, switchSelectNameFetchFn } from "@/components/FormSelect"
import { debounce } from "lodash"

moment.locale("zh-cn")

export interface ServicePutTable {
    id: string
    userId: string
    storeName: string
    actualValue: number
    refundValue: number
    serviceTime: string
}

type ServiceIndexModal = {
    config: {
        modifyConfig: {
            data: ServicePutTable
            isOpen: boolean
            isLoading: boolean
            type: string
        }
        setModifyConfig: Dispatch<
            SetStateAction<{ data: ServicePutTable | null; isOpen: boolean; isLoading: boolean }>
        >
    }
    actionRef: React.MutableRefObject<any>
}

interface DataSourceType {
    id: number
    storeName: string
    serviceTime: string
    actualValue: number
    refundValue: number
}

const columns: ProColumns<DataSourceType>[] = [
    {
        title: "店铺名称",
        dataIndex: "storeName",
        width: "30%",
        valueType: "select",
        request: (params) => switchSelectNameFetchFn("store", params.keyWords),
        debounceTime: 500,

        fieldProps: { showSearch: true, filterOption: false },
    },
    {
        title: "绩效月份",
        dataIndex: "serviceTime",
        width: "15%",
        valueType: "dateMonth",
    },
    {
        title: "实销金额",
        dataIndex: "actualValue",
        width: "20%",
        fieldProps: {
            type: "number", // 确保输入框只接受数字
        },
    },
    {
        title: "退款金额",
        dataIndex: "refundValue",
        width: "20%",
        fieldProps: {
            type: "number", // 确保输入框只接受数字
        },
    },
    {
        title: "操作",
        valueType: "option",
    },
]

export function EditPerformanceModal(props: ServiceIndexModal) {
    const { type } = props.config.modifyConfig
    const formRef = useRef<ProFormInstance<ServicePutTable>>(null)
    const [editableKeys, setEditableRowKeys] = useState<React.Key[]>()

    const handleFinish: FormProps<ServicePutTable>["onFinish"] = async (
        values: ServicePutTable
    ): Promise<boolean | void> => {
        const { id, userId } = props.config.modifyConfig.data

        const result = await putServiceListAPI({
            ...values,
            id,
            userId,
        })
        if (result.data) {
            message.success(result.message)
            formRef.current?.resetFields()
            props.actionRef.current?.reload()
            props.config.setModifyConfig((modifyConfig) => ({
                ...modifyConfig,
                isOpen: false,
            }))
        } else {
            message.error(result.message)
        }
    }

    let time = dayjs(new Date()).format("YYYY-MM")
    if (props.config.modifyConfig.data) {
        time = dayjs(new Date(props.config.modifyConfig.data.serviceTime)).format("YYYY-MM")
    }

    async function handleFinishRequest(formData: ServicePutTable[]) {
        const result = await addServiceListAPI(formData)

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
                open={props.config.modifyConfig.isOpen}
                title={type === "add" ? "添加客服绩效" : "编辑客服绩效"}
                onCancel={() => {
                    props.config.setModifyConfig({
                        ...props.config.modifyConfig,
                        isOpen: false,
                    })
                }}
                footer={null}
                width={1000} // 设置Modal的宽度
            >
                {type === "edit" ? (
                    <ServiceIndexForm
                        formData={
                            type === "edit"
                                ? {
                                      ...props.config.modifyConfig.data,
                                      serviceTime: time,
                                  }
                                : {
                                      serviceTime: dayjs(new Date()).format("YYYY-MM"),
                                  }
                        }
                        handleFinish={handleFinish}
                        formRef={formRef}
                        type={props.config.modifyConfig.type}
                    />
                ) : (
                    <div>
                        <ProForm
                            onFinish={async (values) => {
                                const formData = values.dataSource.map((item: DataSourceType) => {
                                    const { id, ...rest } = item
                                    return { ...rest, userId: values.userId }
                                })

                                await handleFinishRequest(formData)
                            }}
                        >
                            <MyFormSelect name="userId" label="选择用户" type="user" />
                            <ProForm.Item
                                label="添加客服负责店铺数据"
                                name="dataSource"
                                trigger="onValuesChange"
                            >
                                <EditableProTable<{
                                    serviceDate: string
                                    storeName: string
                                    actualValue: number
                                    refundValue: number
                                }>
                                    rowKey="id"
                                    toolBarRender={false}
                                    columns={columns}
                                    recordCreatorProps={{
                                        newRecordType: "dataSource",
                                        position: "top",
                                        record: () => ({
                                            id: Date.now(),
                                            serviceTime: dayjs(new Date()).format("YYYY-MM"),
                                        }),
                                    }}
                                    editable={{
                                        type: "multiple",
                                        editableKeys,
                                        onChange: setEditableRowKeys,
                                        actionRender: (row, _, dom) => {
                                            return [dom.delete]
                                        },
                                    }}
                                />
                            </ProForm.Item>
                        </ProForm>
                    </div>
                )}
            </Modal>
        </ConfigProvider>
    )
}

interface ServiceIndexFormProps {
    formData: ServicePutTable
    handleFinish: (
        values: ServicePutTable,
        formRef: React.RefObject<ProFormInstance<ServicePutTable>>
    ) => void
    formRef: React.RefObject<ProFormInstance<ServicePutTable>>
    type?: string
}

export function ServiceIndexForm({ formData, handleFinish, formRef, type }: ServiceIndexFormProps) {
    return (
        <ProForm<ServicePutTable>
            layout="vertical"
            onFinish={(values) => handleFinish(values, formRef)}
            formRef={formRef}
            initialValues={formData}
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
                        <ProFormText name="id" label="客服指标ID" fieldProps={{ disabled: true }} />
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
                        name="serviceTime"
                        label="选择月份"
                        fieldProps={{ format: "YYYY-MM" }}
                        rules={[{ required: true, message: "请选择指标完成月份" }]}
                    />
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={12}>
                    <ProFormSelect
                        name="storeName"
                        label="店铺名称"
                        request={async (values) =>
                            await switchSelectNameFetchFn("store", values.keyWords)
                        }
                        placeholder="输入店铺名称"
                        rules={[{ required: true, message: "请输入店铺名称" }]}
                        fieldProps={{
                            showSearch: true,
                            filterOption: false,
                            style: {
                                minWidth: 140,
                            },
                        }}
                        debounceTime={300}
                    />
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={8}>
                    <ProFormDigit
                        name="actualValue"
                        label="实销金额"
                        rules={[{ required: true, message: "请输入实销金额" }]}
                    />
                </Col>
                <Col span={8}>
                    <ProFormDigit
                        name="refundValue"
                        label="退款金额"
                        rules={[{ required: true, message: "请输入退款金额" }]}
                    />
                </Col>
            </Row>
        </ProForm>
    )
}
