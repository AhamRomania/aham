import { AuthLayout } from "@/c/Layout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
      <AuthLayout>
        <div style={{margin:"0 auto", width:1024}}>{children}</div>
      </AuthLayout>
  );
}
