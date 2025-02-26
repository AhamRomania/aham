"use client";

import { destroyCurrentSession } from "@/c/Auth";
import { useRouter } from "next/navigation";

export default function Page() {
    const router = useRouter();
    destroyCurrentSession().then(() => {
        router.push('/');
    });
}
