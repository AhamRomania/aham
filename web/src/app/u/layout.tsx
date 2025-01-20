import { HomepageLayout } from "@/c/Layout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <HomepageLayout>
      {children}
    </HomepageLayout>
  );
}
