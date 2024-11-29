import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-900 to-indigo-900 flex items-center justify-center px-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Login to Aura.io</CardTitle>
                    <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
                </CardHeader>
                <CardContent>
                    <form>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="your@email.com" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" type="password" required />
                            </div>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <Button className="w-full">Login</Button>
                    <p className="text-sm text-center">
                        Don't have an account?{' '}
                        <Link href="/register" className="text-purple-400 hover:underline">
                            Register here
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}

