import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertOctagon, RefreshCw } from "lucide-react";
import { TitanButton } from "@/components/ui";
import { logEvent } from "@/services/telemetry/loggerService";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
  console.group("🔥 TITAN CRASH");

  console.error("MESSAGE:");
  console.error(error.message);

  console.error("STACK:");
  console.error(error.stack);

  console.error("COMPONENT:");
  console.error(errorInfo.componentStack);

  console.groupEnd();

  logEvent("ERROR", "REACT_ERROR_BOUNDARY", error.message, errorInfo);
}

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen w-full items-center justify-center bg-[#050507] p-6 font-mono text-zinc-100">
          <div className="max-w-md w-full rounded-3xl border border-red-500/40 bg-[#0d0d10] p-8 shadow-2xl shadow-black space-y-5 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-red-500/30 bg-red-500/10 text-red-400">
              <AlertOctagon className="size-7" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold font-sans text-white">System Error Intercepted</h2>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                TITAN's Error Boundary safely caught an unhandled application exception.
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-[#070709] p-3 text-left">
              <span className="text-[10px] font-bold text-red-400 uppercase">Error Message</span>
              <p className="text-xs text-zinc-300 font-mono line-clamp-2">
                {this.state.error?.message || "Unknown Application Anomaly"}
              </p>
            </div>

            <div className="flex justify-center pt-2">
              <TitanButton
                size="md"
                leftIcon={<RefreshCw className="size-4" />}
                onClick={this.handleReload}
              >
                RELOAD TITAN SYSTEM
              </TitanButton>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
