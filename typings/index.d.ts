import 'egg'

declare module 'egg' {
  interface PostOrigin {
    addrVideoArr: Array<string>
    addrImgArr: Array<string>
    content: string
    topicId: number
    topicName?: string
  }
  interface Post {
    video: string
    image: Array<string>
    content: string
    topic: Topic
  }
  interface Topic {
    id: number
    name: string
  }
}
