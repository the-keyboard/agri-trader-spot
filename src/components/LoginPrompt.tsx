 import { LogIn } from "lucide-react";
 import { Button } from "@/components/ui/button";
 import { Card, CardContent } from "@/components/ui/card";
 import { openLoginDialog } from "@/hooks/useAuthDialog";
 
 interface LoginPromptProps {
   icon?: React.ReactNode;
   message?: string;
 }
 
 export const LoginPrompt = ({ 
   icon,
   message = "Please login to access this feature"
 }: LoginPromptProps) => {
   return (
     <Card className="rounded-2xl">
       <CardContent className="py-12 text-center">
         {icon || <LogIn className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />}
         <p className="text-muted-foreground mb-4">{message}</p>
         <Button 
           onClick={() => openLoginDialog()} 
           className="rounded-xl"
         >
           <LogIn className="w-4 h-4 mr-2" />
           Login
         </Button>
       </CardContent>
     </Card>
   );
 };