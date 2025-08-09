import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useJwt } from "react-jwt";
import styles from "./login.module.scss";
import yantramLogo from "./../../../src/assets/circlemeta.jpg";
import cross from "./../../../src/assets/circlemeta.jpg";
import LoginForm from "../../component/loginForm/loginForm";
import vector from "./../../../src/assets/doctor_svg.png";
import { ArrowBack } from "@mui/icons-material";
import { key } from "../../utils/constant";
import CryptoJS from "crypto-js";
import { setLoading } from "../../store/error/error.action";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storedEncryptedData = localStorage.getItem("user");
      if (storedEncryptedData) {
        const bytes = CryptoJS.AES.decrypt(storedEncryptedData, key);
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        const { token } = decryptedData;
        setToken(token || null);
      } else {
        setToken(null);
      }
    } catch (error) {
      console.error("Decryption error or invalid data:", error);
      setToken(null);
    }
  }, []);

  const isTokenExpired = useJwt(token || "").isExpired;

  useEffect(() => {
    if (token && isTokenExpired === false) {
      navigate("/hospital-dashboard");
    } else {
      setIsLoading(false);
    }
  }, [token, isTokenExpired, navigate]);

  if (isLoading) {
    dispatch(setLoading(true));
    return null; // Render nothing while loading
  }

  return (
    <div className={styles.container}>
      <div className={styles.container_form}>
        <Link to="/">
          <ArrowBack />
        </Link>
        <div>
          <Link to="/">
          <h4 style={{color: "#000", fontWeight: "bold", textAlign: "center", display: "flex", justifyContent: "center", alignItems: "center"}}>
      META HEALTH
    </h4>
            {/* <img src={yantramLogo} alt="Yantram Logo" /> */}
          </Link>
          {/* <img src={cross} alt="Cross Logo" /> */}
        </div>
        <LoginForm />
      </div>
      <div className={styles.container_vector}>
        {/* <div className={styles.container_vector_heading}>
          Intelligent Platform for Efficient Patient Management.
        </div> */}
        <div className={styles.container_vector_image}>
          {/* <img src={vector} alt="Vector Illustration" /> */}
        </div>
      </div>
    </div>
  );
};

export default Login;
