export const baseURL: string = 'http://192.168.178.64:3000/api/v1'

export const publicAPIKey: string =
    '-----BEGIN PUBLIC KEY-----\nMFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAKjJiAJ2rZAB0HYBWRnv7kcHddH/Uu+8\nP8AW2o/kqiUMvcKeN+beUatNRY4bb8CdxkAS7jyaCEUNLP5WZV0yajMCAwEAAQ==\n-----END PUBLIC KEY-----'

export const drawerLinks: Object = [
    {
        to: '/moderation',
        icon: 'mdi-bank',
        text: 'moderation',
        isNested: true,
        requiresStaff: true,
        children: [
            {
                to: '/moderation/userinfo',
                external: false,
                icon: 'mdi-eye',
                text: 'userinfo',
            },
            {
                to: '/moderation/chatreport',
                external: false,
                icon: 'mdi-message',
                text: 'chatreport',
            },
        ],
    },
    {
        to: '/',
        icon: 'mdi-view-dashboard',
        text: 'dashboard',
        isNested: false,
        requiresStaff: false,
    },
    {
        to: '/user-profile',
        icon: 'mdi-account',
        text: 'userProfile',
        isNested: false,
        requiresStaff: false,
    },
    {
        to: '/friends',
        icon: 'mdi-account-heart',
        text: 'friends',
        isNested: false,
        requiresStaff: false,
    },
    {
        to: '/clan',
        icon: 'mdi-account-group',
        text: 'clan',
        isNested: true,
        requiresStaff: false,
        children: [
            {
                to: '/clan',
                external: false,
                icon: 'mdi-eye',
                text: 'overview',
            },
            {
                to: '/clan/manage',
                external: false,
                icon: 'mdi-tune-vertical',
                text: 'manage',
            },
        ],
    },
    {
        to: '/support',
        icon: 'mdi-lifebuoy',
        text: 'support',
        isNested: true,
        requiresStaff: false,
        children: [
            {
                to: '/support',
                external: false,
                icon: 'mdi-ticket',
                text: 'ticketSupport',
            },
            {
                to: 'mailto:example@example.org',
                external: true,
                icon: 'mdi-email',
                text: 'emailSupport',
            },
            {
                to: 'ts3server://example.org',
                external: true,
                icon: 'mdi-voice',
                text: 'voiceSupport',
            },
        ],
    },
]
