import {
  getDownloadURL,
  ref as createRef,
  uploadBytes,
} from "firebase/storage";
import { ChangeEvent, useEffect, useState } from "react";
import { checkIsImage, fetchImages } from "^lib/firebase/storage/fetch";
import { FOLDERS } from "^lib/firebase/storage/folders";
import { useUploadImageAndCreateImageDocMutation } from "^redux/services/images";
// todo: max file size

const Test = () => {
  const [hasUploaded, setHasUploaded] = useState(false);
  const [upload] = useUploadImageAndCreateImageDocMutation();

  /*   useEffect(() => {
    if (!hasUploaded) {
      setHasUploaded(true);
      const test = async () => {
        const name = "2383c6ad-707c-4a87-9110-ec3468c65665_2400x1600";
        const ref = createRef(storage, `${FOLDERS.IMAGES}/${name}`);
        const URL = await getDownloadURL(ref);
        console.log("URL", URL);
      };
      test();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); */
  const [hasFetched, setHasFetched] = useState(false);
  useEffect(() => {
    if (!hasFetched) {
      setHasFetched(true);
      checkIsImage("0765034e-51e3-4894-8b62-b7830262925b_2400x1600");
    }
  }, [hasFetched]);

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const files = e.target.files;

    if (!files) {
      console.log("No file selected.");
      return;
    }

    const file = files[0];
    const isImage = file.name.match(/.(jpg|jpeg|png|webp|avif|gif|tiff)$/i);

    if (!isImage) {
      console.log("Invalid file (needs to be an image).");
      return;
    }

    const isAcceptedImage = file.name.match(/.(jpg|jpeg|png|webp)$/i);

    if (!isAcceptedImage) {
      console.log(
        "Invalid image type. Needs to be of type .jpg, .jpeg, .png or .webp"
      );
      return;
    }

    await upload(file);
  };

  return (
    <div>
      <input
        accept="image/png, image/jpg, image/jpeg, image/webp"
        onChange={handleFileUpload}
        name="files"
        type="file"
      />
      <button
        onClick={async () =>
          await checkIsImage("2383c6ad-707c-4a87-9110-ec3468c65665_2400x1600")
        }
      >
        Test
      </button>
    </div>
  );
};

export default Test;
