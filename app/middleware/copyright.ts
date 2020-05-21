import { Context } from 'egg'

export default (): any => {
  return async (ctx: Context, next: () => Promise<any>) => {
    ctx.set('Access-Control-Expose-Headers', 'x-powered-by')
    ctx.set('x-powered-by', 'Quincy ( likequincy@outlook.com )')
    await next()
  }
}
