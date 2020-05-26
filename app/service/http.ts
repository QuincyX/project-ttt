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
        'Content-Type': 'application/json;charset=UTF-8',
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
        if (response.data.code !== 0) {
          return Promise.reject({
            code: response.data.code,
            message: response.data.message.slice(0, 200),
            config: response.config,
            response,
            toJSON: () => {
              return JSON.stringify(response.data)
            },
          })
        } else {
          return Promise.resolve(response)
        }
      },
      (error: AxiosError) => {
        return Promise.reject(error)
      }
    )
    return instance({ ...options })
  }
  getUrl() {}
}
