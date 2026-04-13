'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState, useEffect } from "react";
import Image from 'next/image';
import Link from 'next/link';

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Search, Star, MapPin } from "lucide-react";
import { type AiActivityRecommendationsOutput } from '@/ai/flows/ai-activity-recommendations';
import { Textarea } from "@/components/ui/textarea";
import { ActivityFilters } from "@/components/activity-filters";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

type RecommendationWithSlug = AiActivityRecommendationsOutput['recommendations'][0] & { slug: string };

const formSchema = z.object({
  destination: z.string().min(2, { message: "Пункт назначения должен содержать не менее 2 символов." }),
  preferences: z.string().min(3, { message: "Опишите ваши предпочтения."}),
});

const generateSlug = (name: string, index: number) => {
    const rusToLat: { [key: string]: string } = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e', 'ж': 'zh',
        'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
        'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'c',
        'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
    };
    return name.toLowerCase()
        .split('').map(char => rusToLat[char] || char).join('')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-') + `-${index}`;
};


function ActivityCard({ recommendation, index }: { recommendation: RecommendationWithSlug, index: number }) {
  const priceString = recommendation.price;
  let fromText = '';
  let mainPrice = priceString;

  if (priceString.toLowerCase().startsWith('от ')) {
    fromText = priceString.substring(0, 2); // "от"
    mainPrice = priceString.substring(3); // e.g. "30 BYN/час"
  }
  
  return (
    <Card className="group overflow-hidden transition-shadow hover:shadow-xl flex flex-col rounded-2xl">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={recommendation.imageUrl || `https://picsum.photos/seed/activity${index}/800/600`}
          alt={recommendation.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          data-ai-hint={`${recommendation.type.toLowerCase()} activity`}
        />
        {recommendation.rating && (
            <div className="absolute top-3 right-3 bg-card/90 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="font-semibold text-card-foreground">{recommendation.rating.toFixed(1)}</span>
            </div>
        )}
      </div>
      <CardHeader>
        <CardDescription>{recommendation.type}</CardDescription>
        <CardTitle className="font-bold text-lg mb-0 group-hover:text-primary transition-colors">{recommendation.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center text-sm text-muted-foreground mb-3">
            <MapPin className="w-4 h-4 mr-1.5" />
            {recommendation.location}
        </div>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{recommendation.description}</p>
      </CardContent>
       <CardFooter className="flex items-center justify-between pt-3 border-t mt-auto">
            <div>
              {fromText && <span className="text-sm text-muted-foreground mr-1">{fromText}</span>}
              <span className="text-2xl font-bold text-primary">{mainPrice}</span>
            </div>
            <Button asChild>
                <Link href={`/activities/${recommendation.slug}`}>Подробнее</Link>
            </Button>
      </CardFooter>
    </Card>
  )
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 12 }).map((i, index) => (
        <Card key={index} className="overflow-hidden flex flex-col rounded-2xl">
            <Skeleton className="h-48 w-full" />
            <CardHeader>
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent className="flex flex-col flex-grow gap-4">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full" />
            </CardContent>
            <CardFooter className="flex items-center justify-between pt-3 border-t mt-auto">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-10 w-1/3" />
            </CardFooter>
        </Card>
      ))}
    </div>
  )
}

const baseMockActivityData: AiActivityRecommendationsOutput = {
    recommendations: [
      { name: "VR-арена Warpoint", type: "VR-арена", description: "Командный VR-шутер на большой арене. Почувствуй себя героем боевика!", price: "от 30 BYN/час", location: "пр-т Победителей, 9, Минск", rating: 4.9, imageUrl: "https://picsum.photos/seed/vr-warpoint/800/600" },
      { name: "Квест «Пила»", type: "Квест", description: "Хоррор-квест по мотивам знаменитого фильма. Сможете ли вы выбраться из ловушки Конструктора?", price: "от 100 BYN за команду", location: "ул. Куйбышева, 22, Минск", rating: 4.8, imageUrl: "https://picsum.photos/seed/saw-quest/800/600" },
      { name: "Боулинг-клуб Madison", type: "Боулинг", description: "Современный боулинг-центр с 12 дорожками, баром и рестораном. Отличное место для компании.", price: "от 45 BYN/час", location: "ул. Тимирязева, 9, Минск", rating: 4.6, imageUrl: "https://picsum.photos/seed/bowling-madison/800/600" },
      { name: "Картинг-центр «Форсаж»", type: "Картинг", description: "Одна из лучших крытых картинг-трасс в Минске. Скорость, адреналин и дух соперничества.", price: "от 35 BYN за заезд", location: "пр-т Дзержинского, 91, Минск", rating: 4.7, imageUrl: "https://picsum.photos/seed/karting-forsazh/800/600" },
      { name: "Парк активного отдыха «0.67»", type: "Активный отдых", description: "Пейнтбол, лазертаг, веревочный городок и беседки для отдыха на природе.", price: "от 40 BYN с человека", location: "Минский район, д. Комарово", rating: 4.8, imageUrl: "https://picsum.photos/seed/park-067/800/600" },
      { name: "Аквапарк «Лебяжий»", type: "Аквапарк", description: "Крупнейший аквапарк в Беларуси с множеством горок, бассейнов и спа-зоной.", price: "от 55 BYN за 4 часа", location: "пр-т Победителей, 120, Минск", rating: 4.5, imageUrl: "https://picsum.photos/seed/aquapark-lebyazhiy/800/600" },
    ],
};

const mockActivityData: AiActivityRecommendationsOutput = {
    recommendations: Array.from({ length: 4 }).flatMap(() => baseMockActivityData.recommendations).map((rec, index) => ({
        ...rec,
        name: `${rec.name} ${Math.floor(index/baseMockActivityData.recommendations.length) + 1}`,
        imageUrl: rec.imageUrl?.replace('/seed/', `/seed/${index}-`)
    }))
};

const mockActivityDataWithSlugs = mockActivityData.recommendations.map((rec, index) => ({
    ...rec,
    slug: generateSlug(rec.name, index)
}));

export default function ActivitiesPageContent() {
  const [recommendations, setRecommendations] = useState<RecommendationWithSlug[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
        sessionStorage.setItem('activityRecommendations', JSON.stringify(mockActivityDataWithSlugs));
    }
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      destination: "",
      preferences: "активный отдых для компании друзей",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setHasSearched(true);
    setRecommendations([]);
    setCurrentPage(1);

    // AI call is mocked for now
    toast({
        title: "Поиск в разработке",
        description: "Функционал поиска развлечений скоро будет добавлен.",
    });
    setRecommendations(mockActivityDataWithSlugs);
    setIsLoading(false);
  }

  const currentActivities = hasSearched ? recommendations : mockActivityDataWithSlugs;
  
  const totalPages = Math.ceil(currentActivities.length / itemsPerPage);
  const paginatedActivities = currentActivities.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto mb-8">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Поиск развлечений</CardTitle>
          <CardDescription>Найдите лучшие развлечения и активности в вашем городе.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="destination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Где вы ищете?</FormLabel>
                    <FormControl>
                      <Input placeholder="Например, Минск" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="preferences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ваши предпочтения</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Например: для двоих, активный отдых, в помещении" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                Найти развлечения
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {!isLoading && !hasSearched && (
          <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg max-w-4xl mx-auto mb-8">
              <Search className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold">Результаты поиска появятся здесь</h3>
              <p className="text-muted-foreground mt-1">Заполните форму выше, чтобы найти лучшие развлечения. Ниже представлены популярные варианты.</p>
          </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        <aside className="lg:col-span-1 lg:sticky lg:top-24 h-fit">
          <ActivityFilters />
        </aside>

        <main className="lg:col-span-3">
          {isLoading && <LoadingSkeleton />}
          
          {!isLoading && paginatedActivities && paginatedActivities.length > 0 && (
            <div>
              <h2 className="text-2xl font-headline font-bold mb-6">{hasSearched ? `Найдено ${currentActivities.length} вариантов` : 'Популярные развлечения'}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedActivities.map((rec, index) => (
                  <ActivityCard key={`${rec.slug}-${index}`} recommendation={rec} index={index} />
                ))}
              </div>
            </div>
          )}
          
          {!isLoading && hasSearched && (!recommendations || recommendations.length === 0) && (
             <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg h-full">
                 <h3 className="text-xl font-semibold">Ничего не найдено</h3>
                 <p className="text-muted-foreground mt-1 max-w-sm">Попробуйте изменить параметры поиска.</p>
             </div>
          )}
           {!isLoading && currentActivities.length > itemsPerPage && (
                <Pagination className="mt-8">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={() => handlePageChange(currentPage - 1)}
                                aria-disabled={currentPage === 1}
                                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                            />
                        </PaginationItem>
                        {[...Array(totalPages)].map((_, i) => (
                            <PaginationItem key={i}>
                                <PaginationLink
                                    onClick={() => handlePageChange(i + 1)}
                                    isActive={currentPage === i + 1}
                                >
                                    {i + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                        <PaginationItem>
                            <PaginationNext
                                onClick={() => handlePageChange(currentPage + 1)}
                                aria-disabled={currentPage === totalPages}
                                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </main>
      </div>
    </div>
  );
}
