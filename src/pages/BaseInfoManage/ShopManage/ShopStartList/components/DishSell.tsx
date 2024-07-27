import { message, Modal } from "antd"
import type { ProFormInstance } from "@ant-design/pro-components"
import { ProForm, ProFormText, ProFormSelect } from "@ant-design/pro-components"
import type { Dispatch, SetStateAction } from "react"
import { useRef } from "react"
import type { FormProps } from "rc-field-form/lib/Form"
import { addSellDitchListAPI } from "@/apis/shop"
import type { EditConfigProps } from "@/type"
import { MyFormSelect } from "@/components/FormSelect"

type ModifyProps = {
    config: {
        modifyConfig: EditConfigProps
        setModifyConfig: Dispatch<SetStateAction<EditConfigProps>>
    }

    actionRef: any
    item: {
        id: string
    }
}

export function DishSell(props: ModifyProps) {
    const formRef = useRef<ProFormInstance>()

    const onClose = () => {
        props.config.setModifyConfig({
            ...props.config.modifyConfig,
            isOpen: false,
        })
        formRef.current?.resetFields()
    }

    /**
     * 修改店
     * @param values
     */
    const onFinish: FormProps<{ sellId: string; id: string }>["onFinish"] = async (
        values
    ): Promise<boolean | void> => {
        // console.log(values)

        const result = await addSellDitchListAPI(props.item.id, values.sellId)
        if (result.data) {
            message.success(result.message)
            onClose()
            props.actionRef.current.reset()
        }
    }

    return (
        <Modal
            open={props.config.modifyConfig.isOpen}
            title="添加渠道平台"
            onOk={() => onClose()}
            onCancel={() => onClose()}
            footer={false}
        >
            <ProForm<{ id: string; name: string }>
                layout="vertical"
                onFinish={onFinish}
                formRef={formRef}
            >
                <ProFormText
                    name="ditchId"
                    width="md"
                    label="渠道ID"
                    fieldProps={{
                        disabled: true,
                        value: props.item.id,
                    }}
                />
                <MyFormSelect label="选择平台" name="sellId" type="sell" />
            </ProForm>
        </Modal>
    )
}
