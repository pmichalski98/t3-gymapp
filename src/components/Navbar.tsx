import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";
import ButtonStyleWrapper from "~/components/ButtonStyleWrapper";
import { useRouter } from "next/router";
function Navbar() {
  const router = useRouter();
  const currentRoute = router.pathname;

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
      className="sticky top-0 mx-auto flex max-w-screen-xl justify-center justify-around border-b-4 border-lightCyan px-1
     pt-3 pb-1"
    >
      {renderedLinks}
      {
        <>
          <ButtonStyleWrapper className="m-0 flex-nowrap px-[5px] py-1">
            <SignOutButton />
          </ButtonStyleWrapper>
        </>
      }
    </nav>
  );
}

export default Navbar;
