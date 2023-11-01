"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPolicy = void 0;
const aws_1 = require("../utils/aws");
const getPolicy = (req, res) => {
    const { id } = req.payload;
    const { fileName, mime, type } = req.body;
    (0, aws_1.generatePolicy)(id, mime, `${type}/${fileName}`, {}, (err, data, filePath) => {
        if (err)
            res.send({ success: false, msg: "Error while generating policy!" });
        else
            res.send({ success: true, data, filePath });
    });
};
exports.getPolicy = getPolicy;
