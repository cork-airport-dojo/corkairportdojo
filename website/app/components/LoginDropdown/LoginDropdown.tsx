import { ChevronDown, User, LogOut } from "lucide-react"
import { Link, useNavigate } from "react-router"
import { GitHubLoginButton } from "../auth/GitHubLoginButton/GitHubLoginButton"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { useAuthStore } from "~/store/use-auth-store"
import { useEffect } from "react"
import { Button } from "../ui/button"

import styles from './LoginDropdown.module.scss'

export default function LoginDropdown() {
  const {
    isAuthenticated,
    userName,
    avatarUrl,
    hydrate,
    signOut,
  } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  const handleLogout = async () => {
    await signOut();
    navigate("/", { replace: true });
  };



  if (isAuthenticated) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className={styles.profileButton}>
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={userName}
                className={styles.avatar}
              />
            ) : (
              <div className={styles.avatarFallback}>
                {userName.slice(0, 1).toUpperCase() || "U"}
              </div>
            )}

            <div className={styles.profileMeta}>
              <span className={styles.profileEyebrow}>Signed in</span>
              <span className={styles.profileName}>{userName}</span>
            </div>

            <ChevronDown size={16} className={styles.profileChevron} />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className={styles.profileMenu}>
          <DropdownMenuItem asChild>
            <Link to="/profile">
              <User size={16} />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          {/*<DropdownMenuItem>
                                <Settings size={16} />
                                <span>Settings</span>
                            </DropdownMenuItem>*/}
          <DropdownMenuItem onClick={() => void handleLogout()}>
            <LogOut size={16} />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

    )
  } else {
    return (
      <GitHubLoginButton
        redirectTo="/profile"
        className={styles.loginButton}
        label="Sign in with GitHub"
      />

    )
  }
}
