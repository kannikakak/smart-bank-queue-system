import { AuthShell, authIcons } from "@/components/auth-shell";

export default function RegisterPage() {
  return (
    <AuthShell
      mode="register"
      description="Join SmartQ for a secure and seamless queueing experience."
      fields={[
        {
          name: "fullName",
          label: "Full Name",
          type: "text",
          placeholder: "Jane Doe",
          icon: authIcons.user,
        },
        {
          name: "email",
          label: "Email Address",
          type: "email",
          placeholder: "jane@example.com",
          icon: authIcons.mail,
        },
        {
          name: "phone",
          label: "Phone Number",
          type: "tel",
          placeholder: "+1 (555) 000-0000",
          icon: authIcons.phone,
        },
        {
          name: "password",
          label: "Password",
          type: "password",
          placeholder: "Choose a password",
          icon: authIcons.lock,
        },
        {
          name: "confirmPassword",
          label: "Confirm Password",
          type: "password",
          placeholder: "Confirm your password",
          icon: authIcons.verify,
        },
      ]}
      submitLabel="Create Account"
      helperText={
        <label className="auth-consent">
          <input type="checkbox" />
          <span>
            I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </span>
        </label>
      }
      footerText="Already have an account?"
      footerActionLabel="Login instead"
      footerActionHref="/login"
    />
  );
}
