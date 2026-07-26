import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopNavbar } from "@/components/layout/TopNavbar";
import CommandPaletteModal from "@/components/common/CommandPaletteModal";
import GlobalQuickActions from "@/components/common/GlobalQuickActions";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import { BottomTabBar } from "@/components/mobile/BottomTabBar";
import { OfflineBanner } from "@/components/mobile/OfflineBanner";
import { PWAInstallPromptModal } from "@/components/mobile/PWAInstallPromptModal";
import { pageTransition } from "@/animations/motionSystem";

type AppLayoutProps = { children: ReactNode; pageTitle?: string };

export function AppLayout({ children, pageTitle }: AppLayoutProps) {
  return (
    <ErrorBoundary>
      <div className="flex h-svh overflow-hidden bg-[#09090b]">
        <OfflineBanner />
        <Sidebar />
        <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-[radial-gradient(circle_at_70%_-10%,rgba(250,204,21,0.055),transparent_30%),linear-gradient(135deg,#0d0d0f_0%,#09090b_100%)]">
          <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] [background-size:42px_42px]" />
          <TopNavbar title={pageTitle} />
          
          {/* Motion Main Page Transition */}
          <motion.main
            variants={pageTransition}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative flex-1 overflow-y-auto px-5 py-6 pb-20 md:pb-8 lg:px-9 lg:py-8"
          >
            {children}
          </motion.main>
        </div>
        <BottomTabBar />
        <PWAInstallPromptModal />
        <CommandPaletteModal />
        <GlobalQuickActions />
      </div>
    </ErrorBoundary>
  );
}
