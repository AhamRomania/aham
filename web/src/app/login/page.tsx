"use client";

import getApiFetch from "@/api/api";
import { setAccessToken } from "@/c/Auth";
import { track } from "@/c/funcs";
import Logo from "@/c/logo";
import OrSection from "@/c/orsection";
import { AuthInfo } from "@/c/types";
import { css } from "@emotion/react";
import {
    Button,
    CircularProgress,
    Input,
    Stack
} from "@mui/joy";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const router = useRouter();
  const api = getApiFetch();

  const [loggingIn, setLoggingIn] = useState(false);

  useEffect(() => {
    track("login/view");
  }, []);

  const onAuthSuccess = (data: AuthInfo) => {
    setAccessToken(data);
    setLoggingIn(false);
    setTimeout(() => {
        const query = new URLSearchParams(window.location.search);
        if (query.get("then")) {
        router.push(query.get("then") as string);
        } else {
        router.push(`/u/anunturi/creaza`);
        }
        router.refresh();
    }, 0);
  }

  const onAuthFail = () => {
    track("login/failed");
    setLoggingIn(false);
    alert("Nu m-am putut loga");
  }

  return (
    <>
      <div
        css={css`
          width: 323px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-item: center;
        `}
      >
        <div
          css={css`
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            margin-bottom: 50px;
            h1 {
              margin-top: 20px;
            }
          `}
        >
          <Link href="/">
            <Logo bg="#9C27B0" color="#FFF" size={42} padding={21} />
          </Link>
          <h1>CONECTARE</h1>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            setLoggingIn(true);
            api<AuthInfo>("/auth", {
              method: "POST",
              body: JSON.stringify(formJson),
            })
              .then(onAuthSuccess)
              .catch(onAuthFail);
          }}
        >
          <Stack spacing={1}>
            <Input
              data-test="login-email-input"
              name="email"
              type="text"
              placeholder="Email"
              size="lg"
              required
            />
            <Input
              data-test="login-password-input"
              name="password"
              type="password"
              placeholder="Parolă"
              size="lg"
              required
            />
            <Button size="lg" type="submit" data-test="login-submit">
              {loggingIn ? <CircularProgress size="sm" /> : "Intră"}
            </Button>
          </Stack>
        </form>

        <OrSection>sau</OrSection>

        <Link href="/cont">
          <Button
            style={{ width: "100%" }}
            size="lg"
            type="submit"
            variant="outlined"
          >
            Crează cont nou
          </Button>
        </Link>
      </div>
    </>
  );
}
