import { v4 } from "uuid";
import fs, { readFileSync } from "fs";
import { join, resolve } from "path";

export class genUtil {
  static getRandomArrayWithDoubles(size) {
    let repeat = {};
    let arr = [];
    while (arr.length < size * 2) {
      let r = Math.floor(Math.random() * size) + 1;
      if (!repeat[r]) {
        arr.push(r);
        repeat[r] = 1;
      } else if (repeat[r] < 2) {
        arr.push(r);
        repeat[r]++;
      }
    }

    return arr;
  }

  static generateRandomArrayData(level) {
    let file_id = v4();
    let size = level == 1 ? 5 : level == 2 ? 10 : 25;
    let arr = [];
    arr = genUtil.getRandomArrayWithDoubles(size);

    return { file_id, arr, errScore: 0 };
  }

  static getFilePathById(id) {
    return join(resolve(), "game-boards", `${id}.json`);
  }

  static readFile(id) {
    try {
      const path = genUtil.getFilePathById(id);
      const data = fs.readFileSync(path);
      return JSON.parse(data);
    } catch (error) {
      throw error;
    }
  }

  static writeFileErrScore(id, errScore) {
    try {
      const obj = genUtil.readFile(id);
      const filePath = genUtil.getFilePathById(id);

      const newData = {
        ...obj,
        errScore,
      };
      fs.writeFileSync(filePath, JSON.stringify(newData));
    } catch (error) {
      throw error;
    }
  }
}
