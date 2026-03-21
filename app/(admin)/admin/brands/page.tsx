import { Suspense } from "react";
import BrandsPage from "./components/BrandsPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BrandsPage />
    </Suspense>
  );
}
