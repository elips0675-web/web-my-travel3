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
import { CalendarIcon, Loader2, Search, Star, Users, Clock, Heart } from "lucide-react";
import { format } from "date-fns";
import { ru } from 'date-fns/locale';
import { aiTourRecommendations, type AiTourRecommendationsOutput } from '@/ai/flows/ai-tour-recommendations';
import { Textarea } from "@/components/ui/textarea";
import { TourFilters } from "@/components/tour-filters";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

type RecommendationWithSlug = AiTourRecommendationsOutput[0] & { slug: string };

const formSchema = z.object({
  destination: z.string().min(2, { message: "Пункт назначения должен содержать не менее 2 символов." }),
  dates: z.object({
    from: z.date({ required_error: "Необходима дата начала." }),
    to: z.date({ required_error: "Необходима дата окончания." }),
  }),
  preferences: z.string().min(3, { message: "Опишите ваши предпочтения, например, 'семейный отдых', 'экстрим', 'исторические места'"}),
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


const mockTourData: AiTourRecommendationsOutput = [
        {
            name: "Замки Мира и Несвижа",
            description: "Погрузитесь в историю белорусского средневековья, посетив два самых известных замковых комплекса страны, включенных в список Всемирного наследия ЮНЕСКО.",
            type: "исторический",
            priceRange: "150 BYN",
            bookingLink: "#",
            relevanceScore: 98,
            duration: "Целый день",
            groupSize: "до 30 чел.",
            highlights: ["Мирский замок (XVI-XX вв.)", "Несвижский дворцово-парковый комплекс", "Фарный костел в Несвиже"],
            included: ["Транспорт из Минска", "Услуги профессионального гида", "Входные билеты в оба замка"],
            excluded: ["Обед", "Личные расходы"],
            galleryImageUrls: [
                "https://picsum.photos/seed/mir-nesvizh/800/600",
                "https://picsum.photos/seed/mir-castle-belarus/800/600",
                "https://picsum.photos/seed/nesvizh-palace/800/600",
                "https://picsum.photos/seed/belarus-history/800/600"
            ]
        },
        {
            name: "Беловежская пуща и Поместье Деда Мороза",
            description: "Откройте для себя древнейший лес Европы, увидьте могучих зубров в их естественной среде обитания и загляните в гости к белорусскому Деду Морозу.",
            type: "природа",
            priceRange: "180 BYN",
            bookingLink: "#",
            relevanceScore: 95,
            duration: "Целый день",
            groupSize: "до 45 чел.",
            highlights: ["Вольеры с дикими животными", "Музей природы", "Поместье Деда Мороза", "Царь-дуб"],
            included: ["Транспорт", "Услуги гида", "Входные билеты в поместье"],
            excluded: ["Обед", "Билеты в Музей природы и вольеры"],
            galleryImageUrls: [
                "https://picsum.photos/seed/belovezha/800/600",
                "https://picsum.photos/seed/bison-belarus/800/600",
                "https://picsum.photos/seed/ded-moroz-estate/800/600",
                "https://picsum.photos/seed/ancient-forest/800/600"
            ]
        },
        {
            name: "Обзорная экскурсия по Минску: от старины до современности",
            description: "Исследуйте многоликий Минск: от уютных улочек Троицкого предместья до грандиозных проспектов и футуристической архитектуры Национальной библиотеки.",
            type: "обзорная",
            priceRange: "80 BYN",
            bookingLink: "#",
            relevanceScore: 92,
            duration: "3-4 часа",
            groupSize: "до 15 чел.",
            highlights: ["Троицкое предместье", "Остров слёз", "Проспект Независимости", "Национальная библиотека"],
            included: ["Комфортабельный автобус", "Услуги гида"],
            excluded: ["Входные билеты на смотровую площадку библиотеки"],
            galleryImageUrls: [
                "https://picsum.photos/seed/minsk-city/800/600",
                "https://picsum.photos/seed/trinity-suburb/800/600",
                "https://picsum.photos/seed/minsk-architecture/800/600",
                "https://picsum.photos/seed/belarus-capital/800/600"
            ]
        },
        {
            name: "Линия Сталина: история и оружие",
            description: "Посетите один из самых грандиозных фортификационных ансамблей на территории Беларуси, где можно не только увидеть, но и потрогать военную технику времен ВОВ.",
            type: "военно-исторический",
            priceRange: "110 BYN",
            bookingLink: "#",
            relevanceScore: 88,
            duration: "5-6 часов",
            groupSize: "до 25 чел.",
            highlights: ["Военно-исторический музей", "Экспозиция боевой техники", "Катание на танке (опционально)", "Стрельба из охолощенного оружия"],
            included: ["Транспорт", "Гид-экскурсовод", "Входные билеты"],
            excluded: ["Питание", "Катание на технике и стрельба"],
            galleryImageUrls: [
                "https://picsum.photos/seed/stalin-line/800/600",
                "https://picsum.photos/seed/ww2-history/800/600",
                "https://picsum.photos/seed/military-museum/800/600",
                "https://picsum.photos/seed/belarus-tanks/800/600"
            ]
        }\n    ];

const mockTourDataWithSlugs = mockTourData.map((tour, index) => ({
    ...tour,
    slug: generateSlug(tour.name, index)
}));

constrepeatedMockData = Array.from({ length: 3 }).flatMap(() => mockTourDataWithSlugs);

function TourCard({ recommendation, index }: { recommendation: RecommendationWithSlug, index: number }) {
    const [isFavorite, setIsFavorite] = useState(false);
    const rating = (recommendation.relevanceScore / 20);
    return (
    <Card className="group overflow-hidden transition-shadow hover:shadow-xl flex flex-col rounded-2xl">
      <div className="relative h-52 overflow-hidden">
        <Image
          src={recommendation.galleryImageUrls?.[0] || `https://picsum.photos/seed/tour${index}/800/600`}
          alt={recommendation.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          data-ai-hint={`photo of ${recommendation.type} tour`}
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
      </div>
      <CardHeader>
        <CardDescription className="uppercase tracking-wider text-primary font-semibold text-xs">{recommendation.type}</CardDescription>
        <CardTitle className="font-bold text-lg mb-0 group-hover:text-primary transition-colors">{recommendation.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow">
        <p className="text-sm text-muted-foreground mb-4 flex-grow line-clamp-2">{recommendation.description}</p>
        <div className="flex items-center text-sm text-muted-foreground gap-x-4 gap-y-1 flex-wrap">
            <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {recommendation.duration}
            </div>
             <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                {recommendation.groupSize}
            </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between pt-4 border-t mt-auto">
        <div>
            <p className="text-xs text-muted-foreground">От</p>
            <p className="text-2xl font-bold text-primary">{recommendation.priceRange}</p>
        </div>
        <Button asChild>
          <Link href={`/tours/${recommendation.slug}`}>Подробнее</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 12 }).map((_, index) => (
        <Card key={index} className="overflow-hidden flex flex-col rounded-2xl">
            <Skeleton className="h-52 w-full" />
            <CardHeader>
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent className="flex flex-col flex-grow gap-4">
                <Skeleton className="h-10 w-full" />
                <div className="flex items-center gap-4">
                     <Skeleton className="h-4 w-1/2" />
                     <Skeleton className="h-4 w-1/2" />
                </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between pt-4 border-t mt-auto">
                <div className="flex flex-col gap-2">
                    <Skeleton className="h-3 w-8" />
                    <Skeleton className="h-7 w-20" />
                </div>
                <Skeleton className="h-10 w-1/3" />
            </CardFooter>
        </Card>
      ))}
    </div>
  )
}

export default function ToursPageContent() {
  const [recommendations, setRecommendations] = useState<RecommendationWithSlug[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('tourRecommendations', JSON.stringify(repeatedMockData));
    }
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      destination: "",
      preferences: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setHasSearched(true);
    setRecommendations([]);
    setCurrentPage(1);

    try {
      const result = await aiTourRecommendations({
        destination: values.destination,
        startDate: values.dates.from.toISOString().split('T')[0],
        endDate: values.dates.to.toISOString().split('T')[0],
        preferences: values.preferences,
      });

      const recommendationsWithSlugs = result.map((rec, index) => ({
          ...rec,
          slug: generateSlug(rec.name, index)
      }));

      if (typeof window !== 'undefined') {
        sessionStorage.setItem('tourRecommendations', JSON.stringify(recommendationsWithSlugs));
      }
      setRecommendations(recommendationsWithSlugs);

    } catch (error) {
      console.error(error);
      toast({
        title: "Произошла ошибка",
        description: "Не удалось получить рекомендации по турам. Попробуйте еще раз.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }

  const currentTours = hasSearched ? recommendations : repeatedMockData;

  const totalPages = Math.ceil(currentTours.length / itemsPerPage);
  const paginatedTours = currentTours.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto mb-8">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Подбор туров с помощью AI</CardTitle>
          <CardDescription>Задайте параметры и получите персональную подборку туров по Беларуси и другим странам.</CardDescription>
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
                      <FormLabel>Куда вы хотите поехать?</FormLabel>
                      <FormControl>
                        <Input placeholder="Например, Беларусь или Минская область" {...field} />
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
                      <FormLabel>В какие даты?</FormLabel>
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
                      <Textarea placeholder="Например: активный отдых, хочу посмотреть замки, еду с детьми, бюджет до 200 BYN на человека" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                Подобрать туры
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {!isLoading && !hasSearched && (
          <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg max-w-4xl mx-auto mb-8">
              <Search className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold">Результаты поиска появятся здесь</h3>
              <p className="text-muted-foreground mt-1">Заполните форму выше, чтобы найти тур вашей мечты. Ниже представлены популярные направления.</p>
          </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          <aside className="lg:col-span-1 lg:sticky lg:top-24 h-fit">
              <TourFilters />
          </aside>
          <main className="lg:col-span-3">
              {isLoading && <LoadingSkeleton />}

              {!isLoading && hasSearched && recommendations && recommendations.length > 0 && (
                  <div>
                      <h2 className="text-2xl font-headline font-bold mb-6">Найдено {recommendations.length} туров</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                          {paginatedTours.map((rec, index) => (
                              <TourCard key={`${rec.slug}-${index}`} recommendation={rec} index={index} />
                          ))}
                      </div>
                  </div>
              )}

              {!isLoading && hasSearched && (!recommendations || recommendations.length === 0) && (
                  <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg h-full">
                      <h3 className="text-xl font-semibold">Ничего не найдено</h3>
                      <p className="text-muted-foreground mt-1 max-w-sm">Попробуйте изменить параметры поиска или они будут заменены на популярные предложения.</p>
                  </div>
              )}

              {!isLoading && !hasSearched && (
                   <div>
                      <h2 className="text-2xl font-headline font-bold mb-6">Популярные туры</h2>
                       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                           {paginatedTours.map((rec, index) => (
                              <TourCard key={`${rec.slug}-${index}`} recommendation={rec} index={index} />
                          ))}
                      </div>
                  </div>
              )}

              {!isLoading && currentTours.length > itemsPerPage && (
                  <Pagination className="mt-8">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} aria-disabled={currentPage === 1} className={currentPage === 1 ? "pointer-events-none opacity-50" : ""} />
                        </PaginationItem>
                        {[...Array(totalPages)].map((_, i) => (
                            <PaginationItem key={i}>
                                <PaginationLink onClick={() => handlePageChange(i + 1)} isActive={currentPage === i + 1}>
                                    {i + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                        <PaginationItem>
                            <PaginationNext onClick={() => handlePageChange(currentPage + 1)} aria-disabled={currentPage === totalPages} className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""} />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
              )}
          </main>
      </div>
    </div>
  );
}
