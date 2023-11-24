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

export function AvatarSelector() {
  const [selectedAvatar, setSelectedAvatar] = useState(`/avatars/1.png`);

  const isSelected = (avatar: string) => selectedAvatar === avatar;

  return (
    <>
      <input value={selectedAvatar} type="hidden" name="imageUrl" />
      <ScrollShadow
        hideScrollBar
        className="flex h-44 w-full flex-wrap justify-evenly gap-3 overflow-y-auto rounded-lg border-2 border-gray-300 p-2"
      >
        {avatarList.map((avatar, index) => (
          <Avatar
            key={index}
            isBordered
            src={avatar}
            color={isSelected(avatar) ? "primary" : "default"}
            className="h-20 w-20 cursor-pointer hover:outline-gray-400"
            onClick={() => setSelectedAvatar(avatar)}
          />
        ))}
      </ScrollShadow>
    </>
  );
}

export default AvatarSelector;
