import React, { FC, useEffect } from "react";
import { Control, useController } from "react-hook-form";
import { ActionMeta, MultiValue, StylesConfig } from "react-select";
import CreatableSelect from "react-select/creatable";
import { Preferences } from "../../types";

interface Props {
  name: keyof Preferences;
  control: Control<Preferences, object>;
  placeholder: string;
}

type MyOptionType = {
  label: string;
  value: string;
};

type IsMulti = true;

const TagSelect: FC<Props> = ({ name, control, placeholder }) => {
  const {
    field: { ref, value, onChange, ...controllerProps },
  } = useController({
    name,
    control,
  });

  // Create option
  const createOption = (label: string) => ({
    label,
    value: label?.toLowerCase().replace(/\W/g, ""),
  });

  // Handle initial values
  const handleValue = (value: string | string[]) => {
    // Check if is array (object)
    if (typeof value === "object") {
      return value.map((item) => createOption(item));
    } else {
      return createOption(value);
    }
  };

  // Update controller value
  const handleChange:
    | ((
        newValue: MultiValue<MyOptionType>,
        actionMeta: ActionMeta<MyOptionType>
      ) => void)
    | undefined = (values) => {
    const tags = values?.map((obj) => obj["value"]);
    onChange(tags);
  };

  // Set default values
  useEffect(() => {}, []);

  return (
    <CreatableSelect
      isMulti
      styles={styles}
      placeholder={placeholder}
      noOptionsMessage={() => "Already added."}
      value={handleValue(value)}
      onChange={handleChange}
      {...controllerProps}
    />
  );
};

export { TagSelect };

// Styles

const styles: StylesConfig<MyOptionType, IsMulti> = {
  placeholder: (provided) => ({
    ...provided,
    color: "#A0AEC0", // gray.400
  }),
  container: (provided) => ({
    ...provided,
    padding: 0,
    width: "100%",
  }),
  control: (provided, state) => ({
    ...provided,
    backgroundColor: "transparent",
    borderRadius: "0.2rem", // md
    // paddingTop: "0.75em",
    // paddingBottom: "0.75em",
    // paddingLeft: "0.5rem",
    // Hover & State
    border: state.isFocused ? "2px solid #1A202C" : "1px solid #E2E8F0", // gray.200
    marginLeft: state.isFocused ? "-1px" : "0",
    marginTop: state.isFocused ? "-1px" : "0",
    // Disables the blue border
    boxShadow: state.isFocused ? "0" : "0",
    "&:hover": {
      borderBottom: state.isFocused ? "2px solid #1A202C" : "1px solid #E2E8F0", // gray.200
    },
    overflow: "hidden",
    cursor: "text",
    fontSize: "0.9rem",
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    display: "none",
  }),
  multiValue: (provided) => ({
    ...provided,
    color: "white",
    backgroundColor: "#1A202C",
    borderRadius: "0.25rem",
    paddingLeft: "0.25rem",
    paddingRight: "0.25rem",
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: "white",
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    padding: "0",
    margin: "0",
    "&:hover": {
      backgroundColor: "transparent",
      color: "white",
    },
  }),
  menu: (provided, state) => ({
    ...provided,
    display: state.selectProps.inputValue ? "block" : "none",
    fontSize: "0.8rem",
    marginTop: "0",
  }),
  option: (provided, state) => ({
    ...provided,
    fontSize: "0.8rem",
    backgroundColor: state.isFocused ? "#1A202C" : "none", // gray.800
    color: state.isFocused ? "white" : "#1A202C",
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    display: "none",
  }),
  valueContainer: (provided, state) => ({
    ...provided,
    // padding: 0,
    margin: 0,
    paddingLeft: state.hasValue ? "0.2rem" : "0.5rem",
    paddingRight: state.hasValue ? "0.2rem" : "0.5rem",
    paddingTop: state.hasValue ? "0.2rem" : "0",
    paddingBottom: state.hasValue ? "0.2rem" : "0",
  }),
  input: (provided, state) => ({
    ...provided,
    padding: 0,
    margin: 0,
    paddingLeft: state.hasValue ? "0.25rem" : "0",
  }),
};
