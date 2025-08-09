import styles from './help.module.scss'
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import LiveHelpIcon from "@mui/icons-material/LiveHelp";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";

const Help= () => {
    const boxRef = useRef<HTMLDivElement | null>(null);
  const [activeNumber, setActiveNumber] = React.useState(0);

  function handleEvent(event: MouseEvent) {
    // console.log("event", event);
    const target_element = event.target as HTMLDivElement;
    const closest_element = target_element.closest(
      "#question"
    ) as HTMLDivElement;
    const activeElemntClosest = closest_element.closest(
      ".box"
    ) as HTMLDivElement;
    const activeNumberCurr = Number(
      activeElemntClosest.getAttribute("data-number")
    );
    // console.log("target", target_element);
    // console.log(activeNumber, activeNumberCurr);

    if (activeNumberCurr !== activeNumber) {
      setActiveNumber(activeNumberCurr);
      // const nextSibling = closest_element?.nextSibling as HTMLDivElement;

      // console.log("current target", event.currentTarget);
    }
    if (activeNumberCurr === activeNumber) {
      setActiveNumber(0);
    }
  }

  React.useEffect(() => {
    boxRef.current?.addEventListener("click", handleEvent);
    return () => {
      boxRef.current?.removeEventListener("click", handleEvent);
    };
  }, [activeNumber]);
  React.useEffect(() => {
    const allElement = document.querySelectorAll(".box");
    allElement.forEach((element) => {
      const box_number = Number(element.getAttribute("data-number"));
      if (box_number !== activeNumber) {
        const newArray: Array<HTMLDivElement> = [
        //   ...element.children,
        ] as Array<HTMLDivElement>;
        newArray.forEach((el: HTMLDivElement) => {
          if (el.classList.contains(styles.box_answer)) {
            el.style.minHeight = "0";
            el.style.maxHeight = "0";
          }
        });
      }
      if (box_number === activeNumber) {
        const newArray: Array<HTMLDivElement> = [
        //   ...element.children,
        ] as Array<HTMLDivElement>;
        newArray.forEach((el: HTMLDivElement) => {
          if (el.classList.contains(styles.box_answer)) {
            el.style.maxHeight = "20rem";
          }
        });
      }
    });
  }, [activeNumber]);

  const navigate = useNavigate();

  const handleTabChange = (tab: string) => {
    if (tab === "contactus") {
      navigate("contact-us");
    } else if (tab === "videos") {
      navigate("videos");
    } else if (tab === "manuals") {
      navigate("manuals");
    } else if (tab === "tickets") {
      navigate("tickets");
    }
  };
  return (
    <>
      <div className={styles.container}>
        <div className={styles.container_top}>
          <h2 className={styles.heading}>How Can We Help?</h2>
          <div className={styles.search_box}>
            <input
              type="text"
              placeholder="Search for a question"
              id="help_input"
            />
            <label htmlFor="help_input">
              <SearchIcon />
            </label>
          </div>
        </div>
        <div className={styles.container_cards}>
          <div
            className={styles.card + " " + styles.card_2}
            onClick={() => handleTabChange("videos")}
          >
            <div className={styles.card_icon}>
              <OndemandVideoIcon fontSize="large" />
            </div>
            <h4>Videos</h4>
          </div>
          <div
            className={styles.card + " " + styles.card_3}
            onClick={() => handleTabChange("manuals")}
          >
            {" "}
            <div className={styles.card_icon}>
              <LiveHelpIcon fontSize="large" />
            </div>
            <h4>Manuals</h4>
          </div>
          <div
            className={styles.card + " " + styles.card_4}
            onClick={() => handleTabChange("tickets")}
          >
            <div className={styles.card_icon}>
              <ConfirmationNumberIcon fontSize="large" />
            </div>
            <h4>Tickets</h4>
          </div>
        </div>
        <div className={styles.container_questions}>
          <h1 className={styles.left}>Frequently Asked Questions</h1>
          <div className={styles.right} ref={boxRef}>
            <div className={`${styles.box} box`} data-number={1}>
              <div className={styles.box_question} id="question">
                <h3>How do I create a new patient?</h3>
                {activeNumber === 1 ? (
                  <RemoveIcon fontSize="large" />
                ) : (
                  <AddIcon fontSize="large" />
                )}
              </div>
              <div className={styles.box_answer}>
                To create a new patient, click on the "Add Patient".
              </div>
            </div>
            <div className={`${styles.box} box`} data-number={2}>
              <div className={styles.box_question} id="question">
                <h3>How can I reset my password?</h3>
                {activeNumber === 2 ? (
                  <RemoveIcon fontSize="large" />
                ) : (
                  <AddIcon fontSize="large" />
                )}
              </div>
              <div className={styles.box_answer}>
                To reset your password, go to the profile page and add "New
                Password" and "Confirm Password" then click on Update Changes.
              </div>
            </div>
            <div className={`${styles.box} box`} data-number={3}>
              <div className={styles.box_question} id="question">
                <h3>How can I update my profile ?</h3>
                {activeNumber === 3 ? (
                  <RemoveIcon fontSize="large" />
                ) : (
                  <AddIcon fontSize="large" />
                )}
              </div>
              <div className={styles.box_answer}>
                To update your profile, go to the profile page and "Upload
                Image" and then click on Update Changes
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Help