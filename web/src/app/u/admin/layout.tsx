import { Centred } from "@/c/Layout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <Centred>
      {children}
    </Centred>
  );
}
