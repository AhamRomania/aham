"use client"

import Pictures from "@/c/Form/Pictures";
import Location from "@/c/Form/Location";
import { Centred, PageName } from "@/c/Layout";
import { css } from "@emotion/react";
import { Close } from "@mui/icons-material";
import { Button, FormHelperText, Grid, IconButton, Input, Textarea } from "@mui/joy";
import { FormControl, FormLabel } from '@mui/joy';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Backdrop } from "@mui/material";
import { BouncingLogo } from "@/c/logo";

export default function Page() {

  const router = useRouter();

  const [showSlugEditor, setShowSlugEditor] = useState(false);
  const [descriptionCharCount, setDescriptionCharCount] = useState(0);
  const [savingAd, setSavingAd] = useState(false);

  const cancelAdCreating = () => {
      if(confirm('Anulează adăugarea anunțului')) {
        router.push('/u/anunturi');
      }
  }

  const save = () => {
    setSavingAd(true);
  }

  return (
    <Centred width={720}>
      <PageName right={(
        <IconButton
          variant="plain"
          onClick={() => cancelAdCreating()}
        >
            <Close/>
        </IconButton>
      )}>
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
            <Textarea
              onChange={(e) => {
                setDescriptionCharCount(e.target.value.length);
              }}
              minRows={5}
              maxRows={15}
            />
            <FormHelperText>
                <Grid flex="1" container flexDirection="row">
                  <Grid></Grid>
                  <Grid flex={1}></Grid>
                  <Grid>
                    {descriptionCharCount}/10000
                  </Grid>
                </Grid>
            </FormHelperText>
        </FormControl>

        <Grid container spacing={2} sx={{ flexGrow: 1 }}>
            <Grid>
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

        <Grid container gap={2}>
          <Grid>
            <Button
              data-test-id="add-button"
              variant="solid"
              size="lg"
              onClick={() => save()}
              loading={savingAd}
            >
              Publică anunțul
            </Button>
          </Grid>
          <Grid flex={1}>
            <p css={css`font-size:12px;`}>
              Selectând <strong>publică anunțul</strong>, ești de acord că ai citit și ai acceptat <a href="/termeni-si-conditii" target="_blank">termenii și condiții</a> de utilizare. Vă rugăm să consultați de asemenea pagina de <a href="/confidentialitate" target="_blank">confidențialitate</a> pentru informații cu privire la prelucrarea datelor dumneavoastră. Vă rugăm să vizitați pagina noastră de contact pentru a solicita asistență suplimentară.
            </p> 
          </Grid>
        </Grid>
        <Backdrop
          sx={(theme) => ({ color: '#FFF', zIndex: theme.zIndex.drawer + 1 })}
          open={savingAd}
        >
          <BouncingLogo/>
        </Backdrop>
      </div>
    </Centred>
  );
}
