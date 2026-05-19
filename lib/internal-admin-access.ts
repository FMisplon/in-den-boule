import { env } from "@/lib/env";

export function getReservationAdminCode() {
  return env.internalAdminAccessCode || env.reservationAdminAccessCode;
}

export function getGiftCardAdminCode() {
  return env.internalAdminAccessCode || env.giftCardAdminAccessCode;
}

export function getCheckInAdminCode() {
  return env.internalAdminAccessCode || env.checkInAccessCode;
}
