import axios from "axios";

export class gameUtil {
  static getCardsNoFromLevel(level) {
    return level === 1 ? 10 : level === 2 ? 20 : 50;
  }

  static async initGame(level) {
    const response = await axios.post("/create", {
      level,
    });
    if (response?.data) {
      return response.data;
    }
    return { init: false, file_id: null };
  }

  static async getCardValue(card1Index, card2Index = -1) {
    const response = await axios.get("/card", {
      params: {
        card1Index: card1Index,
        card2Index: card2Index,
      },
    });
    if (response?.data) {
      return response.data;
    }
    return null;
  }

  static async deleteFile() {
    await axios.delete("/");
  }
}
