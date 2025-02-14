import Link from "next/link";
import { FC, useEffect, useState } from "react";
import Tip from "../tooltip";
import { IconButton, Snackbar, Stack } from "@mui/joy";
import { CheckCircle } from "@mui/icons-material";
import { Ad } from "../types";
import getDomain, { Domain } from "../domain";

export interface SocialShareProps {
  url: string;
  ad: Ad
}

const SocialShare: FC<SocialShareProps> = ({ url, ad }) => {

  const [showCopiedInfo, setShowCopiedInfo] = useState(false);
  const [shortURL, setShortURL] = useState<string>();

  useEffect(() => {
    if (shortURL) { return; }
    const data = new FormData();
    data.set("url", url);
    fetch(getDomain(Domain.Url), { method: "POST", mode: 'no-cors', body: data })
      .then((response) => response.text())
      .then((short) => {
        setShortURL(short);
      });
  }, []);

  const handleCopyURL = () => {
    if (shortURL) {
      navigator.clipboard.writeText(shortURL!).then(
        () => {
          setShowCopiedInfo(true);
        },
        () => {
          alert("Nu am putut copia URL");
        }
      );
    }
  };

  return (
    <>
      <Stack gap={1} flexDirection="row">
        <Tip delay={100} title="Distribuie pe X">
          <Link href={`https://x.com/intent/tweet?text=${ad.title}&url=${shortURL}`} target="_blank">
            <svg xmlns="http://www.w3.org/2000/svg" width={32} height={32}>
              <path
                fill="#000"
                fillRule="nonzero"
                d="M5.333 0A5.333 5.333 0 0 0 0 5.333v21.334A5.333 5.333 0 0 0 5.333 32h21.334A5.333 5.333 0 0 0 32 26.667V5.333A5.333 5.333 0 0 0 26.667 0H5.333Zm1.59 6.857h6.047l4.295 6.103 5.211-6.103h1.905l-6.256 7.325 7.714 10.96h-6.046l-4.983-7.08-6.048 7.08H6.857l7.092-8.301-7.026-9.984Zm2.916 1.524 10.749 15.238h2.335L12.174 8.381H9.84Z"
              />
            </svg>
          </Link>
        </Tip>

        <Tip delay={100} title="Distribuie pe Facebook">
          <Link href={`https://www.facebook.com/sharer/sharer.php?u=${shortURL}`} target="_blank">
            <svg xmlns="http://www.w3.org/2000/svg" width={32} height={32}>
              <path
                fill="#000"
                fillRule="nonzero"
                d="M28.19 0H3.81A3.81 3.81 0 0 0 0 3.81v24.38A3.81 3.81 0 0 0 3.81 32h24.38A3.81 3.81 0 0 0 32 28.19V3.81A3.81 3.81 0 0 0 28.19 0Zm-3.047 11.429h-1.524c-1.63 0-2.286.38-2.286 1.523v2.286h3.81l-.762 3.81h-3.048v11.428h-3.81V19.048h-3.047v-3.81h3.048v-2.286c0-3.047 1.524-5.333 4.571-5.333 2.21 0 3.048.762 3.048.762v3.048Z"
              />
            </svg>
          </Link>
        </Tip>

        <Tip delay={100} title="Distribuie pe Pinterest">
          <Link href={`https://pinterest.com/pin/create/button/?url=${shortURL}&description=${ad.title}`} target="_blank">
            <svg xmlns="http://www.w3.org/2000/svg" width={32} height={32}>
              <path
                fill="#000"
                fillRule="nonzero"
                d="M16 0C7.178 0 0 7.178 0 16c0 6.876 4.36 12.751 10.46 15.01-.176-1.566-.148-4.131.142-5.373.271-1.167 1.754-7.435 1.754-7.435s-.448-.896-.448-2.22c0-2.08 1.205-3.632 2.706-3.632 1.277 0 1.892.958 1.892 2.107 0 1.284-.816 3.201-1.239 4.979-.353 1.49.747 2.704 2.215 2.704 2.658 0 4.701-2.804 4.701-6.85 0-3.58-2.572-6.084-6.246-6.084-4.255 0-6.753 3.192-6.753 6.49 0 1.286.495 2.664 1.113 3.414.122.149.14.278.104.429-.114.472-.366 1.488-.416 1.696-.065.275-.217.332-.5.2-1.868-.87-3.036-3.6-3.036-5.795 0-4.717 3.427-9.05 9.883-9.05 5.189 0 9.22 3.696 9.22 8.638 0 5.155-3.25 9.303-7.76 9.303-1.516 0-2.94-.788-3.428-1.718 0 0-.75 2.856-.932 3.556-.315 1.21-1.663 3.719-2.339 4.858 1.547.5 3.196.773 4.907.773 8.823 0 16-7.177 16-16 0-8.822-7.177-16-16-16Z"
              />
            </svg>
          </Link>
        </Tip>
        <Tip delay={100} title="Copiază Link">
          <IconButton onClick={handleCopyURL}>
            <svg xmlns="http://www.w3.org/2000/svg" width={32} height={32}>
              <path
                fill="#000"
                fillRule="nonzero"
                d="M26.667 0A5.333 5.333 0 0 1 32 5.333v21.334A5.333 5.333 0 0 1 26.667 32H5.333A5.333 5.333 0 0 1 0 26.667V5.333A5.333 5.333 0 0 1 5.333 0ZM15 11h-4c-1.383 0-2.563.488-3.537 1.463C6.487 13.438 6 14.617 6 16s.487 2.563 1.463 3.538C8.437 20.512 9.617 21 11 21h4v-2h-4a2.893 2.893 0 0 1-2.125-.875A2.893 2.893 0 0 1 8 16c0-.833.292-1.542.875-2.125A2.893 2.893 0 0 1 11 13h4v-2Zm6 0h-4v2h4c.833 0 1.542.292 2.125.875S24 15.167 24 16s-.292 1.542-.875 2.125A2.893 2.893 0 0 1 21 19h-4v2h4c1.383 0 2.563-.488 3.538-1.462C25.512 18.562 26 17.383 26 16s-.488-2.563-1.462-3.537C23.562 11.488 22.383 11 21 11Zm-1 4h-8v2h8v-2Z"
              />
            </svg>
          </IconButton>
        </Tip>
      </Stack>
      <Snackbar
        variant="outlined"
        anchorOrigin={{vertical:'top', horizontal:'center'}}
        open={showCopiedInfo}
        autoHideDuration={3000}
        onClose={() => setShowCopiedInfo(false)}
      >
        <CheckCircle color="success"/>
        Adresa URL a fost copiată!
      </Snackbar>
    </>
  );
};

export default SocialShare;
