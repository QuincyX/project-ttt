import { Application } from 'egg'

export default (app: Application) => {
  const { controller, router } = app

  router.delete('/mock/:id/list/item/:item', controller.mock.deleteMockListItem)
  router.post('/mock/:id/list/item', controller.mock.addMockListItem)

  router.resources('rule', '/rule', controller.rule)
  router.resources('mock', '/mock', controller.mock)
}
