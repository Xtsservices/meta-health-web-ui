import styles from "./Ticket.module.scss";
import { useState, useEffect, ChangeEvent, useRef } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../store/user/user.selector";
import { authFetch } from "../../../axios/useAuthFetch";

import TicketTable from "./TicketTable";
import { useSeachStore } from "../../../store/zustandstore";
import admin_styles from "./../../../component/sidebar/admin_styles.module.scss";
import search_icon from "./../../../assets/sidebar/search_icon.png";
import PopperMenu from "../../../component/Popper";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";



const Tickets = () => {
  const user = useSelector(selectCurrentUser);
   const [openMenu, setOpenMenu] = useState(false);
    const anchorRef = useRef<HTMLDivElement>(null);
    const { setSearchText } = useSeachStore();

  const [ticketCounts, setTicketCounts] = useState({
    Total_Tickets: 0,
    Open: 0,
    Pending: 0,
    Overdue: 0,
    Assigned: 0,
  });

  const fetchTicketCounts = async () => {
    try {
      const response = await authFetch("/ticket/count", user.token);
      if (response && response.message === "success") {
        setTicketCounts({
          Total_Tickets: response.Total_Tickets || 0,
          Open: response.Open || 0,
          Pending: response.Pending || 0,
          Overdue: response.Overdue || 0,
          Assigned: response.Assigned || 0,
        });
      } else {
        console.error("Invalid API response:", response);
      }
    } catch (error) {
      console.error("Error fetching ticket counts:", error);
    }
  };

  useEffect(() => {
    if (user.token) {
      fetchTicketCounts();
    }
  }, [user.token]);

  
  const handleToggle = () => {
    setOpenMenu((prevOpen) => !prevOpen);
  };

  return (
    <>
   <div className={admin_styles.main_header}>
        <div className={admin_styles.main_header_top}>
          <div className={admin_styles.main_header_top_search}>
            <img src={search_icon} alt="" className="" />
            <input
              type="text"
              className="input_search"
              placeholder="Search"
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                setSearchText(event.target.value);
              }}
            />
          </div>

          <div
            className={admin_styles.header_profile}
            // onClick={() => navigate("/inpatient/admin/profile")}
            ref={anchorRef}
            onClick={handleToggle}
          >
            {user.imageURL ? (
              <img src={user.imageURL} alt="" className="" />
            ) : (
              <AccountCircleIcon fontSize="large" />
            )}
            {/* <img src={profile_pic} alt="" className="" /> */}
          </div>
          <PopperMenu
            setOpen={setOpenMenu}
            open={openMenu}
            url={"/sadmin/profile"}
            anchorRef={anchorRef}
            color={"#c0e4ff"}
          />
        </div>
      </div>
  
    <div className={styles.container}>
      <div className={styles.container_widz + " " + styles.container_widz_1}>
        <h2 className={styles.widz_num}>{ticketCounts.Total_Tickets}</h2>
        <p className="">Total Tickets</p>
      </div>
      <div className={styles.container_widz + " " + styles.container_widz_2}>
        <h2 className={styles.widz_num}>{ticketCounts.Open}</h2>
        <p className="">Open</p>
      </div>
      <div className={styles.container_widz + " " + styles.container_widz_3}>
        <h2 className={styles.widz_num}>{ticketCounts.Pending}</h2>
        <p className="">Pending</p>
      </div>
      <div className={styles.container_widz + " " + styles.container_widz_4}>
        <h2 className={styles.widz_num}>{ticketCounts.Overdue}</h2>
        <p className="">Overdue</p>
      </div>
      <div className={styles.container_widz + " " + styles.container_widz_5}>
        <h2 className={styles.widz_num}>{ticketCounts.Assigned}</h2>
        <p className="">Assigned</p>
      </div>
      <div className={styles.container_ticketTable}>
        <TicketTable />
      </div>
    </div>
      </>
  );
};

export default Tickets;
