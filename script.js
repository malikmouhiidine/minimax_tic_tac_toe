let boardState = Array(9).fill(null);

const oSVG = `<svg xmlns="http://www.w3.org/2000/svg" data-player="O" viewBox="0 0 448 512"> <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --> <path d="M224 32.01c-123.5 0-224 100.5-224 224s100.5 224 224 224s224-100.5 224-224S347.5 32.01 224 32.01zM224 416c-88.22 0-160-71.78-160-160s71.78-159.1 160-159.1s160 71.78 160 159.1S312.2 416 224 416z" /></svg>`;
const xSVG = `<svg xmlns="http://www.w3.org/2000/svg" data-player="X" viewBox="0 0 384 512"> <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --> <path d="M376.6 427.5c11.31 13.58 9.484 33.75-4.094 45.06c-5.984 4.984-13.25 7.422-20.47 7.422c-9.172 0-18.27-3.922-24.59-11.52L192 305.1l-135.4 162.5c-6.328 7.594-15.42 11.52-24.59 11.52c-7.219 0-14.48-2.438-20.47-7.422c-13.58-11.31-15.41-31.48-4.094-45.06l142.9-171.5L7.422 84.5C-3.891 70.92-2.063 50.75 11.52 39.44c13.56-11.34 33.73-9.516 45.06 4.094L192 206l135.4-162.5c11.3-13.58 31.48-15.42 45.06-4.094c13.58 11.31 15.41 31.48 4.094 45.06l-142.9 171.5L376.6 427.5z" /></svg>`;

const slots = Array.from(document.getElementsByClassName("slot"));

slots.forEach((slot, i) => {
  slot.addEventListener("click", () => {
    move(i, boardState, false);
    updatebord();

    let bestNextMove = useMinimax(boardState);
    move(bestNextMove.index, boardState, true);
    updatebord();
  });
});

const move = (index, boardState, isBot) => {
  if (whoWon(boardState) == 0 && !boardState[index])
    boardState[index] = isBot ? oSVG : xSVG;
};

const updatebord = () =>
  slots.forEach((slot, i) => (slot.innerHTML = boardState[i]));

const whoWon = (boardState) => {
  const winningCombinations = [
    [0, 1, 2],
    [2, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (combination of winningCombinations) {
    if (combination.every((i) => boardState[i] == xSVG)) {
      return -1;
    } else if (combination.every((i) => boardState[i] == oSVG)) {
      return 1;
    }
  }
  return 0;
};

const isFull = (boardState) => !boardState.includes(null);

function useMinimax(boardState) {
  let bestNextMove = { index: null, score: -1 };
  for (const [index, slot] of boardState.entries()) {
    if (slot == null) {
      const cloneBoardState = [...boardState];
      cloneBoardState[index] = oSVG;
      const score = minimax(cloneBoardState, 9, false);
      if (score >= bestNextMove.score) {
        bestNextMove = { index, score };
      }
    }
  }
  return bestNextMove;
}

function minimax(boardState, depth, maxi) {
  if (depth == 0 || isFull(boardState) || whoWon(boardState) != 0)
    return whoWon(boardState);

  if (maxi) {
    let value = -1;
    for (const [i, slot] of boardState.entries()) {
      if (slot == null) {
        const cloneBoardState = [...boardState];
        cloneBoardState[i] = oSVG;
        const score = minimax([...cloneBoardState], depth - 1, false);
        value = Math.max(value, score);
      }
    }
    return value;
  } else {
    let value = 1;
    for (const [i, slot] of boardState.entries()) {
      if (slot == null) {
        const cloneBoardState = [...boardState];
        cloneBoardState[i] = xSVG;
        const score = minimax([...cloneBoardState], depth - 1, true);
        value = Math.min(value, score);
      }
    }
    return value;
  }
}

// If u want the bot to start first
// let bestNextMove = useMinimax(boardState);
// move(bestNextMove.index, boardState, true);
// updatebord();
