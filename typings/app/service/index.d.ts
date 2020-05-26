// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
type AnyClass = new (...args: any[]) => any;
type AnyFunc<T = any> = (...args: any[]) => T;
type CanExportFunc = AnyFunc<Promise<any>> | AnyFunc<IterableIterator<any>>;
type AutoInstanceType<T, U = T extends CanExportFunc ? T : T extends AnyFunc ? ReturnType<T> : T> = U extends AnyClass ? InstanceType<U> : U;
import ExportApiDoc from '../../../app/service/apiDoc';
import ExportAuth from '../../../app/service/auth';
import ExportHttp from '../../../app/service/http';
import ExportJob from '../../../app/service/job';
import ExportLog from '../../../app/service/log';
import ExportMock from '../../../app/service/mock';
import ExportMs from '../../../app/service/ms';
import ExportNotice from '../../../app/service/notice';
import ExportUtil from '../../../app/service/util';

declare module 'egg' {
  interface IService {
    apiDoc: AutoInstanceType<typeof ExportApiDoc>;
    auth: AutoInstanceType<typeof ExportAuth>;
    http: AutoInstanceType<typeof ExportHttp>;
    job: AutoInstanceType<typeof ExportJob>;
    log: AutoInstanceType<typeof ExportLog>;
    mock: AutoInstanceType<typeof ExportMock>;
    ms: AutoInstanceType<typeof ExportMs>;
    notice: AutoInstanceType<typeof ExportNotice>;
    util: AutoInstanceType<typeof ExportUtil>;
  }
}
