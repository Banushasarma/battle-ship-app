import React, { useState, useEffect } from "react";
import axios from "axios";
import './App.css';

const API_URL = "https://localhost:7058/api/game"; // Update the URL if necessary

function App() {
  const [grid, setGrid] = useState([]);
  const [message, setMessage] = useState("");
  const [remainingShips, setRemainingShips] = useState([]);

  // Load the initial grid status
  useEffect(() => {
    getStatus();
  }, []);

  // Get the grid status from the API
  const getStatus = async () => {
    try {
      const response = await axios.get(`${API_URL}/status`);
      setGrid(response.data.board);
      setRemainingShips(response.data.remainingShips);
    } catch (error) {
      console.error("Error fetching game status:", error);
    }
  };

  // Handle firing at a specific grid location
  const fireShot = async (row, col) => {
    const position = String.fromCharCode(65 + row) + (col + 1); // Convert to "A5" format
    try {
      const response = await axios.post(`${API_URL}/fire`, position, {
        headers: { 'Content-Type': 'application/json' }
      });
      setMessage(response.data.result);
      if (response.data.message) {
        setMessage(response.data.message);
      }
      getStatus(); // Refresh the grid after firing
    } catch (error) {
      console.error("Error firing shot:", error);
    }
  };

  // Render the game grid
  const renderGrid = () => {
    return grid.map((row, rowIndex) => (
      <div key={rowIndex} className="grid-row">
        {row.map((cell, colIndex) => (
          <div
            key={colIndex}
            className={`grid-cell ${cell === "X" ? "hit" : cell === "O" ? "miss" : ""}`}
            onClick={() => fireShot(rowIndex, colIndex)}
          >
            {cell}
          </div>
        ))}
      </div>
    ));
  };

  return (
    <div className="App">
      <h1>Battleship Game</h1>
      <div className="game-grid">{renderGrid()}</div>
      <div className="game-info">
        <p>{message}</p>
        <h3>Remaining Ships:</h3>
        <ul>
          {remainingShips.map((ship, index) => (
            <li key={index}>{ship}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;