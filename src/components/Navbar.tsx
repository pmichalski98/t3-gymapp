import Link from "next/link";
import { SignOutButton, useUser } from "@clerk/nextjs";
import ButtonStyleWrapper from "~/components/ButtonStyleWrapper";
import { useRouter } from "next/router";
import Image from "next/image";
import MyLink from "~/components/MyLink";
import Button from "~/components/Button";
function Navbar() {
  const router = useRouter();
  const currentRoute = router.pathname;
  const { user } = useUser();
  if (!user) throw new Error("No user");

  const links = [
    { label: "Stats", path: "/stats" },
    { label: "Trainings", path: "/trainings" },
    { label: "Home", path: "/home" },
    { label: "Body", path: "/body" },
  ];

  const renderedLinks = links.map((link) => (
    <MyLink href={link.path} key={link.label}>
      {link.label}
    </MyLink>
  ));

  return (
    <nav className="mx-auto flex w-full items-center justify-around  px-1  pb-1 md:text-lg ">
      {renderedLinks}
      <div className="flex  gap-3">
        <ButtonStyleWrapper variant="secondary">
          <SignOutButton />
        </ButtonStyleWrapper>
        <Image
          className="mx-auto rounded-full"
          src={user.profileImageUrl}
          alt="Profile Image"
          width={50}
          height={50}
        />
      </div>
    </nav>
  );
}

export default Navbar;
