import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { v4 } from "uuid";
import { Post } from "../types";

interface UseAccounts {
  previews: Partial<Post>[];
  images: string[];
  setImages: Dispatch<SetStateAction<string[]>>;
}

const usePreviewPosts = (): UseAccounts => {
  const [previews, setPreviews] = useState<Partial<Post>[]>([]);
  const [images, setImages] = useState<string[]>([]);

  // Create partial posts with required data for display
  useEffect(() => {
    if (images.length) {
      images.map((image) => {
        const previewExists = previews.some((post) => post.image === image);
        if (!previewExists) {
          const newPreview = {
            id: v4(),
            image,
            likes: 0,
            comments: 0,
            isPreview: true,
          };
          setPreviews([...previews, newPreview]);
        }
      });
    } else {
      setPreviews([]);
    }
  }, [images]);

  return { previews, images, setImages };
};

export { usePreviewPosts };
