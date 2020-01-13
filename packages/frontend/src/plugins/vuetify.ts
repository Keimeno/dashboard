import Vue from 'vue'
// @ts-ignore
import Vuetify from 'vuetify/lib'
import { getMode } from '@/common/mode.service'

Vue.use(Vuetify)

export default new Vuetify({
    theme: {
        dark: getMode() == 'dark' ? true : false,
        themes: {
            light: {
                primary: '#c02a39',
                secondary: '#55822F',
                tertiary: '#495057',
                accent: '#82B1FF',
                error: '#f55a4e',
                info: '#00d3ee',
                success: '#5cb860',
                warning: '#ffa21a',
                inverted: '#323134',
                background: '#f4f2f2',
                backgroundGradientStart: '#f3f4f9',
                backgroundGradientEnd: '#d2d3d0',
            },
            dark: {
                primary: '#c02a39',
                secondary: '#55822F',
                tertiary: '#495057',
                accent: '#82B1FF',
                error: '#f55a4e',
                info: '#00d3ee',
                success: '#5cb860',
                warning: '#ffa21a',
                inverted: '#d7d5d9',
                background: '#303030',
                backgroundGradientStart: '#222126',
                backgroundGradientEnd: '#12100f',
            },
        },
        options: {
            customProperties: true,
        },
    },
    icons: {
        iconfont: 'mdiSvg',
    },
})
