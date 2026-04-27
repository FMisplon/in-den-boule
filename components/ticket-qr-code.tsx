import QRCode from "qrcode";

type TicketQrCodeProps = {
  value: string;
  size?: number;
};

export async function TicketQrCode({ value, size = 220 }: TicketQrCodeProps) {
  const svg = await QRCode.toString(value, {
    type: "svg",
    width: size,
    margin: 1,
    errorCorrectionLevel: "M",
    color: {
      dark: "#1f5a2d",
      light: "#0000"
    }
  });

  return <div dangerouslySetInnerHTML={{ __html: svg }} />;
}
