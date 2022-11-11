const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const express = require("express");
const app = express();
const knex = require("./knex"); // Maybe I will have to change this
const PORT = process.env.PORT || 8080;
//const jwt = require('jsonwebtoken');
require("dotenv").config({ path: "./.env.local" });

const path = require("path");
app.use(express.static(path.resolve(__dirname, "../frontend/build")));

app.use(express.json());

// app.get('/logIn', (req, res)=>{

//     return
//     res.status(200);
//     res.send(`name of DB User: ${process.env.DB_USER}`);
// });

// app.get('/register', (req,res) => {

// })

// var HeadersAPISports = new Headers();
// myHeaders.append("x-rapidapi-key", `${process.env.API_FOOTBALL}`);
// myHeaders.append("x-rapidapi-host", "v3.football.api-sports.io");

// var requestOptions = {
//   method: 'GET',
//   headers: HeadersAPISports,
//   redirect: 'follow'
// };

// fetch("https://v3.football.api-sports.io/{endpoint}", requestOptions)
// .then(response => response.text())
// .then(result => console.log(result))
// .catch(error => console.log('error', error));

app.get("/", (req, res) => {
  res.status(200);
  res.send(`name of DB User: ${process.env.DB_USER}`);
});

app.get("/soccer/leagues", async (req, res) => {
  const leagues = await knex.select("*").from("leagues");
  res.send(leagues);
});

app.get("/soccer/teams", (req, res) => {
  const leagueID = req.get("leagueID");
  fetch(`${process.env.API_URL}/teams?league=${leagueID}&season=2022`, {
    method: "GET",
    headers: {
      "x-rapidapi-host": `${process.env.API_HOST}`,
      "x-rapidapi-key": `${process.env.API_KEY}`,
    },
  })
    .then((response) => response.json())
    .then((result) => {
      const teamsArray = [];
      result.response.forEach((element) => {
        teamInfo = {};
        teamInfo.id = element.team.id;
        teamInfo.name = element.team.name;
        teamInfo.logo = element.team.logo;
        teamsArray.push(teamInfo);
      });
      return teamsArray;
    })
    .then((resultArray) => res.send(resultArray))
    .catch((error) => console.log("error", error));
});

app.get("/soccer/games", async (req, res) => {
  const teamIDs = req.get("teamIDs");
  const teamsIDArray = teamIDs.split(",");
  const date = req.get("DateSelected") ? req.get("DateSelected") : "2022-11-10";
  console.log(date)
  const FetchgamesPromises = teamsIDArray.map((ID) => {
    return fetch(
      `${process.env.API_URL}/fixtures?date=${date}&season=2022&team=${ID}&timezone=ASIA%2FTOKYO`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-host": `${process.env.API_HOST}`,
          "x-rapidapi-key": `${process.env.API_KEY}`,
        },
      }
    ).then((resposne) => resposne.json());
  });

  await Promise.all(FetchgamesPromises)
    .then((result) => {
      const GamesInfo =[]
      result.forEach((game) => {
        if (game.response.length >= 1) {
          const gameInfo = {};
          gameInfo.FixtureID = game.response[0].fixture.id;
          gameInfo.status = game.response[0].fixture.status;
          gameInfo.home = game.response[0].teams.home;
          gameInfo.away = game.response[0].teams.away;
          gameInfo.goals = game.response[0].goals;
          GamesInfo.push(gameInfo);
        }
      })
      return GamesInfo
      }).then((FinalArray) => res.send(FinalArray))
});

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/build", "index.html"));
});

app.listen(PORT, (error) => {
  if (!error)
    console.log(
      "Server is Successfully Running, and App is listening on port " + PORT
    );
  else console.log("Error occurred, server can't start", error);
});