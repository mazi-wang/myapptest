import type {EditConfigProps} from "@/type";
import type {Dispatch, SetStateAction} from "react";
import React, {useEffect, useRef, useState} from "react";
import type {Interface, InterfaceGroup} from "@/entity";
import {Checkbox, message, Modal} from "antd";
import {ProForm, ProFormInstance, ProFormText} from "@ant-design/pro-components";
import type {FormProps} from "rc-field-form/lib/Form";
import {modifyInterfaceGroup} from "@/apis/interface-group";
import {getInterfaceList} from "@/cache/interface";

type GroupEditProps = {
    config: {
        editConfig: EditConfigProps
        setEditConfig: Dispatch<SetStateAction<EditConfigProps>>
    }
    item: {
        key: string
        title: string
        children: Interface[]
    }
}

export default function GroupEditModal(props: GroupEditProps) {
    const [interfaceCheckedIdList, setInterfaceCheckedIdList] = useState<string[]>(props.item?.children?.map(inter => inter.id))
    const [interfaceList, setInterfaceList] = useState<{ label: string, value: string }[]>([])
    const formRef = useRef<ProFormInstance>()
    useEffect(() => {
        formRef.current?.resetFields()
    }, [props.item])

    /**
     * 修改接口分组数据
     * @param values
     */
    const onFinish: FormProps<InterfaceGroup>["onFinish"] = async (values): Promise<boolean | void> => {
        console.log("form: ", values)

        const result = await modifyInterfaceGroup({
            id: props.item.key,
            name: values.name,
            interfaceIdList: interfaceCheckedIdList
        })
        if (result.data) {
            message.success(result.message)
            props.config.setEditConfig({
                ...props.config.editConfig,
                isOpen: false,
            })
        }
    }

    const onInterfaceChange = (interfaceIdList) => {
        setInterfaceCheckedIdList(interfaceIdList)
    }

    useEffect(() => {
        ;(async function () {
            const interResult = await getInterfaceList([])
            setInterfaceList(interResult.list.map(inter => ({label: inter.name + "-" + inter.path, value: inter.id})))
        })()
    }, []);

    return (
        <Modal
            width={800}
            open={props.config.editConfig.isOpen}
            title="编辑接口分组信息"
            onOk={() => {
                props.config.setEditConfig({
                    ...props.config.editConfig,
                    isOpen: false,
                })
            }}
            onCancel={() => {
                props.config.setEditConfig({
                    ...props.config.editConfig,
                    isOpen: false,
                })
            }}
            footer={false}
        >
            <ProForm<InterfaceGroup> layout="vertical" onFinish={onFinish} formRef={formRef}>
                <ProFormText
                    name="name"
                    width="md"
                    label="分组名称"
                    initialValue={props.item.title}
                    rules={[
                        {
                            required: true,
                            message: "请输入分组名称",
                        },
                    ]}
                />
                <div
                    style={{
                        border: "1px solid #ccc",
                        padding: "10px",
                        marginBottom: "10px"
                    }}
                >
                    <Checkbox.Group
                        options={interfaceList}
                        defaultValue={interfaceCheckedIdList}
                        onChange={onInterfaceChange}
                        className="interface-id"
                        style={{
                            display: "grid",
                            gridRowGap: 5,
                            gridTemplateColumns: "repeat(3, 1fr)"
                        }}
                    />
                </div>
            </ProForm>
        </Modal>
    )
}
