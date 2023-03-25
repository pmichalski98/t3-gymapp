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
    "text-xl hover:text-lightCyan focus:outline-cyan outline-none rounded p-1";
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
    <nav className="sticky top-0 flex justify-center justify-around border-b-4 border-lightCyan pt-3 pb-2">
      {renderedLinks}
      {
        <>
          <ButtonStyleWrapper>
            <SignOutButton />
          </ButtonStyleWrapper>
        </>
      }
    </nav>
  );
}

export default Navbar;
