"use client"

import getApiFetch from "@/api/api";
import CategorySelector from "@/c/Categories/CategorySelector";
import AutocompletePropValue from "@/c/Form/AutocompletePropValue";
import NumericFormatAdapter from "@/c/Form/NumericFormatAdapter";
import Pictures from "@/c/Form/Pictures/Pictures";
import { GenericPicture } from "@/c/Form/Pictures/types";
import { toCents } from "@/c/formatter";
import { PageName } from "@/c/Layout";
import { AccountLayoutContext } from "@/c/Layout/account";
import { BouncingLogo } from "@/c/logo";
import { Category, Prop } from "@/c/types";
import { css } from "@emotion/react";
import { Button, Checkbox, Divider, FormControl, FormHelperText, FormLabel, Grid, Input, Option, Select, Stack, Textarea } from "@mui/joy";
import { Backdrop } from "@mui/material";
import Link from "next/link";
import { Fragment, useContext, useEffect, useState } from "react";

export default function Page() {

  const {setPath} = useContext(AccountLayoutContext);
  const api = getApiFetch();

  const [currency, setCurrency] = useState('LEI');
  const [category, setCategory] = useState<Category | null>(null);
  const [descriptionCharCount, setDescriptionCharCount] = useState(0);
  const [imagesCount, setImagesCount] = useState(0)
  const [savingAd, setSavingAd] = useState(false);
  const [props, setProps] = useState<Prop[]>();

  const onImagesChange = (images:GenericPicture[]) => {
    setImagesCount(images.length);
  }

  useEffect(() => {
    setPath(
      <>
        <Link href="/u/anunturi">
          Anunțuri
        </Link>
        <span>Crează aunț</span>
      </>
    )
  },[]);

  useEffect(() => {
    if (category && category.id) {
      api<Prop[]>(`/categories/${category?.id}/props`).then(setProps);
    }
  }, [category]);

  const propElementFactory = (prop: Prop) => {
    switch (prop.type) {
      case 'NUMBER':
        return <FormControl key={prop.id} size="lg">
            <FormLabel>{prop.title}</FormLabel>
            <Input type="number" name={`prop[${prop.name}]`} endDecorator={prop.template ?? prop.template}/>
            {prop.description && <FormHelperText>{prop.description}</FormHelperText>}
        </FormControl>
      case 'TEXT':
        return <FormControl key={prop.id} size="lg">
            <FormLabel>{prop.title}</FormLabel>
            <AutocompletePropValue prop={prop} endDecorator={prop.template ?? prop.template}/>
            {prop.description && <FormHelperText>{prop.description}</FormHelperText>}
        </FormControl>
      case 'BOOL':
        return <FormControl key={prop.id} size="lg">
            <FormLabel>{prop.title}</FormLabel>
            <Checkbox name={`prop[${prop.name}]`}/>
            {prop.description && <FormHelperText>{prop.description}</FormHelperText>}
        </FormControl>
      case 'DATE':
        return <FormControl key={prop.id} size="lg">
            <FormLabel>{prop.title}</FormLabel>
            <Input type="date" name={`prop[${prop.name}]`} endDecorator={prop.template ?? prop.template}/>
            {prop.description && <FormHelperText>{prop.description}</FormHelperText>}
        </FormControl>
      case 'SELECT':
        return (
          <FormControl key={prop.id} size="lg">
            <FormLabel>{prop.title}</FormLabel>
            <Select name={`prop[${prop.name}]`}>
              <Option value="-1">Alege {prop.title}</Option>
              {prop.options.values.map((v: string,i: number) => <Option key={i} value={i}>{v}</Option>)}
              <Option value="0">Nu este în listă</Option>
            </Select>
            {prop.description && <FormHelperText>{prop.description}</FormHelperText>}
          </FormControl>
        )
    }
  }

  const renderProps = () => {
    return props?.map((prop: Prop, index: number) => {
        return (
          <div key={index} data-type={prop.type}>
            {propElementFactory(prop)}
          </div>
        )
    })
  }

  const getFormDataProps = (formData:{[key:string]:any}): {[key:string]:any} => {
    
    if (!props || props.length === 0) {
      return {};
    }

    const values: {[key:string]:any} = {};

    Object.keys(formData).forEach(formKey => {
        const reg = new RegExp(/^prop\[(.*)\]$/)
        if (formData[formKey] !== '' && reg.test(formKey)) {
          const propKey = formKey.match(reg)![1];
          values[propKey] = formData[formKey];
        }
    });

    return values
  }

  return (
    <>
      <PageName>
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
              category: parseInt(data.category),
              description: data.description,
              messages: (data.messages === 'on'),
              show_phone: (data.phone === 'on'),
              phone: (data.phone || ''),
              pictures: (data.pictures||'').split(','),
              currency: currency,
              price: toCents(data.price),
              title: data.title,
              props: getFormDataProps(data)
            }),
          }).then((response: any) => {
            window.location.href = '/u/anunturi?id=' + response.id;
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
            hr {
                margin: 30px 0;
            }
        `}
      >
        <FormControl size="lg" required>
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

        <div
          css={css`
            @media only screen and (min-width : 1200px) {
              display: grid; 
              grid-template-columns: 1fr 1fr; 
              gap: 20px;
            }
          `}
        >
        {renderProps()}
        </div>

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
                        slotProps={{
                          input: {
                            component: NumericFormatAdapter,
                          },
                        }}
                        sx={{ width: 300 }}
                        endDecorator={
                          <Fragment>
                            <Divider orientation="vertical" />
                            <Select
                              variant="plain"
                              value={currency}
                              onChange={(_, value) => setCurrency(value!)}
                              slotProps={{
                                listbox: {
                                  variant: 'outlined',
                                },
                              }}
                              sx={{ mr: -1.5, '&:hover': { bgcolor: 'transparent' } }}
                            >
                              <Option value="EUR">EUR</Option>
                              <Option value="LEI">LEI</Option>
                            </Select>
                          </Fragment>
                        }
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

        <Grid
          css={css`
            margin-top:100px;
            flex-direction: column;
            @media only screen and (min-width : 1200px) {
                flex-direction: row;
            }
          `}
          container
          gap={2}
        >
          <Grid
            css={css`
              gap: 10px;
              display: flex; 
              flex: 1;
              button {
              flex: 1;
              } 
            `}
          >
            <Button
              data-test="add-button"
              variant="outlined"
              size="lg"
              type="submit"
              loading={savingAd}
            >
              Salvează
            </Button>
            <Button
              data-test="add-button"
              variant="solid"
              size="lg"
              type="submit"
              loading={savingAd}
            >
              Publică
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
      </>
  );
}
