"use client";
import useApiFetch from "@/hooks/api";
import { Autocomplete, AutocompleteOption, CircularProgress, ListItemDecorator } from "@mui/joy";
import * as React from "react";

export default function CitySelect() {
  
  const api = useApiFetch();
  const [counties, setCounties] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const loading = open && counties.length === 0;

  React.useEffect(() => {

    let active = true;

    if (!loading) {
      return undefined;
    }

    api("/cities").then(setCounties)

    return () => {
      active = false;
    };
  }, [loading]);


  return (
    <Autocomplete
      placeholder="Localitate"
      size="lg"
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      endDecorator={
        loading ? (
          <CircularProgress size="sm" sx={{ bgcolor: 'background.surface' }} />
        ) : null
      }
      options={counties}
      groupBy={o => o.county_name}
      getOptionLabel={(option) => option.name}
      renderOption={(props, option) => (
        <AutocompleteOption {...props} key={option.id}>
          {option.name}
        </AutocompleteOption>
      )}
    ></Autocomplete>
  );
}
