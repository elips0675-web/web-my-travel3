'use client';
import { useState, useMemo, useRef, useEffect } from 'react';
import Image from 'next/image';
import { APIProvider, Map, AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps';
import { cn } from '@/lib/utils';
import { Luggage, Home, Coffee, Gamepad2, Car, Star, MapPin, Clock, Users, Filter, X, List, Locate, Search } from 'lucide-react';

// Icons
const Icons = {
    Tour: () => <Luggage className="w-5 h-5" />,
    Home: () => <Home className="w-5 h-5" />,
    Coffee: () => <Coffee className="w-5 h-5" />,
    Gamepad: () => <Gamepad2 className="w-5 h-5" />,
    Car: () => <Car className="w-5 h-5" />,
    Star: () => <Star className="w-4 h-4 fill-current text-amber-400" />,
    MapPin: () => <MapPin className="w-4 h-4" />,
    Clock: () => <Clock className="w-4 h-4" />,
    Users: () => <Users className="w-4 h-4" />,
    Filter: () => <Filter className="w-5 h-5" />,
    X: () => <X className="w-5 h-5" />,
    List: () => <List className="w-5 h-5" />,
    Map: () => <MapPin className="w-5 h-5" />, // Using MapPin for Map icon
    Locate: () => <Locate className="w-5 h-5" />,
    Search: () => <Search className="w-5 h-5" />
};

// Mock Data
const mockData = [
    // Туры - Москва и область
    { id: 1, category: 'tours', title: 'Горный поход на Эльбрус', type: 'Экстрим', price: 25000, duration: '3 дня', rating: 4.8, location: 'Кабардино-Балкария', coords: { lat: 43.35, lng: 42.44 }, image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400', seats: 12 },
    { id: 2, category: 'tours', title: 'Золотое кольцо России', type: 'Культурный', price: 15000, duration: '5 дней', rating: 4.6, location: 'Сергиев Посад', coords: { lat: 56.31, lng: 38.13 }, image: 'https://images.unsplash.com/photo-1513326738677-b964603b136d?w=400', seats: 20 },
    { id: 3, category: 'tours', title: 'Байкал зимой', type: 'Природа', price: 35000, duration: '7 дней', rating: 4.9, location: 'Иркутск', coords: { lat: 52.29, lng: 104.29 }, image: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?w=400', seats: 8 },
    
    // Жильё - Москва
    { id: 5, category: 'accommodation', title: 'Отель "Астория"', type: 'Отель', price: 8000, rating: 4.7, location: 'Москва, Тверская', coords: { lat: 55.76, lng: 37.61 }, amenities: ['WiFi', 'SPA', 'Бассейн'], image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400', rooms: 2 },
    { id: 6, category: 'accommodation', title: 'Уютный лофт в центре', type: 'Апартаменты', price: 4500, rating: 4.5, location: 'Москва, Арбат', coords: { lat: 55.75, lng: 37.59 }, amenities: ['WiFi', 'Кухня', 'Кондиционер'], image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400', rooms: 1 },
    { id: 7, category: 'accommodation', title: 'Эко-дом у озера', type: 'Дом', price: 12000, rating: 4.9, location: 'Рублёвка', coords: { lat: 55.73, lng: 37.25 }, amenities: ['WiFi', 'Баня', 'Барбекю'], image: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=400', rooms: 3 },
    { id: 8, category: 'accommodation', title: 'Хостел "Встреча"', type: 'Хостел', price: 1200, rating: 4.2, location: 'Москва, Курский вокзал', coords: { lat: 55.76, lng: 37.66 }, amenities: ['WiFi', 'Кухня'], image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400', rooms: 1 },
    
    // Кафе - Москва
    { id: 9, category: 'cafes', title: 'Coffee Like', type: 'Кофейня', price: 500, cuisine: 'Европейская', rating: 4.4, location: 'Москва, Патриаршие', coords: { lat: 55.765, lng: 37.592 }, features: ['WiFi', 'Рабочее место', 'Завтрак'], image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400' },
    { id: 10, category: 'cafes', title: 'Хачапурная №1', type: 'Ресторан', price: 1500, cuisine: 'Грузинская', rating: 4.7, location: 'Москва, Мясницкая', coords: { lat: 55.763, lng: 37.632 }, features: ['Живая музыка', 'Бизнес-ланч'], image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400' },
    { id: 11, category: 'cafes', title: 'Сыроварня', type: 'Ресторан', price: 2500, cuisine: 'Русская', rating: 4.8, location: 'Москва, Замоскворечье', coords: { lat: 55.73, lng: 37.63 }, features: ['Панорамный вид', 'Дегустация'], image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400' },
    
    // Развлечения - Москва
    { id: 13, category: 'entertainment', title: 'Картинг "Скорость"', type: 'Активный отдых', price: 2000, duration: '1 час', rating: 4.6, location: 'Москва, МКАД', coords: { lat: 55.70, lng: 37.80 }, ageGroup: '12+', image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400' },
    { id: 14, category: 'entertainment', title: 'Квест "Тайна да Винчи"', type: 'Квест', price: 3500, duration: '1.5 часа', rating: 4.8, location: 'Москва, Таганка', coords: { lat: 55.74, lng: 37.67 }, ageGroup: '16+', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400' },
    { id: 15, category: 'entertainment', title: 'Океанариум', type: 'Экскурсия', price: 1200, duration: '2 часа', rating: 4.5, location: 'Москва, Чистые пруды', coords: { lat: 55.76, lng: 37.64 }, ageGroup: '0+', image: 'https://images.unsplash.com/photo-1582967788606-a171f1080ca8?w=400' },
    
    // Транспорт - Москва
    { id: 17, category: 'cars', title: 'Toyota Camry', type: 'Седан', price: 3500, transmission: 'Автомат', seats: 5, rating: 4.6, location: 'Москва, Шереметьево', coords: { lat: 55.97, lng: 37.41 }, image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400' },
    { id: 18, category: 'cars', title: 'Mercedes Sprinter', type: 'Минивэн', price: 8000, transmission: 'Механика', seats: 19, rating: 4.4, location: 'Москва, Домодедово', coords: { lat: 55.41, lng: 37.90 }, image: 'https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=400' },
    { id: 19, category: 'cars', title: 'BMW X5', type: 'Внедорожник', price: 7000, transmission: 'Автомат', seats: 5, rating: 4.8, location: 'Москва, Внуково', coords: { lat: 55.60, lng: 37.29 }, image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400' }
];

const filterConfig = {
    tours: {
        fields: [
            { key: 'type', label: 'Тип тура', options: ['Экстрим', 'Культурный', 'Природа', 'Пляжный'] },
            { key: 'duration', label: 'Длительность', options: ['1-3 дня', '4-7 дней', '8+ дней'] },
            { key: 'priceRange', label: 'Цена', type: 'range', min: 0, max: 100000 }
        ]
    },
    accommodation: {
        fields: [
            { key: 'type', label: 'Тип жилья', options: ['Отель', 'Апартаменты', 'Дом', 'Хостел'] },
            { key: 'amenities', label: 'Удобства', options: ['WiFi', 'Бассейн', 'SPA', 'Кухня', 'Баня', 'Барбекю'] },
            { key: 'priceRange', label: 'Цена за ночь', type: 'range', min: 0, max: 20000 }
        ]
    },
    cafes: {
        fields: [
            { key: 'cuisine', label: 'Кухня', options: ['Европейская', 'Грузинская', 'Русская', 'Азиатская'] },
            { key: 'features', label: 'Особенности', options: ['WiFi', 'Рабочее место', 'Живая музыка', 'Панорамный вид'] },
            { key: 'priceRange', label: 'Средний чек', type: 'range', min: 0, max: 5000 }
        ]
    },
    entertainment: {
        fields: [
            { key: 'type', label: 'Тип развлечения', options: ['Активный отдых', 'Квест', 'Экскурсия', 'Экстрим'] },
            { key: 'ageGroup', label: 'Возраст', options: ['0+', '6+', '12+', '16+', '18+'] },
            { key: 'priceRange', label: 'Цена', type: 'range', min: 0, max: 20000 }
        ]
    },
    cars: {
        fields: [
            { key: 'type', label: 'Тип авто', options: ['Седан', 'Внедорожник', 'Минивэн', 'Кроссовер'] },
            { key: 'transmission', label: 'Коробка', options: ['Автомат', 'Механика'] },
            { key: 'priceRange', label: 'Цена в сутки', type: 'range', min: 0, max: 15000 }
        ]
    }
};

const categoryLabels = {
    tours: { label: 'Туры', icon: Icons.Tour, color: '#3b82f6', bgColor: 'bg-blue-500' },
    accommodation: { label: 'Жильё', icon: Icons.Home, color: '#22c55e', bgColor: 'bg-green-500' },
    cafes: { label: 'Кафе', icon: Icons.Coffee, color: '#f97316', bgColor: 'bg-orange-500' },
    entertainment: { label: 'Развлечения', icon: Icons.Gamepad, color: '#a855f7', bgColor: 'bg-purple-500' },
    cars: { label: 'Транспорт', icon: Icons.Car, color: '#ef4444', bgColor: 'bg-red-500' }
};

const MapComponent = ({ items, activeItem, onMarkerClick, selectedCategories }: { items: any[], activeItem: any, onMarkerClick: (item: any) => void, selectedCategories: string[] }) => {
    const mapRef = useRef(null);
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [center, setCenter] = useState({ lat: 55.76, lng: 37.64 });

    useEffect(() => {
        if (map && items.length > 0) {
            const bounds = new window.google.maps.LatLngBounds();
            items.forEach(item => bounds.extend(new window.google.maps.LatLng(item.coords.lat, item.coords.lng)));
            map.fitBounds(bounds);
        }
    }, [items, map]);
    
    const handleLocateMe = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                map?.setCenter(pos);
                map?.setZoom(14);
            });
        }
    };

    return (
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
            <div className="relative w-full h-full">
                <Map
                    ref={mapRef}
                    defaultCenter={center}
                    defaultZoom={11}
                    gestureHandling={'greedy'}
                    disableDefaultUI={true}
                    onCameraChanged={(ev) => setCenter(ev.detail.center)}
                    mapId="a2e4c8c2a3d3c1d"
                    onLoad={({map}) => setMap(map)}
                >
                    {items.map(item => (
                        <AdvancedMarker
                            key={item.id}
                            position={item.coords}
                            onClick={() => onMarkerClick(item)}
                        />
                    ))}
                    {activeItem && (
                        <InfoWindow
                            position={activeItem.coords}
                            onCloseClick={() => onMarkerClick(null)}
                        >
                            <div className="p-2 max-w-xs">
                                <Image src={activeItem.image} alt={activeItem.title} width={200} height={100} className="w-full h-24 object-cover rounded-md mb-2" />
                                <h3 className="font-bold text-md mb-1">{activeItem.title}</h3>
                                <p className="text-sm text-gray-600 mb-2">{activeItem.location}</p>
                                <div className="text-lg font-bold text-indigo-600">{activeItem.price.toLocaleString()} ₽</div>
                            </div>
                        </InfoWindow>
                    )}
                </Map>
                <div className="map-legend hidden md:block">
                    <div className="font-semibold mb-2 text-sm">Категории</div>
                    {selectedCategories.map(cat => (
                        <div key={cat} className="legend-item">
                            <div className="legend-dot" style={{ background: categoryLabels[cat as keyof typeof categoryLabels].color }}></div>
                            <span>{categoryLabels[cat as keyof typeof categoryLabels].label}</span>
                        </div>
                    ))}
                </div>
                <button 
                    onClick={handleLocateMe}
                    className="absolute bottom-20 right-4 bg-white p-3 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                >
                    <Icons.Locate />
                </button>
            </div>
        </APIProvider>
    );
};

const ResultCard = ({ item, isActive, onClick, onHover }: {item: any, isActive: boolean, onClick: (item:any) => void, onHover: (item:any) => void}) => {
    const config = categoryLabels[item.category as keyof typeof categoryLabels];
    const Icon = config.icon;
    
    return (
        <div 
            className={cn('bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 card-enter group cursor-pointer', {
                'ring-2 ring-indigo-500': isActive
            })}
            onClick={() => onClick(item)}
            onMouseEnter={() => onHover(item)}
        >
            <div className="relative h-48 overflow-hidden">
                <Image 
                    src={item.image} 
                    alt={item.title}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className={`absolute top-3 left-3 ${config.bgColor} text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5`}>
                    <Icon />
                    {config.label}
                </div>
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1">
                    <Icons.Star />
                    <span className="font-semibold">{item.rating}</span>
                </div>
            </div>
            <div className="p-4">
                <h3 className="font-bold text-lg text-gray-800 mb-2">{item.title}</h3>
                <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
                    <Icons.MapPin />
                    {item.location}
                </div>
                
                <div className="flex flex-wrap gap-2 mb-3">
                    {item.type && (
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs">
                            {item.type}
                        </span>
                    )}
                    {item.duration && (
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs flex items-center gap-1">
                            <Icons.Clock />
                            {item.duration}
                        </span>
                    )}
                    {item.seats && (
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs flex items-center gap-1">
                            <Icons.Users />
                            {item.seats} мест
                        </span>
                    )}
                     {item.amenities && item.amenities.slice(0, 2).map((a: string, i: number) => (
                        <span key={i} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs">
                            {a}
                        </span>
                    ))}
                    {item.cuisine && (
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs">
                            {item.cuisine}
                        </span>
                    )}
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div>
                        <span className="text-2xl font-bold text-indigo-600">{item.price.toLocaleString()}</span>
                        <span className="text-gray-400 text-sm"> ₽</span>
                        {item.category === 'accommodation' && <span className="text-gray-400 text-sm">/ночь</span>}
                        {item.category === 'cars' && <span className="text-gray-400 text-sm">/сутки</span>}
                    </div>
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-indigo-700 transition-colors">
                        Подробнее
                    </button>
                </div>
            </div>
        </div>
    );
};

const FilterSection = ({ category, activeFilters, onFilterChange }: { category: string, activeFilters: any, onFilterChange: (cat: string, field: string, val: any) => void }) => {
    const config = filterConfig[category as keyof typeof filterConfig];
    if (!config) return null;

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-4">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <span 
                    className="w-2 h-2 rounded-full"
                    style={{ background: categoryLabels[category as keyof typeof categoryLabels].color }}
                />
                {categoryLabels[category as keyof typeof categoryLabels].label}
            </h3>
            
            {config.fields.map(field => (
                <div key={field.key} className="mb-4 last:mb-0">
                    <label className="text-sm font-medium text-gray-600 mb-2 block">
                        {field.label}
                    </label>
                    
                    {field.type === 'range' ? (
                        <div>
                            <input
                                type="range"
                                min={field.min}
                                max={field.max}
                                step={1000}
                                value={activeFilters[category]?.[field.key] || field.max}
                                onChange={(e) => onFilterChange(category, field.key, parseInt(e.target.value))}
                                className="range-slider mb-2"
                            />
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>{field.min?.toLocaleString()} ₽</span>
                                <span className="font-medium text-indigo-600">
                                    До {(activeFilters[category]?.[field.key] || field.max).toLocaleString()} ₽
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {field.options && field.options.map(option => {
                                const isActive = activeFilters[category]?.[field.key]?.includes(option);
                                return (
                                    <button
                                        key={option}
                                        onClick={() => {
                                            const current = activeFilters[category]?.[field.key] || [];
                                            const updated = isActive 
                                                ? current.filter((o: string) => o !== option)
                                                : [...current, option];
                                            onFilterChange(category, field.key, updated);
                                        }}
                                        className={cn('filter-chip px-3 py-1.5 rounded-full text-sm font-medium transition-all', {
                                            'bg-indigo-600 text-white shadow-md': isActive,
                                            'bg-gray-100 text-gray-600 hover:bg-gray-200': !isActive,
                                        })}
                                    >
                                        {option}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};


export default function FilterMapContent() {
    const [selectedCategories, setSelectedCategories] = useState(['accommodation', 'cafes']);
    const [activeFilters, setActiveFilters] = useState<any>({});
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('rating');
    const [viewMode, setViewMode] = useState('split'); // 'split', 'map', 'list'
    const [activeItem, setActiveItem] = useState<any | null>(null);
    const listRef = useRef<HTMLDivElement>(null);

    const toggleCategory = (category: string) => {
        setSelectedCategories(prev => {
            if (prev.includes(category)) {
                return prev.length > 1 ? prev.filter(c => c !== category) : prev;
            }
            return [...prev, category];
        });
    };

    const handleFilterChange = (category: string, field: string, value: any) => {
        setActiveFilters((prev: any) => ({
            ...prev,
            [category]: {
                ...prev[category],
                [field]: value
            }
        }));
    };

    const resetFilters = () => {
        setActiveFilters({});
        setSearchQuery('');
    };

    const filteredData = useMemo(() => {
        return mockData.filter(item => {
            if (!selectedCategories.includes(item.category)) return false;
            if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
            
            const categoryFilters = activeFilters[item.category];
            if (categoryFilters) {
                if (categoryFilters.priceRange && item.price > categoryFilters.priceRange) return false;
                if (categoryFilters.type?.length > 0 && !categoryFilters.type.includes(item.type)) return false;
                if (categoryFilters.cuisine?.length > 0 && !categoryFilters.cuisine.includes(item.cuisine)) return false;
                if (categoryFilters.transmission?.length > 0 && !categoryFilters.transmission.includes(item.transmission)) return false;
            }
            return true;
        }).sort((a, b) => {
            if (sortBy === 'price-asc') return a.price - b.price;
            if (sortBy === 'price-desc') return b.price - a.price;
            return b.rating - a.rating;
        });
    }, [selectedCategories, activeFilters, searchQuery, sortBy]);

    useEffect(() => {
        if (activeItem && listRef.current) {
            const element = document.getElementById(`item-${activeItem.id}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [activeItem]);
    
    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col bg-gray-50">
            <header className="bg-white shadow-sm z-20 flex-shrink-0">
                <div className="px-4 py-3">
                    <div className="flex items-center justify-between mb-3">
                        <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            TravelMap
                        </h1>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setViewMode('list')} className={cn('p-2 rounded-lg transition-colors', viewMode === 'list' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-500 hover:bg-gray-100')}><Icons.List /></button>
                            <button onClick={() => setViewMode('split')} className={cn('p-2 rounded-lg transition-colors', viewMode === 'split' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-500 hover:bg-gray-100')}><Icons.Map /></button>
                            <button onClick={() => setViewMode('map')} className={cn('p-2 rounded-lg transition-colors hidden md:block', viewMode === 'map' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-500 hover:bg-gray-100')}><div className="w-5 h-5 border-2 border-current rounded-sm"></div></button>
                        </div>
                    </div>
                    <div className="relative">
                        <input type="text" placeholder="Поиск..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Icons.Search /></div>
                    </div>
                </div>
                <div className="px-4 pb-3 flex gap-2 overflow-x-auto scrollbar-hide">
                    {Object.entries(categoryLabels).map(([key, { label, icon: Icon }]) => {
                        const isActive = selectedCategories.includes(key);
                        return (
                            <button key={key} onClick={() => toggleCategory(key)} className={cn('category-btn flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap', isActive ? 'active text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}>
                                <Icon /> {label}
                            </button>
                        );
                    })}
                </div>
            </header>

            <div className="flex-1 overflow-hidden flex">
                {(viewMode === 'split' || viewMode === 'list') && (
                    <aside className={cn('bg-gray-50 border-r border-gray-200 overflow-y-auto', viewMode === 'split' ? 'w-80 hidden lg:block p-4' : 'w-full max-w-sm p-4')}>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-bold text-gray-800">Фильтры</h2>
                            {Object.keys(activeFilters).length > 0 && (<button onClick={resetFilters} className="text-xs text-indigo-600 font-medium hover:underline">Сбросить</button>)}
                        </div>
                        {selectedCategories.map(category => (
                            <FilterSection key={category} category={category} activeFilters={activeFilters} onFilterChange={handleFilterChange} />
                        ))}
                    </aside>
                )}

                {(viewMode === 'split' || viewMode === 'list') && (
                    <div className={cn('bg-white border-r border-gray-200 overflow-y-auto', viewMode === 'split' ? 'w-96 hidden xl:block' : 'flex-1')} ref={listRef}>
                        <div className="p-4 sticky top-0 bg-white border-b border-gray-100 z-10 flex items-center justify-between">
                            <span className="text-sm text-gray-600">Найдено <span className="font-bold text-gray-900">{filteredData.length}</span></span>
                            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                <option value="rating">По рейтингу</option>
                                <option value="price-asc">Сначала дешевле</option>
                                <option value="price-desc">Сначала дороже</option>
                            </select>
                        </div>
                        <div className="p-4 space-y-4">
                            {filteredData.map(item => (<div key={item.id} id={`item-${item.id}`}><ResultCard item={item} isActive={activeItem?.id === item.id} onClick={setActiveItem} onHover={setActiveItem} /></div>))}
                            {filteredData.length === 0 && (<div className="text-center py-12"><div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center"><Icons.Filter /></div><p className="text-gray-500 text-sm">Ничего не найдено</p></div>)}
                        </div>
                    </div>
                )}

                {(viewMode === 'split' || viewMode === 'map') && (
                    <div className={cn('relative bg-gray-100', viewMode === 'split' ? 'flex-1' : 'w-full')}>
                        <MapComponent items={filteredData} activeItem={activeItem} onMarkerClick={setActiveItem} selectedCategories={selectedCategories} />
                        <button onClick={() => setViewMode(viewMode === 'map' ? 'split' : 'map')} className="absolute top-4 left-4 md:hidden bg-white px-4 py-2 rounded-xl shadow-lg font-medium text-sm flex items-center gap-2">
                           {viewMode === 'map' ? <><Icons.List /> Список</> : <><Icons.Map /> Карта</>}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
