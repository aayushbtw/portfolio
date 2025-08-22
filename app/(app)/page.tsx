import {
  Panel,
  PanelHeader,
  PanelTitle,
  PanelContent,
  PanelEyebrow,
  PanelDescription,
} from "@/components/panel";
import { projects } from "@/data/projects";
import { user } from "@/data/user";

export default function HomePage() {
  return (
    <div className="space-y-20 mt-10">
      <UserPanel />
      <ProjectsPanel />
    </div>
  );
}

function UserPanel() {
  return (
    <Panel>
      <PanelHeader>
        <PanelEyebrow>{user.designation}</PanelEyebrow>
        <PanelTitle as="h1" className="mb-3">
          Hello, I'm {user.name}
        </PanelTitle>
        <PanelDescription>{user.about}</PanelDescription>
        <ul className="flex gap-4 items-center text-muted-foreground">
          {user.social.map((item) => (
            <li key={item.name}>
              <a
                href={item.url}
                target="_blank"
                className="bg-card-primary hover:bg-card-secondary hover:scale-105 font-medium text-sm border border-border/60 rounded-xl px-3 h-9 inline-flex items-center justify-center"
              >
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </PanelHeader>
    </Panel>
  );
}

// function ExperiencePanel() {
//   return (
//     <Panel>
//       <PanelHeader>
//         <PanelTitle>Experience</PanelTitle>
//       </PanelHeader>
//       <PanelContent className="p-0 ">
//         <ul className="divide-y">
//           {experience.map((work) => (
//             <li key={work.company}>
//               <div className="flex font-mono font-semibold text-sm tracking-widest text-foreground/40 uppercase p-4 border-b">
//                 {work.company} / {work.title}
//                 <span className="ml-auto">
//                   {work.duration.from} - {work.duration.to} / {work.type}
//                 </span>
//               </div>

//               <ul className="text-sm/7 text-muted-foreground p-4">
//                 {work.responsibilities.map((item) => (
//                   <li key={item}>{item}</li>
//                 ))}
//               </ul>

//               <ul className="gap-2 flex p-4 pt-0">
//                 {work.tech.map((item) => (
//                   <Badge asChild key={item}>
//                     <li>{item}</li>
//                   </Badge>
//                 ))}
//               </ul>
//             </li>
//           ))}
//         </ul>
//       </PanelContent>
//     </Panel>
//   );
// }

function ProjectsPanel() {
  return (
    <Panel>
      <PanelHeader>
        <PanelTitle>Projects</PanelTitle>
      </PanelHeader>
      <PanelContent className="p-0">
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {projects.map((project) => (
            <li
              key={project.name}
              className="border rounded-xl bg-card-primary hover:bg-card-secondary group p-1"
            >
              <a
                href={project.href}
                target="_blank"
                className="h-64 flex flex-col"
              >
                <div className="relative border bg-muted rounded-lg h-full flex justify-center items-center">
                  {/* grid pattern */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:128px_96px] bg-center" />

                  {/* content */}
                  <div className="relative z-10 size-14 rounded-xl border bg-[linear-gradient(135deg,var(--color-card-primary)_0%,var(--color-card-secondary)_100%)] flex items-center justify-center">
                    <project.icon className="size-8 text-foreground/80" />
                  </div>
                </div>

                <div className="p-2 flex flex-col gap-0.5 leading-6">
                  <h3 className="font-medium">{project.name}</h3>
                  <p className="text-muted-foreground">{project.description}</p>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </PanelContent>
    </Panel>
  );
}

// function ProjectsPanel() {
//   return (
//     <Panel>
//       <PanelHeader>
//         <PanelEyebrow>Projects</PanelEyebrow>
//         <PanelTitle>Things I’ve Built</PanelTitle>
//         <SeparatorLabel>text-base/7 text-muted-foreground</SeparatorLabel>
//         <PanelDescription>
//           A selection of tools, experiments, and ideas I’ve designed, developed,
//           or contributed to.
//         </PanelDescription>
//       </PanelHeader>
//       <PanelContent className="p-0">
//         {/* Grid Lines (overlay layer) */}
//         <div className="pointer-events-none absolute inset-0 z-10 grid grid-cols-2 gap-5">
//           <div className="border-r border"></div>
//           <div className="border-l border"></div>
//         </div>

//         {/* Project Cards */}
//         <ul className="grid grid-cols-2 gap-5">
//           {projects.map((project, index) => (
//             <a
//               key={project.name}
//               href={project.href}
//               target="_blank"
//               className={cn(
//                 "grid p-2",
//                 index % 2 === 0 ? " " : "",
//               )}
//             >
//               <div className="h-48 border rounded-xl w-full flex flex-col justify-center px-10">
//                 <div className="max-w-sm">
//                   <h6 className="font-mono">{project.name}</h6>
//                   <p className="text-sm font-sans text-muted-foreground">
//                     {project.description}
//                   </p>
//                 </div>
//               </div>
//             </a>
//           ))}
//         </ul>
//       </PanelContent>
//       <SeparatorPattern />
//     </Panel>
//   );
// }
