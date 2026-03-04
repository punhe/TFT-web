import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'PunheLabs - Interactive SQL Learning Platform',
        short_name: 'PunheLabs',
        description: 'PunheLabs by Punhe - Nền tảng học SQL tương tác miễn phí. Thực hành SQL trực tiếp trên trình duyệt với môi trường an toàn.',
        start_url: '/',
        display: 'standalone',
        background_color: '#0f172a',
        theme_color: '#7c3aed',
        orientation: 'portrait-primary',
        icons: [
            {
                src: '/assests/favicon.ico',
                sizes: '64x64',
                type: 'image/x-icon',
            },
        ],
        categories: ['education', 'developer-tools', 'productivity'],
        lang: 'vi',
    }
}
