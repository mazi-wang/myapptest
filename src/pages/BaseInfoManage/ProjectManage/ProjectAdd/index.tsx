import type { ProFormInstance } from "@ant-design/pro-components"
import { ProForm, ProFormText, ProFormDatePicker } from "@ant-design/pro-components"
import React, { useRef } from "react"
import { message } from "antd"
import { addProjectAPI } from "@/apis/project"
import type { FormProps } from "rc-field-form/lib/Form"

import moment from "moment"
import "moment/locale/zh-cn"
import { ConfigProvider } from "antd"
import zhCN from "antd/lib/locale/zh_CN"

moment.locale("zh-cn")

type ProjectFormProps = {
    name: string
    startTime: string
}

const UserAdd: React.FC = () => {
    const formRef = useRef<ProFormInstance>()

    /**
     * 提交员工数据
     * @param values
     */
    const onFinish: FormProps<ProjectFormProps>["onFinish"] = async (values) => {
        console.log("表单值为: ", values)

        const result = await addProjectAPI({
            ...values,
        })
        if (result.data) {
            message.success("提交成功")
        }
    }

    return (
        <div className="bg-gray-100 flex">
            <ConfigProvider locale={zhCN}>
                <ProForm<ProjectFormProps> layout="vertical" onFinish={onFinish} formRef={formRef}>
                    <ProFormText
                        width="md"
                        name="name"
                        label="项目名称"
                        placeholder="请输入项目名称"
                        rules={[
                            {
                                required: true,
                                message: "项目名称是必填项",
                            },
                        ]}
                    />

                    <ProFormDatePicker
                        name="startTime"
                        label="选择开始时间"
                        tooltip="请选择一个日期"
                        placeholder="请选择日期"
                    />
                </ProForm>
            </ConfigProvider>
        </div>
    )
}

export default UserAdd
