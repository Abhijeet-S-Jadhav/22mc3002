import fs from "fs";
import path from "path";

const logFile = path.join(process.cwd(), "access.log");

export function logger(req, res, next) {
  const entry = `${new Date().toISOString()} ${req.method} ${req.originalUrl}\n`;
  fs.appendFileSync(logFile, entry);
  next();
}
