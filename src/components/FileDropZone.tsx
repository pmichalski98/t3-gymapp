import {
  type ChangeEvent,
  ChangeEventHandler,
  type FormEvent,
  useCallback,
  useState,
} from "react";
import Image from "next/image";
import { api } from "~/utils/api";
import FormData from "form-data";
import Button from "~/components/Button";

function FileDropZone() {
  const [file, setfile] = useState<File | string>();

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    setfile(e.currentTarget.files?.[0]);
  }
  const { mutateAsync: getPresignedUrl } =
    api.uploadPhotos.uploadPhoto.useMutation();

  async function handleFileUpload(e: FormEvent) {
    e.preventDefault();
    const { url, fields } = await getPresignedUrl();
    if (!file) return;
    console.log(file);
    const abu = {
      ...fields,
      "Content-Type": file.type,
      file,
    };
    const formData = new FormData();
    for (const name in abu) {
      formData.append(name, abu[name]);
    }
    console.log(formData, "halo");
    const res = await fetch(url, {
      body: formData,
      method: "POST",
      mode: "no-cors",
    });
    console.log(res);
    setfile("");
  }

  return (
    <form onSubmit={handleFileUpload}>
      <input type="file" onChange={handleFileChange} />
      <Button>Upload file</Button>
    </form>
  );
}
export default FileDropZone;
