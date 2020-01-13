import Vue from 'vue'
import Vuex from 'vuex'

import actions from './actions'
import getters from './getters'
import mutations from './mutations'
import modules from './modules'
import state from './state'

Vue.use(Vuex)

// Create a new store
const store = new Vuex.Store({
    actions,
    getters,
    modules,
    mutations,
    state,
})

export default store
