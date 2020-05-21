import { Application } from 'egg'

export default (app: Application) => {
  const { controller, router } = app

  router.redirect('/', '/ping')
  router.get('/ping', controller.dev.ping)
}
