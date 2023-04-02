import Link from "next/link";
import { SignOutButton, useUser } from "@clerk/nextjs";
import ButtonStyleWrapper from "~/components/ButtonStyleWrapper";
import { useRouter } from "next/router";
import Image from "next/image";
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

  const notActive =
    "transition text-xl hover:text-lightCyan focus:outline-cyan outline-none rounded p-1";
  const active = `font-bold border-l-4 border-lightCyan pl-2 text-lightCyan ${notActive} `;

  const renderedLinks = links.map((link) => (
    <Link
      href={link.path}
      key={link.label}
      className={currentRoute === link.path ? active : notActive}
    >
      {link.label}
    </Link>
  ));

  return (
    <nav
      className="sticky top-0 mx-auto flex max-w-6xl items-center justify-center justify-around border-b-4 border-lightCyan
     px-1 pt-3 pb-1"
    >
      {renderedLinks}
      <div className="flex gap-3">
        <ButtonStyleWrapper className="m-0 h-3/4 flex-nowrap self-center px-[5px] py-1">
          <SignOutButton />
        </ButtonStyleWrapper>
        <div>
          <Image
            className="mx-auto rounded-full"
            src={user.profileImageUrl}
            alt="Profile Image"
            width={50}
            height={50}
          />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
