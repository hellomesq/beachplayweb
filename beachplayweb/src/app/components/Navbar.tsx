import Link from 'next/link';

interface NavBarProps {
  active: string;
}

const links = [
  { label: "inicio", href: "/inicio" },
  { label: "agendamentos", href: "/agendamentos" }
];

export default function NavBar(props: NavBarProps) {
  const { active } = props;
  const classActive = "border-b-4 border-emerald-600";

  return (
    <nav className="fixed top-0 w-full bg-slate-900 px-6 pt-6 text-white z-10">
      <h1 className="text-2xl font-bold">BeachPlay</h1>
      <ul className="flex gap-12">
        {links.map((link) => (
          <li key={link.label} className={active === link.label ? classActive : ""}>
            <Link href={link.href}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
