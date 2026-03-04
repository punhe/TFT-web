import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Đăng ký tài khoản - PunheLabs | Punhe SQL Learning',
    description:
        'Tạo tài khoản miễn phí trên PunheLabs (PunheLab) by Punhe. Bắt đầu hành trình học SQL tương tác với trình soạn thảo mạnh mẽ, dữ liệu thực và hướng dẫn chi tiết.',
    openGraph: {
        title: 'Đăng ký miễn phí - PunheLabs | by Punhe',
        description:
            'Tạo tài khoản miễn phí và bắt đầu học SQL ngay với PunheLabs. Trình soạn thảo SQL tương tác do Punhe phát triển.',
        url: 'https://punhelabs.io.vn/register',
    },
    alternates: {
        canonical: '/register',
    },
}

export default function RegisterLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
