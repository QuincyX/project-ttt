import { Application } from 'egg'

export default (app: Application) => {
  const { controller, router } = app

  router.get('/action/:id/response', controller.action.getResponse)
  router.post('/action/:id/output', controller.action.addOutput)

  router.resources('job', '/job', controller.job)
  router.resources('story', '/story', controller.story)
  router.resources('case', '/case', controller.case)
  router.resources('action', '/action', controller.action)
}
