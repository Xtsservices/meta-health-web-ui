import React from "react";
import styles from "./imagefield.module.scss";
import UploadIcon from "@mui/icons-material/Upload";
type imageInputType = {
  image: File | undefined;
  setImage: React.Dispatch<React.SetStateAction<File | undefined>>;
};
function ImageField({ setImage }: imageInputType) {
  const image_ref = React.useRef<HTMLImageElement>(null);
  const [showImg, setShowImg] = React.useState(false);
  const profile_pic = "";
  return (
    <>
      <div className={styles.image_container}>
        <img
          style={{ visibility: `${showImg ? "visible" : "hidden"}` }}
          src={profile_pic}
          alt="profile_pic"
          className={styles.img_show}
          ref={image_ref}
        />

        <input
          type="file"
          className={styles.input_image}
          accept="image/*"
          id="input_image"
          alt="img"
          onChange={(e) => {
            // console.log(document.querySelector('img[alt="profile_pic"]'));

            const reader = new FileReader();
            reader.onloadend = function (e) {
              // console.log("reader", e.target);

              const result = e.target?.result as string | null; // Add type assertion
              if (result) {
                image_ref.current?.setAttribute("src", result);
              }
            };
            //   reader.readAsDataURL(e.target.files[0]);
            const file = e.target.files?.[0]; // Use optional chaining to access the first file
            setImage(file);
            if (file) {
              reader.readAsDataURL(file);
              setShowImg(true);
            }
          }}
          style={{ display: "none" }}
        />
        <label htmlFor="input_image">
          <UploadIcon color="primary" />
          Upload Image
        </label>
      </div>
    </>
  );
}

export default ImageField;
