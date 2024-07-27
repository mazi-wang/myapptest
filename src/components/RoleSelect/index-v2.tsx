import { useEffect, useState } from "react"
import { message, Pagination } from "antd"
import type { PageReq, PageRes } from "@/type"
import type { RoleListRes } from "@/apis/role"
import { ProFormSelect } from "@ant-design/pro-components"

import { listPostAPI } from "@/apis/post"

export default function RoleSelect() {
    const [rolePage, setRolePage] = useState<{
        req: PageReq<string>
        res: PageRes<RoleListRes>
    }>({
        req: {
            current: 1,
            pageSize: 5,
            data: { name: "" },
        },
        res: {
            current: 1,
            pageSize: 5,
            total: 0,
            data: [],
        },
    })

    const [options, setOptions] = useState<{ label: string; value: string }[]>([])

    useEffect(() => {
        setOptions(() => {
            return rolePage.res.data.map((item) => ({
                label: item.name,
                value: item.id,
            }))
        })
    }, [rolePage.res.data])

    return (
        <ProFormSelect
            name="roleIdList"
            width="md"
            label="角色名称"
            debounceTime={500}
            placeholder="请输入你想搜索的角色名称"
            showSearch={true}
            options={options}
            request={async ({ keyWords = "" }) => {
                const result = await listPostAPI({
                    ...rolePage.req,
                    data: { name: keyWords },
                })
                console.log("role-result: ", result)
                if (result.data) {
                    setRolePage({
                        ...rolePage,
                        res: result.data,
                    })
                    return result.data.data.map((item) => ({
                        label: item.name,
                        value: item.id,
                    }))
                }
                return []
            }}
            fieldProps={{
                mode: "multiple",
                dropdownRender: (menu) => {
                    console.log("menu: ", menu)

                    return (
                        <>
                            {menu}
                            <div className="flex-center">
                                <Pagination
                                    size="small"
                                    defaultPageSize={5}
                                    showTotal={(total) => `共 ${total} 条`}
                                    hideOnSinglePage={true}
                                    total={rolePage.res.total}
                                    onChange={async (page, pageSize) => {
                                        const result = await listPostAPI({
                                            current: page,
                                            pageSize,
                                        })
                                        console.log("page-change-result: ", result)
                                        if (result.data) {
                                            setRolePage({
                                                ...rolePage,
                                                res: result.data,
                                            })
                                        } else {
                                            message.error("获取角色失败")
                                        }
                                    }}
                                />
                            </div>
                        </>
                    )
                },
            }}
            rules={[
                {
                    required: true,
                    message: "请选择角色类别",
                },
            ]}
        />
    )
}
