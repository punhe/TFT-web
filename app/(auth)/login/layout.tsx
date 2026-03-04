import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Đăng nhập - PunheLabs | Punhe SQL Learning',
    description:
        'Đăng nhập vào PunheLabs (PunheLab) by Punhe để truy cập trình soạn thảo SQL tương tác miễn phí. Thực hành SQL với SELECT, JOIN, GROUP BY ngay trên trình duyệt.',
    openGraph: {
        title: 'Đăng nhập - PunheLabs | by Punhe',
        description:
            'Đăng nhập để bắt đầu học SQL miễn phí trên PunheLabs. Nền tảng học SQL tương tác do Punhe phát triển.',
        url: 'https://punhelabs.io.vn/login',
    },
    alternates: {
        canonical: '/login',
    },
}

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
