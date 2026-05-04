/* eslint-disable @next/next/no-img-element */
import { type FC } from 'react';
import { CircleUser } from 'lucide-react';

type AvatarProps = {
  avatar?: string; // URL to the avatar image
  alt?: string;
  size?: number; // optional size in pixels
  className?: string;
};

export const Avatar: FC<AvatarProps> = ({ avatar, alt = 'Avatar', size = 20, className }) => {
  return (
    <>
      {avatar ? (
        <img
          src={avatar}
          alt={alt}
          width={size}
          height={size}
          className={`rounded-full object-cover ${className ?? ''}`}
          style={{ width: size, height: size }}
        />
      ) : (
        <CircleUser className={`text-gray-300 ${className ?? ''}`} size={size} />
      )}
    </>
  );
};
