import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import type { DealStatus } from "../types";

export function Logo() {
  return <Link to="/" className="logo-mark">FOR<span>M</span></Link>;
}
export function Banner({ kind = "info", children }: { kind?: "info" | "err" | "ok"; children: ReactNode }) {
  return <div className={`banner ${kind}`}>{children}</div>;
}
export function StatusTag({ status }: { status: DealStatus }) {
  const map: Record<DealStatus, string> = {
    RESERVED: "tag-warn", ACCEPTED: "tag-warn", PAID: "tag-ok", ACTIVE: "tag-live",
    PROOF_SUBMITTED: "tag-warn", COMPLETED: "tag-ok", CANCELLED: "tag-err", REFUNDED: "tag-err",
  };
  return <span className={`tag ${map[status]}`}>{status.replace("_", " ")}</span>;
}
