import { useLanguage } from "@/app/providers";
import { Button, type ButtonProps } from "@/shared/ui";
import { useSignOut } from "@/entities/session";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface LogoutButtonProps {
  className?: string;
  /** Redirect target after signing out. Defaults to home. */
  redirectTo?: string;
  size?: ButtonProps["size"];
}

export function LogoutButton({ className, redirectTo = "/", size = "sm" }: LogoutButtonProps) {
  const { t } = useLanguage();
  const signOut = useSignOut();
  const navigate = useNavigate();

  return (
    <Button
      variant="ghost"
      size={size}
      className={"cursor-pointer h-10 w-10 hover:bg-red-500! hover:text-white! dark:bg-white/10!"}
      disabled={signOut.isPending}
      title={t("Logout")}
      onClick={() =>
        signOut.mutate(undefined, {
          onSuccess: () => navigate(redirectTo),
        })
      }
    >
      <LogOut size={16} />
    </Button>
  );
}
