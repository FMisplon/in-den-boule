import { NextResponse } from "next/server";
import { generateGiftCardPdf } from "@/lib/gift-cards";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ voucherCode: string }> }
) {
  const { voucherCode } = await context.params;
  const supabase = createSupabaseServerClient();

  const { data: giftCard } = await supabase
    .from("gift_cards")
    .select("*")
    .eq("voucher_code", voucherCode)
    .maybeSingle();

  if (!giftCard) {
    return new NextResponse("Voucher not found", { status: 404 });
  }

  const pdfBytes = await generateGiftCardPdf(giftCard);

  return new NextResponse(pdfBytes, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="cadeaubon-${giftCard.voucher_code}.pdf"`
    }
  });
}
