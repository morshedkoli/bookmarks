"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Logo from "@/components/ui/logo";
import { Lock, Eye, EyeOff, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PinAuth = ({ onAuthenticated }) => {
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTimeLeft, setBlockTimeLeft] = useState(0);
  const { toast } = useToast();

  const CORRECT_PIN = "9632";
  const MAX_ATTEMPTS = 3;
  const BLOCK_DURATION = 300; // 5 minutes in seconds

  useEffect(() => {
    // Check if user is already authenticated
    const isAuthenticated = sessionStorage.getItem('admin-authenticated');
    if (isAuthenticated === 'true') {
      onAuthenticated();
    }

    // Check if user is blocked
    const blockEndTime = localStorage.getItem('admin-block-end');
    if (blockEndTime) {
      const now = Date.now();
      const blockEnd = parseInt(blockEndTime);
      if (now < blockEnd) {
        setIsBlocked(true);
        setBlockTimeLeft(Math.ceil((blockEnd - now) / 1000));
      } else {
        localStorage.removeItem('admin-block-end');
        localStorage.removeItem('admin-attempts');
      }
    }

    // Load previous attempts
    const savedAttempts = localStorage.getItem('admin-attempts');
    if (savedAttempts) {
      setAttempts(parseInt(savedAttempts));
    }
  }, [onAuthenticated]);

  useEffect(() => {
    let interval;
    if (isBlocked && blockTimeLeft > 0) {
      interval = setInterval(() => {
        setBlockTimeLeft((prev) => {
          if (prev <= 1) {
            setIsBlocked(false);
            setAttempts(0);
            localStorage.removeItem('admin-block-end');
            localStorage.removeItem('admin-attempts');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isBlocked, blockTimeLeft]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isBlocked) {
      toast({
        title: "Access Blocked",
        description: `Too many failed attempts. Try again in ${Math.floor(blockTimeLeft / 60)}:${(blockTimeLeft % 60).toString().padStart(2, '0')}`,
        variant: "destructive",
      });
      return;
    }

    if (!pin) {
      toast({
        title: "PIN Required",
        description: "Please enter the admin PIN",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Simulate a small delay for security
    setTimeout(() => {
      if (pin === CORRECT_PIN) {
        // Successful authentication
        sessionStorage.setItem('admin-authenticated', 'true');
        localStorage.removeItem('admin-attempts');
        localStorage.removeItem('admin-block-end');
        setAttempts(0);
        
        toast({
          title: "Access Granted",
          description: "Welcome to Admin Dashboard",
        });
        
        onAuthenticated();
      } else {
        // Failed authentication
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        localStorage.setItem('admin-attempts', newAttempts.toString());

        if (newAttempts >= MAX_ATTEMPTS) {
          // Block user
          const blockEndTime = Date.now() + (BLOCK_DURATION * 1000);
          localStorage.setItem('admin-block-end', blockEndTime.toString());
          setIsBlocked(true);
          setBlockTimeLeft(BLOCK_DURATION);
          
          toast({
            title: "Access Blocked",
            description: `Too many failed attempts. Access blocked for ${BLOCK_DURATION / 60} minutes.`,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Invalid PIN",
            description: `Incorrect PIN. ${MAX_ATTEMPTS - newAttempts} attempts remaining.`,
            variant: "destructive",
          });
        }
        
        setPin("");
      }
      
      setIsLoading(false);
    }, 500);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex flex-col items-center">
            <Logo size="xl" variant="icon" className="mb-2" />
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full">
              <Shield className="w-6 h-6 text-gray-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Admin Access
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Enter your PIN to access the admin dashboard
          </p>
        </CardHeader>
        
        <CardContent>
          {isBlocked ? (
            <div className="text-center py-8">
              <Lock className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-600 mb-2">
                Access Temporarily Blocked
              </h3>
              <p className="text-gray-600 mb-4">
                Too many failed attempts. Please try again in:
              </p>
              <div className="text-2xl font-mono font-bold text-red-600">
                {formatTime(blockTimeLeft)}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="pin" className="text-sm font-medium text-gray-700">
                  Admin PIN
                </label>
                <div className="relative">
                  <Input
                    id="pin"
                    type={showPin ? "text" : "password"}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="Enter 4-digit PIN"
                    maxLength={4}
                    className="pr-10 text-center text-lg tracking-widest"
                    disabled={isLoading}
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPin ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {attempts > 0 && !isBlocked && (
                <div className="text-center text-sm text-amber-600 bg-amber-50 p-3 rounded-md">
                  ⚠️ {MAX_ATTEMPTS - attempts} attempts remaining
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || isBlocked}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Verifying...
                  </div>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Access Dashboard
                  </>
                )}
              </Button>
            </form>
          )}

          <div className="mt-6 text-center text-xs text-gray-500">
            <p>🔒 Secure admin access with PIN protection</p>
            <p className="mt-1">Session expires when browser is closed</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PinAuth;
