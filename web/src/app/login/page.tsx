"use client";

import { ACCESS_TOKEN_COOKIE_NAME } from "@/c/Auth";
import Cookies from "js-cookie";

export default function Page() {
  const onLogin = () => {
    const userElement = document.getElementById("user");
    const passElement = document.getElementById("pass");

    if (!userElement || !passElement) {
      return;
    }

    const user = (userElement as HTMLInputElement).value;
    const pass = (passElement as HTMLInputElement).value;

    fetch("https://api.aham.ro/v1/auth", {
      method: "POST",
      body: JSON.stringify({ email: user, password: pass }),
    }).then((resp) => {

      if (resp.status != 200) {
        return;
      }

      resp.json().then((data) => {
        
        Cookies.set(ACCESS_TOKEN_COOKIE_NAME, data.token, {
          expires: 30,
          sameSite: 'strict',
          secure: true,
          domain: 'aham.ro'
        });

        window.location.href = "/anunt";
      });
    });
  };

  return (
    <>
      <div style={{ margin: "0 auto", width: 1024 }}>
        <input id="user" type="text" placeholder="User" />
        <input id="pass" type="password" placeholder="Pass" />
        <button onClick={() => onLogin()}>Login</button>
      </div>
    </>
  );
}
