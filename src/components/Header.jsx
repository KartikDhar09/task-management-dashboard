import React, { useState, memo } from "react";

import { useDispatch, useSelector } from "react-redux";

import { motion, AnimatePresence } from "framer-motion";

import {
  MoonStar,
  Sun,
  Search,
  Trash2,
  CheckSquare,
  X,
  LogOut,
  Menu
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription
} from "@/components/ui/sheet";

import { logoutUser } from "../Store/authSlice";

import { SearchComponent } from './search/SearchComponent.jsx';

import { useTasks } from "../context/TaskContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

const getUserInitials = (name) => {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const MobileNav = ({
  isDarkMode,
  setIsDarkMode,
  clearTasks,
  handleLogout,
  user,
  onClose
}) => {
  const handleThemeChange = () => {
    setIsDarkMode(!isDarkMode);
    onClose();
  };
  const handleClearTasks = () => {
    clearTasks();
    onClose();
  };
 
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center gap-3 mb-4">
        <Avatar className="h-10 w-10">
          <AvatarFallback>{getUserInitials(user.name)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{user.name}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {user.email}
          </p>
        </div>
      </div>

      {/* Theme Toggle Button */}
      <Button
        variant="outline"
        className="justify-start"
        onClick={handleThemeChange}
      >
        {isDarkMode ? (
          <Sun className="w-4 h-4 mr-2 text-amber-500" />
        ) : (
          <MoonStar className="w-4 h-4 mr-2 text-indigo-500" />
        )}
        {isDarkMode ? "Light mode" : "Dark mode"}
      </Button>

      {/* Clear Tasks Button */}
      <Button
        variant="outline"
        className="justify-start text-red-500"
        onClick={handleClearTasks}
      >
        <Trash2 className="w-4 h-4 mr-2" />
        Clear all tasks
      </Button>

      {/* Logout Button */}
      <Button
        variant="destructive"
        className="justify-start mt-auto"
        onClick={handleLogout}
      >
        <LogOut className="w-4 h-4 mr-2" />
        Sign out
      </Button>
    </div>
  );
};

const Header = memo(({ onSearchUpdate }) => {
  const dispatch = useDispatch();
  const { isDarkMode, setIsDarkMode } = useTheme();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { tasks } = useSelector((state) => state.tasks);
  const handleLogout = () => dispatch(logoutUser());
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { clearTasks } = useTasks();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  if (!isAuthenticated) return null;

  return (
    <TooltipProvider>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm"
      >
        <div className="max-w-7xl mx-auto">
          <div className="px-4 md:px-6 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
                <div className="relative group cursor-pointer">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg opacity-75 blur-sm group-hover:opacity-100 transition duration-300" />
                  <div className="relative flex items-center justify-center w-10 h-10 bg-white dark:bg-gray-900 rounded-lg border border-indigo-100 dark:border-indigo-800 shadow-sm group-hover:border-indigo-300 dark:group-hover:border-indigo-700 transition-all duration-300">
                    <CheckSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <h1 className="text-xl md:text-2xl font-bold">
                    <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      Task Manager
                    </span>
                  </h1>
                </div>
              </div>

              {/* Mobile Navigation Section */}
              <div className="flex items-center gap-2 lg:hidden ml-auto">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 md:h-10 md:w-10 flex items-center justify-center"
                  onClick={() => setIsSearchOpen(true)}
                  aria-label="Search tasks"
                >
                  <Search className="w-4 h-4 md:w-5 md:h-5 text-gray-600 dark:text-gray-400" />
                </Button>

                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                  <SheetTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 md:h-10 md:w-10 flex items-center justify-center"
                      aria-label="Open menu"
                    >
                      <Menu className="w-4 h-4 md:w-5 md:h-5 text-gray-600 dark:text-gray-400" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetTitle className="sr-only">Menu</SheetTitle>
                    <SheetDescription className="sr-only">
                      Access your account settings and preferences
                    </SheetDescription>
                    <MobileNav
                      isDarkMode={isDarkMode}
                      setIsDarkMode={setIsDarkMode}
                      clearTasks={clearTasks}
                      handleLogout={handleLogout}
                      user={user}
                      onClose={() => setIsSheetOpen(false)}
                    />
                  </SheetContent>
                </Sheet>
              </div>

              {/* Desktop Navigation Section */}
              <div className="hidden lg:flex items-center gap-3 md:gap-4 flex-1 justify-end">
                <SearchComponent
                  onSearchUpdate={onSearchUpdate}
                  tasks={tasks}
                  className="md:max-w-lg"
                />
                
                <div className="flex items-center gap-2.5">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setIsDarkMode(!isDarkMode)}
                          className="relative group bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900"
                          aria-label={
                            isDarkMode
                              ? "Switch to light mode"
                              : "Switch to dark mode"
                          }
                        >
                          {isDarkMode ? (
                            <Sun className="w-5 h-5 text-amber-500" />
                          ) : (
                            <MoonStar className="w-5 h-5 text-indigo-500" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {isDarkMode ? "Light mode" : "Dark mode"}
                      </TooltipContent>
                    </Tooltip>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={clearTasks}
                          className="relative group"
                          aria-label="Clear all tasks"
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Clear all tasks</TooltipContent>
                    </Tooltip>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative group"
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Avatar
                          className="h-9 w-9 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 border-2 border-indigo-200 dark:border-indigo-700 group-hover:border-indigo-300 dark:group-hover:border-indigo-600 transition-colors duration-300 cursor-pointer"
                          aria-label={`User profile: ${user.name}`}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20 opacity-0 group-hover:opacity-100 transition duration-300 rounded-full"></div>
                          <AvatarFallback className="text-sm font-medium text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors duration-300">
                            {getUserInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                      </TooltipTrigger>
                      <TooltipContent className="flex flex-col gap-1">
                        <p className="font-medium text-sm">{user.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {user.email}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={handleLogout}
                          className="relative"
                          aria-label="Sign out"
                        >
                          <LogOut className="w-5 h-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Sign out</TooltipContent>
                    </Tooltip>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Search Modal */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed inset-0 z-50 bg-white dark:bg-gray-900 p-4"
            >
              <div className="flex items-center gap-2 mb-4">
                <SearchComponent
                  onSearchUpdate={onSearchUpdate}
                  tasks={tasks}
                  className="flex-1"
                  onClose={() => setIsSearchOpen(false)}
                  isMobile
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </TooltipProvider>
  );
});

export default Header;