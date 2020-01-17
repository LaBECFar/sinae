import { config } from '../config'

export default function auth({ next, router }) {
    if (!localStorage.getItem('token')) {
        return router.push({ name: 'login' })
    }

    config.api.get('/user/info')
        .then(resp => {
            if (!resp) router.push({ name: 'login' })
            return next()
        })
        .catch(() => {
            return router.push({ name: 'login' })
        })    
}
