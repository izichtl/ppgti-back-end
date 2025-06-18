// types/express/index.d.ts (você pode colocar esse trecho onde declara tipos globais)
declare global {
  namespace Express {
    interface Response {
      response: {
        success: (payload: ResponsePayload) => void;
        failure: (payload: ResponsePayload) => void;
        invalid: (payload: ResponsePayload) => void;
        unauthorized: (payload: ResponsePayload) => void;
        fail: (payload: ResponsePayload) => void;
      };
    }
  }
}

export interface ResponsePayload {
  status?: number;
  message?: string;
  data?: any;
  total_count?: number;
  error?: boolean;
  code?: string;
}

// src/middlewares/response.ts
import type { Request, Response, NextFunction } from 'express';
// import type { ResponsePayload } from '../types/express';

const response: {
  success(payload: ResponsePayload): void;
  fail(payload: ResponsePayload): void;
  invalid(payload: ResponsePayload): void;
  unauthorized(payload: ResponsePayload): void;
  failure(payload: ResponsePayload): void;
} = {
  success: () => {},
  fail: () => {},
  invalid: () => {},
  unauthorized: () => {},
  failure: () => {},
};

const responseMiddleware = (
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.response = {
    success: (payload: ResponsePayload): void => {
      if (!res.headersSent) {
        res.status(payload.status || 200).json({
          success: true,
          message: payload.message || 'Request was successful',
          data: payload.data,
          total_count: payload.total_count,
        });
      }
    },

    failure: (payload: ResponsePayload): void => {
      if (!res.headersSent) {
        console.log('FALHA', payload);
        res.status(payload.status || 500).json({
          success: false,
          code: payload.code || 'INTERNAL_SERVER_ERROR',
          message: payload.message || 'An internal server error occurred',
          data: payload.data,
        });
      }
    },

    invalid: (payload: ResponsePayload): void => {
      if (!res.headersSent) {
        res.status(payload.status || 400).json({
          success: false,
          message: payload.message || 'The request is invalid',
          data: payload.data,
        });
      }
    },

    unauthorized: (payload: ResponsePayload): void => {
      if (!res.headersSent) {
        res.status(payload.status || 401).json({
          success: false,
          message: payload.message || 'You are not authorized to perform this action',
          data: payload.data,
        });
      }
    },

    fail: (payload: ResponsePayload): void => {
      if (!res.headersSent) {
        res.status(payload.status || 422).json({
          success: false,
          message: payload.message || 'The request failed to process',
          data: payload.data,
        });
      }
    },
  };

  // // Transição suave: redireciona chamadas globais para o res.response
  // response.success = res.response.success;
  // response.failure = res.response.failure;
  // response.invalid = res.response.invalid;
  // response.unauthorized = res.response.unauthorized;
  // response.fail = res.response.fail;

  next();
};

export { response };
export default responseMiddleware;


// /* eslint-disable no-unused-vars */
// import type { Request, Response, NextFunction } from 'express';

// export interface ResponsePayload {
//   status?: number;
//   message?: string;
//   data?: unknown;
//   total_count?: number;
//   error?: boolean;
//   code?: string;
// }

// const response: {
//   success(payload: ResponsePayload): void;
//   fail(payload: ResponsePayload): void;
//   invalid(payload: ResponsePayload): void;
//   unauthorized(payload: ResponsePayload): void;
//   failure(payload: ResponsePayload): void;
// } = {
//   success: () => {},
//   fail: () => {},
//   invalid: () => {},
//   unauthorized: () => {},
//   failure: () => {},
// };

// const responseMiddleware = (
//   _req: Request,
//   res: Response,
//   next: NextFunction
// ): void => {
//   response.success = (payload: ResponsePayload): void => {
//     res.status(payload.status || 200).json({
//       success: true,
//       message: payload.message || 'Request was successful',
//       data: payload.data,
//       total_count: payload.total_count,
//     });
//   };

//   response.invalid = (payload: ResponsePayload): void => {
//     res.status(payload.status || 400).json({
//       success: false,
//       message: payload.message || 'The request is invalid',
//       data: payload.data,
//     });
//   };

//   response.unauthorized = (payload: ResponsePayload): void => {
//     res.status(payload.status || 401).json({
//       success: false,
//       message:
//         payload.message || 'You are not authorized to perform this action',
//       data: payload.data,
//     });
//   };

//   response.failure = (payload: ResponsePayload): void => {
//     console.log('FALHA', payload)
//     res.status(payload.status || 500).json({
//       success: false,
//       code: payload.code || 'INTERNAL_SERVER_ERROR',
//       message: payload.message || 'An internal server error occurred',
//       data: payload.data,
//     });
//   };

//   next();
// };

// export { response };
// export default responseMiddleware;

