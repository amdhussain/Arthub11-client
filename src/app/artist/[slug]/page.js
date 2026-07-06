import ArtistProfile from '@/components/artist/ArtistProfile';

export default async function ArtistPage({ params }) {
  const { slug } = await params;
  return <ArtistProfile slug={slug} />;
}
