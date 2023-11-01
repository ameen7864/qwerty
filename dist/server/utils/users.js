"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAvatar = void 0;
const axios_1 = __importDefault(require("axios"));
const constants_1 = require("./constants");
const others_1 = require("./others");
const { accessoriesOptions, clothColorOptions, clothOptions, facialHairColorOptions, facialHairOptions, femaleHairOptions, hairColorOptions, maleHairOptions, } = constants_1.avatarOptions;
const generateAvatar = (gender) => __awaiter(void 0, void 0, void 0, function* () {
    const accessoriesType = (0, others_1.generateRandomElementFromArray)(accessoriesOptions);
    const avatarStyle = (0, others_1.generateRandomElementFromArray)(["Circle", "Transparent"]);
    const clothColor = (0, others_1.generateRandomElementFromArray)(clothColorOptions);
    const clothType = (0, others_1.generateRandomElementFromArray)(clothOptions);
    const facialHairColor = (0, others_1.generateRandomElementFromArray)(facialHairColorOptions);
    const facialHairType = gender === "female" || gender === "other"
        ? "Blank"
        : (0, others_1.generateRandomElementFromArray)(facialHairOptions);
    const skinColor = "light";
    const topType = gender === "female"
        ? (0, others_1.generateRandomElementFromArray)(femaleHairOptions)
        : (0, others_1.generateRandomElementFromArray)(maleHairOptions);
    const topColor = (0, others_1.generateRandomElementFromArray)(hairColorOptions);
    const url = `https://avataaars.io/?accessoriesType=${accessoriesType}&avatarStyle=${avatarStyle}&clotheColor=${clothColor}&clotheType=${clothType}&facialHairColor=${facialHairColor}&facialHairType=${facialHairType}&hairColor=${topColor}&skinColor=${skinColor}&topType=${topType}`;
    try {
        const data = yield axios_1.default.get(url);
        return data.data;
    }
    catch (err) {
        return "";
    }
});
exports.generateAvatar = generateAvatar;
