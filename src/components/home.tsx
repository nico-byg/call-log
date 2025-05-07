import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LoginForm from "./auth/LoginForm";
import { motion } from "framer-motion";

const Home = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md px-4"
      >
        <Card className="shadow-lg border-slate-200">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Help Desk Portal
            </CardTitle>
            <CardDescription className="text-center">
              Sign in to manage support calls
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
          <CardFooter className="flex flex-col space-y-2 text-center text-sm text-muted-foreground">
            <p>Secure access for authorized help desk personnel only</p>
            <p>© {new Date().getFullYear()} Help Desk Management System</p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default Home;
