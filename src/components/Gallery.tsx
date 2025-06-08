"use client";
import { Images } from '@/types/Images';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

import React, { useEffect, useState } from 'react';
import ImageGallery, { ReactImageGalleryItem } from 'react-image-gallery';

import 'react-image-gallery/styles/css/image-gallery.css';



function Gallery({ image }: { image: Images[] }) {
  const [thumbnailPosition, setThumbnailPosition] = useState<'bottom' | 'left'>('bottom');

  useEffect(() => {
    const handleResize = () => {
      setThumbnailPosition(window.innerWidth < 768 ? 'bottom' : 'left');
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const galleryImages: ReactImageGalleryItem[] = image.map((img) => ({
    original: img.url,
    thumbnail: `${img.url}?w=100&h=100&fit=crop`,
    originalAlt: img.alt || '',
    thumbnailAlt: img.alt || '',
  }));
  const renderItem = (item:ReactImageGalleryItem) => (
    <div className="w-full flex items-center justify-center">
      <Image 
      height={500}    width={500}
        src={item.original}
        alt={item.originalAlt||""}
        className="rounded-4xl max-h-full "
      />
    </div>
  );

  
  
  return (
    <div className="">
      <ImageGallery
  items={galleryImages}
  renderItem={renderItem}

  thumbnailPosition={thumbnailPosition}
  showPlayButton={false}
  showFullscreenButton={false}
  showBullets={true}
  disableThumbnailScroll={true}
  showNav={true}
  renderLeftNav={(onClick: React.MouseEventHandler<HTMLButtonElement> | undefined, disabled: boolean | undefined) => (
    <button
      className="absolute top-1/2 left-2 -translate-y-1/2 z-10 bg-gray-300 p-2 rounded-full shadow-md hover:bg-gray-100 disabled:opacity-50"
      onClick={onClick}
      disabled={disabled}
    >
      <ChevronLeft className='text-black'/>
    </button>
  )}
  renderRightNav={(onClick: React.MouseEventHandler<HTMLButtonElement> | undefined, disabled: boolean | undefined) => (
    <button
      className="absolute top-1/2 right-2 -translate-y-1/2 z-10 bg-gray-300 p-2 rounded-full shadow-md hover:bg-gray-100 disabled:opacity-50"
      onClick={onClick}
      disabled={disabled}
    >
      <ChevronRight className='text-black'/>
    </button>
  )}
/>
    </div>
  );
}

export default Gallery;
