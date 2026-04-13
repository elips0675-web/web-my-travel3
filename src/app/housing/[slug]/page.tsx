import HousingDetailsPageContent from '@/components/pages/housing-details-page';

export default function HousingDetailsPage({ params }: { params: { slug: string } }) {
    return <HousingDetailsPageContent slug={params.slug} />;
}
