const DataDisplayUnit = ({
  label,
  values,
}: {
  label: string;
  values: (string | null)[];
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between">
      <p className="font-bold">{label}</p>
      <div>
        {values.map((value, index) => {
          if (!value) return null;
          return (
            <p key={label + index + value} className="sm:text-end">
              {value}
            </p>
          );
        })}
      </div>
    </div>
  );
};

export default DataDisplayUnit;
