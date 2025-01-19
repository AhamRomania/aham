import { Face } from "@mui/icons-material";
import { Avatar } from "@mui/material";
import * as React from "react"

export type UserAvatarProps = {
    uuid?: string
}

const UserAvatar = (props: UserAvatarProps) => {

    return (
        <Avatar variant="rounded">
            <Face/>
        </Avatar>
    )
}

export default UserAvatar