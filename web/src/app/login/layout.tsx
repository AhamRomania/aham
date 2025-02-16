import { seo } from "@/c/funcs";
import { AuthLayout } from "@/c/Layout";
export const metadata = seo('/login');
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
