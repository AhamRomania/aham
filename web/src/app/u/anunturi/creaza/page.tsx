"use client"

import Pictures from "@/c/Form/Pictures/Pictures";
import { GenericPicture } from "@/c/Form/Pictures/types";
import { Centred, PageName } from "@/c/Layout";
import { css } from "@emotion/react";
import { Close } from "@mui/icons-material";
import { Button, Checkbox, Divider, FormHelperText, Grid, IconButton, Input, Stack, Textarea } from "@mui/joy";
import { FormControl, FormLabel } from '@mui/joy';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Backdrop } from "@mui/material";
import { BouncingLogo } from "@/c/logo";
import CategorySelector from "@/c/Categories/CategorySelector";
import { Category } from "@/c/types";
import useApiFetch from "@/hooks/api";

export default function Page() {

  const api = useApiFetch();
  const router = useRouter();

  const [, setCategory] = useState<Category | null>(null);
  const [descriptionCharCount, setDescriptionCharCount] = useState(0);
  const [imagesCount, setImagesCount] = useState(0)
  const [savingAd, setSavingAd] = useState(false);

  const onImagesChange = (images:GenericPicture[]) => {
    setImagesCount(images.length);
  }

  const cancelAdCreating = () => {
      if(confirm('Anulează adăugarea anunțului')) {
        router.push('/u/anunturi');
      }
  }

  return (
    <Centred
      width={720}
      css={css`
        hr {
          margin: 30px 0px;
        }  
      `}
    >
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
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const data = Object.fromEntries((formData as any).entries());
          setSavingAd(true);
          api(`/ads`, {
            method: 'POST',
            body: JSON.stringify({
              currency: 'LEI',
              category: parseInt(data.category),
              description: data.description,
              messages: (data.messages === 'on'),
              show_phone: (data.phone === 'on'),
              phone: (data.phone || ''),
              pictures: (data.pictures||'').split(','),
              price: parseInt(data.price),
              title: data.title,
            }),
          }).then((response: any) => {
            window.location.href = '/u/anunturi/creaza?id=' + response.id;
          }).catch(e => {
            setSavingAd(false);
            console.log(e);
          });
        }}
        css={css`
            margin-bottom:50px;
            .MuiFormControl-root {
                margin-bottom: 20px;
            }    
        `}
      >
        <FormControl size="lg">
            <FormLabel>Categorie</FormLabel>
            <CategorySelector name="category" onCategorySelect={setCategory}/>
        </FormControl>

        <Divider/>

        <FormControl size="lg" required>
            <FormLabel>Imagini</FormLabel>
            <Pictures name="pictures" onChange={onImagesChange}/>
            <FormHelperText>
                <Grid flex="1" container flexDirection="row">
                  <Grid></Grid>
                  <Grid flex={1}></Grid>
                  <Grid>
                    {imagesCount}/20
                  </Grid>
                </Grid>
            </FormHelperText>
        </FormControl>

        <Divider/>

        <FormControl size="lg" required>
            <FormLabel>Titlu</FormLabel>
            <Input name="title"/>
        </FormControl>

        <FormControl size="lg" required>
            <FormLabel>Descriere</FormLabel>
            <Textarea
              name="description"
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
                        name="price"
                        type="number"
                        endDecorator={<div>LEI</div>}
                    />
                </FormControl>
            </Grid>
        </Grid>

        <Divider/>

        <FormControl size="lg">
            <FormLabel>Contact</FormLabel>
            <Stack gap={2} flexDirection="column">
              <Checkbox name="messages" size="md" label="Vreau să primesc mesaje pe platformă"/>
            </Stack>
        </FormControl>

        <FormControl size="lg">
            <Stack gap={2} flexDirection="column">
            <Checkbox name="phone" size="md" label="Afișează numărul de telefon"/>
            </Stack>
        </FormControl>

        <Divider/>

        <FormControl size="lg" required>
            <FormLabel>Locație</FormLabel>
            <Input/>
        </FormControl>

        <Grid
          css={css`margin-top:100px;`}
          container
          gap={2}
        >
          <Grid>
            <Button
              data-test="add-button"
              variant="solid"
              size="lg"
              type="submit"
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
      </form>
    </Centred>
  );
}
