import { css } from "@emotion/react";
import { Button, DialogActions, DialogContent, Modal, ModalClose, ModalDialog } from "@mui/joy";
import { FC } from "react";

export interface ConfirmProps {
    message: string;
    color: 'primary' | 'neutral' | 'danger' | 'success' | 'warning';
    onResponse: (confirm?: boolean) => void;
}

const Confirm:FC<ConfirmProps> = ({message, color, onResponse}) => {
    return (
        <Modal
            open={true}
            onClose={() => onResponse()}
        >
            <ModalDialog
                layout="center"
                variant="soft"
                role="alertdialog"
                css={css`width:400px;`}
            >
                <ModalClose />
                <DialogContent css={css`padding:10px;margin-top:20px;display:flex;justify-content:center;align-items:center;`}>
                    {message}
                </DialogContent>
                <DialogActions css={css`justify-content:center;`}>
                    <Button color={color} onClick={() => onResponse(true)}>
                        Da
                    </Button>
                    <Button variant="outlined" onClick={() => onResponse()}>
                        Anulează
                    </Button>
                </DialogActions>
            </ModalDialog>
        </Modal>
    )
}

export default Confirm;