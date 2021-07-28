import React from "react";

function Table({
  table,
  activeCard1,
  activeCard1Value,
  activeCard2,
  activeCard2Value,
  onCardClick,
}) {
  const getCardValueByIndex = (
    index,
    activeCard1,
    activeCard1Value,
    activeCard2,
    activeCard2Value
  ) => {
    if (index === activeCard1 && activeCard1Value) {
      return { active: "active-card", cardValue: activeCard1Value };
    } else if (index === activeCard2 && activeCard2Value) {
      return { active: "active-card", cardValue: activeCard2Value };
    }
    return { active: "", cardValue: null };
  };

  const renderTable = () => {
    return table.map((card, index) => {
      const { active, cardValue } = getCardValueByIndex(
        index,
        activeCard1,
        activeCard1Value,
        activeCard2,
        activeCard2Value
      );
      return (
        <div key={index}>
          {card === "matched" ? (
            <div className={`empty-card`}>?</div>
          ) : (
            <div
              onClick={() => onCardClick(index)}
              className={`card ${active}`}
            >
              {" "}
              {cardValue ? cardValue : "?"}
            </div>
          )}
        </div>
      );
    });
  };

  return <div className={"table-container"}>{renderTable()}</div>;
}

export default Table;
