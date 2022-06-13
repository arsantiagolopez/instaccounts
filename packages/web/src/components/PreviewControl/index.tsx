import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import { Flex, Icon, IconButton, Tooltip } from "@chakra-ui/react";
import React, { Dispatch, FC, SetStateAction } from "react";
import { HiOutlineDownload } from "react-icons/hi";
import { VscDebugRestart } from "react-icons/vsc";
import { Action, StyleProps } from "../../types";
import { Dropzone } from "../Dropzone";

interface Props {
  actions: Action[];
  setActions: Dispatch<SetStateAction<Action[]>>;
  images: string[];
  setImages: Dispatch<SetStateAction<string[]>>;
}

const PreviewControl: FC<Props> = ({
  actions,
  setActions,
  images,
  setImages,
}) => {
  const handleClose = () => {
    const defaultActive = actions.map((obj) =>
      obj?.name === "DEFAULT"
        ? { ...obj, active: true }
        : { ...obj, active: false }
    );
    return setActions(defaultActive);
  };

  const handleReset = () => setImages([]);

  const dropzoneProps = { images, setImages };
  return (
    <Flex {...styles.wrapper}>
      <CloseIcon onClick={handleClose} {...styles.close} />

      <Dropzone {...dropzoneProps}>
        <Tooltip
          label="Add a photo"
          aria-label="Add a photo"
          {...styles.tooltip}
        >
          <IconButton
            aria-label="Add a photo"
            icon={<AddIcon />}
            {...styles.button}
            {...styles.add}
          />
        </Tooltip>
      </Dropzone>

      <Tooltip label="Reset feed" aria-label="Reset feed" {...styles.tooltip}>
        <IconButton
          onClick={handleReset}
          aria-label="Reset feed"
          icon={<Icon as={VscDebugRestart} fontSize="1.25em" />}
          {...styles.button}
          {...styles.reset}
        />
      </Tooltip>
      <Tooltip
        label="Save preview grid"
        aria-label="Save preview grid"
        {...styles.tooltip}
      >
        <IconButton
          aria-label="Save preview grid"
          icon={<Icon as={HiOutlineDownload} fontSize="1.5em" />}
          {...styles.button}
          {...styles.save}
        />
      </Tooltip>
    </Flex>
  );
};

export { PreviewControl };

// Styles

const styles: StyleProps = {
  wrapper: {
    zIndex: 999,
    position: "fixed",
    top: { base: "3.5em", md: "10vh" },
    left: { base: "0", md: "10vw" },
    direction: { base: "row", md: "column" },
    background: "rgba(255,255,255,0.9)",
    backdropFilter: "blur(3px)",
    height: { base: "3em", md: "30vh" },
    width: { base: "calc(100% - 0.5em - 0.5em)", md: "auto" },
    marginX: { base: "0.5em", md: "0" },
    boxShadow: { base: "lg", md: "xl" },
    borderRadius: "0.5em",
    padding: { base: "0.5em", md: "1.5vw" },
    justify: { base: "space-between", md: "flex-start" },
  },
  close: {
    display: { base: "none", md: "block" },
    position: "absolute",
    top: "0",
    right: "0",
    cursor: "pointer",
    padding: "0.5em",
    boxSize: "1.5em",
  },
  tooltip: {
    zIndex: 9999,
    display: { base: "none", md: "block" },
    placement: "bottom-start",
    top: -5,
    right: -5,
  },
  button: {
    boxSize: { base: "auto", md: "3em" },
    marginTop: { base: "none", md: "2" },
    _hover: {
      background: "black",
    },
  },
  reset: {
    order: { base: 1, md: 2 },
  },
  add: {
    order: { base: 3, md: 1 },
  },
  save: {
    display: { base: "none", md: "block" },
    order: 3,
  },
};
