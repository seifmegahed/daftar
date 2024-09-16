import { cn } from "@/lib/utils";

function DataDisplayTable({
  data,
  className,
}: {
  data: { name: string; value: string }[];
  className?: string;
}) {
  return (
    <table>
      <tbody>
        {data.map((row) => (
          <tr key={row.name}>
            <td className={cn("w-40 py-1", className)}>{row.name}</td>
            <td>{row.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default DataDisplayTable;
