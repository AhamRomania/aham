import { createNewUserApp, getUserApps, removeUserApp } from "@/api/common";
import { Add, CopyAll, Delete } from "@mui/icons-material";
import { IconButton, Input, Stack, Table } from "@mui/joy";
import { FC, useEffect, useState } from "react";
import { UserApp } from "../types";
import AccountSection from "./Section";
import Confirm from "../Dialog/Confirm";
import { track } from "../funcs";

const AppList: FC = () => {
  const [apps, setApps] = useState<UserApp[]>();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<UserApp | null>();
  useEffect(() => {
    getUserApps().then(setApps);
  }, []);
  const onCreateNewApp = () => {
    createNewUserApp().then(() => {
      getUserApps().then(setApps);
    });
  };
  const proceedWithDelete = (proceed?: boolean) => {
    if (proceed && showDeleteConfirm) {
      removeUserApp(showDeleteConfirm.id)
        .then(() => {
          setShowDeleteConfirm(null);
          getUserApps().then(setApps);
        })
        .catch(() => {
          setShowDeleteConfirm(null);
          alert(`Failed to remove`);
        });
    } else {
        setShowDeleteConfirm(null);
    }
  };
  const copyKeyToClipboard = (app: UserApp) => {
    navigator.clipboard.writeText(app.key!).then(
      () => {
        track("cont/apps/copyKey", { app: app.id });
      },
      () => {
        alert("Nu am putut copia cheia");
      }
    );
  };
  return (
    <AccountSection
      title={
        <div>
          {"Aplicații"}
          <IconButton onClick={onCreateNewApp} size="sm">
            <Add />
          </IconButton>
        </div>
      }
    >
      {!apps && <div>Nu ai definit nicio aplicație</div>}
      {apps && (
        <div data-test="apps">
          <Table size="lg" borderAxis="none">
            <thead>
              <tr>
                <th style={{ width: "30%" }}>Nume</th>
                <th>Cheie</th>
                <th style={{ width: "50px" }}></th>
              </tr>
            </thead>
            <tbody>
              {apps.map((app, index) => (
                <tr key={index}>
                  <td>
                    <Input readOnly defaultValue={app.name} />
                  </td>
                  <td>
                    <Input
                      readOnly
                      defaultValue={app.key}
                      endDecorator={
                        <IconButton
                          onClick={() => copyKeyToClipboard(app)}
                          variant="soft"
                        >
                          <CopyAll />
                        </IconButton>
                      }
                    />
                  </td>
                  <td>
                    <Stack gap={1} flexDirection="row">
                      <IconButton
                        onClick={() => setShowDeleteConfirm(app)}
                        variant="soft"
                      >
                        <Delete />
                      </IconButton>
                    </Stack>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
      {showDeleteConfirm && (
        <Confirm
          onResponse={proceedWithDelete}
          color="danger"
          message="Ștergi aplicația?"
        />
      )}
    </AccountSection>
  );
};

export default AppList;
