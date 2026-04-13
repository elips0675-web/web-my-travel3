'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import Image from 'next/image';

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
import { CalendarIcon, Loader2, Search, Star, Clock, Users } from "lucide-react";
import { format } from "date-fns";
import { ru } from 'date-fns/locale';
import { aiTourRecommendations, type AiTourRecommendationsOutput } from '@/ai/flows/ai-tour-recommendations';
import Link from "next/link";
import { TourFilters } from "@/components/tour-filters";
import { Skeleton } from "../ui/skeleton";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

type TourRecommendationWithSlug = AiTourRecommendationsOutput[0] & { slug: string };

const formSchema = z.object({
  destination: z.string().min(2, { message: "Пункт назначения должен содержать не менее 2 символов." }),
  dates: z.object({
    from: z.date({ required_error: "Необходима дата начала." }),
    to: z.date({ required_error: "Необходима дата окончания." }),
  }),
  interests: z.string().min(3, { message: "Опишите ваши интересы."}),
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


const baseMockTourData: AiTourRecommendationsOutput = [
    {
        name: "Замки Мира и Несвижа",
        description: "Посетите два самых известных замка Беларуси, внесенных в список Всемирного наследия ЮНЕСКО. Погрузитесь в атмосферу средневековья и магнатской роскоши.",
        type: "культурно-исторический",
        priceRange: "150 BYN",
        bookingLink: "#",
        relevanceScore: 98,
        duration: "Целый день",
        groupSize: "до 40 чел.",
        highlights: ["Мирский замок", "Несвижский дворцово-парковый комплекс", "Фарный костел в Несвиже"],
        included: ["Транспорт", "Услуги гида"],
        excluded: ["Входные билеты", "Обед"],
        galleryImageUrls: [
            "https://picsum.photos/seed/mir-castle/800/600",
            "https://picsum.photos/seed/nesvizh-castle/800/600",
            "https://picsum.photos/seed/belarus-castles/800/600",
            "https://picsum.photos/seed/radziwill-palace/800/600"
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
        name: "Обзорная экскурсия по Минску",
        description: "Познакомьтесь с главным городом Беларуси: от старинного Троицкого предместья до современных проспектов и Национальной библиотеки.",
        type: "обзорная",
        priceRange: "70 BYN",
        bookingLink: "#",
        relevanceScore: 93,
        duration: "4 часа",
        groupSize: "до 40 чел.",
        highlights: ["Троицкое предместье", "Остров слёз", "Проспект Независимости", "Национальная библиотека (обзорная площадка)"],
        included: ["Транспорт", "Услуги гида"],
        excluded: ["Билет на обзорную площадку", "Личные расходы"],
        galleryImageUrls: [
            "https://picsum.photos/seed/minsk-cityscape/800/600",
            "https://picsum.photos/seed/minsk-trinity/800/600",
            "https://picsum.photos/seed/minsk-library/800/600",
            "https://picsum.photos/seed/minsk-evening/800/600"
        ]
    },
    {
        name: "Брест и Брестская крепость-герой",
        description: "Посетите легендарную Брестскую крепость, символ стойкости и мужества, и познакомьтесь с уютным и красивым городом Брестом.",
        type: "военно-исторический",
        priceRange: "160 BYN",
        bookingLink: "#",
        relevanceScore: 96,
        duration: "Целый день",
        groupSize: "до 45 чел.",
        highlights: ["Мемориальный комплекс «Брестская крепость-герой»", "Музей обороны", "Пешеходная улица Советская в Бресте"],
        included: ["Транспорт", "Услуги гида", "Экскурсия по крепости"],
        excluded: ["Входные билеты в музеи", "Обед"],
        galleryImageUrls: [
            "https://picsum.photos/seed/brest-fortress/800/600",
            "https://picsum.photos/seed/brest-memorial/800/600",
            "https://picsum.photos/seed/brest-city/800/600",
            "https://picsum.photos/seed/fortress-gate/800/600"
        ]
    },
     {
        name: "Музейный комплекс «Дудутки»",
        description: "Окунитесь в мир старинных белорусских ремесел и технологий. Попробуйте свежеиспеченный хлеб, домашний сыр и покатайтесь на лошадях.",
        type: "этнография",
        priceRange: "120 BYN",
        bookingLink: "#",
        relevanceScore: 94,
        duration: "6 часов",
        groupSize: "до 40 чел.",
        highlights: ["Мастер-классы по ремеслам", "Дегустация продуктов", "Единственная в Беларуси ветряная мельница", "Конюшня"],
        included: ["Транспорт", "Услуги гида", "Входные билеты с дегустациями"],
        excluded: ["Обед", "Сувениры"],
        galleryImageUrls: [
            "https://picsum.photos/seed/dudutki-windmill/800/600",
            "https://picsum.photos/seed/dudutki-crafts/800/600",
            "https://picsum.photos/seed/dudutki-village/800/600",
            "https://picsum.photos/seed/dudutki-horses/800/600"
        ]
    },
    {
        name: "Августовский канал и Гродно",
        description: "Полюбуйтесь на гидротехническое чудо XIX века — Августовский канал, и прогуляйтесь по королевскому городу Гродно.",
        type: "природа и история",
        priceRange: "170 BYN",
        bookingLink: "#",
        relevanceScore: 92,
        duration: "Целый день",
        groupSize: "до 40 чел.",
        highlights: ["Шлюзование на Августовском канале", "Старый и Новый замки в Гродно", "Коложская церковь XII века"],
        included: ["Транспорт", "Услуги гида"],
        excluded: ["Билеты на теплоход", "Входные билеты в замки", "Обед"],
        galleryImageUrls: [
            "https://picsum.photos/seed/augustow-canal/800/600",
            "https://picsum.photos/seed/grodno-city/800/600",
            "https://picsum.photos/seed/grodno-castle/800/600",
            "https://picsum.photos/seed/kolozha-church/800/600"
        ]
    }
];

const mockTourData: AiTourRecommendationsOutput = Array.from({ length: 4 }).flatMap(() => baseMockTourData).map((tour, index) => ({
    ...tour,
    name: `${tour.name} Вариант ${Math.floor(index/baseMockTourData.length) + 1}`,
    galleryImageUrls: tour.galleryImageUrls.map(url => url.replace('/seed/', `/seed/${index}-`))
}));

const mockToursWithSlugs: TourRecommendationWithSlug[] = mockTourData.map((tour, index) => ({
    ...tour,
    slug: generateSlug(tour.name, index),
}));

function TourCard({ tour, index }: { tour: TourRecommendationWithSlug, index: number }) {
    const rating = tour.relevanceScore / 20;
    return (
        <Card className="group overflow-hidden transition-shadow hover:shadow-xl flex flex-col rounded-2xl">
            <div className="relative h-48 overflow-hidden">
                <Image
                    src={tour.galleryImageUrls[0] || `https://picsum.photos/seed/tour${index}/800/600`}
                    alt={tour.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    data-ai-hint={tour.type}
                />
                <div className="absolute top-3 right-3 bg-card/90 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="font-semibold text-card-foreground">{rating.toFixed(1)}</span>
                </div>
            </div>
            <CardHeader>
                <CardDescription>{tour.type}</CardDescription>
                <CardTitle className="font-bold text-lg mb-0 group-hover:text-primary transition-colors">{tour.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col flex-grow">
                <p className="text-sm text-muted-foreground mb-3 flex-grow line-clamp-2">{tour.description}</p>
                 <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        <span>{tour.duration}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4" />
                        <span>{tour.groupSize}</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between pt-3 border-t mt-auto">
                <div>
                    <span className="text-2xl font-bold text-primary">{tour.priceRange}</span>
                    <span className="text-muted-foreground text-sm"> / чел.</span>
                </div>
                <Button asChild>
                    <Link href={`/tours/${tour.slug}`}>Подробнее</Link>
                </Button>
            </CardFooter>
        </Card>
    );
}


function LoadingSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
                <Card key={i} className="overflow-hidden flex flex-col rounded-2xl">
                    <Skeleton className="h-48 w-full" />
                    <CardHeader>
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-6 w-3/4" />
                    </CardHeader>
                    <CardContent className="flex flex-col flex-grow gap-4">
                        <Skeleton className="h-10 w-full" />
                        <div className="flex gap-4">
                            <Skeleton className="h-5 w-1/2" />
                            <Skeleton className="h-5 w-1/2" />
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


export default function ToursPageContent() {
  const [recommendations, setRecommendations] = useState<TourRecommendationWithSlug[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      destination: "",
      interests: "история, еда, архитектура",
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
        travelDates: {
          start: values.dates.from.toISOString(),
          end: values.dates.to.toISOString(),
        },
        interests: values.interests.split(',').map(i => i.trim()),
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
        title: "Ошибка",
        description: "Не удалось получить рекомендации. Попробуйте еще раз.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }

  const currentTours = hasSearched ? recommendations : mockToursWithSlugs;
  if(typeof window !== 'undefined' && !hasSearched) {
      sessionStorage.setItem('tourRecommendations', JSON.stringify(mockToursWithSlugs));
  }

  const totalPages = Math.ceil(currentTours.length / itemsPerPage);
  const paginatedTours = currentTours.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Card className="max-w-7xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Поиск туров и экскурсий</CardTitle>
          <CardDescription>Найдите идеальные развлечения для вашего путешествия с помощью AI.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="destination"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Куда вы едете?</FormLabel>
                      <FormControl>
                        <Input placeholder="Например, Рим, Италия" {...field} />
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
                 <FormField
                    control={form.control}
                    name="interests"
                    render={({ field }) => (
                    <FormItem className="flex flex-col justify-end">
                        <FormLabel>Ваши интересы</FormLabel>
                        <FormControl>
                        <Input placeholder="история, еда..." {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              </div>
               <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                   {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                   Найти туры
               </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {!isLoading && !hasSearched && (
           <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg max-w-4xl mx-auto">
              <Search className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold">Результаты поиска появятся здесь</h3>
              <p className="text-muted-foreground mt-1 max-w-sm">Заполните форму выше, чтобы найти туры, которые подходят именно вам. Ниже представлены популярные варианты.</p>
          </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        <aside className="lg:col-span-1 lg:sticky lg:top-24 h-fit">
          <TourFilters />
        </aside>

        <main className="lg:col-span-3">
            {isLoading && <LoadingSkeleton />}
            
            {!isLoading && !hasSearched && (
                 <div>
                    <h2 className="text-2xl font-headline font-bold mb-6">Популярные туры</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {paginatedTours.map((tour, index) => (
                            <TourCard key={index} tour={tour} index={index} />
                        ))}
                    </div>
                </div>
            )}

            {!isLoading && hasSearched && recommendations && recommendations.length > 0 && (
                <div>
                <h2 className="text-2xl font-headline font-bold mb-6">Найдено {recommendations.length} туров</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {paginatedTours.map((tour, index) => (
                    <TourCard key={index} tour={tour} index={index} />
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

            {!isLoading && currentTours.length > itemsPerPage && (
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
