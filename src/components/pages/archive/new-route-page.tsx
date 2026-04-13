'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ru } from 'date-fns/locale';

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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  name: z.string().min(2, { message: "Название должно содержать не менее 2 символов." }),
  destination: z.string().min(2, { message: "Пункт назначения должен содержать не менее 2 символов." }),
  dates: z.object({
    from: z.date({ required_error: "Необходима дата начала." }),
    to: z.date({ required_error: "Необходима дата окончания." }),
  }),
});

const categoryLabels: { [key: string]: string } = {
    'tours': 'Туры',
    'housing': 'Жилье',
    'restaurants': 'Кафе и рестораны',
    'activities': 'Развлечения',
    'rental-car': 'Транспорт'
};

export default function NewRoutePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const destinationParam = searchParams.get("destination");
  const categoriesParam = searchParams.getAll("category");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      destination: destinationParam || "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // Here you would typically send data to a server
    // For now, we'll just show a toast and redirect
    toast({
      title: "Маршрут создан!",
      description: `Ваш маршрут "${values.name}" был успешно создан.`,
    });
    router.push("/");
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">Создать новый маршрут</CardTitle>
        <CardDescription>Спланируйте свое следующее незабываемое путешествие.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
             {categoriesParam.length > 0 && (
                <FormItem>
                    <FormLabel>Выбранные категории</FormLabel>
                    <div className="flex flex-wrap gap-2">
                        {categoriesParam.map(category => (
                            <Badge key={category} variant="secondary">{categoryLabels[category] || category}</Badge>
                        ))}
                    </div>
                </FormItem>
            )}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название поездки</FormLabel>
                  <FormControl>
                    <Input placeholder="Например, Весенний Париж" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="destination"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Пункт назначения</FormLabel>
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
                  <FormLabel>Даты поездки</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value?.from && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value?.from ? (
                            field.value.to ? (
                              <>
                                {format(field.value.from, "d LLL", { locale: ru })} -{" "}
                                {format(field.value.to, "d LLL, y", { locale: ru })}
                              </>
                            ) : (
                              format(field.value.from, "d LLL, y", { locale: ru })
                            )
                          ) : (
                            <span>Выберите даты</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={field.value?.from}
                        selected={{ from: field.value?.from, to: field.value?.to }}
                        onSelect={(range) => field.onChange(range)}
                        numberOfMonths={2}
                        locale={ru}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Создать маршрут</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
