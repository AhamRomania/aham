import useIsLoggedIn from "@/hooks/auth";
import { redirect } from "next/navigation";

export default async function Page() {

    const isLoggedIn = await useIsLoggedIn();

    if (!isLoggedIn) {
        return redirect('/login');
    }

    return <>Creaza anunt</>;
}
  