import admin_styles from "./../../../component/sidebar/admin_styles.module.scss";
import search_icon from "./../../../../src/assets/sidebar/search_icon.png";
import { useSeachStore } from "../../../store/zustandstore";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PopperMenu from "../../../component/Popper";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "../../../store/user/user.selector";
import CanvasEditor from "../../../component/TemplateManagement/CanvasEditor";
import { authFetch } from "../../../axios/useAuthFetch";
import { Button, Menu, MenuItem, Divider } from "@mui/material";
import { FileCopy, KeyboardArrowDown } from "@mui/icons-material";
import TemplateTable from "../../../component/TemplateManagement/TemplateTable";
import styles from "../../../component/TemplateManagement/UploadPreview.module.css";
import { ManagmentTemplates } from "../../../types";
import { authDelete } from "../../../axios/authDelete";
import { setError } from "../../../store/error/error.action";

const TemplateManagement = () => {
  const { setSearchText, searchText } = useSeachStore();
  const [openMenu, setOpenMenu] = React.useState(false);
  const [category, setCategory] = useState<string | null>(null);
  const [, setLoading] = useState<boolean>(false);
  const user = useSelector(selectCurrentUser);
  const anchorRef = React.useRef<HTMLDivElement>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedValue, setSelectedValue] = useState<string>("Select");
  const open = Boolean(anchorEl);
  const dispatch = useDispatch();
  const [templatesData, setTemplatesData] = useState<ManagmentTemplates[]>([]);

  const handleToggle = () => {
    setOpenMenu((prevOpen) => !prevOpen);
  };

  const fetchTemplates = async () => {
    setLoading(true);
    setCategory(null);
    setSelectedValue("Select");
    try {
      const response = await authFetch(
        `template/${user.hospitalID}/${user.id}`,
        user.token
      );
      if (response?.message === "success") {
        const data = response?.templates;
        if (data.length > 0) {
          setTemplatesData(data);
        } else {
          setCategory("TaxInvoice");
          setSelectedValue("TaxInvoice")
        }
      }
      console.log("responselool", response);
    } catch (error) {
      console.error("Error fetching templates:", error);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);

  const handleClose = (value?: string) => {
    if (value) {
      const categoryIncludes = templatesData.some((each) =>
        each.category.includes(value)
      );
      console.log("categoryIncludes", categoryIncludes);
      if (categoryIncludes) {
        setCategory(null);
        setSelectedValue("Select");
        dispatch(setError("Template Exist"));
        alert(`${value} Template Exist`);
      } else {
        setSelectedValue(value);
        setCategory(value);
      }
    }
    setAnchorEl(null);
  };

  const handleDelete = async (tableid: number) => {
    setSelectedValue("Select");
    const response = await authDelete(
      `template/${tableid}/${user.hospitalID}/${user.id}`,
      user.token
    );

    if (response.message == "success") {
      fetchTemplates();
    }
  };

  return (
    <>
      <div className={admin_styles.main_header}>
        <div className={admin_styles.main_header_top}>
          <div className={admin_styles.main_header_top_search}>
            <img src={search_icon} alt="Search Icon" />
            <input
              type="text"
              className="input_search"
              placeholder="Search"
              value={searchText}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setSearchText(event.target.value)
              }
            />
          </div>

          <div
            className={admin_styles.header_profile}
            ref={anchorRef}
            onClick={handleToggle}
          >
            {user.imageURL ? (
              <img src={user.imageURL} alt="Profile" />
            ) : (
              <AccountCircleIcon fontSize="large" />
            )}
          </div>

          <PopperMenu
            setOpen={setOpenMenu}
            open={openMenu}
            url={"/inpatient/admin/profile"}
            anchorRef={anchorRef}
            color={"#c0e4ff"}
          />
        </div>
      </div>

      <div className={styles.uploadPreviewMainContainer}>
        <div className={styles.headercontainer}>
          <h2>{category}.</h2>
          <div>
            <Button
              variant="contained"
              onClick={handleClick}
              endIcon={<KeyboardArrowDown sx={{ color: "white" }} />}
              sx={{
                width: 125,
                borderRadius: "40px",
                backgroundColor: "#1977F3",
              }}
            >
              {selectedValue}
            </Button>
            <Menu anchorEl={anchorEl} open={open} onClose={() => handleClose()}>
              <MenuItem onClick={() => handleClose("TaxInvoice")}>
                <FileCopy /> Create TaxInvoice
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => handleClose("Report")}>
                <FileCopy /> Create Report
              </MenuItem>
            </Menu>
          </div>
        </div>

        {templatesData && templatesData.length > 0 && !category ? (
          <TemplateTable data={templatesData} onDelete={handleDelete} />
        ) : (
          category && (
            <CanvasEditor category={category} fetchTemplates={fetchTemplates} />
          )
        )}
      </div>
    </>
  );
};

export default TemplateManagement;
