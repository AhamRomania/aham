import { css } from "@emotion/react";
import {
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalClose,
  ModalDialog,
  Option,
  Select,
  Textarea,
} from "@mui/joy";
import { FC, useEffect, useRef, useState } from "react";
import { Ad, ReportData, User } from "../types";
import { getMe, saveAdReport } from "@/api/common";
import { track } from "../funcs";

export interface ReportAdDialog {
  ad: Ad;
  onClose: (success: boolean) => void;
}

const ReportAdDialog: FC<ReportAdDialog> = ({ ad, onClose }) => {
  const [saving, setSaving] = useState<boolean>(false);
  const [reason, setReason] = useState<string>("");
  const [me, setMe] = useState<User>();
  const [fetching, setFetching] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    track('ad/report/dialog/show',{"ad":ad.id});
  }, []);

  useEffect(() => {
    getMe().then(
        (me) => {
            setMe(me);
            setFetching(false);
        }
    );
  },[]);

  const onSubmitClick = () => {
    setSaving(true);
    formRef.current?.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }))
  };

  const save = (data: ReportData) => {
    saveAdReport(ad, data).then(
        () => {
            setSaving(false);
            onClose(true);
        }
    ).catch(
        () => {
            setSaving(false);
            alert('Nu am putut salva. Posibil să fi raportat deja acest anunț, dacă nu te rugăm încearcă mai târziu.');
        }
    )
  }

  if(fetching) {
    return [];
  }

  return (
    <Modal open={true} onClose={() => onClose()}>
      <ModalDialog
        layout="center"
        variant="soft"
        role="alertdialog"
        css={css`
          width: 500px;
        `}
      >
        <ModalClose />
        <DialogTitle>Raportează anunț</DialogTitle>
        <DialogContent>
            <form
                ref={formRef}
                onSubmit={(event:any) => {
                    event.preventDefault();
                    const formData = new FormData(event.currentTarget);
                    const data = Object.fromEntries((formData as any).entries());
                    save(data as any);
                }}
            >
            {!me && (
                <>
                    <FormControl>
                        <FormLabel>Nume</FormLabel>
                        <Input name="name" type="text" autoFocus={true} />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Email</FormLabel>
                        <Input name="email" type="email" autoFocus={true} />
                    </FormControl>
                </>
            )}
          <FormControl>
            <FormLabel>Motiv</FormLabel>
            <Select name="reason" onChange={(e: any, v: any) => setReason(v)}>
              <Option defaultChecked value={"inappropriate"}>Conținut neadecvat</Option>
              <Option value={"copyright"}>Drepturi de autor</Option>
              <Option value={"spam"}>Spam</Option>
              <Option value={"other"}>Alt motiv</Option>
            </Select>
          </FormControl>
          {reason === "other" && (
            <FormControl>
              <FormLabel>Mesajul tău</FormLabel>
              <Textarea name="comments" autoFocus={true} minRows={4} />
            </FormControl>
          )}
          </form>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => onSubmitClick()}
            disabled={saving}
            startDecorator={saving ? <CircularProgress /> : ""}
          >
            Salvează
          </Button>
        </DialogActions>
      </ModalDialog>
    </Modal>
  );
};

export default ReportAdDialog;
