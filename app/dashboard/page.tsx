import { ArrowRight, CheckCircle, ChevronDown, Lock, Mic, MoreHorizontal, Briefcase, Clock } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TaskProgressChart, ProjectStatusChart } from "@/components/charts"
import { createClient } from "@/lib/supabase/server"
import { ProfileCompletionBanner } from "@/components/profile-completion-banner"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let showProfileBanner = false
  if (user) {
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("profile_status")
      .eq("user_id", user.id)
      .single()

    showProfileBanner = profile?.profile_status === 0
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      {showProfileBanner && <ProfileCompletionBanner />}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-white rounded-full p-4 flex items-center justify-center shadow-sm">
            <span className="text-2xl font-bold">19</span>
          </div>
          <div>
            <p className="font-semibold">Tue, December</p>
            <Button variant="destructive" size="sm" className="mt-1">
              Show My Tasks <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <h1 className="text-3xl font-bold">Hey, Need help? 👋</h1>
            <p className="text-muted-foreground">Just ask me anything!</p>
          </div>
          <Button size="icon" className="rounded-full w-14 h-14 bg-white text-black shadow-sm hover:bg-gray-100">
            <Mic className="h-6 w-6" />
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 since last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">231</div>
            <p className="text-xs text-muted-foreground">+180.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Hours Logged</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">109h 23m</div>
            <p className="text-xs text-muted-foreground">Team total this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">System Lock</CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Button size="sm">Enable</Button>
            <p className="text-xs text-muted-foreground mt-2">Secure your workspace</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Task Progress</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <TaskProgressChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Activity Manager</CardTitle>
            <div className="flex items-center gap-2 pt-2">
              <Button variant="outline" size="sm">
                Team <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
              <Button variant="outline" size="sm">
                Insights <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
                  <AvatarFallback>AU</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Alex updated a task</p>
                  <p className="text-sm text-muted-foreground">"Design new landing page"</p>
                </div>
                <div className="ml-auto font-medium text-sm">1h ago</div>
              </div>
              <div className="flex items-center">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="https://i.pravatar.cc/150?u=a04258114e29026702d" />
                  <AvatarFallback>JL</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Jane created a new project</p>
                  <p className="text-sm text-muted-foreground">"Q3 Marketing Campaign"</p>
                </div>
                <div className="ml-auto font-medium text-sm">3h ago</div>
              </div>
              <div className="flex items-center">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026707d" />
                  <AvatarFallback>MD</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Mike commented on a task</p>
                  <p className="text-sm text-muted-foreground">"Finalize budget proposal"</p>
                </div>
                <div className="ml-auto font-medium text-sm">1d ago</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Project Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ProjectStatusChart />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>My Tasks</CardTitle>
            <p className="text-sm text-muted-foreground">Tasks assigned to you.</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center p-2 rounded-lg hover:bg-muted">
                <div>
                  <p className="font-medium">Finalize Q2 report</p>
                  <p className="text-sm text-muted-foreground">Due in 2 days</p>
                </div>
                <Progress value={80} className="w-1/3 ml-auto" />
                <Button variant="ghost" size="icon" className="ml-2">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center p-2 rounded-lg hover:bg-muted">
                <div>
                  <p className="font-medium">Design homepage mockups</p>
                  <p className="text-sm text-muted-foreground">Due in 5 days</p>
                </div>
                <Progress value={40} className="w-1/3 ml-auto" />
                <Button variant="ghost" size="icon" className="ml-2">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center p-2 rounded-lg hover:bg-muted">
                <div>
                  <p className="font-medium">Setup new project repository</p>
                  <p className="text-sm text-muted-foreground">Due tomorrow</p>
                </div>
                <Progress value={95} className="w-1/3 ml-auto" />
                <Button variant="ghost" size="icon" className="ml-2">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
