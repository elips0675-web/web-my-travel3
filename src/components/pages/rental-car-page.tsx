'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState, useEffect } from "react";
import Image from 'next/image';
import Link from "next/link";

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
import { CalendarIcon, Loader2, Search, Users, Briefcase, Cog, DoorClosed, Star } from "lucide-react";
import { format } from "date-fns";
import { ru } from 'date-fns/locale';
import { type AiRentalCarRecommendationsOutput } from '@/ai/flows/ai-rental-car-recommendations';
import { RentalCarFilters } from "@/components/rental-car-filters";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { Checkbox } from "../ui/checkbox";

type TransportRecommendation = AiRentalCarRecommendationsOutput['recommendations'][0];
type TransportRecommendationWithSlug = TransportRecommendation & { slug: string };

const transportCategories = [
    { id: 'Каршеринг', label: 'Каршеринг' },
    { id: 'Такси', label: 'Такси' },
    { id: 'Велосипеды', label: 'Велосипеды' },
    { id: 'Самокаты', label: 'Самокаты' },
];

const formSchema = z.object({
  location: z.string().min(2, { message: "Место получения должно содержать не менее 2 символов." }),
  dates: z.object({
    from: z.date({ required_error: "Необходима дата начала." }),
    to: z.date({ required_error: "Необходима дата окончания." }),
  }),
  transportCategories: z.array(z.string()).refine((value) => value.length > 0, {
    message: "Выберите хотя бы одну категорию.",
  }),
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

function TransportCard({ transport, index }: { transport: TransportRecommendationWithSlug, index: number }) {
    return (
      <Card className="group overflow-hidden transition-shadow hover:shadow-xl flex flex-col rounded-2xl">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={transport.imageUrl || `https://picsum.photos/seed/transport${index}/800/600`}
            alt={transport.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            data-ai-hint={`${transport.type.toLowerCase()} transport`}
          />
          <div className="absolute top-3 right-3 bg-card/90 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="font-semibold text-card-foreground">{transport.rating?.toFixed(1)}</span>
          </div>
        </div>
        <CardHeader>
          <CardDescription>{transport.type} - {transport.supplier}</CardDescription>
          <CardTitle className="font-bold text-lg mb-0 group-hover:text-primary transition-colors">{transport.name}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col flex-grow">
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
            {transport.features.passengers && <div className="flex items-center gap-1.5"><Users className="w-4 h-4" /><span>{transport.features.passengers}</span></div>}
            {transport.features.luggage && <div className="flex items-center gap-1.5"><Briefcase className="w-4 h-4" /><span>{transport.features.luggage}</span></div>}
            {transport.features.transmission && <div className="flex items-center gap-1.5"><Cog className="w-4 h-4" /><span>{transport.features.transmission}</span></div>}
            {transport.features.doors && <div className="flex items-center gap-1.5"><DoorClosed className="w-4 h-4" /><span>{transport.features.doors}</span></div>}
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between pt-3 border-t mt-auto">
          <div className="text-2xl font-bold text-primary">{transport.price}</div>
          <Button asChild>
            <Link href={`/rental-car/${transport.slug}`}>Подробнее</Link>
          </Button>
        </CardFooter>
      </Card>
    );
}
  
function LoadingSkeleton() {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 12 }).map((i) => (
          <Card key={i} className="overflow-hidden rounded-2xl">
            <Skeleton className="h-48 w-full" />
            <CardHeader>
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-6 w-1/2" />
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-4">
                    <Skeleton className="h-5 w-1/4" />
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
    );
}

const mockTransportData: AiRentalCarRecommendationsOutput = {
    recommendations: [
        { name: "Яндекс.Драйв", type: "Каршеринг", supplier: "Яндекс", price: "от 0.3 BYN/мин", rating: 4.7, features: { passengers: 5, luggage: 2, transmission: "Автомат", doors: 4 }, imageUrl: "https://picsum.photos/seed/yandexdrive/800/600" },
        { name: "Ситидрайв", type: "Каршеринг", supplier: "Ситимобил", price: "от 0.25 BYN/мин", rating: 4.6, features: { passengers: 5, luggage: 2, transmission: "Автомат", doors: 4 }, imageUrl: "https://picsum.photos/seed/citydrive/800/600" },
        { name: "Яндекс.Такси", type: "Такси", supplier: "Яндекс", price: "от 5 BYN", rating: 4.8, features: { passengers: 4 }, imageUrl: "https://picsum.photos/seed/yandextaxi/800/600" },
        { name: "Nextbike", type: "Велосипеды", supplier: "Nextbike", price: "от 2 BYN/час", rating: 4.5, features: { passengers: 1 }, imageUrl: "https://picsum.photos/seed/nextbike/800/600" },
        { name: "Whoosh", type: "Самокаты", supplier: "Whoosh", price: "1.5 BYN старт, 0.2 BYN/мин", rating: 4.6, features: { passengers: 1 }, imageUrl: "https://picsum.photos/seed/whoosh/800/600" },
        { name: "Uber", type: "Такси", supplier: "Uber", price: "от 4.5 BYN", rating: 4.7, features: { passengers: 4 }, imageUrl: "https://picsum.photos/seed/uber/800/600" },
    ],
};

const mockTransportDataWithSlugs = mockTransportData.recommendations.map((transport, index) => ({
    ...transport,
    slug: generateSlug(transport.name, index)
}));

export default function RentalCarPageContent() {
  const [recommendations, setRecommendations] = useState<TransportRecommendationWithSlug[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
        sessionStorage.setItem('rentalCarRecommendations', JSON.stringify(mockTransportDataWithSlugs));
    }
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: "",
      transportCategories: ["Каршеринг", "Такси"],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setHasSearched(true);
    setRecommendations([]);
    setCurrentPage(1);

    // TODO: Connect to AI flow
    console.log(values);
    await new Promise(resolve => setTimeout(resolve, 2000));
    const recommendationsWithSlugs = mockTransportData.recommendations.filter(r => values.transportCategories.includes(r.type)).map((rec, index) => ({
        ...rec,
        slug: generateSlug(rec.name, index)
    }));

    if (typeof window !== 'undefined') {
        sessionStorage.setItem('rentalCarRecommendations', JSON.stringify(recommendationsWithSlugs));
    }
    setRecommendations(recommendationsWithSlugs);
    
    // toast({
    //   title: "Поиск в разработке",
    //   description: "Функционал поиска автомобилей скоро будет добавлен.",
    // });
    setIsLoading(false);
  }

  const currentTransport = hasSearched ? recommendations : mockTransportDataWithSlugs;

  const totalPages = Math.ceil(currentTransport.length / itemsPerPage);
  const paginatedTransport = currentTransport.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-7xl mx-auto mb-8">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Аренда транспорта</CardTitle>
          <CardDescription>Найдите лучший транспорт для вашего путешествия.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Место получения</FormLabel>
                      <FormControl>
                        <Input placeholder="Город или аэропорт" {...field} />
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
                      <FormLabel>Даты аренды</FormLabel>
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
                name="transportCategories"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel>Тип транспорта</FormLabel>
                      <FormDescription>
                        Выберите один или несколько типов транспорта.
                      </FormDescription>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {transportCategories.map((item) => (
                        <FormField
                          key={item.id}
                          control={form.control}
                          name="transportCategories"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={item.id}
                                className="flex flex-row items-center space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(item.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, item.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== item.id
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  {item.label}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                Найти транспорт
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {!isLoading && !hasSearched && (
          <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg max-w-4xl mx-auto">
              <Search className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold">Результаты поиска появятся здесь</h3>
              <p className="text-muted-foreground mt-1">Заполните форму выше, чтобы найти транспорт для вашей поездки. Ниже представлены популярные варианты.</p>
          </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        <aside className="lg:col-span-1 lg:sticky lg:top-24 h-fit">
          <RentalCarFilters />
        </aside>

        <main className="lg:col-span-3">
          {isLoading && <LoadingSkeleton />}
          
          {!isLoading && hasSearched && recommendations && recommendations.length > 0 && (
            <div>
              <h2 className="text-2xl font-headline font-bold mb-6">Найдено {recommendations.length} вариантов</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {paginatedTransport.map((transport, index) => (
                  <TransportCard key={`${transport.slug}-${index}`} transport={transport} index={index} />
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
                  <h2 className="text-2xl font-headline font-bold mb-6">Популярные предложения</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {paginatedTransport.map((transport, index) => (
                          <TransportCard key={`${transport.slug}-${index}`} transport={transport} index={index} />
                      ))}
                  </div>
              </div>
          )}

          {!isLoading && currentTransport.length > itemsPerPage && (
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
