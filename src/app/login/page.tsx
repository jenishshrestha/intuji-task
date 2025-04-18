import { LoginForm } from "@/components/login/login-form";
import Link from "next/link";
import Image from "next/image";
export default function LoginPage() {
  return (
    <>
      <div className="grid min-h-svh lg:grid-cols-2">
        <div className="flex flex-col gap-4 p-6 md:p-10">
          <div className="flex justify-center gap-2 md:justify-start">
            <Link
              href="/"
              className="flex items-center gap-3 font-serif font-bold"
            >
              Random Team Generator
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-center">
            <LoginForm className="w-full max-w-xs" />
          </div>
        </div>
        <div className="bg-muted relative hidden lg:block">
          <Image
            alt="login background image"
            src="/house.webp"
            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            fill
          />
        </div>
      </div>
    </>
  );
}
