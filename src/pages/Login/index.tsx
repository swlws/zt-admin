import { Button, Card, Form, Input, message } from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import { setToken, setUsername } from '../../utils/auth'
import './index.css'

type LoginForm = {
  username: string
  password: string
}

type LocationState = { from?: string } | null

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const [messageApi, contextHolder] = message.useMessage()

  const onFinish = (values: LoginForm) => {
    setToken(`mock-token-${Date.now()}`)
    setUsername(values.username)
    messageApi.success('登录成功')
    const from = (location.state as LocationState)?.from || '/home'
    navigate(from, { replace: true })
  }

  return (
    <div className="login-container">
      {contextHolder}
      <Card className="login-card" title="zt-admin 登录" variant="borderless">
        <Form<LoginForm>
          name="login"
          initialValues={{ username: 'admin', password: '123456' }}
          onFinish={onFinish}
          size="large"
          autoComplete="off"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="用户名" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Button type="primary" htmlType="submit" block>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
