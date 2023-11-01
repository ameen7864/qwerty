const { port } = require("./dist/config/config");
const app = require("./dist/config/express");
const logger = require("./dist/config/winston");

app.listen(port, () => {
  logger.info({ message: `Listening on ${port}` });
});
