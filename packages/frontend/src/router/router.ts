import Vue from 'vue'
import Router from 'vue-router'

// Routes
import paths from './paths'

const route = (path: string, view: string, name?: string, children?: Array<Object>) => {
	return {
		name: name || view,
		path,
		component: (resolve: any) => 
			import(`@/views/${view}.vue`).then(resolve),
		children: children === undefined ? undefined : children.map((path) => route(path['path'], path['view'], path['name']!))
	}
}

Vue.use(Router)

const router = new Router({
	mode: 'history',
	routes: paths
		.map(path => route(path.path, path.view, path.name, path.children))
		// @ts-ignore
		.concat([{ path: '*', redirect: '/' }]),
	scrollBehavior(to, from, savedPosition) {
		if (savedPosition) {
			return savedPosition
		}
		if (to.hash) {
			return { selector: to.hash }
		}
		return { x: 0, y: 0 }
	},
})

export default router
