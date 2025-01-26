"use client"

import Pictures from "@/c/Form/Pictures";
import Location from "@/c/Form/Location";
import { Centred, PageName } from "@/c/Layout";
import { css } from "@emotion/react";
import { Close } from "@mui/icons-material";
import { Button, FormHelperText, Grid, IconButton, Input, Textarea } from "@mui/joy";
import { FormControl, FormLabel } from '@mui/joy';
import { useState } from "react";

export default function Page() {

  const [showSlugEditor, setShowSlugEditor] = useState(false);

  return (
    <Centred width={720}>
      <PageName right={<IconButton variant="plain"><Close/></IconButton>}>
        Crează anunț
      </PageName>
      <div
        css={css`
            margin-bottom:50px;
            .MuiFormControl-root {
                margin-bottom: 20px;
            }    
        `}
      >

        <FormControl size="lg" required>
            <FormLabel>Imagini</FormLabel>
            <Pictures/>
        </FormControl>

        <FormControl size="lg" required>
            <FormLabel>Titlu</FormLabel>
            <Input value="Minge de baschet culoare portocalie"/>
            <FormHelperText>
              <span style={{color:'#999'}}>aham.ro/categorie/</span>
              <span onClick={() => setShowSlugEditor(true)} style={{fontWeight:500}}>minge-de-baschet-culoare-portocalie</span>
            </FormHelperText>
        </FormControl>

        {showSlugEditor && (
          <FormControl size="lg" required>
            <FormLabel>URL</FormLabel>
            <Input startDecorator={<span style={{color:'#999'}}>aham.ro/categorie/</span>} value="minge-de-baschet-culoare-portocalie"/>
        </FormControl>
        )}

        <FormControl size="lg" required>
            <FormLabel>Descriere</FormLabel>
            <Textarea minRows={5} maxRows={15}/>
            <FormHelperText>
                <Grid flex="1" container flexDirection="row">
                  <Grid></Grid>
                  <Grid flex={1}></Grid>
                  <Grid>
                    1/10000
                  </Grid>
                </Grid>
            </FormHelperText>
        </FormControl>

        <Grid container spacing={2} sx={{ flexGrow: 1 }}>
            <Grid size={1}>
                <FormControl size="lg" required>
                    <FormLabel>Preț</FormLabel>
                    <Input
                        type="number"
                        endDecorator={<div>LEI</div>}
                    />
                </FormControl>
            </Grid>
        </Grid>

        <FormControl size="lg" required>
            <FormLabel>Promovează</FormLabel>
            Promovează
        </FormControl>

        <FormControl size="lg" required>
            <FormLabel>Contact</FormLabel>
            Contact
        </FormControl>

        <FormControl size="lg" required>
            <FormLabel>Location</FormLabel>
            <Location/>
        </FormControl>

        <Button
          data-test-id="add-button"
          variant="solid"
        >
          Adaugă
        </Button>
      </div>
    </Centred>
  );
}
