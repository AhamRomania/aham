import { Face } from "@mui/icons-material";
import { Avatar } from "@mui/joy";
import * as React from "react"

export type UserAvatarProps = {
    uuid?: string
}

const UserAvatar = (props: UserAvatarProps) => {

    return (
        <Avatar>
            <Face/>
        </Avatar>
    )
}

export default UserAvatar