module.exports = {
  error(message: string, errCode: number) {
    this.ctx.status = 200
    this.ctx.body = {
      err: errCode || 4,
      message,
    }
    throw new NotError()
  },
  success(data: [object, Array<any>], page?: Page) {
    if (data instanceof Array) {
      this.ctx.body = {
        err: 0,
        page: page,
        list: data,
      }
    } else {
      this.ctx.body = {
        err: 0,
        data: data,
      }
    }
    this.ctx.status = 200
    throw new NotError()
  },
  getQuery(query) {
    const { page, size, total, sort, ...findQuery } = query
    const pageQuery = {
      page: Number(page) || 1,
      size: Number(size) || 10,
      total: 0,
    }
    let filterQuery = {}
    for (let k in findQuery) {
      if (findQuery[k] || findQuery[k] === false) {
        filterQuery[k] = findQuery[k]
      }
    }
    return { findQuery: filterQuery, pageQuery, sortQuery: sort }
  },
}
class NotError extends Error {
  // force end the current request
  err = 0
  message = 'THIS_IS_NOT_ERROR_JUST_LEAVE_IT_ALONE'
}

interface Page {
  page: Number
  size: Number
}
