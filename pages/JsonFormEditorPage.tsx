
import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '../i18n';
import type { MultiLangString } from '../types';
import Breadcrumbs from '../components/Breadcrumbs';
import DownloadIcon from '../components/icons/DownloadIcon';
import PlusIcon from '../components/icons/PlusIcon';
import TrashIcon from '../components/icons/TrashIcon';
import UploadIcon from '../components/icons/UploadIcon';
import ToggleSwitch from '../components/ToggleSwitch';
import StoreIcon from '../components/icons/StoreIcon';
import CameraIcon from '../components/icons/CameraIcon';
import ClockIcon from '../components/icons/ClockIcon';
import ChevronDownIcon from '../components/icons/ChevronDownIcon';
import ChevronUpIcon from '../components/icons/ChevronUpIcon';
import DocumentDuplicateIcon from '../components/icons/DocumentDuplicateIcon';
import SparklesIcon from '../components/icons/SparklesIcon';


// Helper to get a nested property from an object
const getNestedValue = (obj: any, path: string): any => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};


// Helper to set nested properties on an object immutably
const setNestedValue = (obj: any, path: string, value: any): any => {
    const keys = path.split('.');
    const newObj = JSON.parse(JSON.stringify(obj)); // Deep clone
    let current = newObj;

    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        const nextKey = keys[i+1];
        if (current[key] === undefined || current[key] === null) {
             // If the next key is a number, we are dealing with an array
            if (!isNaN(parseInt(nextKey, 10))) {
                 current[key] = [];
            } else {
                 current[key] = {};
            }
        }
        current = current[key];
    }
    current[keys[keys.length - 1]] = value;
    return newObj;
};

// Configuration for categories based on file name
const FILE_CATEGORY_MAP: { [key: string]: string[] } = {
    'accommodation.json': ['hoteli', 'apartmani', 'studija', 'vili', 'sobi'],
    'restaurants.json': ['restorani', 'picerii', 'brza-hrana', 'zdrava-ishrana'],
    'shopping.json': ['trgovski-centri', 'butici', 'obuvki', 'za-deca', 'supermarketi', 'apteki', 'benzinski-pumpi', 'domasni-proizvodi', 'piljari'],
    'zabava.json': ['kazina', 'klubovi', 'barovi', 'kafe-barovi'],
    'atrakcii.json': ['muzei', 'prirodni-ubavini', 'istoriski-lokaliteti'],
    'vinski-raj.json': ['so-degustacija', 'prodazba-na-vino'],
    'pomos.json': ['slep-sluzbi', 'avtomehanicari', 'vulkanizeri'],
    'prikazni.json': ['lokalni-prikazni', 'soveti-za-patuvanje', 'istorija', 'gastronomsko-iskustvo'],
    'events.json': ['music', 'culture', 'gastronomy', 'sport'],
    'gas-stations.json': ['benzinski-pumpi', 'avto-peralni', 'rent-a-car']
};

type LangOption = 'all' | 'mk' | 'en' | 'sr' | 'el';

const JsonFormEditorPage: React.FC = () => {
    const { t, language } = useTranslation();
    const lang = language as keyof MultiLangString;
    
    type EditorType = 'listings' | 'banners';
    const [activeEditor, setActiveEditor] = useState<EditorType>('listings');

    // State for Listings Editor
    const [selectedListingsFile, setSelectedListingsFile] = useState<string>('');
    const [listingsData, setListingsData] = useState<any[] | null>(null);
    const [listingsSchema, setListingsSchema] = useState<any | null>(null);
    const [isListingsDirty, setIsListingsDirty] = useState(false);
    const [isListingsLoading, setIsListingsLoading] = useState(false);
    const [listingsError, setListingsError] = useState<string | null>(null);
    const [allAccommodationAmenities, setAllAccommodationAmenities] = useState<string[]>([]);
    
    // State for Banners Editor
    const [bannersData, setBannersData] = useState<any[] | null>(null);
    const [bannersSchema, setBannersSchema] = useState<any | null>(null);
    const [isBannersDirty, setIsBannersDirty] = useState(false);
    const [isBannersLoading, setIsBannersLoading] = useState(false);
    const [bannersError, setBannersError] = useState<string | null>(null);

    // Shared state
    const [editingItem, setEditingItem] = useState<any | null>(null);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [useImagePaths, setUseImagePaths] = useState(true);
    
    // UI State for Modernization
    const [activeLangTab, setActiveLangTab] = useState<LangOption>('all');
    const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());

    const availableFiles = [
        'accommodation.json', 'restaurants.json', 'shopping.json', 'zabava.json', 
        'atrakcii.json', 'vinski-raj.json', 'pomos.json', 'ponudi.json', 
        'prikazni.json', 'events.json', 'photographers.json', 'shorts.json',
        'gas-stations.json'
    ];
    
    // Helper to create an empty object from a schema
    const createEmptyObject = (schema: any): any => {
        if (!schema) return {};
        const emptyObj: { [key: string]: any } = {};
        for (const key in schema) {
            const value = schema[key];
            
            // Special handling for currency in accommodation.json
            if (selectedListingsFile === 'accommodation.json' && key === 'currency') {
                emptyObj[key] = { mk: 'ден', en: '€', sr: '€', el: '€' };
                continue;
            }

            if (typeof value === 'string') emptyObj[key] = '';
            else if (typeof value === 'number') emptyObj[key] = 0;
            else if (typeof value === 'boolean') emptyObj[key] = true;
            else if (Array.isArray(value)) emptyObj[key] = [];
            else if (typeof value === 'object' && value !== null) {
                if (value.hasOwnProperty('mk') && value.hasOwnProperty('en')) { // Heuristic for MultiLangString
                    emptyObj[key] = { mk: '', en: '', sr: '', el: '' };
                } else {
                    emptyObj[key] = createEmptyObject(value);
                }
            } else {
                emptyObj[key] = null;
            }
        }
        // Ensure 'id' is unique for new entries if it exists in the schema
        if (schema.hasOwnProperty('id')) {
            emptyObj['id'] = `new-entry-${Date.now()}`;
        }
        return emptyObj;
    };
    
    // Fetch listings data
    useEffect(() => {
        if (!selectedListingsFile) {
            setListingsData(null);
            setListingsSchema(null);
            return;
        }
        const fetchData = async () => {
            setIsListingsLoading(true);
            setListingsError(null);
            try {
                const response = await fetch(`/data/${selectedListingsFile}`);
                if (!response.ok) throw new Error(`Failed to load ${selectedListingsFile}`);
                const data = await response.json();
                if (!Array.isArray(data)) throw new Error('JSON data is not an array.');
                setListingsData(data);
                
                if (data.length > 0 || ['restaurants.json', 'vinski-raj.json', 'gas-stations.json'].includes(selectedListingsFile)) {
                    // Generate Schema from Data
                    const generatedSchema = data.reduce((acc, currentItem) => {
                        const mergeKeys = (target: any, source: any) => {
                            Object.keys(source).forEach(key => {
                                const isObject = (item: any) => item && typeof item === 'object' && !Array.isArray(item);
                                if (!target.hasOwnProperty(key)) { target[key] = source[key]; } 
                                else if (isObject(target[key]) && isObject(source[key])) { mergeKeys(target[key], source[key]); }
                            });
                            return target;
                        };
                        return mergeKeys(acc, currentItem);
                    }, {});

                    // Patch Schema for Restaurants to include working_hours if missing
                    if (selectedListingsFile === 'restaurants.json') {
                        if (!generatedSchema.details) generatedSchema.details = {};
                        if (!generatedSchema.details.working_hours) {
                            generatedSchema.details.working_hours = { mk: '', en: '', sr: '', el: '' };
                        }
                    }

                    // Patch Schema for Wine Paradise to include details structure if missing
                    if (selectedListingsFile === 'vinski-raj.json') {
                        if (!generatedSchema.details) generatedSchema.details = {};
                        const requiredWineFields = ['wine_types', 'wine_tasting', 'food_offer', 'winery_tour'];
                        requiredWineFields.forEach(field => {
                            if (!generatedSchema.details[field]) {
                                generatedSchema.details[field] = { mk: '', en: '', sr: '', el: '' };
                            }
                        });
                    }

                    setListingsSchema(generatedSchema);

                    if (selectedListingsFile === 'accommodation.json') {
                        const amenitiesSet = new Set<string>();
                        data.forEach((acc: any) => {
                            if (acc.amenities && Array.isArray(acc.amenities)) {
                                acc.amenities.forEach((amenity: string) => amenitiesSet.add(amenity));
                            }
                        });
                        const predefinedAmenities = ["parking", "private_bathroom", "air_conditioning", "wifi", "pool", "spa_center", "tv_flat_screen", "pets_allowed", "family_rooms", "free_parking", "kitchen", "non_smoking_rooms", "balcony_terrace"];
                        const allAmenities = [...new Set([...predefinedAmenities, ...Array.from(amenitiesSet)])].sort();
                        setAllAccommodationAmenities(allAmenities);
                    } else {
                        setAllAccommodationAmenities([]);
                    }

                } else {
                    setListingsError(t('editor.emptyFileError'));
                    setListingsSchema(null);
                    setAllAccommodationAmenities([]);
                }
            } catch (err: any) { setListingsError(err.message); } 
            finally {
                setIsListingsLoading(false);
                setEditingItem(null);
                setEditingIndex(null);
                setIsListingsDirty(false);
                setCollapsedSections(new Set());
            }
        };
        fetchData();
    }, [selectedListingsFile, t]);
    
    // Fetch banners data
    useEffect(() => {
        const fetchBannersData = async () => {
            setIsBannersLoading(true);
            setBannersError(null);
            try {
                const response = await fetch(`/data/banners.json`);
                if (!response.ok) throw new Error(`Failed to load banners.json`);
                const data = await response.json();
                if (!Array.isArray(data)) throw new Error('Banners JSON data is not an array.');
                setBannersData(data);
                if (data.length > 0) {
                     const comprehensiveSchema = data.reduce((acc, currentItem) => {
                        const mergeKeys = (target: any, source: any) => {
                            Object.keys(source).forEach(key => {
                                const isObject = (item: any) => item && typeof item === 'object' && !Array.isArray(item);
                                if (!target.hasOwnProperty(key)) { target[key] = source[key]; } 
                                else if (isObject(target[key]) && isObject(source[key])) { mergeKeys(target[key], source[key]); }
                            });
                            return target;
                        };
                        return mergeKeys(acc, currentItem);
                    }, {});
                    setBannersSchema(comprehensiveSchema);
                } else {
                    setBannersError(t('editor.emptyFileError'));
                    setBannersSchema(null);
                }
            } catch (err: any) { setBannersError(err.message); } 
            finally { setIsBannersLoading(false); }
        };
        // Fetch only if tab is active and data is not already loaded
        if (activeEditor === 'banners' && !bannersData) {
            fetchBannersData();
        }
    }, [activeEditor, bannersData, t]);


    // Handlers
    const handleEdit = (item: any, index: number) => {
        setEditingItem(JSON.parse(JSON.stringify(item)));
        setEditingIndex(index);
        setCollapsedSections(new Set()); // Reset collapsed sections on open
    };

    const handleAddNew = () => {
        const schema = activeEditor === 'listings' ? listingsSchema : bannersSchema;
        if (!schema) return;
        setEditingItem(createEmptyObject(schema));
        setEditingIndex(-1);
        setCollapsedSections(new Set());
    };

    const handleDuplicate = (item: any) => {
        const newItem = JSON.parse(JSON.stringify(item));
        // Ensure a new unique ID
        if (newItem.id) {
            newItem.id = `${newItem.id}-copy-${Date.now().toString().slice(-4)}`;
        }
        if (newItem.title && typeof newItem.title === 'object') {
             newItem.title.mk = `${newItem.title.mk} (Copy)`;
             newItem.title.en = `${newItem.title.en} (Copy)`;
        }
        
        if (activeEditor === 'listings' && listingsData) {
            const newData = [newItem, ...listingsData];
            setListingsData(newData);
            setIsListingsDirty(true);
        } else if (activeEditor === 'banners' && bannersData) {
            const newData = [newItem, ...bannersData];
            setBannersData(newData);
            setIsBannersDirty(true);
        }
    };

    const handleSave = () => {
        if (!editingItem || editingIndex === null) return;
        if (activeEditor === 'listings') {
            const newData = [...(listingsData || [])];
            if (editingIndex === -1) newData.unshift(editingItem);
            else newData[editingIndex] = editingItem;
            setListingsData(newData);
            setIsListingsDirty(true);
        } else {
            const newData = [...(bannersData || [])];
            if (editingIndex === -1) newData.unshift(editingItem);
            else newData[editingIndex] = editingItem;
            setBannersData(newData);
            setIsBannersDirty(true);
        }
        setEditingItem(null);
        setEditingIndex(null);
    };
    
    const handleDelete = (index: number) => {
        if (!window.confirm(t('editor.confirmDelete'))) return;
        if (activeEditor === 'listings' && listingsData) {
            setListingsData(listingsData.filter((_, i) => i !== index));
            setIsListingsDirty(true);
        } else if (activeEditor === 'banners' && bannersData) {
            setBannersData(bannersData.filter((_, i) => i !== index));
            setIsBannersDirty(true);
        }
    };

    const handleDownload = () => {
        const data = activeEditor === 'listings' ? listingsData : bannersData;
        const filename = activeEditor === 'listings' ? selectedListingsFile : 'banners.json';
        if (!data || !filename) return;
        const blob: globalThis.Blob = new window.Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        if (activeEditor === 'listings') setIsListingsDirty(false);
        else setIsBannersDirty(false);
    };

    const handleFormChange = useCallback((path: string, value: any) => {
        setEditingItem((prev: any) => setNestedValue(prev, path, value));
    }, []);

    const toggleSection = (path: string) => {
        const newSet = new Set(collapsedSections);
        if (newSet.has(path)) {
            newSet.delete(path);
        } else {
            newSet.add(path);
        }
        setCollapsedSections(newSet);
    };

    const moveArrayItem = (path: string, currentIndex: number, direction: 'up' | 'down') => {
        const items = getNestedValue(editingItem, path);
        if (!Array.isArray(items)) return;
        
        const newItems = [...items];
        const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
        
        if (targetIndex < 0 || targetIndex >= newItems.length) return;
        
        [newItems[currentIndex], newItems[targetIndex]] = [newItems[targetIndex], newItems[currentIndex]];
        handleFormChange(path, newItems);
    };

    const handleImageUpload = useCallback((path: string, e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        Array.from(e.target.files).forEach(file => {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    setEditingItem((prev: any) => {
                        const currentImages = getNestedValue(prev, path) || [];
                        return setNestedValue(prev, path, [...currentImages, event.target!.result]);
                    });
                }
            };
            reader.readAsDataURL(file as globalThis.Blob);
        });
    }, []);
    
    const handleSingleImageUpload = useCallback((path: string, e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            if (event.target?.result) handleFormChange(path, event.target.result);
        };
        reader.readAsDataURL(e.target.files[0] as globalThis.Blob);
    }, [handleFormChange]);

    const injectAccommodationTemplate = (path: string, langKey: string) => {
        const templates: {[key: string]: string} = {
            mk: `[Краток вовед...]\n\n✨ Корисни информации\n◆ Check-in: Од 14:00\n◆ Check-out: До 11:00\n◆ Клуч: Во договор со домаќинот\n◆ Плаќање: На лице место\n\n[Детален опис...]`,
            en: `[Short intro...]\n\n✨ Useful information\n◆ Check-in: From 14:00\n◆ Check-out: By 11:00\n◆ Key: Arranged with the host\n◆ Payment: On site\n\n[Detailed description...]`,
            sr: `[Kratak uvod...]\n\n✨ Korisne informacije\n◆ Check-in: Od 14:00\n◆ Check-out: Do 11:00\n◆ Ključ: U dogovoru sa domaćinom\n◆ Plaćanje: Na licu mesta\n\n[Detaljan opis...]`,
            el: `[Σύντομη εισαγωγή...]\n\n✨ Χρήσιμες πληροφορίες\n◆ Check-in: Από 14:00\n◆ Check-out: Μέχρι 11:00\n◆ Παραλαβή κλειδιών: Κατόπιν συνεννόησης με τον οικοδεσπότη\n◆ Πληρωμή: Επιτόπου\n\n[Λεπτομερής περιγραφή...]`
        };
        const template = templates[langKey] || templates['en'];
        handleFormChange(path, template);
    };

    const injectRestaurantDescTemplate = (path: string, langKey: string) => {
        const templates: {[key: string]: string} = {
            mk: `[Краток вовед...]\n\n✨ Корисни информации\n◆ Кујна: Пици / Скара\n◆ Амбиент: Модерно / Cozy\n◆ Погодности: Паркинг / Картички\n◆ Цена: €€ Средна цена\n\n[Детален опис...]`,
            en: `[Short intro...]\n\n✨ Useful information\n◆ Cuisine: Pizza / Grill\n◆ Ambiance: Modern / Cozy\n◆ Amenities: Parking / Cards\n◆ Price: €€ Moderate\n\n[Detailed description...]`,
            sr: `[Kratak uvod...]\n\n✨ Korisne informacije\n◆ Kuhinja: Pice / Roštilj\n◆ Ambijent: Moderno / Prijatno\n◆ Pogodnosti: Parking / Kartice\n◆ Cena: €€ Srednja cena\n\n[Detaljan opis...]`,
            el: `[Σύντομη εισαγωγή...]\n\n✨ Χρήσιμες πληροφορίες\n◆ Κουζίνα: Πίτσα / Ψητά\n◆ Ατμόσφαιρα: Μοντέρνα / Ζεστή\n◆ Παροχές: Πάρκινγκ / Κάρτες\n◆ Τιμή: €€ Μέτρια\n\n[Λεπτομερής περιγραφή...]`
        };
        const template = templates[langKey] || templates['en'];
        handleFormChange(path, template);
    };

    const injectRestaurantScheduleTemplate = (path: string, langKey: string) => {
        const templates: {[key: string]: string} = {
            mk: `Понеделник - Петок: 09:00 - 23:00\nСабота: 09:00 - 01:00\nНедела: 10:00 - 22:00`,
            en: `Monday - Friday: 09:00 - 23:00\nSaturday: 09:00 - 01:00\nSunday: 10:00 - 22:00`,
            sr: `Ponedeljak - Petak: 09:00 - 23:00\nSubota: 09:00 - 01:00\nNedelja: 10:00 - 22:00`,
            el: `Δευτέρα - Παρασκευή: 09:00 - 23:00\nΣάββατο: 09:00 - 01:00\nΚυριακή: 10:00 - 22:00`
        };
        const template = templates[langKey] || templates['en'];
        handleFormChange(path, template);
    };

    const renderFormField = useCallback((key: string, value: any, path: string): React.ReactNode => {
        const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
        const imageArrayKeys = ['images', 'gallery'];
        const singleImageKeys = ['image', 'authorAvatar', 'portraitImage'];
        const imageOnlyInfoSlidesFiles = ['restaurants.json', 'shopping.json', 'zabava.json', 'vinski-raj.json', 'gas-stations.json'];

        // SMART CATEGORY SELECTOR
        if (key === 'category' && selectedListingsFile && FILE_CATEGORY_MAP[selectedListingsFile]) {
            return (
                <div key={path} className="col-span-1">
                    <label htmlFor={path} className="block text-sm font-bold text-brand-accent dark:text-orange-400 mb-1">{label}</label>
                    <select
                        id={path}
                        className="mt-1 w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-brand-accent focus:border-brand-accent"
                        value={getNestedValue(editingItem, path) || ''}
                        onChange={(e) => handleFormChange(path, e.target.value)}
                    >
                        <option value="">{t('editor.pleaseSelect')}</option>
                        {FILE_CATEGORY_MAP[selectedListingsFile].map(cat => (
                            <option key={cat} value={cat}>
                                {cat} ({t(`categories.${cat}`)})
                            </option>
                        ))}
                    </select>
                </div>
            );
        }

        if (key === 'amenities' && selectedListingsFile === 'accommodation.json' && allAccommodationAmenities.length > 0) {
            const currentAmenities: string[] = getNestedValue(editingItem, path) || [];

            const handleAmenityChange = (amenityKey: string, isChecked: boolean) => {
                const newAmenities = isChecked
                    ? [...currentAmenities, amenityKey]
                    : currentAmenities.filter((a: string) => a !== amenityKey);
                handleFormChange(path, newAmenities.sort()); // Sort for consistency
            };

            const isCollapsed = collapsedSections.has(path);

            return (
                <div key={path} className="col-span-full border dark:border-gray-700 rounded-md overflow-hidden">
                    <div 
                        className="bg-gray-100 dark:bg-gray-800 p-3 flex justify-between items-center cursor-pointer select-none"
                        onClick={() => toggleSection(path)}
                    >
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            {label} <span className="bg-brand-accent text-white text-xs px-2 py-0.5 rounded-full">{currentAmenities.length}</span>
                        </label>
                        {isCollapsed ? <ChevronDownIcon className="w-5 h-5"/> : <ChevronUpIcon className="w-5 h-5"/>}
                    </div>
                    {!isCollapsed && (
                        <div className="p-4 bg-white dark:bg-gray-900">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {allAccommodationAmenities.map(amenityKey => (
                                    <label key={amenityKey} className="flex items-center space-x-2 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={currentAmenities.includes(amenityKey)}
                                            onChange={(e) => handleAmenityChange(amenityKey, e.target.checked)}
                                            className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-brand-accent focus:ring-brand-accent focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 dark:bg-gray-700"
                                        />
                                        <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-brand-accent dark:group-hover:text-orange-300 transition-colors capitalize">
                                            {t(`amenities.${amenityKey}`, { default: amenityKey.replace(/_/g, ' ') })}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            );
        }
        
        if (key === 'locationUrl') {
            return (
                <div key={path} className="col-span-full">
                    <label htmlFor={path} className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{label}</label>
                    <input
                        id={path}
                        type="url"
                        className="mt-1 w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-brand-accent focus:border-brand-accent"
                        value={getNestedValue(editingItem, path) ?? ''}
                        onChange={(e) => handleFormChange(path, e.target.value)}
                        placeholder="https://www.google.com/maps/search/?api=1&query=..."
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('editor.locationUrlHelp')}</p>
                </div>
            );
        }

        // --- IMAGE FIELDS ---
        if (imageArrayKeys.includes(key) || (Array.isArray(value) && key.toLowerCase().includes('images'))) {
            const images = getNestedValue(editingItem, path) || [];
            const isCollapsed = collapsedSections.has(path);

            return (
                <div key={path} className="col-span-full border dark:border-gray-700 rounded-md overflow-hidden">
                     <div 
                        className="bg-gray-100 dark:bg-gray-800 p-3 flex justify-between items-center cursor-pointer select-none"
                        onClick={() => toggleSection(path)}
                    >
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            <CameraIcon className="w-5 h-5" /> {label} <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">{images.length}</span>
                        </label>
                        {isCollapsed ? <ChevronDownIcon className="w-5 h-5"/> : <ChevronUpIcon className="w-5 h-5"/>}
                    </div>
                    
                    {!isCollapsed && (
                        <div className="p-4 bg-white dark:bg-gray-900">
                            {useImagePaths ? (
                                <div className="space-y-2">
                                    {images.map((img: string, index: number) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <div className="flex flex-col">
                                                <button 
                                                    onClick={() => moveArrayItem(path, index, 'up')} 
                                                    disabled={index === 0}
                                                    className="p-1 text-gray-500 hover:text-brand-accent disabled:opacity-30"
                                                >
                                                    <ChevronUpIcon className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => moveArrayItem(path, index, 'down')} 
                                                    disabled={index === images.length - 1}
                                                    className="p-1 text-gray-500 hover:text-brand-accent disabled:opacity-30"
                                                >
                                                    <ChevronDownIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <input type="text" value={img} onChange={(e) => handleFormChange(path, images.map((item: string, i: number) => i === index ? e.target.value : item))} className="flex-grow p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-brand-accent focus:border-brand-accent" placeholder="e.g., /images/my-image.jpg"/>
                                            {(img.startsWith('/') || img.startsWith('http')) && <img src={img} alt="Preview" className="w-12 h-12 object-cover rounded flex-shrink-0 border dark:border-gray-600"/>}
                                            <button onClick={() => handleFormChange(path, images.filter((_: any, i: number) => i !== index))} className="text-red-500 hover:text-red-700 p-2"><TrashIcon className="w-5 h-5"/></button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                                        {images.map((img: string, index: number) => (
                                            <div key={index} className="relative group border rounded-md p-1">
                                                <img src={img} alt={`Preview ${index}`} className="w-full h-24 object-cover rounded-md"/>
                                                <button onClick={() => handleFormChange(path, images.filter((_: any, i: number) => i !== index))} className="absolute top-1 right-1 bg-red-600/80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"><TrashIcon className="w-4 h-4" /></button>
                                            </div>
                                        ))}
                                    </div>
                                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-50">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <UploadIcon className="w-8 h-8 mb-3 text-gray-400" />
                                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">{t('editor.clickToUpload')}</span></p>
                                        </div>
                                        <input type="file" className="hidden" multiple accept="image/*" onChange={(e) => handleImageUpload(path, e)} />
                                    </label>
                                </div>
                            )}
                            {useImagePaths && (
                                <button onClick={() => handleFormChange(path, [...images, ''])} className="mt-4 flex items-center gap-2 text-sm bg-blue-500 text-white font-semibold py-2 px-3 rounded-lg hover:bg-blue-600"><PlusIcon className="w-4 h-4"/>{t('editor.addPath')}</button>
                            )}
                        </div>
                    )}
                </div>
            );
        }

        if (singleImageKeys.includes(key) && typeof value === 'string') {
             const currentVal = getNestedValue(editingItem, path) || '';
             if (useImagePaths) {
                return <div key={path} className="col-span-1"><label htmlFor={path} className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{label}</label><div className="flex gap-2"><input id={path} type="text" className="flex-grow p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600" value={currentVal} onChange={(e) => handleFormChange(path, e.target.value)} placeholder="e.g., /images/avatar.jpg"/>{currentVal && <img src={currentVal} className="w-10 h-10 rounded object-cover border"/>}</div></div>
             } else {
                return <div key={path} className="col-span-1"><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{label}</label>{currentVal ? <div className="relative group w-32 h-32"><img src={currentVal} alt="Preview" className="w-full h-full object-cover rounded-md"/><button onClick={() => handleFormChange(path, '')} className="absolute top-1 right-1 bg-red-600/80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"><TrashIcon className="w-4 h-4"/></button></div> : <label className="flex items-center justify-center w-32 h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-600"><UploadIcon className="w-8 h-8 text-gray-400"/> <input type="file" className="hidden" accept="image/*" onChange={(e) => handleSingleImageUpload(path, e)} /></label>}</div>
             }
        }

        if (key === 'mapSrc') {
            const handleMapSrcChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
                const pastedText = e.target.value;
                const match = pastedText.match(/<iframe[^>]+src="([^"]+)"/);
                handleFormChange(path, (match && match[1]) ? match[1] : pastedText);
            };
            return <div key={path} className="col-span-full"><label htmlFor={path} className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{label}</label><textarea id={path} className="mt-1 w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-brand-accent focus:border-brand-accent font-mono text-sm" value={getNestedValue(editingItem, path) || ''} onChange={handleMapSrcChange} rows={5} placeholder={t('editor.pasteMapEmbedHelp')}/><p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('editor.pasteMapEmbedHelpDetail')}</p></div>;
        }

        // --- MULTILANGUAGE FIELDS ---
        if (typeof value === 'object' && value !== null && !Array.isArray(value) && value.hasOwnProperty('mk') && value.hasOwnProperty('en')) {
            const currentVal = getNestedValue(editingItem, path) || { mk: '', en: '', sr: '', el: '' };
            
            // Special handling for 'working_hours' (generic single input)
            // But if it's restaurants.json, we want Multilang for the schedule
            if (key === 'working_hours' && selectedListingsFile !== 'restaurants.json') {
                 return (
                    <div key={path} className="col-span-full p-4 border dark:border-gray-700 rounded-md bg-blue-50/30 dark:bg-blue-900/10">
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                            <ClockIcon className="w-4 h-4 text-brand-accent"/>
                            {label}
                        </label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded-md bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-brand-accent focus:border-brand-accent"
                            value={currentVal.mk || ''} // Use MK as source of truth
                            onChange={(e) => {
                                const val = e.target.value;
                                handleFormChange(path, { mk: val, en: val, sr: val, el: val });
                            }}
                            placeholder="e.g. 08:00 - 22:00"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Automatically applies to all languages (MK, EN, SR, EL).
                        </p>
                    </div>
                );
            }
            
            // Modern Multi-Lang Display using Global Tab State
            const langsToShow = activeLangTab === 'all' ? ['mk', 'en', 'sr', 'el'] : [activeLangTab];

            return (
                <div key={path} className="col-span-full p-3 border dark:border-gray-700 rounded-md bg-white dark:bg-gray-900">
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">{label}</label>
                        {/* Templates for Restaurants */}
                        {selectedListingsFile === 'restaurants.json' && key === 'description' && (
                            <button 
                                onClick={() => injectRestaurantDescTemplate(`${path}.${activeLangTab === 'all' ? 'mk' : activeLangTab}`, activeLangTab === 'all' ? 'mk' : activeLangTab)}
                                className="text-xs flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                                title="Insert Restaurant Info Template"
                            >
                                <SparklesIcon className="w-3 h-3" /> Info Template
                            </button>
                        )}
                        {selectedListingsFile === 'restaurants.json' && key === 'working_hours' && (
                            <button 
                                onClick={() => injectRestaurantScheduleTemplate(`${path}.${activeLangTab === 'all' ? 'mk' : activeLangTab}`, activeLangTab === 'all' ? 'mk' : activeLangTab)}
                                className="text-xs flex items-center gap-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                                title="Insert Schedule Template"
                            >
                                <ClockIcon className="w-3 h-3" /> Schedule Template
                            </button>
                        )}
                        {/* Template for Accommodation */}
                        {selectedListingsFile === 'accommodation.json' && key === 'description' && (
                            <button 
                                onClick={() => injectAccommodationTemplate(`${path}.${activeLangTab === 'all' ? 'mk' : activeLangTab}`, activeLangTab === 'all' ? 'mk' : activeLangTab)}
                                className="text-xs flex items-center gap-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
                                title="Insert standardized Info Grid template"
                            >
                                <SparklesIcon className="w-3 h-3" /> Insert Template
                            </button>
                        )}
                    </div>
                    <div className={`grid gap-3 ${activeLangTab === 'all' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
                        {langsToShow.map(langKey => (
                            <div key={langKey}>
                                <div className="flex items-center justify-between mb-1">
                                    <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">{langKey}</label>
                                    {activeLangTab === 'all' && (
                                        <div className="flex items-center gap-2">
                                            {selectedListingsFile === 'accommodation.json' && key === 'description' && (
                                                <button 
                                                    onClick={() => injectAccommodationTemplate(`${path}.${langKey}`, langKey)}
                                                    className="text-[10px] text-purple-600 hover:underline"
                                                >
                                                    + Template
                                                </button>
                                            )}
                                            {selectedListingsFile === 'restaurants.json' && key === 'description' && (
                                                <button 
                                                    onClick={() => injectRestaurantDescTemplate(`${path}.${langKey}`, langKey)}
                                                    className="text-[10px] text-green-600 hover:underline"
                                                >
                                                    + Info
                                                </button>
                                            )}
                                            {selectedListingsFile === 'restaurants.json' && key === 'working_hours' && (
                                                <button 
                                                    onClick={() => injectRestaurantScheduleTemplate(`${path}.${langKey}`, langKey)}
                                                    className="text-[10px] text-blue-600 hover:underline"
                                                >
                                                    + Schedule
                                                </button>
                                            )}
                                            <span className="text-[10px] text-gray-400">{langKey.toUpperCase()}</span>
                                        </div>
                                    )}
                                </div>
                                <textarea 
                                    className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-800 dark:border-gray-600 focus:ring-brand-accent focus:border-brand-accent text-sm font-mono" 
                                    value={currentVal[langKey] || ''} 
                                    onChange={(e) => handleFormChange(`${path}.${langKey}`, e.target.value)} 
                                    rows={key === 'working_hours' ? 4 : (key === 'fullContent' ? 15 : (key === 'description' || key === 'content' || key === 'bio' ? 6 : 1))}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
        
        const arrayFieldKeys = ['infoSlides', 'roomGalleries', 'photoGalleries'];
        if (arrayFieldKeys.includes(key)) {
            const items = getNestedValue(editingItem, path) || [];
            const isCollapsed = collapsedSections.has(path);

            // Special handling for infoSlides in specific sections: NO TEXT, IMAGE ONLY
            if (key === 'infoSlides' && imageOnlyInfoSlidesFiles.includes(selectedListingsFile)) {
                return (
                    <div key={path} className="col-span-full border dark:border-gray-700 rounded-lg overflow-hidden">
                        <div 
                            className="bg-gray-100 dark:bg-gray-800 p-3 flex justify-between items-center cursor-pointer select-none"
                            onClick={() => toggleSection(path)}
                        >
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">{label} (Quick View Images) <span className="bg-gray-300 text-gray-800 text-xs px-2 py-0.5 rounded-full">{items.length}</span></label>
                            {isCollapsed ? <ChevronDownIcon className="w-5 h-5"/> : <ChevronUpIcon className="w-5 h-5"/>}
                        </div>
                        
                        {!isCollapsed && (
                            <div className="p-4 bg-white dark:bg-gray-900">
                                <div className="space-y-2">
                                    {items.map((item: any, index: number) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <div className="flex flex-col">
                                                <button onClick={() => moveArrayItem(path, index, 'up')} disabled={index === 0} className="p-1 text-gray-500 hover:text-brand-accent disabled:opacity-30"><ChevronUpIcon className="w-4 h-4"/></button>
                                                <button onClick={() => moveArrayItem(path, index, 'down')} disabled={index === items.length - 1} className="p-1 text-gray-500 hover:text-brand-accent disabled:opacity-30"><ChevronDownIcon className="w-4 h-4"/></button>
                                            </div>
                                            <input 
                                                type="text" 
                                                value={item.image || ''} 
                                                onChange={(e) => {
                                                    const newItems = [...items];
                                                    newItems[index] = { image: e.target.value };
                                                    handleFormChange(path, newItems);
                                                }}
                                                className="flex-grow p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-brand-accent focus:border-brand-accent"
                                                placeholder="e.g., /images/slider/my-image.webp"
                                            />
                                            {(item.image && (item.image.startsWith('/') || item.image.startsWith('http'))) && <img src={item.image} alt="Preview" className="w-10 h-10 object-cover rounded flex-shrink-0"/>}
                                            <button onClick={() => handleFormChange(path, items.filter((_: any, i: number) => i !== index))} className="text-red-500 hover:text-red-700 p-2"><TrashIcon className="w-5 h-5"/></button>
                                        </div>
                                    ))}
                                </div>
                                <button onClick={() => handleFormChange(path, [...items, { image: '' }])} className="mt-4 flex items-center gap-2 text-sm bg-blue-500 text-white font-semibold py-2 px-3 rounded-lg hover:bg-blue-600"><PlusIcon className="w-4 h-4"/>{t('editor.addPath')}</button>
                            </div>
                        )}
                    </div>
                );
            }

            // For Accommodation infoSlides (Image + Text) and other galleries
            const emptyItem = key === 'infoSlides' 
                ? { image: '', text: { mk: '', en: '', sr: '', el: '' } } 
                : { title: { mk: '', en: '', sr: '', el: '' }, images: [] as string[] };
            const titleField = key === 'infoSlides' ? 'text' : 'title';
            const imageField = key === 'infoSlides' ? 'image' : 'images';
            
            return (
                <div key={path} className="col-span-full border dark:border-gray-700 rounded-lg overflow-hidden">
                    <div 
                        className="bg-gray-100 dark:bg-gray-800 p-3 flex justify-between items-center cursor-pointer select-none"
                        onClick={() => toggleSection(path)}
                    >
                        <label className="text-sm font-bold text-brand-text dark:text-gray-200">{label} <span className="bg-gray-300 text-gray-800 text-xs px-2 py-0.5 rounded-full">{items.length}</span></label>
                        {isCollapsed ? <ChevronDownIcon className="w-5 h-5"/> : <ChevronUpIcon className="w-5 h-5"/>}
                    </div>

                    {!isCollapsed && (
                        <div className="p-4 bg-white dark:bg-gray-900 space-y-4">
                            {items.map((item: any, index: number) => (
                                <div key={index} className="p-4 border dark:border-gray-600 rounded-md relative bg-gray-50 dark:bg-gray-800">
                                    <div className="absolute top-2 right-2 flex gap-2">
                                        <button onClick={() => moveArrayItem(path, index, 'up')} disabled={index === 0} className="p-1 text-gray-500 hover:text-brand-accent disabled:opacity-30"><ChevronUpIcon className="w-4 h-4"/></button>
                                        <button onClick={() => moveArrayItem(path, index, 'down')} disabled={index === items.length - 1} className="p-1 text-gray-500 hover:text-brand-accent disabled:opacity-30"><ChevronDownIcon className="w-4 h-4"/></button>
                                        <button onClick={() => handleFormChange(path, items.filter((_: any, i: number) => i !== index))} className="text-red-500 hover:text-red-700 p-1"><TrashIcon className="w-4 h-4"/></button>
                                    </div>
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
                                        <div className="lg:col-span-2">{renderFormField(imageField, item[imageField], `${path}.${index}.${imageField}`)}</div>
                                        <div className="lg:col-span-1">{renderFormField(titleField, item[titleField], `${path}.${index}.${titleField}`)}</div>
                                    </div>
                                </div>
                            ))}
                            <button onClick={() => handleFormChange(path, [...items, emptyItem])} className="mt-4 flex items-center gap-2 bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600"><PlusIcon className="w-5 h-5"/>{t('editor.addNew')}</button>
                        </div>
                    )}
                </div>
            );
        }

        if (typeof value === 'boolean') {
            return (
                <div key={path} className="col-span-1 flex items-center gap-4 pt-2 p-3 border rounded-md bg-white dark:bg-gray-800 dark:border-gray-700">
                    <label htmlFor={path} className="text-sm font-bold text-gray-700 dark:text-gray-300 flex-grow">{label}</label>
                    <ToggleSwitch
                        id={path}
                        label=""
                        checked={getNestedValue(editingItem, path) ?? false}
                        onChange={(checked) => handleFormChange(path, checked)}
                    />
                </div>
            );
        }
        
        if (Array.isArray(value) && value.every((i: any) => typeof i === 'string')) {
             const items = getNestedValue(editingItem, path) || [];
             const isCollapsed = collapsedSections.has(path);

            return (
                 <div key={path} className="col-span-full border dark:border-gray-700 rounded-md overflow-hidden">
                     <div 
                        className="bg-gray-100 dark:bg-gray-800 p-3 flex justify-between items-center cursor-pointer select-none"
                        onClick={() => toggleSection(path)}
                    >
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">{label} <span className="bg-gray-300 text-gray-800 text-xs px-2 py-0.5 rounded-full">{items.length}</span></label>
                        {isCollapsed ? <ChevronDownIcon className="w-5 h-5"/> : <ChevronUpIcon className="w-5 h-5"/>}
                    </div>
                     {!isCollapsed && (
                         <div className="p-4 bg-white dark:bg-gray-900">
                             <div className="flex flex-wrap gap-2">
                                {items.map((item: string, index: number) => (
                                    <div key={index} className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1 border dark:border-gray-600">
                                        <span className="text-sm">{item}</span>
                                        <button onClick={() => handleFormChange(path, items.filter((_: any, i: number) => i !== index))} className="text-gray-500 hover:text-red-500"><TrashIcon className="w-4 h-4"/></button>
                                    </div>
                                ))}
                             </div>
                             <form onSubmit={(e) => { e.preventDefault(); const input = e.currentTarget.elements.namedItem('newItem') as HTMLInputElement; if(input.value) { handleFormChange(path, [...items, input.value]); input.value = ''; } }} className="mt-4 flex items-center gap-2">
                                <input name="newItem" type="text" className="flex-grow p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600" placeholder={t('editor.addNewItem')}/>
                                <button type="submit" className="bg-blue-500 text-white font-semibold py-2 px-3 rounded-lg hover:bg-blue-600">{t('editor.add')}</button>
                             </form>
                         </div>
                     )}
                 </div>
            );
        }

        // Generic Object (Collapsible)
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            const isCollapsed = collapsedSections.has(path);
            // Default to collapsed for contact/details to save space unless it's the root
            const isRoot = !path.includes('.');
            
            return (
                <div key={path} className="col-span-full border dark:border-gray-700 rounded-lg overflow-hidden shadow-sm">
                    <div 
                        className="bg-gray-100 dark:bg-gray-800 p-3 flex justify-between items-center cursor-pointer select-none hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => toggleSection(path)}
                    >
                        <h4 className="text-sm font-bold text-brand-text dark:text-gray-200 uppercase tracking-wider">{label}</h4>
                        {isCollapsed ? <ChevronDownIcon className="w-5 h-5 text-gray-500"/> : <ChevronUpIcon className="w-5 h-5 text-gray-500"/>}
                    </div>
                    {!isCollapsed && (
                        <div className="p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-4 bg-white dark:bg-gray-900 border-t dark:border-gray-700">
                            {Object.entries(value).map(([subKey, subValue]) => renderFormField(subKey, subValue, `${path}.${subKey}`))}
                        </div>
                    )}
                </div>
            );
        }

        return (
            <div key={path} className="col-span-1">
                <label htmlFor={path} className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{label}</label>
                <input
                    id={path}
                    type={typeof value === 'number' ? 'number' : 'text'}
                    className="mt-1 w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-brand-accent focus:border-brand-accent"
                    value={getNestedValue(editingItem, path) ?? ''}
                    onChange={(e) => handleFormChange(path, typeof value === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
                />
            </div>
        );
    }, [editingItem, handleFormChange, handleImageUpload, handleSingleImageUpload, t, useImagePaths, selectedListingsFile, allAccommodationAmenities, activeLangTab, collapsedSections]);
    
    // UI Components
    const EditorTabs: React.FC = () => (
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
             <button onClick={() => setActiveEditor('listings')} className={`px-4 py-2 text-sm font-semibold transition-colors ${activeEditor === 'listings' ? 'border-b-2 border-brand-accent text-brand-accent' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}>{t('editor.businessListings')}</button>
             <button onClick={() => setActiveEditor('banners')} className={`px-4 py-2 text-sm font-semibold transition-colors ${activeEditor === 'banners' ? 'border-b-2 border-brand-accent text-brand-accent' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}>{t('editor.banners')}</button>
        </div>
    );
    
    const ListingsEditor: React.FC = () => (
        <div>
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border dark:border-gray-700">
                <select value={selectedListingsFile} onChange={(e) => setSelectedListingsFile(e.target.value)} className="w-full sm:w-auto flex-grow p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-brand-accent">
                    <option value="">{t('editor.selectFile')}</option>
                    {availableFiles.map(file => <option key={file} value={file}>{file}</option>)}
                </select>
                <div className="flex gap-2 w-full sm:w-auto">
                    {selectedListingsFile && listingsData && listingsSchema && <button onClick={handleAddNew} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600 whitespace-nowrap"><PlusIcon className="w-5 h-5"/> {t('editor.addNew')}</button>}
                    {selectedListingsFile && listingsData && isListingsDirty && <button onClick={handleDownload} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 whitespace-nowrap"><DownloadIcon className="w-5 h-5"/> {t('editor.downloadFile')}</button>}
                </div>
            </div>
            {isListingsLoading && <p className="text-center text-gray-500 animate-pulse">{t('editor.loading')}</p>}
            {listingsError && <p className="text-red-500 bg-red-50 p-4 rounded-md border border-red-200">{listingsError}</p>}
            {listingsData && (
                <div className="grid grid-cols-1 gap-4">
                    {listingsData.map((item, index) => (
                        <div key={item.id || index} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-4 mb-3 sm:mb-0">
                                {item.images && item.images.length > 0 && (
                                    <img src={item.images[0]} className="w-12 h-12 rounded object-cover bg-gray-200" alt="" />
                                )}
                                <div>
                                    <span className="font-bold text-brand-text dark:text-gray-200 block">{item.title?.[lang] || item.name?.[lang] || item.id}</span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">{item.category}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 self-end sm:self-auto">
                                <button onClick={() => handleDuplicate(item)} className="text-gray-500 hover:text-brand-accent p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700" title="Duplicate"><DocumentDuplicateIcon className="w-5 h-5"/></button>
                                <button onClick={() => handleEdit(item, index)} className="text-blue-500 hover:text-blue-700 font-semibold px-3 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20">{t('editor.edit')}</button>
                                <button onClick={() => handleDelete(index)} className="text-red-500 hover:text-red-700 font-semibold px-3 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"><TrashIcon className="w-5 h-5"/></button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    const BannersEditor: React.FC = () => (
         <div>
            <div className="flex items-center gap-4 mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border dark:border-gray-700">
                <div className="flex-grow font-bold text-gray-700 dark:text-gray-300">Banners Configuration</div>
                {bannersData && bannersSchema && <button onClick={handleAddNew} className="flex items-center gap-2 bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600"><PlusIcon className="w-5 h-5"/> {t('editor.addNew')}</button>}
                {bannersData && isBannersDirty && <button onClick={handleDownload} className="flex items-center gap-2 bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600"><DownloadIcon className="w-5 h-5"/> {t('editor.downloadFile')}</button>}
            </div>
            {isBannersLoading && <p className="text-center text-gray-500">{t('editor.loading')}</p>}
            {bannersError && <p className="text-red-500">{bannersError}</p>}
            {bannersData && (
                <ul className="space-y-2">
                    {bannersData.map((item, index) => (
                        <li key={item.id || index} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                            <div className="flex items-center gap-4">
                                {item.content?.image?.mobile && <img src={item.content.image.mobile} className="w-16 h-10 object-cover rounded" alt="" />}
                                <span className="font-semibold text-brand-text dark:text-gray-200">{item.content?.title?.[lang] || item.id}</span>
                            </div>
                             <div className="flex items-center gap-2">
                                <button onClick={() => handleDuplicate(item)} className="text-gray-500 hover:text-brand-accent p-2" title="Duplicate"><DocumentDuplicateIcon className="w-5 h-5"/></button>
                                <button onClick={() => handleEdit(item, index)} className="text-blue-500 hover:text-blue-700 font-semibold px-3 py-1">{t('editor.edit')}</button>
                                <button onClick={() => handleDelete(index)} className="text-red-500 hover:text-red-700 font-semibold px-3 py-1"><TrashIcon className="w-5 h-5"/></button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
    
    return (
        <>
            <Breadcrumbs />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <h1 className="text-3xl md:text-4xl font-serif font-black text-brand-text dark:text-gray-100 mb-6">{t('editor.title')}</h1>

                <div className="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 p-4 rounded-r-lg mb-8">
                    <h2 className="font-bold text-yellow-800 dark:text-yellow-200">{t('editor.warningTitle', {default: 'Important Notice'})}</h2>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">{t('editor.warningText', {default: 'Changes made here are not automatically saved. You must download the updated JSON file and manually replace it in the /public/data/ folder of the project.'})}</p>
                </div>
                
                <EditorTabs />

                {activeEditor === 'listings' ? <ListingsEditor /> : <BannersEditor />}
                
                {/* Form Modal */}
                {editingItem && (
                    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setEditingItem(null)}>
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-[95vw] h-[95vh] flex flex-col animate-slide-up overflow-hidden" onClick={e => e.stopPropagation()}>
                            {/* Modal Header */}
                            <div className="flex flex-col border-b dark:border-gray-700 flex-shrink-0 bg-gray-50 dark:bg-gray-900">
                                <div className="flex items-center justify-between p-4">
                                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">{editingIndex === -1 ? t('editor.addNew') : t('editor.edit')}</h2>
                                    <button onClick={() => setEditingItem(null)} className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">&times;</button>
                                </div>
                                
                                {/* Language Switcher Toolbar */}
                                <div className="flex items-center gap-1 px-4 pb-3 overflow-x-auto hide-scrollbar">
                                    <span className="text-xs font-bold text-gray-500 uppercase mr-2">Editing Lang:</span>
                                    {(['all', 'mk', 'en', 'sr', 'el'] as LangOption[]).map(l => (
                                        <button
                                            key={l}
                                            onClick={() => setActiveLangTab(l)}
                                            className={`px-3 py-1 text-xs font-bold rounded-full transition-colors uppercase ${activeLangTab === l ? 'bg-brand-accent text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300'}`}
                                        >
                                            {l}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 overflow-y-auto flex-grow custom-scrollbar">
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-6">
                                     <div className="col-span-full flex items-center justify-end gap-4 p-3 border dark:border-gray-700 rounded-md bg-blue-50/50 dark:bg-gray-900/50 mb-4">
                                         <label htmlFor="image-mode" className="text-sm font-semibold flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                             <CameraIcon className="w-5 h-5" /> {t('editor.useImagePaths')}
                                         </label>
                                         <ToggleSwitch
                                             id="image-mode"
                                             label=""
                                             checked={useImagePaths}
                                             onChange={setUseImagePaths}
                                         />
                                     </div>
                                    {Object.entries(activeEditor === 'listings' ? (listingsSchema || {}) : (bannersSchema || {})).map(([key, value]) => renderFormField(key, value, key))}
                                </div>
                            </div>

                            {/* Modal Footer */}
                             <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t dark:border-gray-700 flex justify-end gap-4 flex-shrink-0">
                                <button onClick={() => setEditingItem(null)} className="py-2 px-6 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 font-semibold text-gray-700 dark:text-gray-200 transition-colors">{t('editor.cancel')}</button>
                                <button onClick={handleSave} className="py-2 px-6 rounded-lg bg-brand-accent text-white hover:bg-orange-600 font-semibold shadow-md transition-colors">{t('editor.save')}</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};
export default JsonFormEditorPage;
