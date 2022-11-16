import React, { useEffect, useState } from "react";
import "../../styles/SignIn_Register.css";
import { Link, Route, Routes } from "react-router-dom";
import Background from "../../heroPic.jpg";

import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import AddLeague from "./AddLeague";
import AddTeam from "./AddTeam";
import ChildModal from "./ChildModal";

export default function Profile({ props }) {
  const [userInfo, setUserInfo] = useState({ name: "", email: "" });
  const [numTeamsFollowing, setNumTeamsFollowing] = useState(0);
  const [numLeaguesFollowing, setNumLeaguesFollowing] = useState(0);
  const [favouriteTeams, setFavouriteTeams] = useState();
  const [favouriteLeagues, setFavouriteLeagues] = useState();
  const [LeagueModal, setLeagueModal] = useState(false);
  const [TeamModal, setTeamModal] = useState(false);

  const [leagueModalShow, setLeagueModalShow] = useState(false);
  const [TeamModalShow, setTeamModalShow] = useState(false);

  const [leagueId, setLeagueID] = useState();

  const [ShowChildModal, setShowChildModal] = useState(false);


  useEffect(() => {
    console.log(leagueId)
    const userID = localStorage.getItem("userid");
    fetch("/user/Info", {
      headers: {
        userID: userID,
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((result) => setUserInfo(result[0]));

    fetch("/user/Teams", {
      headers: {
        userID: userID,
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      if (res.status === 200) {
        res.json().then((arr) => {
          setNumTeamsFollowing(arr.length);
          setFavouriteTeams(arr);
        });
      } else {
        setFavouriteTeams([]);
        setNumTeamsFollowing(0);
      }
    });

    // fetch("/user/Leagues", {
    //   headers: {
    //     userID: userID,
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   },
    // }).then((res) => {
    //   if (res.status === 200) {
    //     res.json().then((arr) => {
    //       setNumTeamsFollowing(arr.length);
    //       setFavouriteLeagues(arr);
    //     });
    //   } else {
    //     setFavouriteLeagues([]);
    //     setNumTeamsFollowing(0);
    //   }
    // });
  }, []);

  const AddLeaguefunction = () => {
    setLeagueModalShow(true);
    setLeagueModal(true);
  };

  const AddTeamfunction = () => {
    setTeamModal(true);
    setTeamModalShow(true);
    console.log("test");
  };

  return (
    <>
      <div>
        <div>
          <div>
            <div>
              <div
                style={{
                  backgroundImage: `url(${Background})`,
                  height: "250px",
                }}
              >
                <div>
                  <img
                    src="https://campussafetyconference.com/wp-content/uploads/2020/08/iStock-476085198.jpg"
                    alt="Generic placeholder image"
                    className="img-fluid img-thumbnail mt-4 mb-2"
                    style={{ width: "150px", margin: "20px" }}
                  />
                </div>
                <div className="ms-3" style={{ marginTop: "90px" }}>
                  <h5>{userInfo.name}</h5>
                  <p>{userInfo.email}</p>
                </div>
              </div>
              <div
                className="p-4 text-black"
                style={{ backgroundColor: "#f8f9fa" }}
              >
                <div className="d-flex justify-content-end text-center py-1">
                  <div>
                    <p className="mb-1 h5">{numLeaguesFollowing}</p>
                    <p className="small text-muted mb-0">Leagues Following</p>
                  </div>
                  <div className="px-3">
                    <p className="mb-1 h5">{numTeamsFollowing}</p>
                    <p className="small text-muted mb-0">Teams Following</p>
                  </div>
                </div>
              </div>
              <div className="card-body p-4 text-black">
                <div className="mb-5">
                  <p className="lead fw-normal mb-1">Favourite Leagues</p>
                  <div className="p-4" style={{ backgroundColor: "#f8f9fa" }}>
                    <p className="font-italic mb-1">Web Developer</p>
                  </div>
                  <button
                    as={Link}
                    to="/User/Addleague"
                    onClick={() => {
                      AddLeaguefunction();
                    }}
                  >
                    {" "}
                    Add a league
                  </button>
                  <p></p>
                  <p className="lead fw-normal mb-1">Favourite Teams</p>
                  <div className="p-4" style={{ backgroundColor: "#f8f9fa" }}>
                    <p className="font-italic mb-1">Web Developer</p>
                  </div>
                  <button
                    onClick={() => {
                      AddTeamfunction();
                    }}
                  >
                    {" "}
                    Add a team
                  </button>
                </div>

                <FullCalendar
                  plugins={[dayGridPlugin]}
                  headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth timeGridWeek timeGridDay",
                  }}
                  initialView="dayGridMonth"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {LeagueModal === true && (
        <AddLeague show={leagueModalShow} setShow={setLeagueModalShow} />
      )}
      {TeamModal===true && <AddTeam setShowChildModal={setShowChildModal} setLeagueID={setLeagueID} TeamModalShow={TeamModalShow} setTeamModalShow={setTeamModalShow}/>}
      {ShowChildModal===true && <ChildModal leagueId={leagueId} setShowChildModal={setShowChildModal} ShowChildModal={ShowChildModal}/>}
    </>
  );
}