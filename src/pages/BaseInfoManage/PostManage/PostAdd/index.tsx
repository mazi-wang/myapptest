import { ProFormText } from "@ant-design/pro-components"
import React from "react"

const UserAdd: React.FC = () => {
    /**
     * 提交员工数据
     * @param values
     */

    return (
        <ProFormText
            width="md"
            name="name"
            label="岗位名称"
            placeholder="岗位名称"
            rules={[
                {
                    required: true,
                    message: "岗位名称是必填项",
                },
            ]}
        />
    )
}

export default UserAdd
