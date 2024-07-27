import { ProFormSelect, type ProColumns } from "@ant-design/pro-components"
import { Button, message, Popconfirm } from "antd"
import { deleteUserProjectAPI } from "@/apis/project"
import { switchSelectFetchDebounce, switchSelectFetchFn } from "@/components/FormSelect"

type ArticleInfo = {
    articleCreatedTime: string
    articleId: string
    articleName: string
    id: string
    name: string
}

export const columns: () => ProColumns<ArticleInfo>[] = () => [
    {
        title: "用户名称",
        dataIndex: "id",
        key: "id",
        hideInTable: true,
        renderFormItem(schema, config, form, action) {
            return (
                <ProFormSelect
                    showSearch
                    debounceTime={300}
                    placeholder="请选择用户名称"
                    request={({ keyWords }) => {
                        return switchSelectFetchFn("user", keyWords)
                    }}
                />
            )
        },
    },
    {
        title: "用户编号",
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
        key: "articleName",
        width: 60,
        dataIndex: "articleName",
        copyable: true,
        ellipsis: true,
        hideInSearch: true,
    },

    {
        title: "用户名称",
        key: "name",
        width: 50,
        dataIndex: "name",
        copyable: true,
        ellipsis: true,
        hideInSearch: true,
    },

    {
        title: "创建时间",
        key: "articleCreatedTime",
        width: 100,
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
            <Popconfirm
                title="删除员工"
                key="delete"
                onConfirm={async () => {
                    const result = await deleteUserProjectAPI({
                        id: record.id,
                        articleId: record.articleId,
                    })
                    if (result.data) {
                        message.success("删除成功")
                        action?.reload()
                    } else {
                        message.error(result.message)
                    }
                }}
                okText="是的"
                cancelText="取消"
            >
                <Button size={"small"} type={"danger"}>
                    删除
                </Button>
            </Popconfirm>,
        ],
    },
]
