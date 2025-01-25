import { AccountLayout } from "@/c/Layout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <AccountLayout>
      {children}
    </AccountLayout>
  );
}
