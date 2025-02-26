import { FC, useEffect, useState } from "react";
import { Menu, MenuItem } from "../Layout/aside";
import Sam, { SamPermission, SamResource } from "../Sam";
import {
  AddTaskOutlined,
  AdsClickOutlined,
  Analytics,
  AssignmentTurnedIn,
  Category,
  ChatOutlined,
  CheckCircle,
  DashboardOutlined,
  FavoriteOutlined,
  FiberNew,
  FolderOutlined,
  FolderSpecialOutlined,
  Logout,
  Pages,
  Person,
  Public,
  SettingsOutlined,
  ThumbDown,
} from "@mui/icons-material";
import { AdCounts, User } from "../types";
import { getAdCounts } from "@/api/ads";
import { isPrivilegedUser } from "../funcs";
import { getUser } from "../Auth";

export interface AccountMenuProp {
    hideLogout?:boolean;
}

const AccountMenu: FC<AccountMenuProp> = ({hideLogout}) => {
  const [me, setMe] = useState<User | null | undefined>();
  const [counts, setCounts] = useState<AdCounts>({} as AdCounts);
  useEffect(() => {
    getUser().then(setMe);
    getAdCounts().then(setCounts);
  }, []);
  return (
    <Menu collapsed={false}>
      <MenuItem icon={<DashboardOutlined />} title="Panou" href="/u/" />
      <MenuItem icon={<AdsClickOutlined />} title="Anunțuri" href="/u/anunturi">
        <MenuItem
          icon={<FiberNew />}
          title="Ciorne"
          count={counts.drafts}
          href="/u/anunturi"
        />
        <MenuItem
          icon={<Category />}
          title="Disponibile"
          count={counts.completed}
          href="/u/anunturi/disponibile"
        />
        <MenuItem
          icon={<CheckCircle />}
          title="Aprobare"
          count={counts.pending}
          href="/u/anunturi/aprobare"
        />
        <MenuItem
          icon={<Public />}
          title="Publice"
          count={counts.published}
          href="/u/anunturi/publice"
        />
        <MenuItem
          icon={<AssignmentTurnedIn />}
          count={counts.fixing}
          title="Retușare"
          href="/u/anunturi/retusare"
        />
        <MenuItem
          icon={<ThumbDown />}
          title="Respinse"
          count={counts.rejected}
          href="/u/anunturi/respinse"
        />
        <MenuItem
          icon={<FavoriteOutlined />}
          title="Favorite"
          count={counts.favourite}
          href="/u/anunturi/favorite"
        />
      </MenuItem>
      <MenuItem icon={<ChatOutlined />} title="Mesaje" href="/u/mesaje" />
      <MenuItem icon={<Analytics />} title="Statistici" href="/u/statistici" />
      <MenuItem icon={<Person />} title="Cont" href="/u/cont" />
      <MenuItem icon={<SettingsOutlined />} title="Settings" href="/u/setari" />
      {typeof me !== "undefined" && isPrivilegedUser(me) && (
        <MenuItem
          icon={<FolderSpecialOutlined />}
          title="Administrare"
          href="/u/admin"
        >
          <MenuItem
            icon={<AddTaskOutlined />}
            title="Anunțuri"
            href="/u/admin/anunturi"
          />
          <MenuItem
            icon={<FolderOutlined />}
            title="Atribute"
            href="/u/admin/atribute"
          />
          <Sam
            resource={SamResource.CATEGORIES}
            permission={SamPermission.WRITE}
          >
            <MenuItem
              icon={<FolderOutlined />}
              title="Categorii"
              href="/u/admin/categorii"
            />
          </Sam>
          <MenuItem icon={<Pages />} title="SEO" href="/u/admin/seo" />
        </MenuItem>
      )}
      {!hideLogout && <MenuItem icon={<Logout />} title="Logout" href="/u/logout" />}
    </Menu>
  );
};

export default AccountMenu;
