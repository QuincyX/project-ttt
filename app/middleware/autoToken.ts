import { Context } from 'egg'

export default (): any => {
  return async (ctx: Context, next: () => Promise<any>) => {
    if (ctx.headers && ctx.headers['jwt-token']) {
      ctx.state.token = ctx.headers['jwt-token']
      await next()
    } else {
      ctx.body = {
        code: -11,
        message: 'token 不能为空！'
      }
      ctx.status = 200
    }
  }
}
