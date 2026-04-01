import { Avatar, type AvatarProps } from "./avatar";

const AvatarStack = ({ avatars }: { readonly avatars: AvatarProps[] }) => {
  return (
    <div className="flex -space-x-1">
      {avatars.map((avatar) => (
        <Avatar
          alt={avatar.alt}
          href={avatar.href}
          imageURL={avatar.imageURL}
          key={avatar.href}
        />
      ))}
    </div>
  );
};

export default AvatarStack;
