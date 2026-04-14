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
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Search, Star, MapPin } from "lucide-react";
import { aiRestaurantRecommendations, type AiRestaurantRecommendationsOutput } from '@/ai/flows/ai-restaurant-recommendations';
import { Textarea } from "@/components/ui/textarea";
import { RestaurantFilters } from "@/components/restaurant-filters";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

type RecommendationWithSlug = AiRestaurantRecommendationsOutput['recommendations'][0] & { slug: string; features?: string[]; };

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


function RestaurantCard({ recommendation, index }: { recommendation: RecommendationWithSlug, index: number }) {
  return (
    <Card className="group overflow-hidden transition-shadow hover:shadow-xl flex flex-col rounded-2xl">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={recommendation.imageUrl || `https://picsum.photos/seed/restaurant${index}/800/600`}
          alt={recommendation.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          data-ai-hint={`${recommendation.cuisine.toLowerCase()} food`}
        />
        {recommendation.rating && (
            <div className="absolute top-3 right-3 bg-card/90 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="font-semibold text-card-foreground">{recommendation.rating.toFixed(1)}</span>
            </div>
        )}
      </div>
      <CardHeader>
        <CardDescription>{recommendation.cuisine}</CardDescription>
        <CardTitle className="font-bold text-lg mb-0 group-hover:text-primary transition-colors">{recommendation.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow">
        <div className="flex items-center text-sm text-muted-foreground mb-3">
            <MapPin className="w-4 h-4 mr-1.5" />
            {recommendation.location}
        </div>
        <p className="text-sm text-muted-foreground mb-4 flex-grow line-clamp-2">{recommendation.description}</p>
        <div className="flex flex-wrap gap-2">
            {recommendation.specialty && (
                <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-md text-xs font-semibold">
                    {recommendation.specialty}
                </span>
            )}
            {recommendation.features?.slice(0, 2).map((feature, i) => (
                <span key={i} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs">
                    {feature}
                </span>
            ))}
        </div>
      </CardContent>
       <CardFooter className="flex items-center justify-between pt-3 border-t mt-auto">
            <div className="text-2xl font-bold text-primary">{recommendation.price}</div>
            <Button asChild>
                <Link href={`/restaurants/${recommendation.slug}`}>Подробнее</Link>
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
                <Skeleton className="h-5 w-1/3" />
            </CardContent>
            <CardFooter className="flex items-center justify-between pt-3 border-t mt-auto">
                <Skeleton className="h-8 w-1/4" />
                <Skeleton className="h-10 w-1/3" />
            </CardFooter>
        </Card>
      ))}
    </div>
  )
}

const baseMockRestaurantData: any = {
    recommendations: [
      { name: "White Rabbit", cuisine: "Современная русская", location: "Смоленская пл., 3, Москва", description: "Панорамный ресторан с видом на Москву, известный своей инновационной русской кухней.", price: "от 250 BYN", rating: 4.8, specialty: "Борщ с карасями", features: ["Панорамный вид", "Авторская кухня"], imageUrl: "https://picsum.photos/seed/whiterabbit/800/600" },
      { name: "Probka на Цветном", cuisine: "Итальянская", location: "Цветной б-р, 2, Москва", description: "Уютный итальянский ресторан от Арама Мнацаканова с аутентичной кухней и отличной винной картой.", price: "от 150 BYN", rating: 4.7, specialty: "Пицца с трюфелем", features: ["Веранда", "Винная карта"], imageUrl: "https://picsum.photos/seed/probka/800/600" },
      { name: "Кафе Пушкинъ", cuisine: "Русская дворянская", location: "Тверской б-р, 26А, Москва", description: "Легендарный ресторан-аптека с атмосферой XIX века и классической русской кухней.", price: "от 200 BYN", rating: 4.6, specialty: "Пожарская котлета", features: ["Живая музыка", "Исторический интерьер"], imageUrl: "https://picsum.photos/seed/pushkin/800/600" },
      { name: "Горыныч", cuisine: "Гриль", location: "Рождественский б-р, 1, Москва", description: "Ресторан с огромными печами, где готовят блюда на огне. Отличные завтраки и хлеб из собственной пекарни.", price: "от 120 BYN", rating: 4.7, specialty: "Стейки", features: ["Открытая кухня", "Завтраки"], imageUrl: "https://picsum.photos/seed/gorynych/800/600" },
      { name: "Sehnsucht", cuisine: "Европейская", location: "Казанская ул., 3А, Санкт-Петербург", description: "Стильный ресторан с авторской кухней и коктейлями в самом центре Петербурга.", price: "от 100 BYN", rating: 4.8, specialty: "Тартар из говядины", features: ["Авторские коктейли", "Для свиданий"], imageUrl: "https://picsum.photos/seed/sehnsucht/800/600" },
      { name: "Harvest", cuisine: "Овощная", location: "пр. Добролюбова, 11, Санкт-Петербург", description: "Инновационный ресторан, где овощи играют главную роль. Входит в The World's 50 Best Restaurants.", price: "от 220 BYN", rating: 4.9, specialty: "Капуста с икрой", features: ["Fine dining", "Здоровое питание"], imageUrl: "https://picsum.photos/seed/harvest/800/600" },
    ],
};

const mockRestaurantData: any = {
    recommendations: Array.from({ length: 4 }).flatMap(() => baseMockRestaurantData.recommendations).map((rec: any, index: number) => ({
        ...rec,
        name: `${rec.name} ${Math.floor(index/baseMockRestaurantData.recommendations.length) + 1}`,
        imageUrl: rec.imageUrl?.replace('/seed/', `/seed/${index}-`)
    }))
};

const mockRestaurantDataWithSlugs = mockRestaurantData.recommendations.map((rec: any, index: number) => ({
    ...rec,
    slug: generateSlug(rec.name, index)
}));

export default function RestaurantsPageContent() {
  const [recommendations, setRecommendations] = useState<RecommendationWithSlug[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
        sessionStorage.setItem('restaurantRecommendations', JSON.stringify(mockRestaurantDataWithSlugs));
    }
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      destination: "",
      preferences: "уютная атмосфера, вкусная еда, не слишком дорого",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setHasSearched(true);
    setRecommendations([]);
    setCurrentPage(1);

    try {
        const result = await aiRestaurantRecommendations({
            destination: values.destination,
            preferences: values.preferences,
        });

        const recommendationsWithSlugs: RecommendationWithSlug[] = result.recommendations.map((rec, index) => ({
            ...rec,
            slug: generateSlug(rec.name, index)
        }));

        if (typeof window !== 'undefined') {
            sessionStorage.setItem('restaurantRecommendations', JSON.stringify(recommendationsWithSlugs));
        }
        setRecommendations(recommendationsWithSlugs);
    } catch (error) {
        console.error(error);
        toast({
            title: "Ошибка",
            description: "Не удалось получить рекомендации. Попробуйте еще раз.",
            variant: "destructive"
        });
    } finally {
        setIsLoading(false);
    }
  }

  const currentRestaurants = hasSearched ? recommendations : mockRestaurantDataWithSlugs;
  
  const totalPages = Math.ceil(currentRestaurants.length / itemsPerPage);
  const paginatedRestaurants = currentRestaurants.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto mb-8">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Поиск кафе и ресторанов</CardTitle>
          <CardDescription>Найдите идеальное место для ужина, обеда или завтрака с помощью AI.</CardDescription>
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
                      <Input placeholder="Например, Москва" {...field} />
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
                      <Textarea placeholder="Например: итальянская кухня, вид на город, для свидания" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                Найти рестораны
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {!isLoading && !hasSearched && (
          <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg max-w-4xl mx-auto mb-8">
              <Search className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold">Результаты поиска появятся здесь</h3>
              <p className="text-muted-foreground mt-1">Заполните форму выше, чтобы найти лучшие места. Ниже представлены популярные варианты.</p>
          </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        <aside className="lg:col-span-1 lg:sticky lg:top-24 h-fit">
          <RestaurantFilters />
        </aside>

        <main className="lg:col-span-3">
          {isLoading && <LoadingSkeleton />}
          
          {!isLoading && hasSearched && recommendations && recommendations.length > 0 && (
            <div>
              <h2 className="text-2xl font-headline font-bold mb-6">Найдено {recommendations.length} вариантов</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedRestaurants.map((rec, index) => (
                  <RestaurantCard key={`${rec.slug}-${index}`} recommendation={rec} index={index} />
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
           
          {!isLoading && !hasSearched && (
              <div>
                  <h2 className="text-2xl font-headline font-bold mb-6">Популярные рестораны</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {paginatedRestaurants.map((rec, index) => (
                          <RestaurantCard key={`${rec.slug}-${index}`} recommendation={rec} index={index} />
                      ))}
                  </div>
              </div>
          )}

           {!isLoading && currentRestaurants.length > itemsPerPage && (
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
