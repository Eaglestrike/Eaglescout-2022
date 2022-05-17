import React from 'react'
import {useEffect, useState } from 'react'

const Game = () => {
  const [game, setGame] = useState("");
  useEffect(() => {
      fetch("")
  })
  const fetchGame = async () => {
      if(game == null) return null;
      var response = await fetch(`${window.location.hostname}:5000/api/game/name.${game}`);
      var data = response.json();
  }
  return (
    <div>
        <h2>
            Edit and view games
        </h2>
        <div id="curGame">
            <div id="general">

            </div>
            <div id="observationForm">

            </div>
            <div id="pitScoutingForm">

            </div>
            <div id="filters">
            </div> 
        </div>
    </div>
  )
}

export default Game