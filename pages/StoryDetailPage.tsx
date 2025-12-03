import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from '../i18n';
import type { Prikazna, MultiLangString } from '../types';
import Card from '../components/Card';
import SocialShare from '../components/SocialShare';
import Breadcrumbs from '../components/Breadcrumbs';
import UserIcon from '../components/icons/UserIcon';
import ChevronLeftIcon from '../components/icons/ChevronLeftIcon';
import ChevronRightIcon from '../components/icons/ChevronRightIcon';
import SEO from '../components/SEO';

const StoryDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { t, language, getLocalizedPath } = useTranslation();
    const lang = language as keyof MultiLangString;

    const [post, setPost] = useState<Prikazna | null>(null);
    const [allPosts, setAllPosts] = useState<Prikazna[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const articleRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const fetchPost = async () => {
            setLoading(true);
            setError(null);
            setPost(null);
            try {
                const response = await fetch('/data/prikazni.json');
                if (!response.ok) throw new Error('Network response was not ok');
                const posts: Prikazna[] = await response.json();
                const currentPost = posts.find(p => p.id === id);
                setAllPosts(posts);
                if (currentPost) {
                    setPost(currentPost);
                } else {
                    setError(t('storyDetailPage.notFound'));
                }
            } catch (e) {
                setError(t('storyDetailPage.loadError'));
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id, t]);

    useEffect(() => {
        if(post || error) {
            window.scrollTo(0, 0);
        }
    }, [post, error]);
    
    const openLightbox = (index: number) => {
        setSelectedImageIndex(index);
        setIsLightboxOpen(true);
    };

    const closeLightbox = () => {
        setIsLightboxOpen(false);
    };
    
    const showNextImage = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (!post) return;
        setSelectedImageIndex(prevIndex => (prevIndex + 1) % post.images.length);
    }, [post]);

    const showPrevImage = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (!post) return;
        setSelectedImageIndex(prevIndex => (prevIndex - 1 + post.images.length) % post.images.length);
    }, [post]);
    
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isLightboxOpen) return;
            if (e.key === 'ArrowRight') showNextImage();
            if (e.key === 'ArrowLeft') showPrevImage();
            if (e.key === 'Escape') closeLightbox();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isLightboxOpen, showNextImage, showPrevImage]);

    if (loading) {
        return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="animate-pulse">
                    <div className="h-6 w-1/2 bg-gray-300 dark:bg-gray-700 rounded mb-12"></div>
                    <div className="h-12 w-3/4 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
                    <div className="flex items-center space-x-4 mb-8">
                        <div className="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                        <div className="h-5 w-1/4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                    </div>
                    <div className="h-80 w-full bg-gray-300 dark:bg-gray-700 rounded-lg mb-8"></div>
                    <div className="space-y-3">
                        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="text-center py-20 text-red-500">{error}</div>;
    }

    if (!post) {
        return null;
    }

    const relatedPosts = allPosts.filter(p => post.relatedPosts.includes(p.id) && p.id !== post.id);

    return (
        <>
            <SEO 
                title={post.title[lang]} 
                description={(post.shortDescription || post.description)[lang]} 
                image={post.images[0]}
                type="article"
            />
            <Breadcrumbs customLastSegment={post.title[lang]} />
            <article ref={articleRef} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <header className="mb-8">
                    <span className="text-sm font-bold text-brand-accent mb-2 block">{t(`categories.${post.category}`)}</span>
                    <h1 className="text-3xl md:text-5xl font-serif font-black text-brand-text dark:text-gray-100 mb-4">{post.title[lang]}</h1>
                    <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-3">
                            {post.authorAvatar ? (
                                <img src={post.authorAvatar} alt={post.author} className="w-10 h-10 rounded-full object-cover"/>
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                  <UserIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                                </div>
                            )}
                             <div className="leading-tight">
                                <p className="font-semibold text-brand-text dark:text-gray-200">{post.author}</p>
                                <p>{new Date(post.publicationDate).toLocaleDateString(language)}</p>
                            </div>
                        </div>
                        <SocialShare url={window.location.href} title={post.title[lang]} />
                    </div>
                </header>

                {post.images && post.images.length > 0 && (
                    <div className="mb-8 rounded-lg overflow-hidden shadow-lg cursor-pointer" onClick={() => openLightbox(0)}>
                        <img src={post.images[0]} alt={post.title[lang]} className="w-full h-auto" />
                    </div>
                )}
                
                <div 
                    className="prose dark:prose-invert lg:prose-lg max-w-none text-gray-700 dark:text-gray-300"
                    dangerouslySetInnerHTML={{ __html: post.fullContent[lang].replace(/\n/g, '<br />') }}
                />
                
                {post.images && post.images.length > 1 && (
                    <div className="mt-12">
                        <h3 className="text-2xl font-serif font-bold mb-6 text-center">{t('storyDetailPage.gallery')}</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {post.images.map((img, index) => (
                                <div key={index} onClick={() => openLightbox(index)} className="cursor-pointer rounded-lg overflow-hidden group">
                                    <img src={img} alt={`${post.title[lang]} - photo ${index + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                {relatedPosts.length > 0 && (
                     <aside className="mt-16 border-t pt-12">
                        <h3 className="text-2xl font-serif font-bold text-center mb-8">{t('storyDetailPage.relatedPosts')}</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {relatedPosts.map(relatedPost => (
                                <Link key={relatedPost.id} to={getLocalizedPath(`/stories/${relatedPost.id}`)}>
                                    <Card item={relatedPost} onClick={() => {}} />
                                </Link>
                            ))}
                        </div>
                    </aside>
                )}
            </article>

            {isLightboxOpen && post && (
                <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4 animate-fade-in" onClick={closeLightbox}>
                    <button onClick={closeLightbox} className="absolute top-4 right-4 text-white hover:text-gray-300 z-[110] transition-colors" aria-label="Close">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                    <button onClick={showPrevImage} className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/30 p-2 rounded-full hover:bg-black/50 z-[110] transition-colors" aria-label="Previous"><ChevronLeftIcon className="w-8 h-8" /></button>
                    <div className="relative" onClick={e => e.stopPropagation()}>
                        <img key={selectedImageIndex} src={post.images[selectedImageIndex]} alt="" className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg animate-zoom-slide-up" />
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-white text-sm font-semibold">{selectedImageIndex + 1} / {post.images.length}</div>
                    </div>
                    <button onClick={showNextImage} className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/30 p-2 rounded-full hover:bg-black/50 z-[110] transition-colors" aria-label="Next"><ChevronRightIcon className="w-8 h-8" /></button>
                </div>
            )}
        </>
    );
};

export default StoryDetailPage;
