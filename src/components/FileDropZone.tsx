import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

function MyDropzone() {
  const [file, setfile] = useState();
  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        const blob = new Blob([result]);
        const url = URL.createObjectURL(blob);
        setfile(url);

        console.log(result);
      };
      reader.readAsArrayBuffer(file);
      console.log();
    });
    // Do something with the files
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  console.log(file);
  return (
    <div {...getRootProps()} className="bg-rose-400">
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag and drop some files here, or click to select files</p>
      )}
      {file && <img src={file} alt="" />}
    </div>
  );
}
export default MyDropzone;
