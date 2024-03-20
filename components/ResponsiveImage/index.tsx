import { useState, useEffect } from 'react';
import { Image } from 'antd';

const IMAGE_SIZES = {
  SIZE_300: '300w',
  SIZE_600: '600w',
  SIZE_900: '900w',
  SIZE_100: '100vw',
};

type ImageProps = {
  src: string;
  alt?: string;
  sizes?: string;
  imageUrlS?: string;
  imageUrlM?: string;
  imageUrlL?: string;
  className?: string;
  placeholder?: any;
  hasWrapper?: boolean;
};

const ResponsiveImage = ({
  src,
  alt,
  className,
  sizes,
  imageUrlS,
  imageUrlM,
  imageUrlL,
  placeholder,
  hasWrapper,
}: ImageProps) => {
  const [imgSrcSet, setImgSrcSet] = useState('');
  useEffect(() => {
    if (!!(imageUrlS && imageUrlM && imageUrlL)) {
      setImgSrcSet(
        `${imageUrlS} ${IMAGE_SIZES.SIZE_300}, ${imageUrlM} ${IMAGE_SIZES.SIZE_600}, ${imageUrlL} ${IMAGE_SIZES.SIZE_900}`,
      );
      return;
    }
    setImgSrcSet(`${src} ${IMAGE_SIZES.SIZE_300}, ${src} ${IMAGE_SIZES.SIZE_600}, ${src} ${IMAGE_SIZES.SIZE_900}`);
  }, [imageUrlS, imageUrlM, imageUrlL, src]);

  return hasWrapper ? (
    <img src={src} alt={alt} className={className} sizes={sizes} srcSet={imgSrcSet} />
  ) : (
    <Image
      src={src}
      alt={alt}
      className={className}
      sizes={sizes}
      srcSet={imgSrcSet}
      preview={false}
      placeholder={placeholder}
    />
  );
};

ResponsiveImage.defaultProps = {
  sizes: IMAGE_SIZES.SIZE_100,
};

export default ResponsiveImage;
