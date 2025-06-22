import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/lib/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LANGUAGES } from "@/lib/constants";
import Header from "@/components/header";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  nativeLanguages: z.array(z.string()).min(1, "Select at least one native language"),
  spokenLanguages: z.array(z.string()).min(1, "Select at least one spoken language"),
  timezone: z.string().min(1, "Timezone is required"),
  isTeacher: z.boolean(),
  isLearner: z.boolean(),
});

export default function Auth() {
  const [, navigate] = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("login");
  const [selectedNativeLanguages, setSelectedNativeLanguages] = useState<string[]>([]);
  const [selectedSpokenLanguages, setSelectedSpokenLanguages] = useState<string[]>([]);

  // Check URL params for tab
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get("tab");
    if (tab === "teacher") {
      setActiveTab("register");
    }
  }, []);

  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      firstName: "",
      lastName: "",
      nativeLanguages: [],
      spokenLanguages: [],
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      isTeacher: false,
      isLearner: true,
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: z.infer<typeof loginSchema>) => {
      const response = await apiRequest("POST", "/api/auth/login", data);
      return response.json();
    },
    onSuccess: (data) => {
      login(data.user, data.token);
      toast({
        title: "Welcome back!",
        description: "You have been successfully logged in.",
      });
      navigate("/dashboard");
    },
    onError: (error) => {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: z.infer<typeof registerSchema>) => {
      const response = await apiRequest("POST", "/api/auth/register", data);
      return response.json();
    },
    onSuccess: (data) => {
      login(data.user, data.token);
      toast({
        title: "Welcome to SkillShare Global!",
        description: "Your account has been created successfully.",
      });
      navigate("/dashboard");
    },
    onError: (error) => {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleLogin = (data: z.infer<typeof loginSchema>) => {
    loginMutation.mutate(data);
  };

  const handleRegister = (data: z.infer<typeof registerSchema>) => {
    registerMutation.mutate({
      ...data,
      nativeLanguages: selectedNativeLanguages,
      spokenLanguages: selectedSpokenLanguages,
    });
  };

  const handleLanguageToggle = (
    languageCode: string,
    type: "native" | "spoken"
  ) => {
    if (type === "native") {
      setSelectedNativeLanguages((prev) =>
        prev.includes(languageCode)
          ? prev.filter((code) => code !== languageCode)
          : [...prev, languageCode]
      );
    } else {
      setSelectedSpokenLanguages((prev) =>
        prev.includes(languageCode)
          ? prev.filter((code) => code !== languageCode)
          : [...prev, languageCode]
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold text-gray-900">
              {activeTab === "login" ? "Sign In" : "Join SkillShare Global"}
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="register">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      {...loginForm.register("email")}
                      className="mt-1"
                    />
                    {loginForm.formState.errors.email && (
                      <p className="text-sm text-red-600 mt-1">
                        {loginForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      {...loginForm.register("password")}
                      className="mt-1"
                    />
                    {loginForm.formState.errors.password && (
                      <p className="text-sm text-red-600 mt-1">
                        {loginForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full bg-primary-600 hover:bg-primary-700"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? "Signing In..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="register">
                <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        {...registerForm.register("firstName")}
                        className="mt-1"
                      />
                      {registerForm.formState.errors.firstName && (
                        <p className="text-sm text-red-600 mt-1">
                          {registerForm.formState.errors.firstName.message}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        {...registerForm.register("lastName")}
                        className="mt-1"
                      />
                      {registerForm.formState.errors.lastName && (
                        <p className="text-sm text-red-600 mt-1">
                          {registerForm.formState.errors.lastName.message}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      {...registerForm.register("username")}
                      className="mt-1"
                    />
                    {registerForm.formState.errors.username && (
                      <p className="text-sm text-red-600 mt-1">
                        {registerForm.formState.errors.username.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      {...registerForm.register("email")}
                      className="mt-1"
                    />
                    {registerForm.formState.errors.email && (
                      <p className="text-sm text-red-600 mt-1">
                        {registerForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      {...registerForm.register("password")}
                      className="mt-1"
                    />
                    {registerForm.formState.errors.password && (
                      <p className="text-sm text-red-600 mt-1">
                        {registerForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label>Native Languages</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {LANGUAGES.slice(0, 6).map((language) => (
                        <div key={language.code} className="flex items-center space-x-2">
                          <Checkbox
                            id={`native-${language.code}`}
                            checked={selectedNativeLanguages.includes(language.code)}
                            onCheckedChange={() => handleLanguageToggle(language.code, "native")}
                          />
                          <Label htmlFor={`native-${language.code}`} className="text-sm">
                            {language.flag} {language.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Spoken Languages</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {LANGUAGES.slice(0, 6).map((language) => (
                        <div key={language.code} className="flex items-center space-x-2">
                          <Checkbox
                            id={`spoken-${language.code}`}
                            checked={selectedSpokenLanguages.includes(language.code)}
                            onCheckedChange={() => handleLanguageToggle(language.code, "spoken")}
                          />
                          <Label htmlFor={`spoken-${language.code}`} className="text-sm">
                            {language.flag} {language.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="isTeacher"
                        {...registerForm.register("isTeacher")}
                      />
                      <Label htmlFor="isTeacher">I want to teach skills</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="isLearner"
                        {...registerForm.register("isLearner")}
                        defaultChecked
                      />
                      <Label htmlFor="isLearner">I want to learn skills</Label>
                    </div>
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full bg-primary-600 hover:bg-primary-700"
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
