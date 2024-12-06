import { Button, Result } from 'antd'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const NotFound = () => {
    const navigate = useNavigate()
    return (
        <main className='min-h-screen flex flex-col justify-center items-center'>
            <Result
                status="404"
                title="404"
                subTitle="Trang bạn tìm kiếm không tồn tại"
                extra={<Button type="primary" onClick={() => navigate("/")}>Trở về Trang Chủ</Button>}
            />
        </main>
    )
}

export default NotFound