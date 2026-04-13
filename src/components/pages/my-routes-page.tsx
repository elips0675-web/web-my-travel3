'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import * as React from 'react';

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

import { Check, ChevronsUpDown, Search, MapPin, ShieldCheck, Users, Briefcase } from "lucide-react";
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from "@/lib/utils";

const searchSchema = z.object({
  destination: z.string().min(1, { message: "Обязательное поле" }),
  categories: z.array(z.string()).refine((value) => value.length > 0, {
    message: "Выберите хотя бы одну категорию.",
  }),
});

const categories = [
    { id: "tours", label: "Туры" },
    { id: "housing", label: "Жилье" },
    { id: "restaurants", label: "Кафе и рестораны" },
    { id: "activities", label: "Развлечения" },
    { id: "rental-car", label: "Авто" },
];

export default function MyRoutesPageContent() {
    const router = useRouter();
    const heroImage = PlaceHolderImages.find(img => img.id === 'hero-banner-kayleen');
    const whyUsImage = PlaceHolderImages.find(img => img.id === 'why-choose-us');

    const form = useForm<z.infer<typeof searchSchema>>({
        resolver: zodResolver(searchSchema),
        defaultValues: { 
            destination: "",
            categories: [],
        },
    });

    function onSubmit(values: z.infer<typeof searchSchema>) {
        const params = new URLSearchParams();
        params.append("destination", values.destination);
        values.categories.forEach(category => params.append("category", category));
        router.push(`/routes/new?${params.toString()}`);
    }
    
    const destinations = [
        { name: "Париж", image: PlaceHolderImages.find(img => img.id === 'destination-paris') },
        { name: "Рим", image: PlaceHolderImages.find(img => img.id === 'destination-rome') },
        { name: "Нью-Йорк", image: PlaceHolderImages.find(img => img.id === 'destination-ny') },
        { name: "Токио", image: PlaceHolderImages.find(img => img.id === 'destination-tokyo') },
        { name: "Бали", image: PlaceHolderImages.find(img => img.id === 'destination-bali') },
        { name: "Санторини", image: PlaceHolderImages.find(img => img.id === 'destination-santorini') },
        { name: "Лондон", image: { imageUrl: 'https://picsum.photos/seed/london/600/400', description: 'London', imageHint: 'london city'}},
        { name: "Дубай", image: { imageUrl: 'https://picsum.photos/seed/dubai/600/400', description: 'Dubai', imageHint: 'dubai city'}},
    ];

    const whyChooseUsItems = [
        { icon: ShieldCheck, title: "Гарантия лучшей цены", description: "Мы предлагаем конкурентные цены на тысячи направлений." },
        { icon: Users, title: "Поддержка клиентов 24/7", description: "Наша команда поддержки всегда готова помочь вам." },
        { icon: Briefcase, title: "Простое бронирование", description: "Интуитивно понятный процесс бронирования за несколько кликов." },
    ]

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
                            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                <FormField
                                    control={form.control}
                                    name="destination"
                                    render={({ field }) => (
                                        <FormItem className="md:col-span-3 text-left">
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
                                    name="categories"
                                    render={({ field }) => (
                                    <FormItem className="md:col-span-1 text-left flex flex-col justify-end">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        className={cn("h-14 text-base bg-input border-0 justify-between", !field.value?.length && "text-muted-foreground")}
                                                        >
                                                        <div className="flex gap-1 flex-wrap">
                                                        {field.value?.length > 0 ? (
                                                            field.value.length > 2 ? (
                                                                <Badge variant="secondary">{`${field.value.length} выбрано`}</Badge>
                                                            ) : (
                                                                categories
                                                                .filter((cat) => field.value.includes(cat.id))
                                                                .map((cat) => <Badge key={cat.id} variant="secondary">{cat.label}</Badge>)
                                                            )
                                                        ) : "Категории"}
                                                        </div>
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                                                <div className="p-2 space-y-1">
                                                {categories.map((category) => (
                                                    <Button
                                                        key={category.id}
                                                        variant="ghost"
                                                        className="w-full justify-start"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            const selected = field.value || [];
                                                            const isSelected = selected.includes(category.id);
                                                            if (isSelected) {
                                                                field.onChange(selected.filter(id => id !== category.id));
                                                            } else {
                                                                field.onChange([...selected, category.id]);
                                                            }
                                                        }}
                                                    >
                                                        <div className={cn(
                                                            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                                            field.value?.includes(category.id) ? "bg-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible"
                                                        )}>
                                                            <Check className={cn("h-4 w-4")} />
                                                        </div>
                                                        {category.label}
                                                    </Button>
                                                ))}
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
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
            
             <section className="py-16 lg:py-24 bg-secondary">
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
