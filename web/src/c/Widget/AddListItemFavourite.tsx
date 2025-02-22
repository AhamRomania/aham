import { Delete } from "@mui/icons-material";
import { IconButton } from "@mui/joy";
import { FC, useState } from "react";
import { Ad } from "../types";
import AdListItem from "./AdListItem";
import Confirm from "../Dialog/Confirm";
import { removeFavourite } from "@/api/ads";

export interface AdListItemProps {
  ad: Ad;
  onRemove:()=>void;
}

const AdListItemFavourite: FC<AdListItemProps> = ({ ad,onRemove }) => {
  const [showRemoveConfirm, setShowRemoveConfig] = useState(false);

  const remove = (proceed?: boolean) => {
    if (proceed) {
        removeFavourite(ad).then(
            () => {
                onRemove();
            }
        )
    }

    setShowRemoveConfig(false);
  };
  return (
    <>
      <AdListItem
        ad={ad}
        actions={
          <>
            <div style={{ flex: 1 }}></div>
            <IconButton onClick={() => setShowRemoveConfig(true)} variant="solid" color="danger">
              <Delete />
            </IconButton>
          </>
        }
      />
      {showRemoveConfirm && (
        <Confirm color="danger" message="Ștergi anunțul de la favorite?" onResponse={remove} />
      )}
    </>
  );
};

export default AdListItemFavourite;
