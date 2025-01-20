import { MainLayout } from "@/c/Layout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <MainLayout>
      {children}
    </MainLayout>
  );
}
