interface SearchParams {
  ce: string;
}

export default async function Cauta({
        searchParams
    }:{
        searchParams?:SearchParams
    }
) {
  const {ce} = await searchParams!;
  return <>Cautare {ce}</>;
}
