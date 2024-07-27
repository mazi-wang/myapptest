import { message, Modal, Row, Col, ConfigProvider, Button } from "antd"
import type { ActionType, ProFormInstance } from "@ant-design/pro-components"
import { ProForm, ProFormText, ProFormDigit, ProFormDatePicker } from "@ant-design/pro-components"

import React, { useEffect, useRef, useState } from "react"
import type { FormProps } from "rc-field-form/lib/Form"

import zhCN from "antd/es/locale/zh_CN"
import moment from "moment"
import "moment/locale/zh-cn"

import { putPayAPI, getUserLeaveDaysAPI, getPayListAPI, addPayAPI } from "@/apis/pay"
import type { ModalConfig, ChangeModalFn } from "./usePay"
import type { EmployeeCompensation, AddEmployeeCompensation } from "@/apis/pay"
import styles from "./pay.module.css"
import { MyFormSelect } from "@/components/FormSelect"
import dayjs from "dayjs"

moment.locale("zh-cn")

type ServiceIndexModal = {
    config: {
        modifyConfig: ModalConfig
        changeModal: ChangeModalFn
    }
    actionRef: React.MutableRefObject<ActionType | undefined>
}

export function EditPayModal(props: ServiceIndexModal) {
    const formRef = useRef<ProFormInstance<EmployeeCompensation>>(null)

    const handleEditFinish: FormProps<EmployeeCompensation>["onFinish"] = async (
        values: EmployeeCompensation
    ): Promise<boolean | void> => {
        const { id, userId } = props.config.modifyConfig.data
        const result = await putPayAPI({
            ...values,
            id,
            userId,
        })
        if (result.data) {
            message.success(result.message)
            formRef.current?.resetFields()
            props.config.changeModal({ isOpen: false, isLoading: false, type: "edit", data: {} })
            props.actionRef.current?.reload()
        } else {
            message.error(result.message)
        }
    }

    // * This function is used to handle the form submission
    async function handleAddFinish(values: EmployeeCompensation) {
        // const { userId, grantTime } = values
        // console.log("values", values)

        const result = await addPayAPI(values)

        if (result.code === 200) {
            message.success("添加成功")
            formRef.current?.resetFields()
            props.actionRef.current?.reload()
            props.config.changeModal({ isOpen: false, isLoading: false, type: "add", data: {} })
        }
    }

    return (
        <ConfigProvider locale={zhCN}>
            <Modal
                key={props.config.modifyConfig.data?.id}
                open={props.config.modifyConfig.isOpen}
                title={props.config.modifyConfig.type === "add" ? "添加员工工资" : "编辑员工工资"}
                onCancel={() => {
                    props.config.changeModal({
                        isOpen: false,
                        isLoading: false,
                        type: props.config.modifyConfig.type,
                    })
                }}
                footer={null}
                width={800} // 设置Modal的宽度
            >
                <PayIndexForm
                    formData={{
                        ...props.config.modifyConfig.data,
                    }}
                    handleFinish={
                        props.config.modifyConfig.type === "edit"
                            ? handleEditFinish
                            : handleAddFinish
                    }
                    formRef={formRef}
                    type={props.config.modifyConfig.type}
                />
            </Modal>
        </ConfigProvider>
    )
}

interface ServiceIndexFormProps {
    formData: AddEmployeeCompensation
    handleFinish: (
        values: EmployeeCompensation,
        formRef: React.RefObject<ProFormInstance<EmployeeCompensation>>
    ) => void
    formRef: React.RefObject<ProFormInstance<EmployeeCompensation>>
    type?: string
    actionRef: React.MutableRefObject<ActionType | undefined>
}

export function PayIndexForm({
    formData,
    handleFinish,
    formRef,
    type,
    actionRef,
}: ServiceIndexFormProps) {
    const [selectedDate, setSelectedDate] = useState<string>(function () {
        const { grantTime: _grantTime } = formData
        return _grantTime || dayjs().format("YYYY-MM")
    })
    const [userOption, setUserOption] = useState<{ label: string; value: string }>()

    function handleOnChangCallBack(name: { label: string; value: string }) {
        if (name) setUserOption(name)
    }

    const handleTimeOnChange = (_, dateString) => {
        setSelectedDate(dateString)
        message.success(`已选择发工资月份: ${dateString}`)
    }

    useEffect(
        function () {
            async function fetchLeaveDays(
                month_year: string,
                _userOption: { label: string; value: string }
            ) {
                const { value: id, label: name } = _userOption

                const result = await getUserLeaveDaysAPI({
                    month_year: month_year.split("-").at(-1),
                    name,
                })

                const userSpecialBonusResult = await getPayListAPI({
                    current: 1,
                    pageSize: 10,
                    data: {
                        userId: id,
                        date: dayjs(month_year).subtract(1, "month").format("YYYY-MM"),
                    },
                })
                // specialBonus allowance
                if (userSpecialBonusResult.code == 200 && userSpecialBonusResult.data) {
                    message.success("获取用户特殊奖金成功")
                    formRef.current?.setFieldsValue({
                        basicWage: userSpecialBonusResult.data.data[0].basicWage,
                        specialBonus: userSpecialBonusResult.data.data[0].specialBonus,
                        allowance: userSpecialBonusResult.data.data[0].allowance,
                    })
                }
                if (result.code === 200 && result.data) {
                    formRef.current?.setFieldsValue({
                        // leaveDays: result.data.leaveDays || 0,
                        late: result.data.calculatedLateCount || 0,
                    })
                }
            }
            if (userOption && type === "add") fetchLeaveDays(selectedDate, userOption)
        },
        [selectedDate, userOption, formRef, type]
    )

    return (
        <div className={styles.tableStyle}>
            <ProForm<EmployeeCompensation>
                layout="vertical"
                onFinish={async (values) => {
                    handleFinish(values, formRef, actionRef)
                }}
                formRef={formRef}
                initialValues={{ ...formData }} // 设置表单的初始值
                grid={true}
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
                {type === "add" ? null : (
                    <ProFormText
                        name="id"
                        label="工资ID"
                        placeholder="请输入ID"
                        disabled={type === "add" ? false : true}
                        colProps={{ span: 12 }}
                    />
                )}
                {type === "add" ? (
                    <MyFormSelect
                        name="userId"
                        label="选择用户"
                        type="user"
                        onChangeCallBack={handleOnChangCallBack}
                    />
                ) : (
                    <ProFormText
                        name="userId"
                        label="用户ID"
                        placeholder="请输入用户ID"
                        disabled={type === "add" ? false : true}
                        colProps={{ span: 12 }}
                    />
                )}
                <ProFormDatePicker.Month
                    name="grantTime"
                    label="发工资月份"
                    rules={[{ required: true, message: "请选择发工资时间" }]}
                    colProps={{ span: 8 }}
                    dataFormat="YYYY-MM"
                    fieldProps={{
                        format: "YYYY-MM",
                        onChange: handleTimeOnChange,
                    }}
                />
                <ProFormDigit
                    name="basicWage"
                    label="基本工资"
                    placeholder="请输入基本工资"
                    colProps={{ span: 12 }}
                />
                {type === "add" ? null : (
                    <ProFormDigit
                        name="allDay"
                        label="全勤奖金"
                        placeholder="请输入全勤奖金"
                        colProps={{ span: 8 }}
                    />
                )}
                <ProFormText
                    name="rate"
                    label="月末评级"
                    placeholder="月末评级：A"
                    colProps={{ span: 8 }}
                    initialValue={""}
                />
                <ProFormDigit
                    name="rateBonus"
                    label="评级奖金"
                    placeholder="请输入评级奖金"
                    colProps={{ span: 6 }}
                    initialValue={0}
                />
                <ProFormDigit
                    name="specialBonus"
                    label="特殊奖金"
                    placeholder="请输入特别奖金"
                    colProps={{ span: 12 }}
                    initialValue={0}
                />
                <ProFormDigit
                    name="allowance"
                    label="特殊津贴"
                    placeholder="请输入津贴"
                    colProps={{ span: 12 }}
                    initialValue={0}
                />
                <ProFormDigit
                    name="leaveDays"
                    label="请假天数"
                    placeholder="请输入请假天数"
                    colProps={{ span: 12 }}
                    initialValue={0}
                    disabled={type === "add" ? false : true}
                    min={-30}
                    max={30}
                    rules={[{ type: "number", message: "请输入数字" }]}
                />
                <ProForm.Group>
                    {type === "add" ? null : (
                        <ProFormDigit
                            name="deduct"
                            label="请假扣除"
                            placeholder="请输入扣除金额"
                            colProps={{ span: 8 }}
                            initialValue={0}
                            disabled={true}
                        />
                    )}
                    <ProFormDigit
                        name="late"
                        label="迟到次数"
                        placeholder="请输入迟到次数"
                        colProps={{ span: 8 }}
                        initialValue={0}
                        disabled={true}
                    />
                    {type === "add" ? null : (
                        <ProFormDigit
                            name="assessDel"
                            label="考核扣除"
                            placeholder="请输入考核扣除金额"
                            colProps={{ span: 8 }}
                            disabled={true}
                        />
                    )}
                </ProForm.Group>
            </ProForm>
        </div>
    )
}
