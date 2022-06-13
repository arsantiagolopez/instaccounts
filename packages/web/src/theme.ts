import { extendTheme, theme as chakraTheme } from "@chakra-ui/react";
// Disable Chakra focus outline if not keyboard navigating
import "focus-visible/dist/focus-visible";

// Custom themes

const fonts = {
  ...chakraTheme.fonts,
  heading: "Helvetica",
  text: "Arial",
};

const components = {
  ...chakraTheme.components,
  Button: {
    baseStyle: {
      width: "100%",
      borderRadius: "0.25em",
      paddingY: "1.25em",
    },
    defaultProps: {
      size: "sm",
    },
    variants: {
      solid: {
        color: "white",
        background: "gray.800",
        _hover: {
          background: "black",
        },
      },
      outline: {
        color: "gray.600",
        _hover: {
          background: "gray.800",
          color: "white",
        },
      },
    },
  },
  Input: {
    defaultProps: {
      focusBorderColor: "gray.800",
      errorBorderColor: "red.500",
      size: "sm",
    },
  },
  NumberInput: {
    defaultProps: {
      focusBorderColor: "gray.800",
    },
  },
  Textarea: {
    defaultProps: {
      focusBorderColor: "gray.800",
    },
  },
  Heading: {
    baseStyle: {
      color: "gray.800",
      letterSpacing: "tight",
    },
  },
};

const theme = extendTheme({ fonts, components });

export default theme;
