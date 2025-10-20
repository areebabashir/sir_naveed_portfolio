import { useState } from "react";
import { Mail, MailOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const mockMessages = [
  {
    id: 1,
    name: "John Smith",
    email: "john@example.com",
    message: "Interested in your AI automation services for our retail business.",
    date: "2024-03-15",
    read: false,
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah@company.com",
    message: "Would like to schedule a consultation for custom AI solutions.",
    date: "2024-03-14",
    read: true,
  },
  {
    id: 3,
    name: "Michael Chen",
    email: "m.chen@tech.com",
    message: "Looking for AI training programs for our development team.",
    date: "2024-03-13",
    read: true,
  },
];

export default function Messages() {
  const [messages] = useState(mockMessages);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Messages</h1>
        <p className="text-muted-foreground">Contact form submissions</p>
      </div>

      <div className="space-y-4">
        {messages.map((msg) => (
          <Card key={msg.id} className={msg.read ? "opacity-75" : ""}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {msg.read ? (
                    <MailOpen className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <Mail className="h-5 w-5 text-accent" />
                  )}
                  <div>
                    <p className="text-base font-semibold">{msg.name}</p>
                    <p className="text-sm text-muted-foreground font-normal">{msg.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {!msg.read && <Badge variant="default">New</Badge>}
                  <span className="text-sm text-muted-foreground">{msg.date}</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{msg.message}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
