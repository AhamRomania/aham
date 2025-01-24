import { AuthLayout } from "@/c/Layout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
      <AuthLayout>
        {children}
      </AuthLayout>
  );
}
