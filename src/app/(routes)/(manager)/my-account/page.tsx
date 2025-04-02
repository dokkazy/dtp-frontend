import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Account() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
        <CardDescription>
          Manage your account settings. (Placeholder)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>Password change options, account deletion, etc. would go here.</p>
        {/* Placeholder content */}
      </CardContent>
    </Card>
  );
}
