import React from 'react';
import { Card } from "@/components/ui/card";
import { AnimatePresence, motion } from 'framer-motion'; 
import LoginForm from './LoginForm.jsx';
import RegisterForm from './RegisterForm.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

// Main authentication page component that handles both login and registration
const AuthPage = () => {

 const { showRegister } = useAuth();

 // Reusable form container
 const FormCard = ({ children }) => (
   <Card className="backdrop-blur-xl bg-white/95 dark:bg-slate-900/95 
     shadow-2xl border border-slate-200/50 dark:border-slate-700/50 
     relative overflow-hidden rounded-xl w-full max-w-md mx-auto">
     {children}
   </Card>
 );

 return (
   <main className="min-h-screen flex flex-col">        
     <div className="flex-grow flex items-center justify-center p-4 md:p-8 relative">
       <div className="w-full max-w-5xl mx-auto mt-8 md:mt-12">

         {/* enables exit animations when switching forms */}
         <AnimatePresence mode="wait">

           {/* Animated container for form transitions */}
           <motion.div
             key={showRegister ? 'register' : 'login'}
             initial={{ opacity: 0, y: 20 }}          // Initial animation state
             animate={{ opacity: 1, y: 0 }}           // Animated state
             exit={{ opacity: 0, y: -20 }}           // Exit animation state
             transition={{ duration: 0.2 }}          // Animation duration
             className="md:w-1/2 md:mx-auto"
           >
             <FormCard>

               {/* Conditionally render either Register or Login form */}
               {showRegister ? (
                 <RegisterForm />
               ) : (
                 <LoginForm />
               )}
             </FormCard>
           </motion.div>
         </AnimatePresence>
       </div>
     </div>
   </main>
 );
};

export default AuthPage;