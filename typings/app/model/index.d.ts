// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportAction from '../../../app/model/action';
import ExportApiGroup from '../../../app/model/apiGroup';
import ExportApiItem from '../../../app/model/apiItem';
import ExportApiModel from '../../../app/model/apiModel';
import ExportCase from '../../../app/model/case';
import ExportJob from '../../../app/model/job';
import ExportLog from '../../../app/model/log';
import ExportMock from '../../../app/model/mock';
import ExportProject from '../../../app/model/project';
import ExportRule from '../../../app/model/rule';
import ExportStory from '../../../app/model/story';

declare module 'egg' {
  interface IModel {
    Action: ReturnType<typeof ExportAction>;
    ApiGroup: ReturnType<typeof ExportApiGroup>;
    ApiItem: ReturnType<typeof ExportApiItem>;
    ApiModel: ReturnType<typeof ExportApiModel>;
    Case: ReturnType<typeof ExportCase>;
    Job: ReturnType<typeof ExportJob>;
    Log: ReturnType<typeof ExportLog>;
    Mock: ReturnType<typeof ExportMock>;
    Project: ReturnType<typeof ExportProject>;
    Rule: ReturnType<typeof ExportRule>;
    Story: ReturnType<typeof ExportStory>;
  }
}
