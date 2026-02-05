 import { Separator } from "@/components/ui/separator";
 
 export const Footer = () => {
   const currentYear = new Date().getFullYear();
   
   return (
     <footer className="mt-auto border-t border-border/50 bg-card/50">
       <div className="container mx-auto px-4 py-4">
         <div className="flex flex-col items-center justify-center gap-1 text-center">
           <p className="text-xs text-muted-foreground">
             © {currentYear} VBOX Trading. All rights reserved.
           </p>
         </div>
       </div>
     </footer>
   );
 };