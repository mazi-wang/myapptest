import type { Dispatch, SetStateAction } from "react"
import { ProFormSelect, type ProColumns } from "@ant-design/pro-components"
import { Button, Input, message, Popconfirm } from "antd"
import { deleteProjectAPI } from "@/apis/project"
import { switchSelectFetchDebounce, switchSelectFetchFn } from "@/components/FormSelect"

type ModifyProps = { isOpen: boolean; id: string; name: string; startTime: string }

type ProTaleType = {
    id: string
    name: string
    articleCreatedTime: string
}

function debounce(func: Function, wait: number) {
    let timeout: ReturnType<typeof setTimeout> | null = null
    return function (...args: any[]) {
        if (timeout !== null) {
            clearTimeout(timeout)
        }
        timeout = setTimeout(() => func.apply(this, args), wait)
    }
}

const AddUseConfigBtn = ({
    setAddUserConfig,
    id,
}: {
    setAddUserConfig: Dispatch<SetStateAction<ModifyProps>>
    id: string
}) => {
    const handleOnOpen = () => {
        setAddUserConfig((prevConfig) => ({
            ...prevConfig,
            isOpen: true,
            id,
        }))
    }

    return (
        <Button onClick={handleOnOpen} key={"addUserConfig"} type="link">
            项目添加用户
        </Button>
    )
}
export const columns: (
    modifyPwdConfig: ModifyProps,
    setModifyPwdConfig: Dispatch<SetStateAction<ModifyProps>>,
    setAddUserConfig: Dispatch<SetStateAction<ModifyProps>>
) => ProColumns<ProTaleType>[] = (modifyPwdConfig, setModifyPwdConfig, setAddUserConfig) => [
    {
        title: "项目名称",
        key: "id",
        dataIndex: "id",
        hideInTable: true,
        renderFormItem(schema, config, form, action) {
            return (
                <ProFormSelect
                    showSearch
                    debounceTime={300}
                    placeholder="请输入项目名称"
                    request={({ keyWords }) => {
                        return switchSelectFetchFn("article", keyWords)
                    }}
                />
            )
        },
    },
    {
        title: "项目编号",
        key: "id",
        fixed: "left",
        dataIndex: "id",
        width: 50,
        copyable: true,
        ellipsis: true,
        hideInSearch: true,
    },
    {
        title: "项目名称",
        key: "name",
        width: 150,
        dataIndex: "name",
        copyable: true,
        ellipsis: true,
        hideInSearch: true,
    },
    {
        title: "开始时间",
        key: "articleCreatedTime",
        width: 150,
        dataIndex: "articleCreatedTime",
        copyable: true,
        ellipsis: true,
        hideInSearch: true,
    },

    {
        title: "操作",
        valueType: "option",
        key: "option",
        width: 100,
        render: (dom, record, _, action) => [
            <AddUseConfigBtn
                setAddUserConfig={setAddUserConfig}
                id={record.id}
                key={"addConfig"}
            />,
            <Button
                key="modifyPwd"
                type="primary"
                size={"small"}
                onClick={() => {
                    setModifyPwdConfig({
                        ...modifyPwdConfig,
                        id: record.id,
                        name: record.name,
                        startTime: record.articleCreatedTime,
                        isOpen: true,
                    })
                }}
            >
                修改项目
            </Button>,
            <Popconfirm
                key="delete"
                title="删除员工"
                description="此操作是不可逆的，确定删除吗？"
                onConfirm={async () => {
                    const result = await deleteProjectAPI(record.id)
                    if (result.data) {
                        message.success(result.message)
                        action?.reload()
                    } else {
                        message.error(result.message)
                    }
                }}
                okText="是的"
                cancelText="取消"
            >
                <Button type="primary" danger>
                    删除
                </Button>
            </Popconfirm>,
        ],
    },
]
