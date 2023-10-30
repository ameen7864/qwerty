import axios from "axios";
import { avatarOptions } from "./constants";
import { generateRandomElementFromArray } from "./others";

const {
  accessoriesOptions,
  clothColorOptions,
  clothOptions,
  facialHairColorOptions,
  facialHairOptions,
  femaleHairOptions,
  hairColorOptions,
  maleHairOptions,
} = avatarOptions;

export const generateAvatar = async (gender: "male" | "female" | "other") => {
  const accessoriesType = generateRandomElementFromArray(accessoriesOptions);
  const avatarStyle = generateRandomElementFromArray(["Circle", "Transparent"]);
  const clothColor = generateRandomElementFromArray(clothColorOptions);
  const clothType = generateRandomElementFromArray(clothOptions);
  const facialHairColor = generateRandomElementFromArray(
    facialHairColorOptions
  );
  const facialHairType =
    gender === "female" || gender === "other"
      ? "Blank"
      : generateRandomElementFromArray(facialHairOptions);
  const skinColor = "light";
  const topType =
    gender === "female"
      ? generateRandomElementFromArray(femaleHairOptions)
      : generateRandomElementFromArray(maleHairOptions);
  const topColor = generateRandomElementFromArray(hairColorOptions);

  const url = `https://avataaars.io/?accessoriesType=${accessoriesType}&avatarStyle=${avatarStyle}&clotheColor=${clothColor}&clotheType=${clothType}&facialHairColor=${facialHairColor}&facialHairType=${facialHairType}&hairColor=${topColor}&skinColor=${skinColor}&topType=${topType}`;
  try {
    const data = await axios.get(url);
    return data.data;
  } catch (err) {
    return "";
  }
};
