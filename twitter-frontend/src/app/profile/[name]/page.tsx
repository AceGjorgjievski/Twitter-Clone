import { UserProfileView } from "@/sections/user-profile/view";

type UserProfilePageProps = {
  params: {
    name: string;
  };
};

export default async function UserProfile({ params }: UserProfilePageProps) {
  const { name } = await params;

  return <UserProfileView name={name} />;
}
