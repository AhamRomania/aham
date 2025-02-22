import { archiveChat, deleteChat } from "@/api/chat";
import { css } from "@emotion/react";
import { Archive, MoreVert, Schedule, Search } from "@mui/icons-material";
import { Dropdown, IconButton, Input, List, ListItem, Menu, MenuButton, MenuItem } from "@mui/joy";
import Link from "next/link";
import { FC, MouseEvent, useEffect, useState } from "react";
import Confirm from "../Dialog/Confirm";
import getDomain, { Domain } from "../domain";
import { dateTime } from "../formatter";
import { Chat, User } from "../types";
import ReportDialog from "../Dialog/Report";

export interface ChatListProps {
  items: Chat[] | [];
  current?: number;
  user: User | null;
  onChange: ()=>void;
}

const ChatList: FC<ChatListProps> = ({ items, user, current, onChange }) => {

    const [searchKeyword, setSearchKeyword] = useState<string>('');
    const [archived, setArchived] = useState<boolean>(false);
    const [confirmChatDelete, setConfirmChatDelete] = useState<Chat|null>(null);
    const [confirmChatArchive, setConfirmChatArchive] = useState<Chat|null>(null);
    const [showReportDialog, setShowReportDialog] = useState<Chat|null>(null);

    useEffect(() => {
        if (items && typeof(current) !== 'undefined' && user) {
            const subject = items.find(i => i.id == current);
            if (subject) {
                setArchived((subject.archived||[]).indexOf(user.id) >= 0);
            }
        }
    }, [items, current, user]);

    const onMenuItemOptionClick = (event:MouseEvent, chat: Chat, key: string) => {
        event.stopPropagation();
        event.preventDefault();
        if (key == 'view') {
            window.open(
                getDomain(Domain.ApiV1) + `/ads/${chat.reference}?redirect=true`,
                '_blank',
                ''
            )
        }
        if (key == 'archive') {
            setConfirmChatArchive(chat);
        }
        if (key == 'delete') {
            setConfirmChatDelete(chat);
        }
        if (key == 'report') {
            setShowReportDialog(chat);
        }
    }

    const onArchiveChat = (archive?: boolean) => {

        if (archive && confirmChatArchive) {
            archiveChat(confirmChatArchive?.id).then(
                () => {
                    onChange();
                }
            )
        }

        setConfirmChatArchive(null);
    }

    const onDeleteChat = (proceed?:boolean) => {
        if (proceed && confirmChatDelete) {
            deleteChat(confirmChatDelete?.id).then(
                () => {
                    onChange();
                }
            )
        }

        setConfirmChatDelete(null);
    }

    const getChats = (): Chat[] => {

        if (!user) {
            return [];
        }

        let out = [];

        if (archived) {
            out = items.filter(i => (i.archived||[]).indexOf(user.id) >= 0) || [];    
        } else {
            out = items.filter(i => (i.archived||[]).indexOf(user.id) === -1) || [];
        }
        
        if (searchKeyword) {
            out = items.filter(i => i.title.toLowerCase().includes(searchKeyword.toLowerCase())) || [];
        }

        return out.sort((a, b) => a.title.localeCompare(b.title));
    }

    if (items.length === 0) {
        return (
            <div
                css={css`
                    height: 100%;
                    display:flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 12px;
                    color: #999;
                `}
            >
                Niciun mesaj de afișat
            </div>
        )
    }

  return (
    <>
    <div
      css={css`
        display: flex;
        flex-direction: column;
        height: 100%;
      `}
    >
      <div
        data-test="chat-list-header"
        css={css`
          height: 50px;
          display: flex;
          padding: 5px;
          gap: 5px;
          border-bottom: 1px solid #ededed;
        `}
      >
        <Input
            value={searchKeyword}
            onChange={(e:any) => setSearchKeyword(e.target.value)}
            placeholder="Caută conversație"
        />
        {searchKeyword && (
            <IconButton disabled={true}>
                <Search/>
            </IconButton>
        )}
        {searchKeyword == '' && <Dropdown>
            <MenuButton
                onClick={(e) => {e.stopPropagation();e.preventDefault();}}
                slots={{ root: IconButton }}
            >
                {archived ? <Schedule/> : <Archive/>}
            </MenuButton>
            <Menu>
                <MenuItem disabled={!archived} onClick={() => setArchived(false)}>
                    <span>Mesaje Recente</span>
                </MenuItem>
                <MenuItem disabled={archived} onClick={() => setArchived(true)}>
                    <span>Mesaje Arhivate</span>
                </MenuItem>
            </Menu>
        </Dropdown>}
      </div>
      <div
        data-test="chat-list-items"
        css={css`
          overflow: hidden;
          flex: 1;
          overflow-y: auto;
          a {
            display: block;
            width: 100%;
            padding: 10px;
            border-radius: 8px;
            text-decoration: none;
          }
          a:hover {
            background: #f9f9f9;
          }
          a.selected {
            background: #f9f9f9;
          }
        `}
      >
        <List>
          {getChats().map((chat) => (
            <ListItem key={chat.id} data-test={current}>
              <Link
                className={current === chat.id ? "selected" : ""}
                css={css`
                  > div:first-child {
                    line-height: 20px;
                  }
                  > div:last-child {
                    font-size: 11px;
                    text-decoration: none;
                    color: #999;
                    margin-top: 10px;
                  }
                `}
                href={`/u/mesaje/${chat.id}`}
                prefetch={false}
              >
                <div
                    css={css`
                        display: flex;  
                        >div:first-child {flex:1;}  
                        .title {
                            font-size: 15px;
                            color:#000;
                        }
                    `}
                >
                    <div>
                        <div className="title">{chat.title}</div>
                        <div>
                            <span style={{marginRight:'10px'}}>{chat.participants.map((p) => p.given_name).join(", ")}</span>
                            <span>{dateTime(chat.created_at)}</span>
                        </div>
                    </div>
                    <div>
                        <Dropdown>
                            <MenuButton
                                onClick={(e) => {e.stopPropagation();e.preventDefault();}}
                                slots={{ root: IconButton }}
                            >
                                <MoreVert htmlColor="#999"/>
                            </MenuButton>
                            <Menu>
                                <MenuItem onClick={(e: MouseEvent<HTMLDivElement>)=>onMenuItemOptionClick(e,chat,'view')}>
                                    <span>Vezi anunț</span>
                                </MenuItem>
                                <MenuItem onClick={(e: MouseEvent<HTMLDivElement>)=>onMenuItemOptionClick(e,chat,'archive')}>
                                    <span>Arhivează</span>
                                </MenuItem>
                                <MenuItem onClick={(e: MouseEvent<HTMLDivElement>)=>onMenuItemOptionClick(e,chat,'delete')}>
                                    <span>Șterge</span>
                                </MenuItem>
                                <MenuItem onClick={(e: MouseEvent<HTMLDivElement>)=>onMenuItemOptionClick(e,chat,'report')}>
                                    <span>Raportează</span>
                                </MenuItem>
                            </Menu>
                        </Dropdown>
                    </div>
                </div>
              </Link>
            </ListItem>
          ))}
        </List>
      </div>
    </div>
    {confirmChatArchive ? <Confirm color="primary" message={`Arhivezi ${confirmChatArchive.title}?`} onResponse={onArchiveChat}/> : null}
    {confirmChatDelete ? <Confirm color="danger" message={`Ștergi ${confirmChatDelete.title}?`} onResponse={onDeleteChat}/> : null}
    {showReportDialog && <ReportDialog resource="chat" reference={showReportDialog.id} onClose={() => setShowReportDialog(null)}/>}
    </>
  );
};

export default ChatList;
