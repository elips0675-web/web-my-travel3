import ActivityDetailsPageContent from '@/components/pages/activity-details-page';

export default function ActivityDetailsPage({ params }: { params: { slug: string } }) {
    return <ActivityDetailsPageContent slug={params.slug} />;
}
