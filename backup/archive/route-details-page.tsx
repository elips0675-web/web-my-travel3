import { type Route, type Place } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Map from '@/components/map';
import { Calendar, Edit, MapPin, PlusCircle, Building2, Landmark, Utensils } from 'lucide-react';
import Suggestions from '@/components/suggestions';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

function PlaceIcon({ type }: { type: Place['type'] }) {
    const className = "h-5 w-5 text-primary-foreground";
    switch (type) {
        case 'restaurant':
            return <Utensils className={className} />;
        case 'attraction':
            return <Landmark className={className} />;
        case 'hotel':
            return <Building2 className={className} />;
        default:
            return <MapPin className={className} />;
    }
}

function SuggestionsSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-7 w-1/2" />
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg space-y-3">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-10 w-full" />
                    <div className="flex justify-between items-center">
                        <Skeleton className="h-6 w-1/4" />
                        <Skeleton className="h-8 w-1/3" />
                    </div>
                </div>
                <div className="p-4 border rounded-lg space-y-3">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-10 w-full" />
                    <div className="flex justify-between items-center">
                        <Skeleton className="h-6 w-1/4" />
                        <Skeleton className="h-8 w-1/3" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default function RouteDetailsPageContent({ route }: { route: Route }) {
    const mapCenter = route.places.length > 0 ? route.places[0].coordinates : { lat: 48.8566, lng: 2.3522 }; // Default to Paris

    return (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 space-y-8">
                {/* Route Header */}
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-4xl font-headline font-bold">{route.name}</h1>
                        <div className="flex items-center flex-wrap gap-4 text-muted-foreground mt-2">
                            <span className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {route.destination}</span>
                            <span className="flex items-center gap-2"><Calendar className="h-4 w-4" /> {new Date(route.startDate).toLocaleDateString('ru-RU')} - {new Date(route.endDate).toLocaleDateString('ru-RU')}</span>
                        </div>
                    </div>
                    <Button variant="outline"><Edit className="mr-2 h-4 w-4" /> Редактировать</Button>
                </div>

                {/* Map */}
                <Card className="h-[400px] lg:h-[600px] overflow-hidden shadow-lg">
                    <Map places={route.places} center={mapCenter} />
                </Card>

                {/* AI Suggestions */}
                <Suspense fallback={<SuggestionsSkeleton />}>
                    <Suggestions route={route} />
                </Suspense>

            </div>

            <div className="xl:col-span-1 space-y-6">
                <Card className="sticky top-20">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="font-headline">Места</CardTitle>
                        <Button size="sm" variant="outline"><PlusCircle className="mr-2 h-4 w-4" /> Добавить</Button>
                    </CardHeader>
                    <CardContent>
                        {route.places.length > 0 ? (
                            <ul className="space-y-4">
                                {route.places.map(place => (
                                    <li key={place.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-secondary transition-colors">
                                        <div className="bg-primary p-3 rounded-lg mt-1">
                                            <PlaceIcon type={place.type} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">{place.name}</h3>
                                            <p className="text-sm text-muted-foreground line-clamp-2">{place.description}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-muted-foreground text-center py-4">Добавьте места в ваш маршрут.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
