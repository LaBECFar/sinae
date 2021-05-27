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
			component: Dashboard,
			meta: {
				middleware: auth,
				title: 'Home'
			},
			children: [
				{
					path: '',
					name: 'home',
					component: () => import( /* webpackChunkName: "locationIndex" */ './views/Home.vue'),
					meta: {
						middleware: auth,
						title: 'Home'
					}
				},

				{
					path: 'settings',
					name: 'settings',
					component: () => import( /* webpackChunkName: "settings" */ './views/settings/Settings.vue'),
					meta: {
						middleware: auth,
						title: 'Configurações'
					}
				},

				{
					path: 'experimento',
					name: 'experimentoIndex',
					component: () => import( /* webpackChunkName: "locationIndex" */ './views/experimento/Index.vue'),
					meta: {
						middleware: auth,
						title: 'Experimentos'
					}
				},

				{
					path: 'experimento/novo',
					name: 'locationNovo',
					component: () => import( /* webpackChunkName: "locationNew" */ './views/experimento/Novo.vue'),
					meta: {
						middleware: auth,
						title: 'Novo Experimento'
					}
				},
				{
					path: 'experimento/:id/editar',
					name: 'experimentoEditar',
					component: () => import( /* webpackChunkName: "locationEdit" */ './views/experimento/Editar.vue'),
					meta: {
						middleware: auth,
						title: 'Editar Experimento'
					}
				},
				{
					path: 'experimento/:experimentoCodigo/analises',
					name: 'analiseIndex',
					component: () => import( /* webpackChunkName: "analiseIndex" */ './views/analise/Index.vue'),
					meta: {
						middleware: auth,
						title: 'Análises'
					}
				},

				{
					path: 'experimento/:experimentoCodigo/analises/novo',
					name: 'analiseNovo',
					component: () => import( /* webpackChunkName: "analiseNovo" */ './views/analise/Novo.vue'),
					meta: {
						middleware: auth,
						title: 'Nova Análise'
					}
				},

				{
					path: 'placa',
					name: 'placaIndex',
					component: () => import( /* webpackChunkName: "placaIndex" */ './views/placa/Index.vue'),
					meta: {
						middleware: auth,
						title: 'Placas'
					}
				},

				{
					path: 'placa/novo',
					name: 'placaNovo',
					component: () => import( /* webpackChunkName: "placaNovo" */ './views/placa/Novo.vue'),
					meta: {
						middleware: auth,
						title: 'Nova Placa'
					}
				},

				{
					path: 'placa/:id/editar',
					name: 'placaEditar',
					component: () => import( /* webpackChunkName: "placaEditar" */ './views/placa/Editar.vue'),
					meta: {
						middleware: auth,
						title: 'Editar Placa'
					}
				},

				{
					path: 'placa/:id/metadados',
					name: 'placaMetadados',
					component: () => import( /* webpackChunkName: "placaMetadados" */ './views/placa/Metadados.vue'),
					meta: {
						middleware: auth,
						title: 'Métadados'
					}
				},

				{
					path: 'tipo-metadado',
					name: 'tipoMetadadoIndex',
					component: () => import( /* webpackChunkName: "tipoMetadadoIndex" */ './views/tipo-metadado/Index.vue'),
					meta: {
						middleware: auth,
						title: 'Tipo de metadado'
					}
				},

				{
					path: 'tipo-metadado/novo',
					name: 'tipoMetadadoNovo',
					component: () => import( /* webpackChunkName: "tipoMetadadoNovo" */ './views/tipo-metadado/Novo.vue'),
					meta: {
						middleware: auth,
						title: 'Novo tipo de metadado'
					}
				},

				{
					path: 'tipo-metadado/:id/editar',
					name: 'tipoMetadadoEditar',
					component: () => import( /* webpackChunkName: "tipoMetadadoEditar" */ './views/tipo-metadado/Editar.vue'),
					meta: {
						middleware: auth,
						title: 'Editar tipo de metadado'
					}
				},

				{
					path: 'analise/:analiseCodigo',
					name: 'analiseDetalhes',
					component: () => import( /* webpackChunkName: "analiseDetail" */ './views/analise/Detalhes.vue'),
					meta: {
						middleware: auth,
						title: 'Detalhes da Análise'
					}
				},
				{
					path: 'analise/:id/editar',
					name: 'analiseEditar',
					component: () => import( /* webpackChunkName: "locationEdit" */ './views/analise/Editar.vue'),
					meta: {
						middleware: auth,
						title: 'Editar Análise'
					}
				},

				{
					path: 'analise/:id/extrair-video',
					name: 'analiseExtrairVideo',
					component: () => import( /* webpackChunkName: "analiseExtrairVideo" */ './views/analise/ExtrairVideo.vue'),
					meta: {
						middleware: auth,
						title: 'Extrair vídeo'
					}
				},

				{
					path: 'analise/:analiseCodigo/quadrante/:quadrante',
					name: 'analiseDetalhesQuadrante',
					component: () => import( /* webpackChunkName: "analiseQuadrants" */ './views/analise/DetalhesQuadrante.vue'),
					meta: {
						middleware: auth,
						title: 'Quadrante'
					}
				},
				{
					path: 'analise/:analiseCodigo/quadrantes',
					name: 'analiseQuadrantes',
					component: () => import( /* webpackChunkName: "analiseQuadrantes" */ './views/analise/Quadrantes.vue'),
					meta: {
						middleware: auth,
						title: 'Quadrantes'
					}
				},
				{
					path: 'user',
					name: 'userIndex',
					component: () => import( /* webpackChunkName: "userNew" */ './views/user/Index.vue'),
					meta: {
						middleware: auth,
						title: 'Usuários'
					}
				},
				{
					path: 'user/novo',
					name: 'userNovo',
					component: () => import( /* webpackChunkName: "userNew" */ './views/user/Novo.vue'),
					meta: {
						middleware: auth,
						title: 'Novo úsuario'
					}
				},
				{
					path: 'user/:id/editar',
					name: 'userEditar',
					component: () => import( /* webpackChunkName: "userNew" */ './views/user/Editar.vue'),
					meta: {
						middleware: auth,
						title: 'Editar úsuario'
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

router.afterEach((to) => {
    Vue.nextTick(() => {
        document.title = `${to.meta.title} - ${process.env.VUE_APP_TITLE || 'Schistosome Smart Profiler'}`;
    });
});


export default router;