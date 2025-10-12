// @ts-expect-error
import VError from "verror";
import winstonLogger from "./winstonLogger";
const logData = (logObject: unknown, logLevel = "info") => {
	if (!logObject) {
		return;
	}
	const index = logLevel as keyof typeof winstonLogger;
	if (typeof logObject !== "object") {
		winstonLogger[index](logObject);
		return;
	}
	// If errorObject is not an instance of Error, log the object at given log level.
	if (!(logObject instanceof Error)) {
		winstonLogger[index](logObject);
		return;
	}
	const { vErrorLogLevel } = VError.info(logObject);
	const vErrorLogIndex = vErrorLogLevel as keyof typeof winstonLogger;
	if (
		vErrorLogLevel &&
		Object.prototype.hasOwnProperty.call(winstonLogger.levels, logLevel)
	) {
		if (winstonLogger.levels[vErrorLogLevel] <= winstonLogger.levels.warning) {
			winstonLogger[vErrorLogIndex](VError.fullStack(logObject));
		} else {
			winstonLogger[vErrorLogIndex](logObject.message);
		}
		return;
	}
	// errorObject is an instance of Error but has no vErrorLogLevel specified.
	if (winstonLogger.levels[logLevel] <= winstonLogger.levels.warning) {
		winstonLogger[index](VError.fullStack(logObject));
		return;
	}
	winstonLogger.error(VError.fullStack(logObject));
};
const logger = {
	log: (logObject: unknown) => {
		logData(logObject);
	},
	debug: (logObject: unknown) => {
		logData(logObject, "debug");
	},
	info: (logObject: unknown) => {
		logData(logObject, "info");
	},
	notice: (logObject: unknown) => {
		logData(logObject, "notice");
	},
	warning: (logObject: unknown) => {
		logData(logObject, "warning");
	},
	error: (logObject: unknown) => {
		logData(logObject, "error");
	},
	crit: (logObject: unknown) => {
		logData(logObject, "crit");
	},
	alert: (logObject: unknown) => {
		logData(logObject, "alert");
	},
	emerg: (logObject: unknown) => {
		logData(logObject, "emerg");
	},
};
export default logger;
