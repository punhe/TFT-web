import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'SQL Editor - Trình soạn thảo SQL tương tác | PunheLabs by Punhe',
    description:
        'Trình soạn thảo SQL tương tác trực tuyến miễn phí từ PunheLabs (PunheLab) by Punhe. Thực hành SELECT, INSERT, UPDATE, DELETE, JOIN, GROUP BY với dữ liệu thực. Hỗ trợ PostgreSQL.',
    openGraph: {
        title: 'SQL Editor - PunheLabs | Interactive SQL Practice by Punhe',
        description:
            'Thực hành SQL trực tiếp trên trình duyệt với PunheLabs SQL Editor. Miễn phí, không cần cài đặt.',
        url: 'https://punhelabs.io.vn/sql-editor',
    },
    alternates: {
        canonical: '/sql-editor',
    },
}

export default function SqlEditorLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
