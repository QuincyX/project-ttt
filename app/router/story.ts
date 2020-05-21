import { Application } from 'egg'

export default (app: Application) => {
  const { controller, router } = app

  router.resources('job', '/job', controller.job)
  router.resources('story', '/story', controller.story)
  router.resources('case', '/case', controller.case)
  router.resources('action', '/action', controller.action)
}
