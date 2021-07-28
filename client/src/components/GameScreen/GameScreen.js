import React, { useEffect, useState, useRef } from "react";
import { gameUtil } from "../../util/gameUtil";
import setAuthToken from "../../util/setAuthToken";
import Timer from "./Timer";
import { Link } from "react-router-dom";
import Table from "./Table";

const CARD_REVEAL_TIME = 2000;
function GameScreen({ location: { level } }) {
  const [table, setTable] = useState([]);
  const [activeCard1, setActiveCard1] = useState(null);
  const [activeCard2, setActiveCard2] = useState(null);
  const [activeCard1Value, setActiveCard1Value] = useState(null);
  const [activeCard2Value, setActiveCard2Value] = useState(null);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [errorScore, setErrorScore] = useState(0);
  const card2Timer = useRef(null);
  const card1Turn = useRef(true);
  const prevClickedCard1Index = useRef(null);

  useEffect(() => {
    (async () => {
      await initData();
    })();
  }, []);

  useEffect(() => {
    if (gameCompleted) {
      deleteFile();
    }
  }, [gameCompleted]);

  const deleteFile = async () => {
    await gameUtil.deleteFile();
  };

  const initData = async () => {
    try {
      const gameLevel = level || 1;
      const { file_id } = await gameUtil.initGame(gameLevel);
      setAuthToken(file_id);
      const noOfCards = gameUtil.getCardsNoFromLevel(gameLevel);
      const arr = new Array(noOfCards).fill(-1).map((_, index) => index + 1);

      setTable(arr);
    } catch (e) {
      console.log(e);
    }
  };

  const onCard1Click = async (index) => {
    setActiveCard1(index);
    const { data } = await gameUtil.getCardValue(index);
    setActiveCard1Value(data);
  };

  const onCard2Click = async (index) => {
    setActiveCard2(index);
    const { card2value, match, errScore } = await gameUtil.getCardValue(
      activeCard1,
      index
    );
    setActiveCard2Value(card2value);
    const newTable = [...table];
    if (match) {
      newTable[activeCard1] = "matched";
      newTable[index] = "matched";
      const allEqualTable = newTable.every(
        (indexValue) => indexValue === "matched"
      );
      if (allEqualTable) {
        setGameCompleted(true);
      }
    }
    card2Timer.current = setTimeout(() => {
      setActiveCard2Value(null);
      card2Timer.current = null;
      setActiveCard1Value(null);
      setTable(newTable);
    }, CARD_REVEAL_TIME);

    setErrorScore(errScore);
  };

  const onCardClick = async (index) => {
    if (card2Timer.current == null && prevClickedCard1Index.current !== index) {
      if (card1Turn.current) {
        prevClickedCard1Index.current = index;
        card1Turn.current = false;
        onCard1Click(index);
      } else {
        card1Turn.current = true;
        onCard2Click(index);
      }
    }
  };

  return (
    <div>
      <div className={"flex-horizontal"}>
        <Timer isCompleted={gameCompleted} />
        <div className={"header-item"}>Error Score: {errorScore}</div>
      </div>
      {gameCompleted ? (
        <div className={"flex-center"}>
          <Link to={"/"} className={"header-item"}>
            Start Again
          </Link>
        </div>
      ) : null}
      <div className={"flex-horizontal"}>
        <div>
          <Table
            onCardClick={onCardClick}
            table={table}
            activeCard1={activeCard1}
            activeCard2={activeCard2}
            activeCard1Value={activeCard1Value}
            activeCard2Value={activeCard2Value}
          />
        </div>
      </div>
    </div>
  );
}

export default GameScreen;
