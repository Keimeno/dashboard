import Vue from 'vue'
import Card from '@/components/material/Card.vue'
import Notification from '@/components/material/Notification.vue'
import StatsCard from '@/components/material/StatsCard.vue'
import ChartCard from '@/components/material/ChartCard.vue'
import RedeemCard from '@/components/material/RedeemCard.vue'
import Offset from '@/components/helper/Offset.vue'
import Build from '@/components/helper/Build.vue'

Vue.component(Card.name, Card)
Vue.component(Notification.name, Notification)
Vue.component(StatsCard.name, StatsCard)
Vue.component(ChartCard.name, ChartCard)
Vue.component(Offset.name, Offset)

// Typescript
// TODO: Add API to get card names
Vue.component('MaterialRedeemCard', RedeemCard)
Vue.component('Build', Build)
