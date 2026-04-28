type AddressLinesProps = {
  address: string;
  className?: string;
};

type OpeningHoursListProps = {
  hours: string;
  className?: string;
};

function splitLines(value: string) {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function splitAddressLines(address: string) {
  const explicitLines = splitLines(address);

  if (explicitLines.length > 1) {
    return explicitLines;
  }

  return address
    .split(",")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function AddressLines({ address, className }: AddressLinesProps) {
  const lines = splitAddressLines(address);

  return (
    <div className={className}>
      {lines.map((line) => (
        <p key={line}>{line}</p>
      ))}
    </div>
  );
}

export function OpeningHoursList({ hours, className }: OpeningHoursListProps) {
  const lines = splitLines(hours);

  if (!lines.length) {
    return null;
  }

  return (
    <div className={className}>
      {lines.map((line) => (
        <p key={line}>{line}</p>
      ))}
    </div>
  );
}
