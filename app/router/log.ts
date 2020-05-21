import { Application } from 'egg'

export default (app: Application) => {
  const { controller, router } = app

  router.resources('log', '/log', controller.log)
  router.resources('report', '/report', controller.log)
}
