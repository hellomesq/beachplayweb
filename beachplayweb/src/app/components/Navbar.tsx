import Link from 'next/link';

interface NavBarProps {
  active: string;
}

const links = [
  { label: "inicio", href: "/reserva" },
  { label: "agendamentos", href: "/agendamentos" },
  { label: "login", href: "/login" }
];

export default function NavBar(props: NavBarProps) {
  const { active } = props;
  const classActive = "border-b-4 border-risco"; 

  return (
    <nav className="navbar fixed top-0 w-full px-6 py-4 text-white z-10 flex items-center justify-between">
      <h1 className="text-2xl font-bold">BeachPlay</h1>
      <ul className="flex gap-8 ml-auto">
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

