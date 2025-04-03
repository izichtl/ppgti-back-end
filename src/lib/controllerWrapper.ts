import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { CustomError } from "./error/custom.error";
import { response } from "../middlewares/response";
import { fromError } from "zod-validation-error";
interface UserRequest extends Request {
	user?: {
		id: string;
		email: string;
	};
}

type ControllerFunction = (
	req: UserRequest,
	res: Response,
	next: NextFunction,
) => Promise<void>;

export const controllerWrapper = (
	fn: ControllerFunction,
): ControllerFunction => {
	return async (req: UserRequest, res: Response, next: NextFunction) => {
		try {
			await fn(req, res, next);
		} catch (error: unknown) {
			if (error instanceof CustomError) {
				response.failure({
					status: error.status,
					message: error.message,
				});
			} else if (error instanceof ZodError) {
				response.invalid({
					message: fromError(error).toString(),
				});
			} else {
				next(error);
			}
		}
	};
};
