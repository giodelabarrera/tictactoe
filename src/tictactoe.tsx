import { useState } from "react"
import './tictactoe.css'

type Player = 'X' | 'O'

type Board = Map<PositionKey, Player | undefined>

type PositionKey = '1_1' | '1_2' | '1_3' | '2_1' | '2_2' | '2_3' | '3_1' | '3_2' | '3_3';

type RowValue = 1 | 2 | 3

type ColumnValue = 1 | 2 | 3

const POSITION_WINNING_LINES: Array<[PositionKey, PositionKey, PositionKey]> = [
  // vertical
  ['1_1', '1_2', '1_3'],
  ['2_1', '2_2', '2_3'],
  ['3_1', '3_2', '3_3'],
  // horizontal
  ['1_1', '2_1', '3_1'],
  ['1_2', '2_2', '3_2'],
  ['1_3', '2_3', '3_3'],
  // diagonal
  ['1_1', '2_2', '3_3'],
  ['1_3', '2_2', '3_1'],
]

const INITIAL_PLAYER = 'X'

function TicTacToe() {
  const [player, setPlayer] = useState<Player>(INITIAL_PLAYER)
  const [board, setBoard] = useState<Board>(() => initialBoardState())

  const winner = determineWinner(board)

  const makeHandleCellClick = (boardKey: PositionKey) => () => {
    setBoard(prev => {
      const newBoard = new Map(prev)
      newBoard.set(boardKey, player)
      return newBoard
    })
    setPlayer(prev => getInversePlayer(prev))
  }

  const handleReset = () => {
    setBoard(new Map(initialBoardState()))
    setPlayer(INITIAL_PLAYER)
  }

  return (
    <div className="tictactoe">
      <div className="tictactoe__status">
        <span aria-live="polite">{getStatus(winner, board, player)}</span>
      </div>
      <div className="tictactoe__board">
        {Array.from(board.keys()).map(boardKey => {
          const [row, column] = boardKey.split('_')
          return <Cell
            key={boardKey}
            player={player}
            row={Number(row) as RowValue}
            column={Number(column) as ColumnValue}
            disabled={Boolean(winner || (board.get(boardKey)))}
            onClick={makeHandleCellClick(boardKey)}
          >
            {board.get(boardKey)}
          </Cell>
        })}
      </div>
      <div className="tictactoe__reset">
        <button type="button" onClick={handleReset}>Reset</button>
      </div>
    </div >
  );
}

type CellProps = {
  player: Player;
  row: RowValue;
  column: ColumnValue;
  disabled: boolean | undefined;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
};

function Cell({ player, row, column, disabled, onClick, children }: CellProps) {
  return (
    <button
      aria-label={`Mark cell as ${player} in row ${row} and column ${column}`}
      className="tictactoe__cell"
      type="button"
      disabled={disabled}
      onClick={onClick}
    >
      <span aria-hidden="true" className="tictactoe__cell-value">{children}</span>
    </button>
  )
}

function initialBoardState() {
  const mapArray: Array<[PositionKey, undefined]> = []
  for (let i = 1; i <= 3; i++) {
    for (let j = 1; j <= 3; j++) {
      mapArray.push([`${i}_${j}` as PositionKey, undefined])
    }
  }
  return new Map(mapArray)
}

function getStatus(winner: Player | undefined, board: Board, player: Player) {
  if (winner) return `Player ${winner} wins!`

  const fullBoard = Array.from(board.values()).every(Boolean)
  if (fullBoard) return 'Players draw!'

  return `Player ${player} turn`
}

function determineWinner(board: Board) {
  for (const winningLine of POSITION_WINNING_LINES) {
    const positionsToCheck = [
      board.get(winningLine[0]),
      board.get(winningLine[1]),
      board.get(winningLine[2])
    ]
    const player = board.get(winningLine[0])
    const hasWinner = positionsToCheck.every(currentPlayer => currentPlayer === player)
    if (hasWinner) return player
  }
  return undefined
}

function getInversePlayer(player: Player): Player {
  return player === 'X' ? 'O' : 'X';
}

export default TicTacToe