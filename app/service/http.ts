import { Service } from 'egg'
import Axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  AxiosPromise,
} from 'axios'

export default class extends Service {
  axios(options: AxiosRequestConfig): AxiosPromise {
    const instance: AxiosInstance = Axios.create({
      timeout: 20 * 1000,
      withCredentials: false,
      headers: {
        'user-agent': 'project ttt',
      },
    })
    instance.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        return config
      },
      (error: AxiosRequestConfig) => {
        return Promise.reject(error)
      }
    )
    instance.interceptors.response.use(
      (response: AxiosResponse) => {
        // this.ctx.service.log.add({
        //   belongType: 'http',
        //   belongTo: `${response.config.method} ${response.config.url}`,
        //   type: 'success',
        //   content: `status ${response.status}`,
        // })
        return Promise.resolve(response)
      },
      (error: AxiosError) => {
        // this.ctx.service.log.add({
        //   belongType: 'http',
        //   belongTo: `${error.config.method} ${error.config.url}`,
        //   type: 'error',
        //   content: error.toJSON(),
        // })
        return Promise.reject(error)
      }
    )
    return instance({ ...options })
  }
  getUrl() {}
}
