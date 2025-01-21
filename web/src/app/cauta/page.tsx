// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function Cauta(params:any) {
  const {ce} = await params.searchParams!;
  return <>Cautare {ce}</>;
}
