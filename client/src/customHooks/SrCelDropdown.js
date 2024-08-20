import React from "react";
import { Autocomplete, TextField } from "@mui/material";

const SrCelDropdown = ({ options, onSelect, defaultValue, rowIndex }) => {
  return (
    <Autocomplete
      options={options}
      getOptionLabel={(option) => option.sr_cel_no}
      renderInput={(params) => <TextField {...params} size="small" />}
      onChange={(event, newValue) => {
        onSelect(
          {
            target: {
              value: newValue ? newValue.sr_cel_no : null,
            },
          },
          rowIndex,
          "sr_cel_no"
        );
        onSelect(
          {
            target: {
              value: newValue ? newValue.FGUID : null,
            },
          },
          rowIndex,
          "sr_cel_FGUID"
        );
      }}
      defaultValue={
        options.find((option) => option.sr_cel_no === defaultValue) || null
      }
      size="small"
      fullWidth
    />
  );
};

export default SrCelDropdown;
