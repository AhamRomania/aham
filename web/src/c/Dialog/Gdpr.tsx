"use client";

import { FC, useState } from "react";
import Cookies from "js-cookie";
import { Button, DialogActions, Modal, ModalDialog } from "@mui/joy";
import { css } from "@emotion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Gdpr:FC = () => {

    const [open, setOpen] = useState(true);
    const pathname = usePathname();
    
    if (Cookies.get('gdpr') === 'consent') {
        return [];
    }
    
    const hiddenPaths = ["/confidentialitate", "/cookies"];

    if(hiddenPaths.some((path) => pathname.startsWith(path))) {
        return [];
    }

    const accept = () => {
        Cookies.set('gdpr', 'consent', {expires: 120});
        setOpen(false)
    }

    return (
        <Modal open={open}>
            <ModalDialog
                layout="center"
                variant="soft"
                role="alertdialog"
                css={css`
                    width:500px;
                `}
            >
                <p>
                    Folosim cookie-uri pentru a vă oferi cea mai bună experiență pe site-ul nostru. Continuând să navigați, sunteți de acord cu utilizarea acestora. Aflați mai multe în <Link prefetch={false} target="_blank" href="/confidentialitate">politica de confidențialitate</Link> și <Link target="_blank" prefetch={false} href="/cookies">politica privind cookie-urile.</Link>
                </p>
                <DialogActions>
                    <Button onClick={() => accept()}>Accept toate cookie-urile</Button>
                </DialogActions>
            </ModalDialog>
        </Modal>
    )
}

export default Gdpr;