import { generatePolicy } from "../utils/aws";

export const getPolicy = (req: any, res: any) => {
  const { id } = req.payload;
  const { fileName, mime, type } = req.body;

  generatePolicy(id, mime, `${type}/${fileName}`, {}, (err, data, filePath) => {
    if (err)
      res.send({ success: false, msg: "Error while generating policy!" });
    else res.send({ success: true, data, filePath });
  });
};
