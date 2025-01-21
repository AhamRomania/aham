'use client';

import { createTheme as createThemeMaterial } from '@mui/material/styles';
import { extendTheme as extendThemeJoy } from '@mui/joy/styles';

export const MaterialTheme = createThemeMaterial({
  palette: {
    primary: {
      main: '#1F70B8',
    },
  },
});


export const JoyTheme = extendThemeJoy({
  colorSchemes: {
    dark: {
      palette: {
        primary: {
          mainChannel: '#1F70B8',
        },
      },
    },
  },
  //shadows: {
  //  elevation: '',
  //},
  shadow: {

  },
  //vars: {
  //  Avatar: {
  //    defaultBg: '',
  //  }
  //},
  //shape: {
  //  borderRadius: 8,
  //},
  typography: {
    //pxToRem: (size: number) => `${size / 16}rem`,
  }
});