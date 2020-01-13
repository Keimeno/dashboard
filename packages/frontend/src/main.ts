import Vue from 'vue'
import App from './App.vue'
import router from '@/router/router'
import store from '@/store/store'
import i18n from '@/translations/i18n'
import vuetify from './plugins/vuetify'

import './plugins'

Vue.config.productionTip = false

new Vue({
    router,
    store,
    i18n,
    // @ts-ignore
    vuetify,
    render: h => h(App),
}).$mount('#app')
