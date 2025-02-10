import {
  Autocomplete,
  Button,
  CircularProgress,
  Input,
  Stack,
  createFilterOptions,
} from "@mui/joy";
import { City, CreateUserRequest } from "../types";
import { IMaskInput } from "react-imask";
import { FC, useEffect, useState } from "react";
import getApiFetch from "@/api/api";
import { css } from "@emotion/react";

interface RegisterFormProps {
  saving: boolean;
  onFormSubmit: (formJson: CreateUserRequest) => void;
}
const filterOptions = createFilterOptions<City>({
  matchFrom: "any",
  limit: 100,
});

const RegisterForm: FC<RegisterFormProps> = ({ onFormSubmit, saving }) => {
  const api = getApiFetch();
  const [counties, setCounties] = useState<City[]>([]);
  useEffect(() => {
    api<City[]>("/cities").then(setCounties);
  }, []);
  return (
    <form
      autoComplete="off"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const formJson: CreateUserRequest = Object.fromEntries(
          formData.entries()
        ) as unknown as CreateUserRequest;
        formJson.city = parseInt(formJson.city + "");
        onFormSubmit(formJson);
      }}
    >
      <Stack spacing={1}>
        <Input
          name="email"
          disabled={saving}
          required
          aria-autocomplete="none"
          autoComplete="off"
          type="text"
          placeholder="Email"
          size="lg"
        />
        <Input
          name="password"
          disabled={saving}
          required
          type="password"
          placeholder="Parolă"
          size="lg"
        />
        <Input
          name="given_name"
          disabled={saving}
          required
          type="text"
          placeholder="Prenume"
          size="lg"
        />
        <Input
          name="family_name"
          disabled={saving}
          required
          type="text"
          placeholder="Nume"
          size="lg"
        />
        <Input
          size="lg"
          required
          disabled={saving}
          slotProps={{
            input: {
              component: () => (
                <IMaskInput
                  mask="+4\0 000 000 000"
                  definitions={{}}
                  disabled={saving}
                  placeholder="Număr de telefon"
                  overwrite="shift"
                  onChange={(event: any) => {
                    const phone = document.getElementById(
                      "phone"
                    ) as HTMLInputElement;
                    phone.value = (event.target.value as string).replaceAll(
                      " ",
                      ""
                    ) as string;
                  }}
                  css={css`
                    outline: none;
                    background: transparent;
                    border: none;
                    font-size: 19px;
                    &::placeholder {
                      color: #7a7f82;
                    }
                  `}
                />
              ),
            },
          }}
        />

        <input type="hidden" id="phone" name="phone" />

        <Autocomplete<City>
          required
          disabled={saving}
          filterOptions={filterOptions}
          placeholder="Localitate"
          size="lg"
          options={counties}
          groupBy={(o) => o.county_name}
          getOptionLabel={(option) => option.name}
          getOptionKey={(option) => option.id}
          onChange={(_, value) => {
            const city = document.getElementById("city") as HTMLInputElement;
            city.value = (value ? value.id : "") as string;
          }}
        ></Autocomplete>

        <input type="hidden" id="city" name="city" />

        <Button size="lg" type="submit">
          {saving ? <CircularProgress size="sm"/> : 'Crează'}
        </Button>
      </Stack>
    </form>
  );
};

export default RegisterForm;
