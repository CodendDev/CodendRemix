import { useState } from "react";
import { Avatar, ScrollShadow } from "@nextui-org/react";

const avatarList = (() => {
  const avatarList: string[] = [];
  const avatarCount = 49;
  for (let i = 1; i <= avatarCount; i++) {
    avatarList.push(`/avatars/${i}.png`);
  }
  return avatarList;
})();

export function AvatarSelector({ borderColor }: { borderColor?: string }) {
  const [selectedAvatar, setSelectedAvatar] = useState(`/avatars/1.png`);

  const isSelected = (avatar: string) => selectedAvatar === avatar;

  return (
    <>
      <input required value={selectedAvatar} type="hidden" name="imageUrl" />
      <ScrollShadow
        hideScrollBar
        size={0}
        className={`flex h-44 w-full flex-wrap justify-evenly gap-3 overflow-y-auto rounded-lg border-2  p-2 ${
          borderColor ?? "border-gray-300"
        }`}
      >
        {avatarList.map((avatar, index) => (
          <Avatar
            key={index}
            isBordered
            src={avatar}
            className={`h-20 w-20  ${
              isSelected(avatar)
                ? "outline-3 outline-emerald-500"
                : "cursor-pointer hover:outline-gray-400"
            }`}
            onClick={() => setSelectedAvatar(avatar)}
          />
        ))}
      </ScrollShadow>
    </>
  );
}

export default AvatarSelector;
