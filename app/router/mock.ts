import { Application } from 'egg'

export default (app: Application) => {
  const { controller, router } = app

  router.resources('rule', '/rule', controller.rule)
  router.resources('mock', '/mock', controller.mock)
}
