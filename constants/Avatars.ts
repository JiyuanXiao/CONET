import { Asset, useAssets } from "expo-asset";

export const getAvatarAssets = () => {
  const [assets, error] = useAssets([
    require(`@/assets/avatars/avatar-0.png`),
    require(`@/assets/avatars/avatar-2.png`),
    require(`@/assets/avatars/avatar-3.png`),
    require(`@/assets/avatars/avatar-4.png`),
    require(`@/assets/avatars/avatar-5.png`),
    require(`@/assets/avatars/avatar-6.png`),
    require(`@/assets/avatars/avatar-7.png`),
    require(`@/assets/avatars/avatar-8.png`),
    require(`@/assets/avatars/avatar-9.png`),
    require(`@/assets/avatars/avatar-10.png`),
    require(`@/assets/avatars/avatar-11.png`),
    require(`@/assets/avatars/avatar-12.png`),
    require(`@/assets/avatars/avatar-13.png`),
    require(`@/assets/avatars/avatar-14.png`),
    require(`@/assets/avatars/avatar-15.png`),
    require(`@/assets/avatars/avatar-16.png`),
    require(`@/assets/avatars/avatar-17.png`),
    require(`@/assets/avatars/avatar-18.png`),
    require(`@/assets/avatars/avatar-19.png`),
    require(`@/assets/avatars/avatar-20.png`),
    require(`@/assets/avatars/avatar-21.png`),
    require(`@/assets/avatars/avatar-22.png`),
    require(`@/assets/avatars/avatar-23.png`),
    require(`@/assets/avatars/avatar-24.png`),
    require(`@/assets/avatars/avatar-25.png`),
    require(`@/assets/avatars/avatar-26.png`),
    require(`@/assets/avatars/avatar-27.png`),
    require(`@/assets/avatars/avatar-28.png`),
    require(`@/assets/avatars/avatar-29.png`),
    require(`@/assets/avatars/avatar-30.png`),
  ]);
  return assets;
};
