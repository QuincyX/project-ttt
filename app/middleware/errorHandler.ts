import { Context } from 'egg'

export default function fooMiddleware(): any {
  return async (ctx: Context, next: () => Promise<any>) => {
    try {
      await next()
    } catch (err) {
      if (!err.code) {
        ctx.status = 200
        return
      }
      ctx.app.emit('error', err)
      const status = err.status || -4
      const error =
        status === 500 && ctx.app.config.env === 'prod'
          ? 'Internal Server Error'
          : err.message
      ctx.body = {
        code: status,
        message: error
      }
      if (status === 422) {
        ctx.body.detail = err.errors
      }
      ctx.status = 200
    }
  }
}
