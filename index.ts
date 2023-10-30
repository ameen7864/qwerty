import { port } from "./config/config";
import app from "./config/express";
import logger from "./config/winston";

app.listen(port, () => {
  logger.info({ message: `Listening on ${port}` });
});
