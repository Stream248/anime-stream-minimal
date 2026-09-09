import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { ArrowRight, LogOut } from "lucide-react";
import { useNavigate } from "react-router";

/**
 * Minimal fixed-width header: wordmark on the left, a single quiet action on
 * the right (Sign in for guests / Browse for signed-in users). One hairline
 * divider anchors it to the content below.
 */
export function SiteHeader() {
  const { isLoading, isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="border-b border-border/80">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex items-baseline gap-2 transition-opacity hover:opacity-70"
        >
          <span className="text-lg font-semibold tracking-tight text-foreground">
            Comic Home
          </span>
          <span className="hidden text-xs uppercase tracking-[0.25em] text-muted-foreground sm:inline">
            Anime, by taste
          </span>
        </button>

        <nav className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => navigate("/search")}
          >
            Search
          </Button>
          {isLoading ? (
            <span className="text-xs text-muted-foreground">···</span>
          ) : isAuthenticated ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
                onClick={() => navigate("/dashboard")}
              >
                Library
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
                onClick={async () => {
                  await signOut();
                  navigate("/");
                }}
              >
                <LogOut className="mr-2 size-3.5" />
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
                onClick={() => navigate("/dashboard")}
              >
                Library
              </Button>
              <Button size="sm" onClick={() => navigate("/auth?returnTo=/dashboard")}>
                Sign in
                <ArrowRight className="ml-2 size-3.5" />
              </Button>
              <span className="sr-only">Sign in to continue to your library</span>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
