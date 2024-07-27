import { ProForm, ProFormDigit, ProFormSelect, ProFormText } from "@ant-design/pro-components"
import { message, Modal } from "antd"
import { modifyUser } from "@/apis/user"

export default function EditModifyModal(props) {
    return (
        <Modal
            open={props.config.modifyConfig.isOpen}
            title="编辑员工信息"
            onOk={() => {
                props.config.setModifyConfig({
                    ...props.config.modifyConfig,
                    isOpen: false,
                })
            }}
            onCancel={() => {
                props.config.setModifyConfig({
                    ...props.config.modifyConfig,
                    isOpen: false,
                })
            }}
            footer={false}
        >
            <ProForm
                onFinish={async (values) => {
                    const res = await modifyUser(values)
                    // console.log(values)
                    if (res.data) {
                        message.success("提交成功")
                        props.config.setModifyConfig({
                            ...props.config.modifyConfig,
                            isOpen: false,
                        })
                        props.actionRef.current?.reload()
                    }
                }}
                initialValues={props.config.modifyConfig.data}
            >
                <ProFormText
                    width="md"
                    name="id"
                    label="员工编号"
                    placeholder="请输入名称"
                    disabled={true}
                />
                <ProFormText
                    width="md"
                    name="username"
                    label="员工登录名"
                    tooltip="最长为 24 位"
                    placeholder="请输入名称"
                />
                <ProFormText
                    width="md"
                    name="name"
                    label="姓名"
                    tooltip="最长为 24 位"
                    placeholder="请输入名称"
                />
                <ProFormSelect
                    width="md"
                    name="gender"
                    request={async () => [
                        { label: "男", value: 1 },
                        { label: "女", value: 0 },
                    ]}
                    initialValue={1}
                    label="性别"
                />
                <ProFormDigit
                    width="md"
                    name="age"
                    label="年龄"
                    tooltip="最长为 24 位"
                    placeholder="请输入名称"
                />
            </ProForm>
        </Modal>
    )
}
