import { Suspense } from "react";
import EditProfileForm from "./EditProfileForm";

export default function EditProfilePage() {
  return (
    <div>
      <Suspense
        fallback={
          <div className="flex h-screen items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#990000]"></div>
          </div>
        }
      >
        <EditProfileForm />
      </Suspense>
    </div>
  );
}
