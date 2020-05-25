import { Service } from 'egg'

export default class extends Service {
  public async getSwagger(url: string) {
    const result = await this.ctx.curl(url, { dataType: 'json' })
    return result.data
  }
  public async updateProject(url: string) {
    const swaggerJson = await this.ctx.service.apiDoc.getSwagger(url)
    const isProjectExist = await this.ctx.model.Project.exists({
      type: 'swagger',
      title: swaggerJson.info.title,
      host: swaggerJson.host,
    })
    let projectDoc: any
    if (isProjectExist) {
      projectDoc = await this.ctx.model.Project.findOneAndUpdate(
        {
          type: 'swagger',
          title: swaggerJson.info.title,
          host: swaggerJson.host,
        },
        {
          type: 'swagger',
          ...swaggerJson,
          ...swaggerJson.info,
        }
      )
    } else {
      projectDoc = await this.ctx.model.Project.create({
        type: 'swagger',
        ...swaggerJson,
        ...swaggerJson.info,
      })
    }
    const { newApiGroups, oldApiGroup } = await this.updateApiGroup(
      projectDoc._id,
      swaggerJson
    )
    const { oldApiItem, newApiItem } = await this.updateApiItem(
      projectDoc._id,
      swaggerJson
    )
    const apiModelLength = await this.updateApiModel(
      projectDoc._id,
      swaggerJson
    )
    return {
      projectDoc,
      newApiGroups,
      oldApiGroup,
      oldApiItem,
      newApiItem,
      apiModelLength,
    }
  }
  public async updateApiGroup(projectId: string, swaggerJson: any) {
    const oldApiGroup = await this.ctx.model.ApiGroup.updateMany(
      { project: projectId },
      { isEnable: false }
    )
    swaggerJson.tags.forEach(async (o) => {
      await this.ctx.model.ApiGroup.updateOne(
        { project: projectId, name: o.name },
        { description: o.description, isEnable: true },
        { upsert: true }
      )
    })
    const newApiGroups = await this.ctx.model.ApiGroup.find({
      project: projectId,
    })
    return { newApiGroups, oldApiGroup }
  }
  public async updateApiItem(projectId: string, swaggerJson: any) {
    const oldApiItem = await this.ctx.model.ApiItem.updateMany(
      { project: projectId },
      { isEnable: false }
    )
    const apiList = swaggerJson.paths
    Object.keys(apiList).forEach(async (key) => {
      const currentApi = apiList[key]
      const methodList = ['get', 'post', 'delete', 'put']
      methodList.forEach(async (method) => {
        if (currentApi[method]) {
          const apiGroupId = currentApi[method].tags.length
            ? await this.ctx.model.ApiGroup.findOne({
                project: projectId,
                name: currentApi[method].tags[0],
              })
            : ''
          const queryParams = currentApi[method].parameters.filter(
            (o) => o.in === 'query'
          )
          const pathParams = currentApi[method].parameters.filter(
            (o) => o.in === 'path'
          )
          const headerParams = currentApi[method].parameters.filter(
            (o) => o.in === 'header'
          )
          const bodyParams = currentApi[method].parameters
            .filter((o) => o.in === 'body')
            .map((o) => {
              if (o.schema) {
                o.model = o.schema.$ref
              }
              return o
            })

          await this.ctx.model.ApiItem.updateOne(
            { project: projectId, url: key, method },
            {
              isEnable: true,
              url: key,
              method,
              name: currentApi[method].summary,
              operationId: currentApi[method].operationId,
              query: queryParams,
              body: bodyParams,
              header: headerParams,
              path: pathParams,
              apiGroup: apiGroupId._id,
              project: projectId,
            },
            { upsert: true }
          )
        }
      })
    })
    const newApiItem = await this.ctx.model.ApiItem.find({ project: projectId })
    return { oldApiItem, newApiItem }
  }
  public async updateApiModel(projectId: string, swaggerJson: any) {
    Object.keys(swaggerJson.definitions).forEach(async (key) => {
      let proJson: any = {
        name: '',
        description: '',
        type: '',
        project: '',
        properties: [],
      }
      proJson.name = swaggerJson.definitions[key].title
        ? swaggerJson.definitions[key].title
        : ''
      proJson.description = swaggerJson.definitions[key].description
        ? swaggerJson.definitions[key].description
        : ''
      proJson.project = projectId
      proJson.type = swaggerJson.definitions[key].type
        ? swaggerJson.definitions[key].type
        : ''
      if (swaggerJson.definitions[key].properties) {
        Object.keys(swaggerJson.definitions[key].properties).forEach((k) => {
          let projectItem: any = {
            name: '',
            description: '',
            type: '',
            require: '',
          }
          projectItem.name = k
          projectItem.description =
            swaggerJson.definitions[key].properties[k].description
          projectItem.type = swaggerJson.definitions[key].properties[k].type
          projectItem.require = ''
          proJson.properties.push(projectItem)
        })
      }
      const newDoc = await this.ctx.model.ApiModel.create(proJson)
      console.log(newDoc)
    })
    return swaggerJson.definitions.length
  }
}
