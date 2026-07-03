import { AdminGate } from "@/components/admin/admin-gate"
import { AdminSongsView } from "@/components/admin/admin-songs-view"

export default function AdminPage() {
  return (
    <AdminGate>
      <AdminSongsView />
    </AdminGate>
  )
}
