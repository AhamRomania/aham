import { css } from "@emotion/react";
import { Button, CircularProgress, DialogActions, DialogContent, DialogTitle, Modal, ModalClose, ModalDialog } from "@mui/joy";
import { FC, useRef, useState } from "react";
import DPropForm from "../Form/DProp";
import { Prop } from "../types";
import getApiFetch from "@/api/api";

export interface DPropDialogProps {
    prop?: Prop | null;
    onClose: () => void;
}

const DPropDialog:FC<DPropDialogProps> = ({prop, onClose}) => {
    
    const api = getApiFetch();
    const [saving, setSaving] = useState<boolean>(false);
    const formRef = useRef<HTMLFormElement>(null);

    const onFormSubmit = (prop: Prop) => {
        
        setSaving(true)

        const payload: Partial<Prop> = {}

        Object.assign(payload, prop);

        delete payload['id'];

        if (payload.options == '') {
            payload.options = {};
        } else {
            payload.options = JSON.parse(payload.options);
        }

        if (prop.id) {
            
            api(`/props/${prop.id}`,{
                method: 'PUT',
                body: JSON.stringify(payload),
            }).then(
                () => {
                    setSaving(false);
                    if (onClose) { onClose(); }
                }
            ).catch(
                () => {
                    setSaving(false);
                    alert("Nu am putut salva");
                }
            )

            return;
        }

        api(`/props`,{
            method: 'POST',
            body: JSON.stringify(payload),
        }).then(
            () => {
                setSaving(false);
                if (onClose) { onClose(); }
            }
        ).catch(
            () => {
                setSaving(false);
                alert("Nu am putut adăuga");
            }
        )
    }

    const onSubmitClick = () => {
        if (formRef.current) {
            const event = new Event("submit", { bubbles: true, cancelable: true });
            formRef.current.dispatchEvent(event);
        }
    }

    return (
        <Modal
            open={true}
            onClose={() => onClose && onClose()}
        >
            <ModalDialog
                layout="center"
                variant="soft"
                role="alertdialog"
                css={css`width:500px;`}
            >
                <ModalClose />
                <DialogTitle>
                    Proprietate dinamică
                </DialogTitle>
                <DialogContent>
                    <DPropForm formRef={formRef} prop={prop} onSubmit={onFormSubmit}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => onSubmitClick()} disabled={saving} startDecorator={saving ? <CircularProgress/> : ''}>
                        Salvează
                    </Button>
                </DialogActions>
            </ModalDialog>
        </Modal>
    )
}

export default DPropDialog;