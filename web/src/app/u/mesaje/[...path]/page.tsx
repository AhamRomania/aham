"use server";

import Chat from "@/c/Chat/Chat";

export default async function Page(props: any) {
  const params = await props.params
  return <Chat selected={parseInt(params.path)}/>
}