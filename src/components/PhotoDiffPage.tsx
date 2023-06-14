import React from "react";
import FileDropZone from "~/components/FileDropZone";
import Image from "next/image";
import { api } from "~/utils/api";
import Button from "~/components/Button";
import useUtils from "~/hooks/useUtils";
import { CgSpinner } from "react-icons/all";
import { ClipLoader } from "react-spinners";

const PhotoDiffPage = () => {
  const utils = useUtils();
  const { data: photos } = api.photos.getPhotos.useQuery();
  const { mutate: deletePhoto, isLoading: deleteIsLoading } =
    api.photos.deletePhoto.useMutation({
      onSuccess: async () => {
        await utils.photos.invalidate();
      },
    });

  return (
    <section className={""}>
      <div className=" grid-cols-2 gap-2 md:grid">
        {photos?.map((photo) => {
          return (
            <div key={photo.id} className={""}>
              <div className={"flex justify-between pb-2"}>
                <h2>{photo.createdAt.toLocaleDateString()}</h2>
                <Button
                  onClick={() => deletePhoto({ photoId: photo.id })}
                  variant="secondary"
                  className="flex items-center gap-1"
                  disabled={deleteIsLoading}
                >
                  {deleteIsLoading && <ClipLoader color="" size={20} />}
                  Delete
                </Button>
              </div>
              <Image
                src={`https://training-manager.s3.eu-central-1.amazonaws.com/${photo.id}`}
                alt={"photo"}
                width={400}
                height={400}
                className="w-fit rounded-lg"
              />
            </div>
          );
        })}
      </div>
      <FileDropZone />
    </section>
  );
};

export default PhotoDiffPage;
