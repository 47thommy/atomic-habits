import axios from "axios";
import { Image } from "@chakra-ui/react";

const uploadUrl = process.env.REACT_APP_CLOUDINARY_URL;
const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

export const ImageUpload = ({ handleImageUrl, value, setImageUploading }) => {
  const handleUpload = async (event) => {
    setImageUploading(true);
    const data = new FormData();
    data.append("file", event.target.files[0]);
    data.append("upload_preset", uploadPreset);
    data.append("cloud_name", process.env.CLOUD_NAME);
    fetch(uploadUrl, {
      method: "post",
      body: data,
    })
      .then((res) => {
        res.json();
        console.log(res);
        setImageUploading(false);
        handleImageUrl(res.url);
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      {value ? (
        <>
          <div>
            <Image id="add-habit-photo" src={value} alt="pp" h="200px" />
          </div>
          <label width="100%">Change File: </label>
          <input className="input-pic" type="file" onChange={handleUpload} />
        </>
      ) : (
        <>
          <input className="input-pic" type="file" onChange={handleUpload} />
        </>
      )}
    </>
  );
};
