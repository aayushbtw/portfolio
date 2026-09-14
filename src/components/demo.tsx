import { explorations, isExploration } from "~/components/explorations";

function Demo({ name }: { name: string }) {
  if (!isExploration(name)) {
    throw new Error(`No exploration registered as "${name}"`);
  }

  const Exploration = explorations[name];

  return (
    <div
      className="not-typeset my-md bg-bg-3 p-xs rounded-md border"
      data-slot="demo"
    >
      <div className="bg-bg-1 px-md py-xl flex min-h-96 items-center justify-center rounded-xs border">
        <Exploration />
      </div>
    </div>
  );
}

export { Demo };
