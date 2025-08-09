import  {useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./loginForm.module.scss";
import { useDispatch } from "react-redux/es/exports";
import { setCurrentUser } from "../../store/user/user.action";
import { postAxios } from "../../axios/usePost";
import { setError, setSuccess } from "../../store/error/error.action";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CryptoJS from "crypto-js";
import { key, scopeLinks, roleRoutes } from "../../utils/constant";

type LoginFormType = {
  email: string;
  password: string;
};

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: {
      value: "",
      valid: true,
      message: ""
    },
    password: {
      value: "",
      valid: true,
      message: ""
    }
  });
  const [showPassword, setShowPassword] = useState(false);

  const login = async () => {
    const data = await postAxios<LoginFormType>("user/emailLogin", {
      email: formData.email.value,
      password: formData.password.value
    });
    if (data.message === "success") {
      const encryptedData = CryptoJS.AES.encrypt(
        JSON.stringify({ ...data, isLoggedIn: true }),
        key
      ).toString();
      localStorage.setItem("user", encryptedData);
      dispatch(setSuccess("Successfully Logged In"));
      dispatch(setCurrentUser(data));
      if(data.role === 2002 || data.role === 2003){
        return navigate("/nurse");
      }
      else if (roleRoutes[data.role]) {
        navigate(roleRoutes[data.role]);
      } else {
        const userScopes = data?.scope?.split("#");
        if (userScopes?.length === 1) {
          const scope = parseInt(userScopes[0], 10);
          const link = scopeLinks[scope];
          if (link) {
            navigate(`/hospital-dashboard/${link}`);
          }
        } else {
          navigate("/hospital-dashboard");
        }
      }
    } else {
      dispatch(setError(data.message));
    }
  };

  return (
    <div className={styles.form}>
      <div className={styles.form_heading}>Login to Hospital Dashboard</div>
      <div className={styles.form_group}>
        <label htmlFor="email">Email*</label>
        <input
          type="email"
          className=""
          id="email"
          placeholder="Enter your email"
          autoFocus
          required
          formNoValidate
          name="email"
          onChange={(e) => {
            setFormData((prevValue) => {
              return {
                ...prevValue,
                email: {
                  value: e.target.value,
                  valid: e.target.reportValidity(),
                  message: ""
                }
              };
            });
          }}
          style={{
            border: `${
              formData.email.valid ? "1px solid #bfbfbf" : "1px solid #FF0000"
            }`
          }}
        />
        <div
          className={styles.form_group_message}
          style={{
            visibility: `${formData.email.valid ? "hidden" : "visible"}`
          }}
        >
          Please enter a valid email
        </div>
      </div>
      <div className={styles.form_group}>
        <label style={{ marginBottom: "4px" }} htmlFor="password">
          Password*
        </label>
        <div className={styles.password_input}>
          <input
            type={showPassword ? "text" : "password"}
            className=""
            id="password"
            placeholder="Enter your password"
            minLength={5}
            maxLength={20}
            name="password"
            onChange={(e) => {
              setFormData((prevValue) => {
                return {
                  ...prevValue,
                  password: {
                    value: e.target.value,
                    valid: e.target.reportValidity(),
                    message: ""
                  }
                };
              });
            }}
            required
          />
          {showPassword && (
            <VisibilityIcon onClick={() => setShowPassword(false)} />
          )}
          {!showPassword && (
            <VisibilityOffIcon onClick={() => setShowPassword(true)} />
          )}
        </div>
        <div
          className={styles.form_group_message}
          style={{
            visibility: `${formData.password.valid ? "hidden" : "visible"}`
          }}
        >
          Please enter your password
        </div>
      </div>
      <button onClick={login}>Login</button>
    </div>
  );
};

export default LoginForm;
