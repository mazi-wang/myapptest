import { message, Modal } from "antd"
import type { ProFormInstance } from "@ant-design/pro-components"
import {
    ProForm,
    ProFormSelect,
    ProFormDependency,
    ProFormDigit,
    ProFormDatePicker,
} from "@ant-design/pro-components"
import type { Dispatch, SetStateAction } from "react"
import { useRef } from "react"
import type { FormProps } from "rc-field-form/lib/Form"
import { addCostAPI } from "@/apis/shop"
import type { EditConfigProps } from "@/type"
import "moment/locale/zh-cn"
import locale from "antd/es/date-picker/locale/zh_CN"

// 定义组件属性类型
type ModifyProps = {
    config: {
        modifyConfig: EditConfigProps
        setModifyConfig: Dispatch<SetStateAction<EditConfigProps>>
    }
    actionRef: any
    item: {
        allID: { sell_id: string; store_id: string; ditch_id: string }
    }
    setCostProps: Dispatch<
        SetStateAction<{ sellId: null | string; ditchId: null | string; refreshKey: string }>
    >
}

// 定义成本类型的枚举
enum costType {
    货品成本 = 1,
    推广成本 = 2,
    销售额 = 6,
}

// # 定义成本完成类型的枚举
enum CostTypeFinish {
    goodsCost = 1,
    promotionCost = 2,
    swipingCost = 3,
    laborCost = 4,
    outsourcingCost = 5,
    earning = 6,
}

// 获取 { label, value } 对象数组
const costTypeOptions = Object.entries(costType)
    .filter(([key, value]) => typeof value === "number") // 过滤掉反向映射
    .map(([key, value]) => ({ label: key, value: value as number }))

// 定义SellCost组件
export function SellCost(props: ModifyProps) {
    const formRef = useRef<ProFormInstance>()

    // 关闭模态框
    const onClose = () => {
        props.config.setModifyConfig({
            ...props.config.modifyConfig,
            isOpen: false,
        })
        formRef.current?.resetFields()
    }

    // 提交表单处理函数
    const onFinish: FormProps<{
        name: string
        allID: string
        type: number
        dateMonth: string
    }>["onFinish"] = async (values): Promise<boolean | void> => {
        const reqData = {
            ...props.item.allID,
            costType: values.type,
            costTime: values.dateMonth.split("-")[0] + "-" + values.dateMonth.split("-")[1],
            body: {},
        }

        if (values.type === CostTypeFinish.promotionCost) {
            reqData.body = { name: values.name, promotionCost: values.promotionCost }
        } else {
            reqData.body[CostTypeFinish[values.type]] = values.price
        }

        const result = await addCostAPI(reqData)
        if (result.data) {
            message.success(result.message)
            onClose()
            props.actionRef.current.reload()
            props.setCostProps((prev) => ({
                ...prev,
                refreshKey: Math.random().toString(36).slice(2),
            }))
        } else {
            message.error(result.message)
        }
    }

    return (
        <Modal
            open={props.config.modifyConfig.isOpen}
            title="添加成本与销售额"
            onOk={onClose}
            onCancel={onClose}
            footer={false}
        >
            <ProForm<{ id: string; name: string }>
                layout="vertical"
                onFinish={onFinish}
                formRef={formRef}
                initialValues={{ dateMonth: "2024-07" }}
            >
                <ProFormDatePicker.Month
                    name="dateMonth"
                    label="选择月份"
                    fieldProps={{
                        locale,
                        format: "YYYY-MM",
                    }}
                />

                <ProFormSelect
                    name="type"
                    label="添加类型"
                    options={costTypeOptions}
                    placeholder="请选择添加类型"
                />
                <ProFormDependency name={["type"]}>
                    {({ type }) => {
                        switch (type) {
                            case 1:
                            case 3:
                            case 6:
                                return (
                                    <ProFormDigit
                                        name="price"
                                        label={`${costType[type]}金额`}
                                        placeholder="请输入成本价格"
                                        rules={[{ required: true, message: "金额不能为空" }]}
                                    />
                                )
                            case 2:
                                return (
                                    <>
                                        <ProFormSelect
                                            name="name"
                                            label="成本名称"
                                            placeholder="请输入推广成本名称"
                                            rules={[
                                                { required: true, message: "成本名称不能为空" },
                                            ]}
                                            options={[
                                                { label: "直通车", value: "直通车" },
                                                { label: "引力魔方", value: "引力魔方" },
                                                { label: "万相台", value: "万相台" },
                                                { label: "淘客", value: "淘客" },
                                            ]}
                                        />
                                        <ProFormDigit
                                            name="promotionCost"
                                            label="成本金额"
                                            placeholder="请输入成本金额"
                                            rules={[
                                                { required: true, message: "成本价格不能金额" },
                                            ]}
                                        />
                                    </>
                                )
                            default:
                                return null
                        }
                    }}
                </ProFormDependency>
            </ProForm>
        </Modal>
    )
}
