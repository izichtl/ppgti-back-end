import { controllerWrapper } from "../lib/controllerWrapper";
import { response } from "../middlewares/response";
import { getHealthMessage } from "../services/health";

// POST /api/v1/auth/register
export const healthCheck = controllerWrapper(async (_req, _res) => {
	const message = await getHealthMessage();

	response.success({
		message,
	});
});
