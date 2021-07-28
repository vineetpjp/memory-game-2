import fs from "fs";
import { genUtil } from "../utils/genUtil.js";

export class GameController {
  static initGame(req, res) {
    const level = req.body.level;
    const data = genUtil.generateRandomArrayData(level);
    const jsonString = JSON.stringify(data);
    const filePath = genUtil.getFilePathById(data.file_id);

    fs.writeFile(filePath, jsonString, (err) => {
      if (err) {
        res.status(400).send("try again! Something went wrong!!");
      } else {
        res.json({ init: true, file_id: data.file_id });
      }
    });
  }

  static async getTableCard(req, res) {
    const { file_id } = req.headers;
    const { card1Index, card2Index } = req.query;
    const obj = genUtil.readFile(file_id);
    if (card2Index == -1) {
      try {
        const value = obj.arr[card1Index];
        res.json({ data: value });
      } catch (error) {
        console.log(error);
      }
    } else {
      const value1 = obj.arr[card1Index];
      const value2 = obj.arr[card2Index];
      const currentErrScore = obj.errScore;

      if (value1 == value2) {
        res.json({
          card2value: value2,
          match: true,
          errScore: currentErrScore,
        });
        return;
      }

      genUtil.writeFileErrScore(file_id, currentErrScore + 1);
      res.json({
        card2value: value2,
        match: false,
        errScore: currentErrScore + 1,
      });
    }
  }

  static deleteFile(req, res) {
    const { file_id } = req.headers;

    const path = genUtil.getFilePathById(file_id);
    fs.unlinkSync(path);
    res.send({ success: true });
  }
}
