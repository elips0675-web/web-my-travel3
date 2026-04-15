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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon, Loader2, Search, Star, MapPin, Award, Heart } from "lucide-react";
import { format } from "date-fns";
import { ru } from 'date-fns/locale';
import { aiHousingRecommendations, type AiHousingRecommendationsOutput } from '@/ai/flows/ai-housing-recommendations-flow';
import { Textarea } from "@/components/ui/textarea";
import { HousingFilters } from "@/components/housing-filters";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

type RecommendationWithSlug = AiHousingRecommendationsOutput['recommendations'][0] & { slug: string };

const formSchema = z.object({
  destination: z.string().min(2, { message: "Пункт назначения должен содержать не менее 2 символов." }),
  dates: z.object({
    from: z.date({ required_error: "Необходима дата начала." }),
    to: z.date({ required_error: "Необходима дата окончания." }),
  }),
  preferences: z.string().min(3, { message: "Опишите ваши предпочтения."}),
});

function HousingCard({ recommendation, index }: { recommendation: RecommendationWithSlug, index: number }) {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <Card className="group overflow-hidden transition-shadow hover:shadow-xl flex flex-col rounded-2xl">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={recommendation.imageUrl || `https://picsum.photos/seed/housing${index}/800/600`}
          alt={recommendation.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          data-ai-hint={`${recommendation.type.toLowerCase()} interior`}
        />
        <Button
            size="icon"
            variant="secondary"
            className="absolute top-3 right-3 bg-white/80 backdrop-blur rounded-full text-black/70 hover:text-red-500 hover:bg-white transition-colors shadow"
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsFavorite(!isFavorite);
            }}
        >
            <Heart className={cn("h-5 w-5", isFavorite && "fill-red-500 text-red-500")} />
        </Button>
        {recommendation.rating && recommendation.rating >= 4.8 && (
            <div className="absolute top-3 left-3 flex items-center gap-1.5 text-sm font-bold text-white bg-primary px-2 py-1 rounded-full">
                <Award className="w-4 h-4" />
                <span>Лучший выбор</span>
            </div>
        )}
      </div>
      <CardHeader>
        <CardDescription>{recommendation.type}</CardDescription>
        <CardTitle className="font-bold text-lg mb-0 group-hover:text-primary transition-colors">{recommendation.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow">
        <div className="flex items-center text-sm text-muted-foreground mb-3">
            <MapPin className="w-4 h-4 mr-1.5" />
            {recommendation.location}
        </div>
        <p className="text-sm text-muted-foreground mb-3 flex-grow line-clamp-2">{recommendation.description}</p>
        <div className="flex flex-wrap gap-2">
            {recommendation.pros?.slice(0, 2).map((pro, i) => (
                <span key={i} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs">
                    {pro}
                </span>
            ))}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between pt-3 border-t mt-auto">
        <div>
          <span className="text-2xl font-bold text-primary">{recommendation.priceEstimate}</span>
          <span className="text-muted-foreground text-sm">/ночь</span>
        </div>
        <Button asChild>
          <Link href={`/housing/${recommendation.slug}`}>Подробнее</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: 12 }).map((i) => (
        <Card key={i} className="overflow-hidden flex flex-col rounded-2xl">
            <Skeleton className="h-48 w-full" />
            <CardHeader>
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent className="flex flex-col flex-grow gap-4">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full" />
                <div className="flex gap-2">
                    <Skeleton className="h-5 w-1/4" />
                    <Skeleton className="h-5 w-1/4" />
                </div>
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

const baseMockHousingData: AiHousingRecommendationsOutput = {
    recommendations: [
      {
        name: "Гранд-отель «Европа»",
        type: "Отель",
        location: "Санкт-Петербург, Россия",
        description: "Исторический пятизвездочный отель в самом центре города с роскошными номерами и безупречным сервисом.",
        priceEstimate: "25000 BYN",
        rating: 5.0,
        pros: ["Идеальное расположение", "Историческая атмосфера", "Высококлассный сервис", "Спа-центр"],
        cons: ["Высокая цена"],
        imageUrl: "https://picsum.photos/seed/grandhotel/800/600",
      },
      {
        name: "Апартаменты «Москва-Сити»",
        type: "Апартаменты",
        location: "Москва, Россия",
        description: "Современные апартаменты с панорамным видом на город в одной из башен комплекса «Москва-Сити».",
        priceEstimate: "18000 BYN",
        rating: 4.8,
        pros: ["Панорамный вид на город", "Современный дизайн", "Высокий этаж"],
        cons: ["Может быть шумно"],
        imageUrl: "https://picsum.photos/seed/moscowcity/800/600",
      },
      {
        name: "Бутик-отель «Библиотека»",
        type: "Бутик-отель",
        location: "Вологда, Россия",
        description: "Уютный и тихий отель с уникальным дизайном, посвященным книгам и литературе. Идеально для спокойного отдыха.",
        priceEstimate: "8000 BYN",
        rating: 4.9,
        pros: ["Уникальная концепция", "Тихое и спокойное место", "Собственная библиотека"],
        cons: ["Небольшой номерной фонд"],
        imageUrl: "https://picsum.photos/seed/libraryhotel/800/600",
      },
      {
        name: "Эко-отель «Роза Хутор»",
        type: "Отель",
        location: "Сочи, Россия",
        description: "Отель в горах с прекрасным видом, окруженный природой. Идеально для любителей активного отдыха.",
        priceEstimate: "12000 BYN",
        rating: 4.7,
        pros: ["Горный воздух", "Доступ к подъемникам", "Экологичные материалы"],
        cons: ["Удаленность от моря"],
        imageUrl: "https://picsum.photos/seed/rosakhutor/800/600",
      }
    ],
};

const mockHousingData: AiHousingRecommendationsOutput = {
    recommendations: Array.from({ length: 6 }).flatMap(() => baseMockHousingData.recommendations).map((rec, index) => ({
        ...rec,
        name: `${rec.name} Вариант ${Math.floor(index/baseMockHousingData.recommendations.length) + 1}`,
        imageUrl: rec.imageUrl?.replace('/seed/', `/seed/${index}-`)
    }))
};

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

export default function HousingPageContent() {
  const [displayedRecommendations, setDisplayedRecommendations] = useState<RecommendationWithSlug[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    const mockRecsWithSlugs = mockHousingData.recommendations.map((rec, index) => ({
        ...rec,
        slug: generateSlug(rec.name, index)
    }));
    if (typeof window !== 'undefined') {
        sessionStorage.setItem('housingRecommendations', JSON.stringify(mockRecsWithSlugs));
    }
    setDisplayedRecommendations(mockRecsWithSlugs);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      destination: "",
      preferences: "уютно, недорого, с хорошим видом из окна, рядом с центром",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setHasSearched(true);
    setDisplayedRecommendations([]);
    setCurrentPage(1);
    try {
      const result = await aiHousingRecommendations({
        destination: values.destination,
        startDate: values.dates.from.toISOString().split('T')[0],
        endDate: values.dates.to.toISOString().split('T')[0],
        preferences: values.preferences,
      });

      const recommendationsWithSlugs = result.recommendations.map((rec, index) => ({
          ...rec,
          slug: generateSlug(rec.name, index)
      }));

      if (typeof window !== 'undefined') {
        sessionStorage.setItem('housingRecommendations', JSON.stringify(recommendationsWithSlugs));
      }
      setDisplayedRecommendations(recommendationsWithSlugs);

    } catch (error) {
      console.error(error);
      toast({
        title: "Ошибка",
        description: "Не удалось получить рекомендации по жилью. Попробуйте еще раз.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }

  const currentRecommendations = hasSearched ? displayedRecommendations : mockHousingData.recommendations.map((rec, index) => ({...rec, slug: generateSlug(rec.name, index)}));

  const totalPages = Math.ceil(currentRecommendations.length / itemsPerPage);
  const paginatedRecommendations = currentRecommendations.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto mb-8">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Подбор жилья</CardTitle>
          <CardDescription>Найдите идеальное место для проживания с помощью AI.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="destination"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Куда вы едете?</FormLabel>
                      <FormControl>
                        <Input placeholder="Например, Париж, Франция" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dates"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Когда?</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn("w-full justify-start text-left font-normal", !field.value?.from && "text-muted-foreground")}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value?.from ? (field.value.to ? (<>{format(field.value.from, "d LLL", { locale: ru })} - {format(field.value.to, "d LLL, y", { locale: ru })}</>) : (format(field.value.from, "d LLL, y", { locale: ru }))) : (<span>Выберите даты</span>)}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar initialFocus mode="range" defaultMonth={field.value?.from} selected={{ from: field.value?.from, to: field.value?.to }} onSelect={(range) => field.onChange(range)} numberOfMonths={2} locale={ru} />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="preferences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ваши предпочтения</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Опишите, какое жилье вы ищете..." {...field} />
                    </FormControl>
                    <FormDescription>Например: отель 4*, с бассейном, тихое место, для семьи с детьми.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                Найти жилье
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {!isLoading && !hasSearched && (
          <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg max-w-4xl mx-auto mb-8">
              <Search className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold">Результаты появятся здесь</h3>
              <p className="text-muted-foreground mt-1">Заполните форму выше, чтобы найти жилье вашей мечты. Ниже представлены популярные варианты.</p>
          </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        <aside className="lg:col-span-1 lg:sticky lg:top-24 h-fit">
          <HousingFilters />
        </aside>

        <main className="lg:col-span-3">
          {isLoading && <LoadingSkeleton />}
          
          {!isLoading && hasSearched && (
            <div>
              <h2 className="text-2xl font-headline font-bold mb-6">Найдено {displayedRecommendations.length} вариантов</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {paginatedRecommendations.map((rec, index) => (
                  <HousingCard key={`${rec.slug}-${index}`} recommendation={rec} index={index} />
                ))}
              </div>
            </div>
          )}

          {!isLoading && !hasSearched && (
              <div>
                  <h2 className="text-2xl font-headline font-bold mb-6">Популярные предложения</h2>
                   <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {paginatedRecommendations.map((rec, index) => (
                        <HousingCard key={`${rec.slug}-${index}`} recommendation={rec} index={index} />
                    ))}
                  </div>
              </div>
          )}
           {!isLoading && currentRecommendations.length > itemsPerPage && (
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
