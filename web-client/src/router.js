import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from './views/layouts/Dashboard.vue'
import auth from './middleware/auth';

Vue.use(Router)


const router = new Router({
	routes: [
		{
			path: '/login',
			name: 'login',
			component: () => import( /* webpackChunkName: "locationNew" */ './views/user/Login.vue')
		},

		{
			path: '/forgot-password',
			name: 'forgotPassword',
			component: () => import( /* webpackChunkName: "forgotPassword" */ './views/user/ForgotPassword.vue')
		},

		{
			path: '/change-password/:userid/:token',
			name: 'changePassword',
			component: () => import( /* webpackChunkName: "changePassword" */ './views/user/ChangePassword.vue')
		},

		{
			path: '/register',
			name: 'register',
			component: () => import( /* webpackChunkName: "register" */ './views/user/Register.vue')
		},

		{
			path: '/',
			name: 'dashboard',
			component: Dashboard,
			meta: {
				middleware: auth
			},
			children: [
				{
					path: '',
					name: 'home',
					component: () => import( /* webpackChunkName: "locationIndex" */ './views/Home.vue'),
					meta: {
						middleware: auth
					}
				},

				{
					path: 'experimento',
					name: 'experimentoIndex',
					component: () => import( /* webpackChunkName: "locationIndex" */ './views/experimento/Index.vue'),
					meta: {
						middleware: auth
					}
				},

				{
					path: 'experimento/novo',
					name: 'locationNovo',
					component: () => import( /* webpackChunkName: "locationNew" */ './views/experimento/Novo.vue'),
					meta: {
						middleware: auth
					}
				},
				{
					path: 'experimento/:id/editar',
					name: 'experimentoEditar',
					component: () => import( /* webpackChunkName: "locationEdit" */ './views/experimento/Editar.vue'),
					meta: {
						middleware: auth
					}
				},
				{
					path: 'experimento/:experimentoCodigo/analises',
					name: 'analiseIndex',
					component: () => import( /* webpackChunkName: "analiseIndex" */ './views/analise/Index.vue'),
					meta: {
						middleware: auth
					}
				},

				{
					path: 'placa',
					name: 'placaIndex',
					component: () => import( /* webpackChunkName: "placaIndex" */ './views/placa/Index.vue'),
					meta: {
						middleware: auth
					}
				},

				{
					path: 'placa/novo',
					name: 'placaNovo',
					component: () => import( /* webpackChunkName: "placaNovo" */ './views/placa/Novo.vue'),
					meta: {
						middleware: auth
					}
				},

				{
					path: 'placa/:id/editar',
					name: 'placaEditar',
					component: () => import( /* webpackChunkName: "placaEditar" */ './views/placa/Editar.vue'),
					meta: {
						middleware: auth
					}
				},

				{
					path: 'placa/:id/metadados',
					name: 'placaMetadados',
					component: () => import( /* webpackChunkName: "placaMetadados" */ './views/placa/Metadados.vue'),
					meta: {
						middleware: auth
					}
				},

				{
					path: 'tipo-metadado',
					name: 'tipoMetadadoIndex',
					component: () => import( /* webpackChunkName: "tipoMetadadoIndex" */ './views/tipo-metadado/Index.vue'),
					meta: {
						middleware: auth
					}
				},

				{
					path: 'tipo-metadado/novo',
					name: 'tipoMetadadoNovo',
					component: () => import( /* webpackChunkName: "tipoMetadadoNovo" */ './views/tipo-metadado/Novo.vue'),
					meta: {
						middleware: auth
					}
				},

				{
					path: 'tipo-metadado/:id/editar',
					name: 'tipoMetadadoEditar',
					component: () => import( /* webpackChunkName: "tipoMetadadoEditar" */ './views/tipo-metadado/Editar.vue'),
					meta: {
						middleware: auth
					}
				},

				{
					path: 'analise/:analiseCodigo',
					name: 'analiseDetalhes',
					component: () => import( /* webpackChunkName: "analiseIndex" */ './views/analise/Detalhes.vue'),
					meta: {
						middleware: auth
					}
				},
				{
					path: 'analise/:id/editar',
					name: 'analiseEditar',
					component: () => import( /* webpackChunkName: "locationEdit" */ './views/analise/Editar.vue'),
					meta: {
						middleware: auth
					}
				},
				{
					path: 'analise/:analiseCodigo/quadrante/:quadrante',
					name: 'analiseDetalhesQuadrante',
					component: () => import( /* webpackChunkName: "analiseIndex" */ './views/analise/DetalhesQuadrante.vue'),
					meta: {
						middleware: auth
					}
				},
				{
					path: 'analise/:analiseCodigo/quadrantes',
					name: 'analiseQuadrantes',
					component: () => import( /* webpackChunkName: "analiseQuadrantes" */ './views/analise/Quadrantes.vue'),
					meta: {
						middleware: auth
					}
				},
				{
					path: 'user',
					name: 'userIndex',
					component: () => import( /* webpackChunkName: "userNew" */ './views/user/Index.vue'),
					meta: {
						middleware: auth
					}
				},
				{
					path: 'user/novo',
					name: 'userNovo',
					component: () => import( /* webpackChunkName: "userNew" */ './views/user/Novo.vue'),
					meta: {
						middleware: auth
					}
				},
				{
					path: 'user/:id/editar',
					name: 'userEditar',
					component: () => import( /* webpackChunkName: "userNew" */ './views/user/Editar.vue'),
					meta: {
						middleware: auth
					}
				},
			]
		},

	]
})


// Creates a `nextMiddleware()` function which not only
// runs the default `next()` callback but also triggers
// the subsequent Middleware function.
function nextFactory(context, middleware, index) {
	const subsequentMiddleware = middleware[index];
	// If no subsequent Middleware exists,
	// the default `next()` callback is returned.
	if (!subsequentMiddleware) return context.next;

	return (...parameters) => {
		// Run the default Vue Router `next()` callback first.
		context.next(...parameters);
		// Then run the subsequent Middleware with a new
		// `nextMiddleware()` callback.
		const nextMiddleware = nextFactory(context, middleware, index + 1);
		subsequentMiddleware({
			...context,
			next: nextMiddleware
		});
	};
}

router.beforeEach((to, from, next) => {
	if (to.meta.middleware) {
		const middleware = Array.isArray(to.meta.middleware) ?
			to.meta.middleware : [to.meta.middleware];

		const context = {
			from,
			next,
			router,
			to,
		};
		const nextMiddleware = nextFactory(context, middleware, 1);

		return middleware[0]({
			...context,
			next: nextMiddleware
		});
	}

	return next();
});


export default router;