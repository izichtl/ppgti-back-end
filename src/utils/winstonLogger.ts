import { DateTime } from "luxon";
import winston from "winston";
import WinstonDailyRotateFile from "winston-daily-rotate-file";
import config from "config";
const serviceName: string = config.get("serviceName");
// const correlationIdHeader: string = config.get("headers.correlationId");
const winstonTransportConfig = {
	consoleConfig: {
		level: "debug",
		handleExceptions: true,
	},
	fileRotateConfig: {
		level: "info",
		filename: `${serviceName}-%DATE%.log`,
		datePattern: "YYYY-MM-DD",
		dirname: `${config.get("logDir")}/${process.env.NODE_ENV}/${serviceName}`,
		maxSize: "20m",
		maxFiles: 14,
		handleExceptions: true,
	},
};
const timestampFormat = winston.format((info, opts: any) => {
	if (opts.zone) {
		info.timestamp = DateTime.now().setZone(opts.zone).toISO();
	}
	return info;
});
const logLineFormat = winston.format.printf(
	(info) => `${info.timestamp} \
["-"] \
[${info.label}] \
${info.level.toUpperCase()}: ${info.message}`,
);
const format = winston.format.combine(
	winston.format.label({ label: serviceName }),
	timestampFormat({ zone: config.get("timezone") }),
	logLineFormat,
);
const winstonTransports = [];
if (["stage", "beta", "production"].includes(process.env.NODE_ENV || "")) {
	winstonTransports.push(
		new WinstonDailyRotateFile(winstonTransportConfig.fileRotateConfig),
	);
} else {
	winstonTransports.push(
		new winston.transports.Console(winstonTransportConfig.consoleConfig),
	);
}
const winstonLogger = winston.createLogger({
	levels: winston.config.syslog.levels,
	transports: winstonTransports,
	format,
	exitOnError: false,
});
export default winstonLogger;
