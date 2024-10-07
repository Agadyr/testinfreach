import { resetPasswordAction} from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ChangePassword({ searchParams }: { searchParams: Message }) {
  return (
    <form className="flex-1 flex flex-col min-w-64">
      <h1 className="text-2xl font-medium">ChangePassword</h1>
      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
        <Label htmlFor="password">Password</Label>
        <Input type="password" name="password" placeholder="Required" required />
        <div className="flex justify-between items-center">
          <Label htmlFor="password">Password</Label>
        </div>
        <Input type="password" name="confirmPassword" placeholder="Confirm Your password" required />
        <SubmitButton pendingText="Changing..." formAction={resetPasswordAction}>
          Change
        </SubmitButton>
        {"error" in searchParams && (
          <p className="text-sm text-red-500 break-words">
            {searchParams.error}
          </p>
        )}
      </div>
    </form>
  );
}
