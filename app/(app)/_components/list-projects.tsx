import Link from "next/link";

const projects = [
  {
    name: "monit",
    description: "Monitor server stats via ssh",
    url: "https://github.com/aayushbtw/monit",
  },
  {
    name: "z",
    description: "Encode & decode strings through CLI",
    url: "https://github.com/aayushbtw/z",
  },
  {
    name: "tt",
    description: "CLI based typing test",
    url: "https://github.com/aayushbtw/tt",
  },
  {
    name: "time",
    description: "Year progress bar with precision",
    url: "https://github.com/aayushbtw/time",
  },
];

function ListProjects() {
  return (
    <ul>
      {projects.map((item) => (
        <li key={item.name}>
          <Link href={item.url}>
            <h6>{item.name}</h6>
            <p>{item.description}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export { ListProjects };
