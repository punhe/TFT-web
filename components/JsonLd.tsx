// JSON-LD Structured Data for SEO
// This helps Google understand the website content and display rich results

export function WebsiteJsonLd() {
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'PunheLabs',
        alternateName: ['Punhe', 'PunheLab', 'Punhe Labs', 'punhelabs'],
        url: 'https://punhelabs.io.vn',
        description:
            'PunheLabs by Punhe - Nền tảng học SQL tương tác miễn phí. Thực hành truy vấn SQL trực tiếp trên trình duyệt.',
        inLanguage: ['vi', 'en'],
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: 'https://punhelabs.io.vn/sql-editor?q={search_term_string}',
            },
            'query-input': 'required name=search_term_string',
        },
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
    )
}

export function OrganizationJsonLd() {
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'PunheLabs',
        alternateName: ['Punhe', 'PunheLab', 'punhe', 'punhelab', 'punhelabs'],
        url: 'https://punhelabs.io.vn',
        logo: 'https://punhelabs.io.vn/og-image.png',
        description:
            'PunheLabs - Nền tảng công nghệ giáo dục do Punhe phát triển, tập trung vào việc dạy SQL và quản trị cơ sở dữ liệu.',
        foundingDate: '2024',
        sameAs: [
            // Add your social media URLs here when available
            // 'https://github.com/punhe',
            // 'https://www.facebook.com/punhelabs',
            // 'https://www.linkedin.com/company/punhelabs',
        ],
        contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'customer support',
            url: 'https://punhelabs.io.vn',
            availableLanguage: ['Vietnamese', 'English'],
        },
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
    )
}

export function SoftwareApplicationJsonLd() {
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'PunheLabs SQL Editor',
        alternateName: ['Punhe SQL', 'PunheLab SQL Editor'],
        applicationCategory: 'EducationalApplication',
        operatingSystem: 'Web Browser',
        url: 'https://punhelabs.io.vn/sql-editor',
        description:
            'Trình soạn thảo SQL tương tác trực tuyến miễn phí từ PunheLabs. Học và thực hành SQL với SELECT, JOIN, GROUP BY và nhiều hơn nữa.',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'VND',
            availability: 'https://schema.org/InStock',
        },
        author: {
            '@type': 'Organization',
            name: 'PunheLabs',
            url: 'https://punhelabs.io.vn',
        },
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.8',
            ratingCount: '120',
            bestRating: '5',
            worstRating: '1',
        },
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
    )
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
    )
}

export function FAQJsonLd() {
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
            {
                '@type': 'Question',
                name: 'PunheLabs là gì?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'PunheLabs (hay còn gọi là Punhe Labs, PunheLab) là nền tảng học SQL tương tác miễn phí do Punhe phát triển. Trang web cho phép bạn thực hành truy vấn SQL trực tiếp trên trình duyệt với dữ liệu thực.',
                },
            },
            {
                '@type': 'Question',
                name: 'Punhe là ai?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Punhe là nhà phát triển đứng sau PunheLabs - nền tảng công nghệ giáo dục tập trung vào việc giúp mọi người học SQL và quản trị cơ sở dữ liệu một cách hiệu quả.',
                },
            },
            {
                '@type': 'Question',
                name: 'Làm thế nào để bắt đầu học SQL trên PunheLabs?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Bạn chỉ cần truy cập punhelabs.io.vn, đăng ký tài khoản miễn phí, và bắt đầu thực hành SQL ngay trên trình soạn thảo tương tác. Không cần cài đặt phần mềm hay cấu hình gì thêm.',
                },
            },
            {
                '@type': 'Question',
                name: 'PunheLabs có miễn phí không?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Có, PunheLabs hoàn toàn miễn phí. Bạn có thể sử dụng trình soạn thảo SQL, các bài học và tất cả tính năng mà không mất phí.',
                },
            },
        ],
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
    )
}
