import { Flex } from "@chakra-ui/react";
import React, { Dispatch, FC, SetStateAction, useEffect } from "react";
import { useDropzone } from "react-dropzone";

interface Props {
  children: JSX.Element;
  images: string[];
  setImages: Dispatch<SetStateAction<string[]>>;
}

interface FileWithPreview extends File {
  preview?: string;
}

const Dropzone: FC<Props> = ({ children, images, setImages }) => {
  const { acceptedFiles, fileRejections, getRootProps, getInputProps } =
    useDropzone({
      accept: "image/*",
      multiple: true,
    });

  // Handle successfully updated files
  useEffect(() => {
    if (acceptedFiles.length) {
      const [file]: FileWithPreview[] = acceptedFiles;

      // Create preview
      file["preview"] = URL.createObjectURL(file);

      setImages([...images, file.preview]);
    }
  }, [acceptedFiles]);

  // Debug rejection errors
  useEffect(() => {
    if (fileRejections.length) {
      const [file] = fileRejections;
      console.log(file.errors);
    }
  }, [fileRejections]);

  return (
    <Flex {...getRootProps()}>
      {children}
      <input {...getInputProps()} />
    </Flex>
  );
};

export { Dropzone };
