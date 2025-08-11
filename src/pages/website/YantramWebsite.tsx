import { useRef } from "react";
import { Link } from "react-router-dom";
import yantram_logo from "../../assets/circlemeta.jpg";
import DeviceCard from "../../component/website/DeviceCard";
import SponserCard from "../../component/website/SponserCard";
import mainSlider2 from "../../assets/website/main_slider.jpg";
import mainSlider from "../../assets/website/landing.png";
import SocialFollow from "../../component/website/social";
import vtrack from "../../assets/website/v_track.png";
import vitals from "../../assets/website/vitals.png";
import cpap from "../../assets/website/CPAP.png";
import cpap_mobile from "../../assets/website/cpap_mobile.jpeg";
import nvcore from "../../assets/website/nv_core.png";
import "./website.scss";

const sponser = [0, 1, 2, 3, 4, 5, 6, 7];

const YantramWebsite = () => {
  const topRef = useRef<HTMLDivElement | null>(null);
  const nvCoreRef = useRef<HTMLDivElement | null>(null);
  const vTrackRef = useRef<HTMLDivElement | null>(null);
  const vitalsRef = useRef<HTMLDivElement | null>(null);
  const cpapRef = useRef<HTMLDivElement | null>(null);
  const prodRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = (index: number) => {
    const scrollTargets = [nvCoreRef, vTrackRef, vitalsRef, cpapRef];
    const targetRef = scrollTargets[index];
    targetRef?.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScrollProducts = () => {
    prodRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScrollTop = () => {
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleNVcoreScroll = () => {
    nvCoreRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleVTrackScroll = () => {
    vTrackRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleVitalsScroll = () => {
    vitalsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCpapScroll = () => {
    cpapRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div ref={topRef} className="web-container">
      {/* HEADER */}
      <div className="web-header">
        <Link to="/">
          {/* <img src={yantram_logo} alt="" className="logo" /> */}
        </Link>
        <h3>Meta Health</h3>
        <div>
          {/* <button onClick={handleScrollProducts}>Our Products</button> */}
          <Link to="/login">
            <button style={{ marginLeft: "10px" }}>Login</button>
          </Link>
        </div>
      </div>
      {/* SLIDER */}
      <div className="web-slider-container">
        <div className="web-slider-img">
          <img src={mainSlider} alt="main-image" className="main-image" />
        </div>
        {/* <div className="web-slider-trans">
          <p></p>
        </div> */}
        {/* <div className="web-slider-body">
          <h2>Smart Range Products</h2>
          <h4>Preferred by Medical Professionals</h4>
        </div> */}
      </div>
      {/* DEVICE CARD */}
      {/* <div ref={prodRef} className="web-deviceCard-container">
        <DeviceCard index={0} updateScroll={handleScroll} />
        <DeviceCard index={1} updateScroll={handleScroll} />
        <DeviceCard index={2} updateScroll={handleScroll} />
        <DeviceCard index={3} updateScroll={handleScroll} />
      </div> */}

      {/* NV-CORE DEVICE */}
      {/* <div ref={nvCoreRef} className="web-device-container">
        <div className="device-top">
          <div className="device-top-image">
            <img src={nvcore} alt="" className="logo" />
          </div>
          <div className="device-top-content">
            <h3>NV Core</h3>
            <p>
              NV-Core is a temperature monitoring device. It is a plug and play
              device which is easy to operate. It is Portable, lightweight and
              designed to enhance user experience . The device can be connected
              to an mobile application to record the data with cloud storage
              functionality.
            </p>
          </div>
        </div>

        <div className="device-features">
          <h3>Key Features</h3>
          <ul>
            <li>
              Medical grade portable device (9cm*7cm*5cm) used for monitoring
              skin and core body temperature of patients in hospitals with
              sensor placed 1.5m away from patient via wires
            </li>

            <li>
              Data continuously displayed on screen as well as app provided with
              the product.
            </li>
            <li>
              Velcro strap available to tie the device on bed side or IV-Poles
            </li>
          </ul>
        </div>

        <div className="device-video">
          <iframe
            width="1240"
            height="600"
            src="https://www.youtube.com/embed/JtjKnw9wNuY"
          ></iframe>
        </div>

        <div className="device-footer">
          <h3>Inference</h3>
          <p>
            Temperature data will be transmitted to our app, where temperature
            graphs and logs can be plotted with cloud storage. One can access
            the previous data as the app has cloud storage.
          </p>
        </div>
      </div> */}

      {/* VTRACK DEVICE */}
      {/* <div ref={vTrackRef} className="web-device-container">
        <div className="device-top">
          <div className="device-top-image">
            <img src={vtrack} alt="" className="logo" />
          </div>
          <div className="device-top-content">
            <h3>V-Track</h3>
            <p>
              Device continuously monitors temperature and transmits results to
              an mobile app. Device will be pasted on body by means of medical
              tapes where sensor touches the skin and the system will transmits
              data via Bluetooth. It also has smart AI system capable of
              identiying diseases.
            </p>
          </div>
        </div>

     

        <div className="device-features">
          <h3>Key Features</h3>
          <ul>
            <li>
              Medical grade wearable patch of 2.5cm*2.5cm*0.7cm, loaded with
              battery and sensors is attached via adhesives to the chest or
              under the armpit.
            </li>

            <li>Device specifically designed for health-conscious people.</li>

            <li>
              Conditions detected :
              <ul>
                <li>Hypothermia and sepsis in babies and elderly.</li>

                <li>
                  Monitoring women health during the pregnancy to ensure mother
                  and baby are well.
                </li>

                <li>Monitoring menstruation health of women.</li>

                <li>
                  Fever and its patterns predicting what type of fever it may
                  be.
                </li>

                <li>Sleep pattern analysis.</li>

                <li>Severity of depression.</li>

                <li>
                  Cerebral diseases like Alzheimer’s, Parkinson’s, stroke and
                  liver cirrhosis.
                </li>

                <li>Metabolic disorders like autoimmune disease triggers</li>
              </ul>
            </li>

            <li>
              Different modules available for different diseases on
              subscription. Subscription can be cancelled anytime. 1 module
              available for free with device purchase.
            </li>
            <li>
              Free space in cloud available to store data. Additional storage
              space can be added on “pay as you go” basis.
            </li>
            <li>Low battery and disease alerts.</li>
            <li>Device runs for 1 week on single charge.</li>
            <li>The device is EMC, EMI compliant.</li>
            <li>
              The HMI (Human machine interaction) of the device is very
              user-friendly with LED indications for on-off and data
              transmission, charging etc.
            </li>
            <li>
              To charge the device just put it in its charging docket provided.
            </li>
            <li>
              Data transmitted to an app and cloud, accessible by dashboard.
            </li>
            <li>
              Reports can be published and shared via social media platforms.
            </li>
            <li>Shelf life of device is 2 years</li>
          </ul>
        </div>

        <div className="device-video">
          <iframe
            width="1240"
            height="600"
            src="https://www.youtube.com/embed/KmHqIfE3J4I"
          ></iframe>
        </div>

        <div className="device-footer">
          <h3>Mobile App Features</h3>
          <ul>
            <li>
              App has syncs with device every 1hr and updates the readings from
              the device.
            </li>

            <li>App has option of adding multiple users</li>
            <li>App stores the data of an individual user.</li>

            <li>
              It shows temperature data in form of graph and logs format with a
              timestamp.
            </li>

            <li>It has cloud storage.</li>

            <li>
              Authentication of app is there via password/Pin functionality
            </li>
          </ul>
        </div>
      </div> */}

      {/* VITALS DEVICE */}
      {/* <div ref={vitalsRef} className="web-device-container">
        <div className="device-top">
          <div className="device-top-image">
            <img src={vitals} alt="" className="logo" />
          </div>
          <div className="device-top-content">
            <h3>Vitals (Product in Pipeline)</h3>
            <p>
              Device continuously monitors temperature ,SpO2 and heart rate
              levels. The recorded data is displayed in organized matter in app.
              Device will be pasted on body by means of medical tapes where
              sensor touches the skin and the system then transmits data via
              Bluetooth.
            </p>
          </div>
        </div>

        <div className="device-features">
          <h3>Key Features</h3>
          <ul>
            <li>The Device monitors temperature,SpO2 and heart rate.</li>
            <li>Device size – 4cm (length) *4cm (width) *0.5-0.7cm (height)</li>
            <li>
              The vitals information can be configured by the doctor in between
              from the range of every 15Mins to 24Hrs.
            </li>
            <li>
              Device wakes up on press button and shows data immediately via
              app.
            </li>
            <li>
              Low battery alerts starting at 20% and 10% battery remaining, sync
              everything and then notifying person that data can be lost once
              device switches off. Same notification should be sent to app as
              well
            </li>
            <li>
              The device battery will last up to 3 months on single charge
            </li>
            <li>The device is EMC, EMI compliant.</li>
            <li>
              The HMI (Human machine interaction) of the device is more
              user-friendly. The LED indication is given, so that the user will
              identify that the device is on and sending readings to the
              associated app. It will also show the battery is low
            </li>
            <li>
              The device can transmit data up to 50m range in an open field.
            </li>
            <li>
              Device battery will last for 500 - 600 charge cycles. (2 years)
            </li>
            <li>Portable charger will be given along with the device.</li>
          </ul>
        </div>
      </div> */}

     
      {/* <div ref={cpapRef} className="web-device-container">
        <div className="device-top">
          <div className="device-top-image">
            <img src={cpap} alt="" className="logo" />
          </div>
          <div className="device-top-content">
            <h3>CPAP (Product in Pipeline)</h3>
            <p>
              Portable and versatile, it includes multiple therapy modes, and
              convenient control with the Mobile app. The machine delivers an
              airstream at one steady pressure and the user can change the
              pressure according to their needs.
            </p>
          </div>
        </div>

        <div className="device-features">
          <h3>Key Features</h3>
          <ul>
            <li>
              The dimensions of the device are 13cm*8cm*5cm. it fits in hand,
              light weight, has following features:
            </li>
            <li>
              <ul>
                <li>Pressure range: Minimum 4cm H2O to 20cm H2O</li>
                <li>Feedback loop to automatically adjust the pressure</li>
                <li>
                  Bluetooth and mobile application to connect and see values in
                  a tabular format.
                </li>
                <li>Size within: 13cm*8cm*5cm</li>
                <li>Weight: 0.3-1kg range which is easy to carry.</li>
                <li>
                  Should run on DC power, can be attached to USB cable to power
                  sockets in train or airplanes and in-built battery
                </li>
              </ul>
            </li>
            <li>Auto CPAP and fixed pressure mode</li>
            <li>Air filter can be easily removed and cleaned</li>
            <li>
              One port for connecting the outlet pipe tube going to patient
              mask.
            </li>
            <li>The Power cord around 6ft length. USB port for charging.</li>
            <li>
              Volume delivered by the machine is around 37-185L, based on
              pressure values.
            </li>
            <li>
              Altitude adjustment of up to 8000 feet, it will work in airplanes.
            </li>
            <li>
              Ramp up time: 0-60mins with 5min increments. Pressure starts from
              4cm H2O to CPAP pressure selected by user.
            </li>
            <li>Tubing used with patient mask is 15mm flexible tube.</li>
          </ul>
        </div>

        <div className="device-video">
          <img src={cpap_mobile} alt="" className="logo" />
        </div>

        <div className="device-footer">
          <h3>Inference</h3>
          <p>
            The mobile app is your personal sleep therapy assistant – on your
            phone! By utilizing Bluetooth wireless technology, it enables you to
            use smart devices to set up therapy, change comfort settings and
            track your sleep.
          </p>
        </div>
      </div>
       */}
      {/* <div className="web-sponser-container">
        <h3>Sponsors & Partners</h3>
        <div className="web-sponser-cards">
          {sponser.map((item, index) => (
            <SponserCard index={item} key={index} />
          ))}
        </div>
      </div> */}
{/* 
      <div className="web-footer">
        <div className="footer-top">
          <div className="left-footer">
            <div className="left-top-footer">
              <img
                src={yantram_logo}
                onClick={handleScrollTop}
                alt=""
                className="logo"
              />
            </div>
            <div className="left-bottom-footer">
              <div className="left-bottom-left-footer">
                <h5>Registered Office Location </h5>
                <p>301, Gowra Tulips,</p>
                <p>Survey No 14 and 15,</p>
                <p>Gafoor Nagar, Hyderabad-500081, Telangana,</p>
                <p>info.yantram@yantrammedtech.com,</p>
                <p>040-35855589 (Landline) ,</p>
              </div>
              <div className="left-bottom-right-footer">
                <h5>Physical Office Location </h5>
                <p>G2,Innovative Cyber View,Partrika Nagar</p>
                <p>Survey No 79 of Madhapur Village,</p>
                <p>Serlinagampally Circle, Hyderabad - 500081, Telangana</p>
                <p>info.yantram@yantrammedtech.com,</p>
                <p>+91-8143716476</p>
              </div>
            </div>
          </div>

          <div className="right-footer">
            <h3>Our Products</h3>
            <ul>
              <li>
                <a onClick={handleNVcoreScroll}>NV-Core</a>
              </li>
              <li>
                <a onClick={handleVTrackScroll}>V-Track</a>
              </li>
              <li>
                <a onClick={handleVitalsScroll}>Vitals</a>
              </li>
              <li>
                <a onClick={handleCpapScroll}>CPAP</a>
              </li>
              <li>
                <a href={window.location.href + "login"}>Hospital Dashboard</a>
              </li>
              <li>
                <a href="http://yantrammedtech.in/login">Clinical Dashboard</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="bottom-footer">
          <SocialFollow />
        </div>
      </div> */}
    </div>
  );
};

export default YantramWebsite;
