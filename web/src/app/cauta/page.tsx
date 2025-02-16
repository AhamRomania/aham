import { seo } from "@/c/funcs";
export const metadata = seo('/cauta');
export default async function Cauta(params:any) {
  const {ce} = await params.searchParams!;
  return <>Cautare {ce}</>;
}
