import { useEffect } from "react";
import "./App.css";
import { joinQuestionerRoom, socketDisconnect, socketInit } from "./lib/socket";
import { Route, Routes, useNavigate } from "react-router-dom";
import Welcome from "./pages/welcome";
import ThankYou from "./pages/thank-you";
import QuestionSelection from "./pages/question-selection";
import SectionIntro from "./pages/section-intro";
import Questioner from "./pages/questioner";
import DoneWaiting from "./pages/done-waiting";
import Done from "./pages/done";
import CompatibilityCheck from "./pages/compactibility-check";
import Invitation from "./pages/invitation";
import { useLocation } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const connectionId = localStorage.getItem("connectionId");

  useEffect(() => {
    if (connectionId) {
      joinQuestionerRoom(connectionId);
    } else {
      // navigate("/");
    }

    return () => {
      socketDisconnect();
    };
  }, []);

  useEffect(() => {
    console.log(location.pathname)
    if (!connectionId && location.pathname !== "/invitation") {
      navigate("/");
    }
  }, [location.pathname, navigate]);

  socketInit();
  return (
    <>
      <Routes>
        <Route path="/" element={<Welcome />} />

        {connectionId && (
          <>
            {" "}
            <Route path="/invite-sent" element={<ThankYou />} />
            <Route path="/selection" element={<QuestionSelection />} />
            <Route path="/intro" element={<SectionIntro />} />
            <Route path="/questioner" element={<Questioner />} />
            <Route path="/done-waiting" element={<DoneWaiting />} />
            <Route path="/done" element={<Done />} />
            <Route path="/check" element={<CompatibilityCheck />} />{" "}
          </>
        )}
        <Route path="/invitation" element={<Invitation />} />
      </Routes>{" "}
    </>
  );
}

export default App;
