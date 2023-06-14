import { type ChangeEvent, type FormEvent, useState } from "react";
import { api } from "~/utils/api";
import FormData from "form-data";
import Button from "~/components/Button";
import Image from "next/image";
import { AiFillDelete } from "react-icons/ai";

interface Fields {
  "Content-Type": string;
  file: File;
  Policy: string;
  "X-Amz-Signature": string;
}

function FileDropZone() {
  const [file, setFile] = useState<File>();
  const utils = api.useContext();

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    setFile(e.currentTarget.files?.[0]);
  }
  const { mutateAsync: getPresignedUrl } = api.photos.uploadPhoto.useMutation(
    {}
  );

  async function handleFileUpload(e: FormEvent) {
    e.preventDefault();
    if (!file) return;
    const { url, fields } = await getPresignedUrl();

    const urlFields: Fields = {
      ...fields,
      "Content-Type": file.type,
      file,
    };
    const formData = new FormData();
    for (const name in urlFields) {
      const key = name;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const value = urlFields[name];
      formData.append(key, value);
    }
    const res = await fetch(url, {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      body: formData,
      method: "POST",
      mode: "no-cors",
    });
    await utils.photos.invalidate();
    setFile(undefined);
  }

  const blob = new Blob([file!]);

  return (
    <>
      <form
        className=" flex flex-col"
        onSubmit={(e) => {
          handleFileUpload(e).catch(console.error);
        }}
      >
        {file && (
          <div className="mt-10 flex  gap-2 ">
            <Image
              src={URL.createObjectURL(blob)}
              alt={"Photo to upload"}
              width={50}
              height={50}
            />
            <AiFillDelete size={20} onClick={() => setFile(undefined)} />
          </div>
        )}

        <div className="relative  ">
          <label
            className="dark:hover:bg-bray-800 flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            htmlFor="file"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                aria-hidden="true"
                className="mb-3 h-10 w-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                ></path>
              </svg>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                SVG, PNG, JPG or GIF (MAX. 800x400px)
              </p>
            </div>
          </label>
          <input
            className="absolute top-0 left-0 h-full w-full cursor-pointer bg-rose-400 opacity-0  "
            id="file"
            type="file"
            onChange={handleFileChange}
          />
        </div>
        <Button disabled={!file}>Upload file</Button>
      </form>
    </>
  );
}
export default FileDropZone;
