// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportAction from '../../../app/controller/action';
import ExportApiGroup from '../../../app/controller/apiGroup';
import ExportApiItem from '../../../app/controller/apiItem';
import ExportApiModel from '../../../app/controller/apiModel';
import ExportCase from '../../../app/controller/case';
import ExportDev from '../../../app/controller/dev';
import ExportJob from '../../../app/controller/job';
import ExportLog from '../../../app/controller/log';
import ExportMock from '../../../app/controller/mock';
import ExportProject from '../../../app/controller/project';
import ExportStory from '../../../app/controller/story';

declare module 'egg' {
  interface IController {
    action: ExportAction;
    apiGroup: ExportApiGroup;
    apiItem: ExportApiItem;
    apiModel: ExportApiModel;
    case: ExportCase;
    dev: ExportDev;
    job: ExportJob;
    log: ExportLog;
    mock: ExportMock;
    project: ExportProject;
    story: ExportStory;
  }
}
