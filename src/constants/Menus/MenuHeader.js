import {
     PersonIcon,CoinIcon, CreateIcon, BusinessSuiteIcon,
    SettingIcon, InfoIcon, LightBulbIcon, WaningMoonIcon, LogoutIcon,
    LetterAIcon
} from '@/components/Icons';

const MENU_ITEMS = [
    {
        icon: <CreateIcon width='1em' height='1em' />,
        title: 'Creator tools',
        children: {
            title: 'Creator tools',
            menuItems: [
                {
                    icon: <LightBulbIcon width='1em' height='1em' />,
                    title: 'LIVE Creator Hub'
                }
            ]
        }
    },
    {
        icon: <LetterAIcon width='1em' height='1em' />,
        title: 'English',
        children: {
            title: 'Language',
            menuItems: [
                {
                    code: 'en',
                    title: 'English'
                },
                {
                    code: 'vi',
                    title: 'Vietnamese'
                }
            ],
        }

    },
    {
        icon: <LightBulbIcon width='1em' height='1em' />,
        title: 'Feedback and help',
        to: '/feedback'
    },
    {
        icon: <WaningMoonIcon width='1em' height='1em' />,
        title: 'Dark mode',
        children: {
            title: 'Dark mode',
            menuItems: [
                {
                    title: 'Use device theme',
                    type: 'theme',
                    data: 'system'
                },
                {
                    title: 'Dark mode',
                    type: 'theme',
                    data: 'dark'
                },
                {
                    title: 'Light mode',
                    type: 'theme',
                    data: 'light'
                }
            ],
        }
    }
];

const USER_MENU = [
    {
        icon: <PersonIcon width='1em' height='1em' />,
        title: 'View profile',
        to: '/profile'
    },
    {
        icon: <SettingIcon width='1em' height='1em' />,
        title: 'Settings',
        to: '/settings'

    }, {
        icon: <LetterAIcon width='1em' height='1em' />,
        title: 'English',
        children: {
            title: 'Language',
            menuItems: [
                {
                    code: 'en',
                    title: 'English'
                },
                {
                    code: 'vi',
                    title: 'Vietnamese'
                }
            ],
        }

    },
    {
        icon: <InfoIcon width='1em' height='1em' />,
        title: 'Feedback and help',
        to: '/feedback'
    },
    {
        icon: <WaningMoonIcon width='1em' height='1em' />,
        title: 'Dark mode',
        children: {
            title: 'Dark mode',
            menuItems: [
                {
                    title: 'Use device theme',
                    type: 'theme',
                    data: 'system'
                },
                {
                    title: 'Dark mode',
                    type: 'theme',
                    data: 'dark'
                },
                {
                    title: 'Light mode',
                    type: 'theme',
                    data: 'light'
                }
            ],
        }
    },
    {
        icon: <LogoutIcon width='1em' height='1em' />,
        title: 'Log out',
        to: '/logout',
    }
]

export { MENU_ITEMS, USER_MENU };