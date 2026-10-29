import { redirect } from "next/navigation";

export default function AdminPhotosRedirect() {
  redirect("/admin/media");
}
