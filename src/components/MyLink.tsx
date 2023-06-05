import React, { type ReactNode } from "react";
import Link from "next/link";
import classNames from "classnames";
import { useRouter } from "next/router";

interface LinkProps {
  href: string;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}
const MyLink = ({ href, onClick, className, children, ...rest }: LinkProps) => {
  const router = useRouter();
  const activeStyles =
    router.pathname === href && " border-l-4 pl-1 rounded border-rose-400/60 ";

  const classes = classNames(
    "font-medium hover:text-gray-300 ",
    className,
    activeStyles
  );

  return (
    <Link onClick={onClick} className={classes} href={href} {...rest}>
      {children}
    </Link>
  );
};

export default MyLink;
