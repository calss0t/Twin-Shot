import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import "../../styles/ChooseLeague.css";
import Modal from "react-bootstrap/Modal";

export default function ChildModal({ leagueId, ShowChildModal, setShowChildModal }) {

  const [teamsArray, setTeamsArray] = useState([]);

  const [teams, setTeams] = useState([]);

  useEffect(() => {
    console.log(leagueId)
    fetch("/soccer/teams", {
      headers: {
        leagueID: leagueId,
      },
    })
      .then((res) => res.json())
      .then((arr) => {
        setTeamsArray(arr);
      });
  }, [leagueId]);

  const closePopup = () => {
    setShowChildModal(false);
  };

  function submit() {
    // const data = { name, sets, reps };
    // (async () => {
    //   const rawResponse = await fetch(
    //     `/testing/ex/${localStorage.getItem("userid")}/${date}`,
    //     {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //         Accept: "*/*",
    //         "Accept-Encoding": "gzip, deflate, br",
    //         Connection: "keep-alive",
    //         "Content-Length": 123,
    //         Authorization: `Bearer ${localStorage.getItem("token")}`,
    //       },
    //       body: JSON.stringify(data),
    //     }
    //   );
    // })();
    setShowChildModal(false);
  }

  const renderCard = (card) => {
    return (
      <Card key={card.id} id={card.id + "top"} className="League_card">
        <Card.Img
          onClick={() => {
            document
              .getElementById(`${card.id}top`)
              .classList.toggle("League_card_selected");
            teams.push(card.id);
          }}
          className="League_Logo"
          alt={`${card.name} poster`}
          src={card.logo}
        ></Card.Img>
        {<br></br>}
        <Card.Title
          onClick={() => {
            document
              .getElementById(`${card.id}top`)
              .classList.toggle("League_card_selected");
            teams.push(card.id);
          }}
          className="League_name"
        >
          {card.name}
        </Card.Title>
      </Card>
    );
  };

  return (
    <>
      <Modal className="modal_2" show={ShowChildModal} onHide={closePopup}>
        <div className="League_selection">
          <h1 className="page_title">Now choose a teams</h1>
          {teamsArray.length == 0 ? (
            <h3>Loading, please wait</h3>
          ) : (
            teamsArray.map(renderCard)
          )}
          {<br></br>}
          {<br></br>}
          {<br></br>}
          {<br></br>}
          <div className="Submit_button">
            <Button className="button" onClick={submit}>
              Submit selection
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}