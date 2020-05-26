import { Application } from 'egg'

export default (app: Application) => {
  const { controller, router } = app

  router.put('/project/:id/refresh', controller.project.refresh)
  router.resources('project', '/project', controller.project)
  router.resources('apiItem', '/apiItem', controller.apiItem)
  router.resources('apiGroup', '/apiGroup', controller.apiGroup)
  router.resources('apiModel', '/apiModel', controller.apiModel)
}
