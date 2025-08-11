import styles from "./help.module.scss";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import LiveHelpIcon from "@mui/icons-material/LiveHelp";
// import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import InfoIcon from "@mui/icons-material/Info";
import { Button } from "@mui/material";
import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material";
import { Role_NAME, SCOPE_LIST } from "../../utility/role";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../store/user/user.selector";
import { authFetch } from "../../axios/useAuthFetch";
import { departmentType } from "../../types";
// import TemplatePdf from "./TemplatePdf";
// import SearchIcon from "@mui/icons-material/Search";
// import help_poster from "./../../../../src/assets/help_background.jpg";
function HelpStaff() {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const [activeNumber, setActiveNumber] = React.useState(0);
  const user = useSelector(selectCurrentUser);
  const [departmentData, setDepartmentData] = React.useState<departmentType[]>(
    []
  );

  // Data you have
  const availableScopes = user?.scope?.split("#").map(Number) || [];

  // Filter SCOPE_LIST based on available scopes
  const filteredScopeList = Object.fromEntries(
    Object.entries(SCOPE_LIST).filter(([_, value]) =>
      availableScopes.includes(value)
    )
  );

  const faqData = [
    {
      id: 1,
      question: "How do I create a new patient?",
      answer: 'To create a new patient, click on the "Add Patient".',
    },
    {
      id: 2,
      question: "How can I reset my password?",
      answer:
        'To reset your password, go to the profile page and add "New Password" and "Confirm Password" then click on Update Changes.',
    },
    {
      id: 3,
      question: "How can I update my profile ?",
      answer:
        'To update your profile, go to the profile page and "Upload Image" and then click on Update Changes.',
    },
  {
  id: 4,
  question: "How Admin can add Staff ?",
  answer: (
    <div>
      <h1>
        Note:
        <span style={{ fontWeight: 100 }}> Upload staff details!!</span>
      </h1>
      <ul style={{ paddingLeft: "20px" }}>
        <li>
          <strong>Roles:</strong>&nbsp;
          {Object.entries(Role_NAME)
            .filter(([key]) => !["sAdmin", "customerCare", "admin"].includes(key))
            .map(([key, value]) => `${key.replace(/([A-Z])/g, " $1")} - ${value}`)
            .join(", ")}
        </li>
        <li>
          <strong>Gender:</strong>&nbsp; Male: 1, Female: 2, Others: 3
        </li>
        <li>
          <strong>Scopes:</strong>&nbsp;
          {Object.entries(filteredScopeList)
            .map(([key, value]) => `${key.replace(/_/g, " ")} - ${value}`)
            .join(", ")}
        </li>
        {departmentData?.length > 0 && (
          <li>
            <strong>Departments:</strong>&nbsp;
            {departmentData.map((each, index) => (
              <span key={each.id}>
                {each.name}: {each.id}
                {index < departmentData.length - 1 && ", "}
              </span>
            ))}
          </li>
        )}
      </ul>
    </div>
  )
}


  ];

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
    if (activeNumberCurr == activeNumber) {
      setActiveNumber(0);
    }
  }

  React.useEffect(() => {
    const getAllDepartment = async () => {
      const response = await authFetch(
        `department/${user.hospitalID}`,
        user.token
      );
      if (response?.message == "success") {
        setDepartmentData(response.departments);
      } else {
        // console.log("error occured in fetching data", response);
      }
    };
    if (user?.hospitalID) {
      getAllDepartment();
    }
  }, [user]);

  console.log("departments", departmentData);

  React.useEffect(() => {
    boxRef.current?.addEventListener("click", handleEvent);
    return () => {
      boxRef.current?.removeEventListener("click", handleEvent);
    };
  }, [activeNumber]);
  React.useEffect(() => {
    // console.log("Active Number", activeNumber);
    const allElement = document.querySelectorAll(".box");
    allElement.forEach((element) => {
      const box_number = Number(element.getAttribute("data-number"));
      if (box_number != activeNumber) {
        const newArray: Array<HTMLDivElement> = [
          ...element.children,
        ] as Array<HTMLDivElement>;
        newArray.forEach((el: HTMLDivElement) => {
          if (el.classList.contains(styles.box_answer)) {
            el.style.minHeight = "0";
            el.style.maxHeight = "0";
          }
        });
      }
      if (box_number == activeNumber) {
        const newArray: Array<HTMLDivElement> = [
          ...element.children,
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
    } else if (tab === "dashboardInfo") {
      navigate("dashboardInfo");
    }
  };
  return (
    <>
      <div className={styles.container}>
        <div className={styles.container_top}>
          <h2 className={styles.heading}>Hello, How Can We Help?</h2>
        </div>
        <div className={styles.container_cards}>
          <div
            className={styles.card + " " + styles.card_1}
            onClick={() => handleTabChange("dashboardInfo")}
          >
            <div className={styles.card_icon}>
              <InfoIcon sx={{ width: "40px" }} />
            </div>
            <h4>Dashboard Information</h4>
          </div>
          {/* <div
            className={styles.card + " " + styles.card_2}
            onClick={() => handleTabChange("videos")}
          >
            <div className={styles.card_icon}>
              <OndemandVideoIcon sx={{ width: "40px" }} />
            </div>
            <h4>Videos</h4>
          </div> */}
          {/* <div
            className={styles.card + " " + styles.card_3}
            onClick={() => handleTabChange("manuals")}
          >
            {" "}
            <div className={styles.card_icon}>
              <LiveHelpIcon sx={{ width: "40px" }} />
            </div>
            <h4>Manuals</h4>
          </div> */}
          <div
            className={styles.card + " " + styles.card_4}
            onClick={() => handleTabChange("tickets")}
          >
            <div className={styles.card_icon}>
              <ConfirmationNumberIcon sx={{ width: "40px" }} />
            </div>
            <h4>Tickets</h4>
          </div>
        </div>
        <div className={styles.askQuestion}>
          <img
            src="./../../../../src/assets/help/Avatar_group.png"
            alt="Group_Avatar"
            width={100}
          />
          <h3>Still Have Question?</h3>
          <p>
            Can't find the answer you're looking for? Please chat to our
            friendly team.
          </p>
          <Button variant="contained" sx={{ backgroundColor: "#1977f3" }}>
            Ask !
          </Button>
        </div>
        <div className={styles.container_questions}>
          <h1 className={styles.left}>Frequently Asked Questions</h1>
          <p>Everything You need to know about Product and Billing.</p>
          <div className={styles.right} ref={boxRef}>
            {faqData
              .filter((item) => {
                // Hide item with id 4 for non-admin users
                if (item.id === 4 && user.role !== Role_NAME.admin)
                  return false;
                return true;
              })
              .map((item) => (
                <div
                  key={item.id}
                  className={`${styles.box} box`}
                  data-number={item.id}
                >
                  <div className={styles.box_question} id="question">
                    <h3>{item.question}</h3>
                    {activeNumber === 3 ? (
                      <RemoveCircleOutline
                        fontSize="medium"
                        sx={{ color: "#1977f3" }}
                      />
                    ) : (
                      <AddCircleOutline
                        fontSize="medium"
                        sx={{ color: "#1977f3" }}
                      />
                    )}
                  </div>
                  <div className={styles.box_answer}>{item.answer}</div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default HelpStaff;
