'use client';

import { Header } from '@/components/layout/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  Settings,
  Shield,
  Bell,
  Database,
  Server,
  Clock,
  Save
} from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
  function handleSave() {
    toast.success('Settings saved successfully');
  }

  return (
    <>
      <Header
        title="Settings"
        description="Configure application settings and preferences"
      />

      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-4xl">
          <Tabs defaultValue="general" className="space-y-6">
            <TabsList>
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="storage">Storage</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    General Settings
                  </CardTitle>
                  <CardDescription>
                    Configure basic application settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="appName">Application Name</Label>
                    <Input id="appName" defaultValue="SentinelConnect" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Input id="timezone" defaultValue="UTC" />
                    <p className="text-xs text-muted-foreground">
                      All schedules and timestamps will use this timezone
                    </p>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Dark Mode</Label>
                      <p className="text-xs text-muted-foreground">
                        Enable dark theme for the interface
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Auto-refresh Dashboard</Label>
                      <p className="text-xs text-muted-foreground">
                        Automatically refresh dashboard data every 30 seconds
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Default Sync Settings
                  </CardTitle>
                  <CardDescription>
                    Default values for new sync configurations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="defaultPath">Default Output Path</Label>
                      <Input id="defaultPath" defaultValue="./output" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="defaultFile">Default File Name</Label>
                      <Input id="defaultFile" defaultValue="sync_data.db" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="rowLimit">Default Row Limit (per table)</Label>
                    <Input id="rowLimit" type="number" defaultValue="100000" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Security Settings
                  </CardTitle>
                  <CardDescription>
                    Configure security and encryption options
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Encrypt Stored Credentials</Label>
                      <p className="text-xs text-muted-foreground">
                        Encrypt database passwords at rest
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Require SSL for All Connections</Label>
                      <p className="text-xs text-muted-foreground">
                        Enforce SSL/TLS for all database connections
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Input id="sessionTimeout" type="number" defaultValue="60" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                    <Input id="maxLoginAttempts" type="number" defaultValue="5" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Audit Log Retention</CardTitle>
                  <CardDescription>
                    How long to keep audit log entries
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="auditRetention">Retention Period (days)</Label>
                    <Input id="auditRetention" type="number" defaultValue="90" />
                    <p className="text-xs text-muted-foreground">
                      Logs older than this will be automatically deleted
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notification Settings
                  </CardTitle>
                  <CardDescription>
                    Configure when and how to receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-xs text-muted-foreground">
                        Send email alerts for important events
                      </p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Sync Failure Alerts</Label>
                      <p className="text-xs text-muted-foreground">
                        Notify when a sync job fails
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Connection Failure Alerts</Label>
                      <p className="text-xs text-muted-foreground">
                        Notify when database connection fails
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="notifyEmail">Notification Email</Label>
                    <Input id="notifyEmail" type="email" placeholder="admin@example.com" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="storage" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Storage Settings
                  </CardTitle>
                  <CardDescription>
                    Configure output file storage and cleanup
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="storagePath">Base Storage Path</Label>
                    <Input id="storagePath" defaultValue="./output" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Auto-cleanup Old Files</Label>
                      <p className="text-xs text-muted-foreground">
                        Automatically delete old sync output files
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fileRetention">File Retention (days)</Label>
                    <Input id="fileRetention" type="number" defaultValue="30" />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Compress Output by Default</Label>
                      <p className="text-xs text-muted-foreground">
                        Automatically compress sync output files
                      </p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Encrypt Output by Default</Label>
                      <p className="text-xs text-muted-foreground">
                        Automatically encrypt sync output files
                      </p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="h-5 w-5" />
                    Cloud Storage (Optional)
                  </CardTitle>
                  <CardDescription>
                    Configure cloud storage for sync outputs
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Enable Cloud Storage</Label>
                      <p className="text-xs text-muted-foreground">
                        Upload sync outputs to cloud storage
                      </p>
                    </div>
                    <Switch />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cloudProvider">Cloud Provider</Label>
                    <Input id="cloudProvider" placeholder="Azure Blob / S3 / GCS" disabled />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bucketName">Bucket/Container Name</Label>
                    <Input id="bucketName" placeholder="sentinel-sync-outputs" disabled />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-6 flex justify-end">
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}

