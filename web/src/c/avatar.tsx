import { Face } from "@mui/icons-material";
import { Avatar } from "@mui/material";
import * as React from "react"

export type UserAvatarProps = {
    uuid?: string
}

const UserAvatar = (props: UserAvatarProps) => {

    return (
        <Avatar data-avatar-uuid={props.uuid} variant="rounded">
            <Face/>
        </Avatar>
    )
}

export default UserAvatar