declare module 'react-image-gallery' {
  import * as React from 'react';

  export interface ReactImageGalleryItem {
    original: string;
    thumbnail?: string;
    originalAlt?: string;
    thumbnailAlt?: string;
    description?: string;
    renderItem?: () => React.ReactNode;
    renderThumbInner?: () => React.ReactNode;
  }

  export interface ReactImageGalleryProps {
    items: ReactImageGalleryItem[];
    showNav?: boolean;
    showFullscreenButton?: boolean;
    showPlayButton?: boolean;
    showThumbnails?: boolean;
    thumbnailPosition?: 'top' | 'right' | 'bottom' | 'left';
    showBullets?: boolean;
    disableThumbnailScroll?: boolean;
    renderItem?: (item: ReactImageGalleryItem) => React.ReactNode;
    renderLeftNav?: (
      onClick: React.MouseEventHandler<HTMLButtonElement>,
      disabled: boolean
    ) => React.ReactNode;
    renderRightNav?: (
      onClick: React.MouseEventHandler<HTMLButtonElement>,
      disabled: boolean
    ) => React.ReactNode;
  }

  export default class ImageGallery extends React.Component<ReactImageGalleryProps> {}
}
