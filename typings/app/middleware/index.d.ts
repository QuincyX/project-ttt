// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportAutoToken from '../../../app/middleware/autoToken';
import ExportCopyright from '../../../app/middleware/copyright';
import ExportErrorHandler from '../../../app/middleware/errorHandler';

declare module 'egg' {
  interface IMiddleware {
    autoToken: typeof ExportAutoToken;
    copyright: typeof ExportCopyright;
    errorHandler: typeof ExportErrorHandler;
  }
}
