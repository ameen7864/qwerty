const { port } = require("./config/config");
const app = require("./config/express");
const logger = require("./config/winston");

app.listen(port, () => {
  logger.info({ message: `Listening on ${port}` });
});
