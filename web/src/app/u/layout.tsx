import LargeHeader from "@/c/LargeHeader";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <>
      <LargeHeader />
      <div style={{margin:"0 auto", width:1024}}>{children}</div>
    </>
  );
}
