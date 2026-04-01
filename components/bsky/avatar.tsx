import Image from "next/image";

export interface AvatarProps {
  readonly href: string;
  readonly imageURL: string;
  readonly alt: string;
}

const Avatar = ({ href, imageURL, alt }: AvatarProps) => {
  return (
    <a href={href}>
      <span className="relative flex size-6 shrink-0 rounded-full ring-2 ring-white dark:dark:ring-gray-900">
        <Image
          alt={alt}
          className="aspect-square rounded-full object-cover"
          fill
          src={imageURL}
        />
      </span>
    </a>
  );
};

export { Avatar };
