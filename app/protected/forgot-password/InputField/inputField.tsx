import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function InputField({ successMessage, form, handleInputChange }: { successMessage: string, form: any, handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void }) {
  if (successMessage) {
    return (
      <>
        <Label htmlFor="code">Enter Your code here</Label>
        <Input 
          onChange={handleInputChange}
          value={form.code}
          name="code" 
          placeholder="Code OTP" 
          required 
        />
      </>
    );
  }
  return (
    <>
      <Label htmlFor="email">Email</Label>
      <Input 
        onChange={handleInputChange}
        value={form.email}
        name="email" 
        placeholder="you@example.com" 
        required 
      />
    </>
  );
}
