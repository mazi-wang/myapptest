import type { ProColumns } from "@ant-design/pro-components"
import type { OperationLog } from "@/entity"
import { Button, message } from "antd"

export const columns: ProColumns<OperationLog>[] = [
    {
        title: "编号",
        key: "id",
        fixed: "left",
        dataIndex: "id",
        width: 150,
        copyable: true,
        ellipsis: true,
    },
    {
        title: "操作者",
        key: "name",
        width: 150,
        dataIndex: "name",
        copyable: true,
        ellipsis: true,
    },
    {
        title: "操作路径",
        key: "path",
        width: 120,
        dataIndex: "path",
        copyable: true,
    },
    {
        title: "描述",
        key: "description",
        width: 150,
        dataIndex: "description",
        copyable: true,
    },
    {
        title: "参数",
        width: 120,
        key: "params",
        dataIndex: "params",
        copyable: true,
        sorter: true,
    },
    {
        title: "操作时间",
        width: 120,
        key: "gmtCreatedTime",
        dataIndex: "gmtCreatedTime",
        valueType: "date",
        sorter: true,
        hideInSearch: true,
    },
    {
        title: "创建时间",
        dataIndex: "gmtCreatedTime",
        valueType: "dateRange",
        hideInTable: true,
        search: {
            transform: (value) => {
                return {
                    createdStart: value[0],
                    createdEnd: value[1],
                }
            },
        },
    },
    {
        title: "操作",
        valueType: "option",
        key: "option",
        fixed: "right",
        render: (_, record) => {
            return [
                <Button
                    key="copy"
                    size={"small"}
                    onClick={() => {
                        let content = ""
                        for (const key in record) {
                            content += `${key}: ${record[key]}; `
                        }
                        console.log("复制内容：", content)
                        navigator.clipboard.writeText(content)
                        message.success("复制成功")
                    }}
                >
                    复制
                </Button>,
            ]
        },
    },
]
