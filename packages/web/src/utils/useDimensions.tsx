/**
 *  Custom hook to get window height and width
 *  on mobile resize. Runs on client (SSR ready)
 */

import { useEffect, useState } from "react";

type WindowDimensions = () => {
  height: number | null;
  width: number | null;
};

const useDimensions: WindowDimensions = () => {
  const isBrowser = typeof window !== "undefined";

  const getWindowDimensions: WindowDimensions = () => {
    const width = isBrowser ? window.visualViewport.width : null;
    const height = isBrowser ? window.visualViewport.height : null;

    return { height, width };
  };

  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    if (isBrowser) {
      const handleResize: () => void = () =>
        setWindowDimensions(getWindowDimensions());
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [isBrowser]);

  return windowDimensions;
};

export { useDimensions };
