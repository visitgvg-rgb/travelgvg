import React from 'react';
import FacebookIcon from './icons/FacebookIcon';
import TwitterIcon from './icons/TwitterIcon';
import ShareIcon from './icons/ShareIcon';
import { useTranslation } from '../i18n';

const SocialShare: React.FC<{ url: string; title: string }> = ({ url, title }) => {
    const { t } = useTranslation();
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);

    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
    
    const handleNativeShare = () => {
        if (navigator.share) {
            navigator.share({
                title: title,
                url: url,
            }).catch(console.error);
        } else {
            // Fallback for browsers that don't support Web Share API
            alert('Sharing is not supported on your browser.');
        }
    }

    return (
        <div className="flex items-center space-x-4">
            <span className="text-sm font-semibold text-gray-600">{t('social.share')}:</span>
            <a href={facebookShareUrl} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600 transition-colors" aria-label="Share on Facebook">
                <FacebookIcon className="w-6 h-6" />
            </a>
            <a href={twitterShareUrl} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-sky-500 transition-colors" aria-label="Share on Twitter">
                <TwitterIcon className="w-6 h-6" />
            </a>
            {typeof navigator.share !== 'undefined' && (
                <button onClick={handleNativeShare} className="text-gray-500 hover:text-brand-accent transition-colors" aria-label="More sharing options">
                    <ShareIcon className="w-6 h-6" />
                </button>
            )}
        </div>
    );
};

export default SocialShare;
