/**
 * Define all application routes here,
 * child paths are supported.
 */
export default [
    {
        path: '',
        name: 'Home',
        view: 'Home',
    },
    {
        path: '/user-profile',
        name: 'User Profile',
        view: 'UserProfile',
    },
    {
        path: '/login',
        name: 'Login',
        view: 'Login',
    },
    {
        path: '/moderation',
        name: 'Moderation',
        view: 'Entry',
        children: [
            {
                name: 'Userinfo',
                view: 'Moderation/Userinfo',
                path: 'userinfo',
            },
            {
                name: 'UserinfoByName',
                view: 'Moderation/UserinfoByName',
                path: 'userinfo/:name',
            },
            {
                name: 'Chatreport',
                view: 'Moderation/Chatreport',
                path: 'chatreport',
            },
            {
                name: 'ChatreportById',
                view: 'Moderation/ChatreportById',
                path: 'chatreport/:id',
            },
        ],
    },
]
