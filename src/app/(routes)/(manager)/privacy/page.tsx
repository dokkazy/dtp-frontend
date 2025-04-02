"use client";
import React, { useState } from 'react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

export default function Privacy() {
  const [isProfilePublic, setIsProfilePublic] = useState(false);
    const [showEmail, setShowEmail] = useState(false);
  return (
    <Card>
          <CardHeader>
            <CardTitle>Privacy Settings</CardTitle>
            <CardDescription>
              Adjust your privacy preferences. (Placeholders)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <Label htmlFor="profile-public" className="font-medium">
                  Make Profile Public
                </Label>
                <p className="text-sm text-muted-foreground">
                  Allow others to see your profile.
                </p>
              </div>
              <Switch
                id="profile-public"
                checked={isProfilePublic}
                onCheckedChange={setIsProfilePublic}
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <Label htmlFor="show-email" className="font-medium">
                  Show Email on Profile
                </Label>
                <p className="text-sm text-muted-foreground">
                  Allow others to see your email address.
                </p>
              </div>
              <Switch
                id="show-email"
                checked={showEmail}
                onCheckedChange={setShowEmail}
              />
            </div>
            {/* Add more privacy options as needed */}
          </CardContent>
        </Card>
  )
}
