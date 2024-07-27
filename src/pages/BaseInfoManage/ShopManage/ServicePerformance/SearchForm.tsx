import React from "react"
import { Form, Input, Button } from "antd"

interface SearchFormProps {
  onSearch: (values: any) => void
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch }) => {
  const [form] = Form.useForm()

  const handleSearch = () => {
    form.validateFields().then((values) => {
      onSearch(values)
    })
  }

  return (
    <Form form={form} layout="inline" onFinish={handleSearch}>
      <Form.Item name="userId" label="用户ID">
        <Input placeholder="请输入用户ID" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          查询
        </Button>
      </Form.Item>
    </Form>
  )
}

export default SearchForm
