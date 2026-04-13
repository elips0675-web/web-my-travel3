'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ru } from 'date-fns/locale';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

import { cn } from "@/lib/utils";
import { CalendarIcon, Search, MapPin, Star, ShieldCheck, Users, Briefcase, Award, Cog, DoorClosed, Luggage, Home, Utensils, Gamepad2, Car, Mail } from "lucide-react";
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { AiTourRecommendationsOutput } from "@/ai/flows/ai-tour-recommendations";
import type { AiHousingRecommendationsOutput } from '@/ai/flows/ai-housing-recommendations-flow';
import type { AiRestaurantRecommendationsOutput } from "@/ai/flows/ai-restaurant-recommendations";
import type { AiActivityRecommendationsOutput } from "@/ai/flows/ai-activity-recommendations";
import type { AiRentalCarRecommendationsOutput } from "@/ai/flows/ai-rental-car-recommendations";

const searchSchema = z.object({
  destination: z.string().min(1, { message: "Обязательное поле" }),
  date: z.date().optional(),
});

function SubscriptionDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size="lg">
                    <Mail className="mr-2 h-5 w-5" />
                    Подписаться на обновления
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Подписка на рассылку</DialogTitle>
                    <DialogDescription>
                        Получайте лучшие предложения и идеи для путешествий прямо на вашу почту.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                            Email
                        </Label>
                        <Input id="email" type="email" placeholder="name@example.com" className="col-span-3" />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit">Подписаться</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default function MyRoutesPageContent() {
    const router = useRouter();
    const heroImage = PlaceHolderImages.find(img => img.id === 'hero-banner-kayleen');
    const whyUsImage = PlaceHolderImages.find(img => img.id === 'why-choose-us');
    const [activeTab, setActiveTab] = useState('tours');


    const form = useForm<z.infer<typeof searchSchema>>({
        resolver: zodResolver(searchSchema),
        defaultValues: { destination: "" },
    });

    function onSubmit(values: z.infer<typeof searchSchema>) {
        const params = new URLSearchParams();
        params.append("destination", values.destination);
        if (values.date) params.append("from", values.date.toISOString());
        router.push(`/${activeTab}?${params.toString()}`);
    }
    
    const categories = [
        { key: 'tours', label: 'Туры', icon: Luggage },
        { key: 'housing', label: 'Жилье', icon: Home },
        { key: 'restaurants', label: 'Кафе и рестораны', icon: Utensils },
        { key: 'activities', label: 'Развлечения', icon: Gamepad2 },
        { key: 'rental-car', label: 'Транспорт', icon: Car }
    ];

    const destinations = [
        { name: "Минск", image: { imageUrl: 'https://picsum.photos/seed/minsk/600/800', description: 'Минск', imageHint: 'minsk city'}},
        { name: "Брест", image: { imageUrl: 'https://picsum.photos/seed/brest/600/800', description: 'Брест', imageHint: 'brest fortress'}},
        { name: "Гомель", image: { imageUrl: 'https://picsum.photos/seed/gomel/600/800', description: 'Гомель', imageHint: 'gomel palace'}},
        { name: "Гродно", image: { imageUrl: 'https://picsum.photos/seed/grodno/600/800', description: 'Гродно', imageHint: 'grodno city'}},
        { name: "Могилев", image: { imageUrl: 'https://picsum.photos/seed/mogilev/600/800', description: 'Могилев', imageHint: 'mogilev city'}},
        { name: "Витебск", image: { imageUrl: 'https://picsum.photos/seed/vitebsk/600/800', description: 'Витебск', imageHint: 'vitebsk city'}},
        { name: "Бобруйск", image: { imageUrl: 'https://picsum.photos/seed/bobruisk/600/800', description: 'Бобруйск', imageHint: 'bobruisk city'}},
        { name: "Париж", image: PlaceHolderImages.find(img => img.id === 'destination-paris') },
    ];

    const whyChooseUsItems = [
        { icon: ShieldCheck, title: "Гарантия лучшей цены", description: "Мы предлагаем конкурентные цены на тысячи направлений." },
        { icon: Users, title: "Поддержка клиентов 24/7", description: "Наша команда поддержки всегда готова помочь вам." },
        { icon: Briefcase, title: "Простое бронирование", description: "Интуитивно понятный процесс бронирования за несколько кликов." },
    ];
    
    // Data and Cards
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

    // Tours
    type TourRecommendationWithSlug = AiTourRecommendationsOutput[0] & { slug: string };
    const baseMockTourData: AiTourRecommendationsOutput = [
        { name: "Замки Мира и Несвижа", description: "Посетите два самых известных замка Беларуси, внесенных в список Всемирного наследия ЮНЕСКО.", type: "культурно-исторический", priceRange: "150 BYN", bookingLink: "#", relevanceScore: 98, duration: "Целый день", groupSize: "до 40 чел.", highlights: ["Мирский замок", "Несвижский дворцово-парковый комплекс", "Фарный костел в Несвиже"], included: ["Транспорт", "Услуги гида"], excluded: ["Входные билеты", "Обед"], galleryImageUrls: [ "https://picsum.photos/seed/mir-castle/800/600" ] },
        { name: "Беловежская пуща и Поместье Деда Мороза", description: "Откройте для себя древнейший лес Европы, увидьте могучих зубров и загляните в гости к белорусскому Деду Морозу.", type: "природа", priceRange: "180 BYN", bookingLink: "#", relevanceScore: 95, duration: "Целый день", groupSize: "до 45 чел.", highlights: ["Вольеры с дикими животными", "Музей природы", "Поместье Деда Мороза"], included: ["Транспорт", "Услуги гида", "Входные билеты в поместье"], excluded: ["Обед", "Билеты в Музей природы"], galleryImageUrls: [ "https://picsum.photos/seed/belovezha/800/600" ]},
        { name: "Обзорная экскурсия по Минску", description: "Познакомьтесь с главным городом Беларуси: от старинного Троицкого предместья до современных проспектов.", type: "обзорная", priceRange: "70 BYN", bookingLink: "#", relevanceScore: 93, duration: "4 часа", groupSize: "до 40 чел.", highlights: ["Троицкое предместье", "Остров слёз", "Проспект Независимости"], included: ["Транспорт", "Услуги гида"], excluded: ["Личные расходы"], galleryImageUrls: [ "https://picsum.photos/seed/minsk-cityscape/800/600" ]},
        { name: "Брест и Брестская крепость-герой", description: "Посетите легендарную Брестскую крепость, символ стойкости и мужества, и познакомьтесь с городом Брестом.", type: "военно-исторический", priceRange: "160 BYN", bookingLink: "#", relevanceScore: 96, duration: "Целый день", groupSize: "до 45 чел.", highlights: ["Мемориальный комплекс «Брестская крепость-герой»", "Музей обороны", "Пешеходная улица Советская"], included: ["Транспорт", "Услуги гида"], excluded: ["Входные билеты в музеи", "Обед"], galleryImageUrls: [ "https://picsum.photos/seed/brest-fortress/800/600" ]}
    ];
    const popularTours = baseMockTourData.slice(0, 4).map((tour, index) => ({ ...tour, slug: generateSlug(tour.name, index) }));
    
    // Housing
    type HousingRecommendationWithSlug = AiHousingRecommendationsOutput['recommendations'][0] & { slug: string };
    const baseMockHousingData: AiHousingRecommendationsOutput = { recommendations: [ { name: "Гранд-отель «Европа»", type: "Отель", location: "Санкт-Петербург, Россия", description: "Исторический пятизвездочный отель в самом центре города с роскошными номерами и безупречным сервисом.", priceEstimate: "от 400 BYN", rating: 5.0, pros: ["Идеальное расположение", "Историческая атмосфера", "Высококлассный сервис"], cons: ["Высокая цена"], imageUrl: "https://picsum.photos/seed/grandhotel/800/600", }, { name: "Апартаменты «Москва-Сити»", type: "Апартаменты", location: "Москва, Россия", description: "Современные апартаменты с панорамным видом на город в одной из башен комплекса «Москва-Сити».", priceEstimate: "от 300 BYN", rating: 4.8, pros: ["Панорамный вид", "Современный дизайн"], cons: ["Может быть шумно"], imageUrl: "https://picsum.photos/seed/moscowcity/800/600", }, { name: "Бутик-отель «Библиотека»", type: "Бутик-отель", location: "Вологда, Россия", description: "Уютный и тихий отель с уникальным дизайном, посвященным книгам и литературе. Идеально для спокойного отдыха.", priceEstimate: "от 180 BYN", rating: 4.9, pros: ["Уникальная концепция", "Тихое место"], cons: ["Небольшой номерной фонд"], imageUrl: "https://picsum.photos/seed/libraryhotel/800/600", }, { name: "Эко-отель «Роза Хутор»", type: "Отель", location: "Сочи, Россия", description: "Отель в горах с прекрасным видом, окруженный природой. Идеально для любителей активного отдыха.", priceEstimate: "от 250 BYN", rating: 4.7, pros: ["Горный воздух", "Доступ к подъемникам"], cons: ["Удаленность от моря"], imageUrl: "https://picsum.photos/seed/rosakhutor/800/600", } ], };
    const popularHousing = baseMockHousingData.recommendations.slice(0, 4).map((rec, index) => ({ ...rec, slug: generateSlug(rec.name, index) }));
    
    // Restaurants
    type RestaurantRecommendationWithSlug = (AiRestaurantRecommendationsOutput['recommendations'][0] & { slug: string });
    const baseMockRestaurantData: AiRestaurantRecommendationsOutput = { recommendations: [ { name: "White Rabbit", cuisine: "Современная русская", location: "Смоленская пл., 3, Москва", description: "Панорамный ресторан с видом на Москву, известный своей инновационной русской кухней.", price: "от 250 BYN", rating: 4.8, specialty: "Борщ с жареными карасями", imageUrl: "https://picsum.photos/seed/whiterabbit/800/600" }, { name: "Probka на Цветном", cuisine: "Итальянская", location: "Цветной б-р, 2, Москва", description: "Уютный итальянский ресторан от Арама Мнацаканова с аутентичной кухней и отличной винной картой.", price: "от 150 BYN", rating: 4.7, specialty: "Пицца с трюфелем", imageUrl: "https://picsum.photos/seed/probka/800/600" }, { name: "Кафе Пушкинъ", cuisine: "Русская дворянская", location: "Тверской б-р, 26А, Москва", description: "Легендарный ресторан-аптека с атмосферой XIX века и классической русской кухней.", price: "от 200 BYN", rating: 4.6, specialty: "Пожарская котлета", imageUrl: "https://picsum.photos/seed/pushkin/800/600" }, { name: "Горыныч", cuisine: "Гриль", location: "Рождественский б-р, 1, Москва", description: "Ресторан с огромными печами, где готовят блюда на огне. Отличные завтраки и хлеб.", price: "от 120 BYN", rating: 4.7, specialty: "Стейки и неаполитанская пицца", imageUrl: "https://picsum.photos/seed/gorynych/800/600" } ], };
    const popularRestaurants = baseMockRestaurantData.recommendations.slice(0, 4).map((rec, index) => ({ ...rec, slug: generateSlug(rec.name, index) }));

    // Activities
    type ActivityRecommendationWithSlug = AiActivityRecommendationsOutput['recommendations'][0] & { slug: string };
    const baseMockActivityData: AiActivityRecommendationsOutput = { recommendations: [ { name: "VR-арена Warpoint", type: "VR-арена", description: "Командный VR-шутер на большой арене. Почувствуй себя героем боевика!", price: "от 30 BYN/час", location: "пр-т Победителей, 9, Минск", rating: 4.9, imageUrl: "https://picsum.photos/seed/vr-warpoint/800/600" }, { name: "Квест «Пила»", type: "Квест", description: "Хоррор-квест по мотивам знаменитого фильма. Сможете ли вы выбраться из ловушки Конструктора?", price: "от 100 BYN за команду", location: "ул. Куйбышева, 22, Минск", rating: 4.8, imageUrl: "https://picsum.photos/seed/saw-quest/800/600" }, { name: "Боулинг-клуб Madison", type: "Боулинг", description: "Современный боулинг-центр с 12 дорожками, баром и рестораном. Отличное место для компании.", price: "от 45 BYN/час", location: "ул. Тимирязева, 9, Минск", rating: 4.6, imageUrl: "https://picsum.photos/seed/bowling-madison/800/600" }, { name: "Картинг-центр «Форсаж»", type: "Картинг", description: "Одна из лучших крытых картинг-трасс в Минске. Скорость, адреналин и дух соперничества.", price: "от 35 BYN за заезд", location: "пр-т Дзержинского, 91, Минск", rating: 4.7, imageUrl: "https://picsum.photos/seed/karting-forsazh/800/600" }, ], };
    const popularActivities = baseMockActivityData.recommendations.slice(0, 4).map((rec, index) => ({ ...rec, slug: generateSlug(rec.name, index) }));
    
    // Rental Cars
    type CarRecommendationWithSlug = AiRentalCarRecommendationsOutput['recommendations'][0] & { slug: string };
    const baseMockCarData: AiRentalCarRecommendationsOutput = { recommendations: [ { name: "Kia Rio", type: "Эконом", supplier: "Local Rent", price: "90 BYN", rating: 4.5, features: { passengers: 5, luggage: 2, transmission: "Автомат", doors: 4 }, imageUrl: "https://picsum.photos/seed/kiario/800/600" }, { name: "Toyota Camry", type: "Седан", supplier: "Hertz", price: "150 BYN", rating: 4.8, features: { passengers: 5, luggage: 3, transmission: "Автомат", doors: 4 }, imageUrl: "https://picsum.photos/seed/camry/800/600" }, { name: "Renault Duster", type: "SUV", supplier: "Avis", price: "120 BYN", rating: 4.7, features: { passengers: 5, luggage: 4, transmission: "Механика", doors: 4 }, imageUrl: "https://picsum.photos/seed/duster/800/600" }, { name: "BMW 5 Series", type: "Премиум", supplier: "Sixt", price: "300 BYN", rating: 4.9, features: { passengers: 5, luggage: 3, transmission: "Автомат", doors: 4 }, imageUrl: "https://picsum.photos/seed/bmw5/800/600" }, ], };
    const popularCars = baseMockCarData.recommendations.slice(0, 4).map((car, index) => ({ ...car, slug: generateSlug(car.name, index) }));

    return (
        <>
            <section className="relative h-screen min-h-[700px] w-full flex items-center justify-center -mt-16">
                <Image
                    src={heroImage?.imageUrl || "https://picsum.photos/seed/kayleen-hero/1920/1080"}
                    alt={heroImage?.description || "Abstract background"}
                    fill
                    className="object-cover"
                    priority
                    data-ai-hint={heroImage?.imageHint || "abstract background"}
                />
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative z-10 flex flex-col items-center text-white text-center px-4 max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-7xl font-extrabold font-headline !leading-tight tracking-tight">
                        Ваш Мир Удовольствий
                    </h1>
                    <p className="mt-4 text-lg md:text-xl max-w-2xl text-white/80">
                        Найдите лучшие туры, отели и развлечения по всему миру, подобранные специально для вас.
                    </p>
                    
                    <div className="mt-8 w-full max-w-3xl p-4 bg-background/50 backdrop-blur-md rounded-lg">
                         <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-4 md:items-center gap-4">
                                <FormField
                                    control={form.control}
                                    name="destination"
                                    render={({ field }) => (
                                        <FormItem className="md:col-span-2 text-left">
                                            <FormControl>
                                                <div className="relative">
                                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                                    <Input placeholder="Куда едете?" className="pl-10 h-14 text-base bg-input border-0" {...field} />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="date"
                                    render={({ field }) => (
                                        <FormItem className="text-left">
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn("w-full justify-start text-left font-normal h-14 text-base bg-input border-0", !field.value && "text-muted-foreground")}
                                                        >
                                                            <CalendarIcon className="mr-2 h-5 w-5" />
                                                            {field.value ? format(field.value, "d LLL, y", { locale: ru }) : <span>Выберите дату</span>}
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar initialFocus mode="single" selected={field.value} onSelect={field.onChange} locale={ru} />
                                                </PopoverContent>
                                            </Popover>
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="h-14 text-base font-bold md:col-span-1">
                                    <Search className="mr-2 h-5 w-5" />
                                    Найти
                                </Button>
                            </form>
                        </Form>
                    </div>
                </div>
            </section>
            
            <section className="py-16 lg:py-24">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <h2 className="text-4xl md:text-5xl font-bold font-headline mb-4">Популярное</h2>
                        <p className="text-lg text-muted-foreground">Ознакомьтесь с нашими лучшими предложениями в различных категориях.</p>
                    </div>
                    <div className="flex justify-center mb-12">
                        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-4">
                           {categories.map(({ key, label, icon: Icon }) => {
                                const isActive = activeTab === key;
                                return (
                                    <button
                                        key={key}
                                        onClick={() => setActiveTab(key)}
                                        className={cn('category-btn flex items-center gap-2 px-6 py-3 rounded-2xl font-medium whitespace-nowrap', {
                                            'active text-white': isActive,
                                            'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200': !isActive,
                                        })}
                                    >
                                        <Icon className="w-5 h-5" />
                                        {label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    <div>
                        {activeTab === 'tours' && (
                            <div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {popularTours.map((tour, index) => (
                                        <Link href={`/tours/${tour.slug}`} key={index} className="group flex flex-col">
                                            <div className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
                                                <Image
                                                    src={tour.galleryImageUrls[0]}
                                                    alt={tour.name}
                                                    width={600}
                                                    height={400}
                                                    className="object-cover aspect-[4/3] group-hover:scale-105 transition-transform duration-300"
                                                    data-ai-hint={tour.type}
                                                />
                                                <div className="absolute top-4 right-4 flex items-center gap-1 text-sm font-bold text-white bg-black/50 px-2 py-1 rounded-md">
                                                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                                    <span>{(tour.relevanceScore / 20).toFixed(1)}</span>
                                                </div>
                                            </div>
                                            <div className="pt-4">
                                                <h3 className="font-bold font-headline text-xl mb-2 text-foreground group-hover:text-primary transition-colors">{tour.name}</h3>
                                                <div className="flex justify-between items-center">
                                                    <p className="text-lg font-bold text-foreground">{tour.priceRange}</p>
                                                    <div className="text-sm text-muted-foreground">{tour.duration}</div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                        {activeTab === 'housing' && (
                            <div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {popularHousing.map((rec, index) => (
                                        <Link href={`/housing/${rec.slug}`} key={index} className="group flex flex-col">
                                            <div className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
                                                <Image src={rec.imageUrl || ''} alt={rec.name} width={600} height={400} className="object-cover aspect-[4/3] group-hover:scale-105 transition-transform" />
                                                {rec.rating && rec.rating >= 4.8 && (
                                                    <div className="absolute top-3 left-3 flex items-center gap-1.5 text-sm font-bold text-white bg-primary px-2 py-1 rounded">
                                                        <Award className="w-4 h-4" />
                                                        <span>Лучший выбор</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="pt-4">
                                                <div className="flex justify-between items-start">
                                                    <h3 className="font-bold font-headline text-xl mb-1 text-foreground group-hover:text-primary transition-colors">{rec.name}</h3>
                                                    {rec.rating && (
                                                        <div className="flex items-center gap-1 text-sm font-bold text-amber-500 shrink-0">
                                                            <Star className="w-4 h-4 fill-current" />
                                                            <span>{rec.rating.toFixed(1)}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="text-sm text-muted-foreground mb-2">{rec.location}</p>
                                                <p className="text-lg font-bold text-foreground">{rec.priceEstimate} <span className="text-sm font-normal text-muted-foreground">/ ночь</span></p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                        {activeTab === 'restaurants' && (
                             <div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {popularRestaurants.map((rec, index) => (
                                        <Link href={`/restaurants/${rec.slug}`} key={index} className="group flex flex-col">
                                            <div className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
                                                <Image src={rec.imageUrl || ''} alt={rec.name} width={600} height={400} className="object-cover aspect-[4/3] group-hover:scale-105 transition-transform" />
                                            </div>
                                            <div className="pt-4">
                                                <div className="flex justify-between items-start">
                                                    <h3 className="font-bold font-headline text-xl mb-1 text-foreground group-hover:text-primary transition-colors">{rec.name}</h3>
                                                    {rec.rating && (
                                                        <div className="flex items-center gap-1 text-sm font-bold text-amber-500 shrink-0">
                                                            <Star className="w-4 h-4 fill-current" />
                                                            <span>{rec.rating.toFixed(1)}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="text-sm text-muted-foreground">{rec.cuisine} • {rec.price}</p>
                                            </div>
                                        </Link>
                                ))}
                                </div>
                            </div>
                        )}
                        {activeTab === 'activities' && (
                            <div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {popularActivities.map((rec, index) => (
                                        <Link href={`/activities/${rec.slug}`} key={index} className="group flex flex-col">
                                            <div className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
                                                <Image src={rec.imageUrl || ''} alt={rec.name} width={600} height={400} className="object-cover aspect-[4/3] group-hover:scale-105 transition-transform" />
                                                {rec.rating && (
                                                    <div className="absolute top-4 right-4 flex items-center gap-1 text-sm font-bold text-white bg-black/50 px-2 py-1 rounded-md">
                                                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                                        <span>{rec.rating.toFixed(1)}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="pt-4">
                                                <p className="text-sm text-muted-foreground">{rec.type}</p>
                                                <h3 className="font-bold font-headline text-xl mb-2 text-foreground group-hover:text-primary transition-colors">{rec.name}</h3>
                                                <p className="text-lg font-bold text-foreground">{rec.price}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                        {activeTab === 'rental-car' && (
                            <div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {popularCars.map((car, index) => (
                                        <Link href={`/rental-car/${car.slug}`} key={index} className="group flex flex-col">
                                            <div className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
                                                <Image src={car.imageUrl || ''} alt={car.name} width={600} height={400} className="object-cover aspect-[4/3] group-hover:scale-105 transition-transform" />
                                            </div>
                                            <div className="pt-4">
                                                <div className="flex justify-between items-start">
                                                    <h3 className="font-bold font-headline text-xl mb-1 text-foreground group-hover:text-primary transition-colors">{car.name}</h3>
                                                    {car.rating && (
                                                        <div className="flex items-center gap-1 text-sm font-bold text-amber-500 shrink-0">
                                                            <Star className="w-4 h-4 fill-current" />
                                                            <span>{car.rating.toFixed(1)}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="text-sm text-muted-foreground mb-2">{car.type} • {car.features.transmission}</p>
                                                <p className="text-lg font-bold text-foreground">{car.price} <span className="text-sm font-normal text-muted-foreground">/ день</span></p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

             <section className="py-16 lg:py-24 bg-secondary">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold font-headline mb-4">Не пропустите лучшие предложения!</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                        Подпишитесь на нашу рассылку, чтобы первыми узнавать о новых турах, эксклюзивных скидках и получать вдохновение для следующих путешествий.
                    </p>
                    <SubscriptionDialog />
                </div>
            </section>

             <section className="py-16 lg:py-24">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                       <div className="relative aspect-[4/5] max-w-md mx-auto">
                         <div className="absolute -top-4 -left-4 w-full h-full rounded-2xl bg-primary/30 transform -rotate-3 transition-transform group-hover:rotate-0"></div>
                         <Image
                            src={whyUsImage?.imageUrl || 'https://picsum.photos/seed/why-us/800/1000'}
                            alt={whyUsImage?.description || 'Happy traveler'}
                            width={800}
                            height={1000}
                            className="relative object-cover rounded-2xl w-full h-full shadow-2xl"
                            data-ai-hint={whyUsImage?.imageHint || 'happy traveler'}
                         />
                       </div>
                        <div>
                            <h2 className="text-4xl md:text-5xl font-bold font-headline mb-6">Почему выбирают нас?</h2>
                            <p className="text-lg text-muted-foreground mb-8">Мы создаем незабываемые впечатления, сочетая экспертные знания и индивидуальный подход к каждому клиенту.</p>
                            <div className="space-y-6">
                                {whyChooseUsItems.map((item, index) => (
                                    <div key={index} className="flex items-start gap-4">
                                        <div className="flex-shrink-0 bg-primary/10 text-primary p-3 rounded-full">
                                            <item.icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                                            <p className="text-muted-foreground">{item.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 lg:py-24">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <h2 className="text-4xl md:text-5xl font-bold font-headline mb-4">Популярные направления</h2>
                        <p className="text-lg text-muted-foreground">Откройте для себя самые востребованные уголки мира, которые ждут вашего визита.</p>
                    </div>
                    <Carousel opts={{ align: "start", loop: true }} className="w-full">
                        <CarouselContent>
                            {destinations.map((destination, index) => (
                                <CarouselItem key={index} className="md:basis-1/3 lg:basis-1/4">
                                    <div className="p-1">
                                        <div className="relative aspect-[3/4] rounded-xl overflow-hidden group shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
                                            <Image
                                                src={destination.image?.imageUrl || `https://picsum.photos/seed/${destination.name}/600/800`}
                                                alt={destination.image?.description || destination.name}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                data-ai-hint={destination.image?.imageHint || destination.name.toLowerCase()}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                            <div className="absolute bottom-0 left-0 p-6">
                                                <h3 className="font-bold font-headline text-2xl text-white">{destination.name}</h3>
                                            </div>
                                        </div>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="ml-12" />
                        <CarouselNext className="mr-12" />
                    </Carousel>
                </div>
            </section>
        </>
    );
}
