import { useState } from "react"
import type { User, View } from "../../types"
import Button from "../common/Button"
import Icon from "../common/Icon"

export interface LoginViewProps {
  onLogin: (user: User) => void
  go: (v: View) => void
  showToast: (msg: string) => void
}

export function LoginView({ onLogin, go, showToast }: LoginViewProps) {
  const [mode, setMode] = useState<"login" | "register">("login")

  // Login form state
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [showLoginPass, setShowLoginPass] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)

  // Register form state
  const [regName, setRegName] = useState("")
  const [regEmail, setRegEmail] = useState("")
  const [regPhone, setRegPhone] = useState("")
  const [regPassword, setRegPassword] = useState("")
  const [showRegPass, setShowRegPass] = useState(false)

  // Validation errors
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!loginEmail.trim()) {
      setError("Please enter your email address.")
      return
    }
    if (!loginEmail.includes("@") || !loginEmail.includes(".")) {
      setError("Please enter a valid email address.")
      return
    }
    if (!loginPassword) {
      setError("Please enter your password.")
      return
    }
    if (loginPassword.length < 4) {
      setError("Password must be at least 4 characters.")
      return
    }

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      // Extract a pleasant display name from email or default
      const defaultName = loginEmail.split("@")[0]
      const capitalizedName =
        defaultName.charAt(0).toUpperCase() + defaultName.slice(1)

      const loggedUser: User = {
        id: "usr_" + Date.now().toString(36),
        name: capitalizedName.includes("Arjun")
          ? "Arjun Mehta"
          : capitalizedName,
        email: loginEmail.trim().toLowerCase(),
        phone: "+91 98765 43210",
        joinedDate: "April 2026",
      }

      onLogin(loggedUser)
      showToast(`Welcome back, ${loggedUser.name}!`)
      go("account")
    }, 600)
  }

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!regName.trim()) {
      setError("Please enter your full name.")
      return
    }
    if (
      !regEmail.trim() ||
      !regEmail.includes("@") ||
      !regEmail.includes(".")
    ) {
      setError("Please enter a valid email address.")
      return
    }
    if (!regPhone.trim() || regPhone.replace(/\D/g, "").length < 10) {
      setError("Please enter a valid 10-digit mobile number.")
      return
    }
    if (!regPassword || regPassword.length < 6) {
      setError("Password should be at least 6 characters.")
      return
    }

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      const newUser: User = {
        id: "usr_" + Date.now().toString(36),
        name: regName.trim(),
        email: regEmail.trim().toLowerCase(),
        phone: "+91 " + regPhone.replace(/\D/g, "").slice(-10),
        joinedDate: "April 2026",
      }

      onLogin(newUser)
      showToast(`Account created! Welcome to AVYR, ${newUser.name}.`)
      go("account")
    }, 600)
  }

  const handleDemoLogin = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      const demoUser: User = {
        id: "usr_demo_arjun",
        name: "Arjun Mehta",
        email: "arjun@example.com",
        phone: "+91 98765 43210",
        joinedDate: "April 2026",
      }
      onLogin(demoUser)
      showToast("Signed in as Arjun Mehta!")
      go("account")
    }, 400)
  }

  const handleForgotPassword = () => {
    if (!loginEmail.trim() || !loginEmail.includes("@")) {
      showToast("Please type your email above first.")
      return
    }
    showToast(`Password reset link sent to ${loginEmail}!`)
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Top Monogram & Heading */}
        <div className="auth-header">
          <div className="auth-monogram">
            <span>A</span>
          </div>
          <span className="eyebrow">Atelier Client Privilege</span>
          <h1>{mode === "login" ? "Sign In to AVYR" : "Create an Account"}</h1>
          <p>
            {mode === "login"
              ? "Access your curated wardrobe, saved delivery addresses, and bespoke orders."
              : "Experience handcrafted luxury with early access to limited artisanal drops."}
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="auth-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={mode === "login"}
            className={`auth-tab ${mode === "login" ? "active" : ""}`}
            onClick={() => {
              setMode("login")
              setError("")
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "register"}
            className={`auth-tab ${mode === "register" ? "active" : ""}`}
            onClick={() => {
              setMode("register")
              setError("")
            }}
          >
            New Account
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="auth-error-box" role="alert">
            <Icon name="close" size={14} />
            <span>{error}</span>
          </div>
        )}

        {/* 1. SIGN IN FORM */}
        {mode === "login" && (
          <form className="auth-form" onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label htmlFor="login-email">
                <span>Email Address</span>
                <span className="req">*</span>
              </label>
              <div className="input-wrap">
                <span className="input-icon">
                  <Icon name="mail" size={17} />
                </span>
                <input
                  id="login-email"
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="name@example.com"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div className="label-with-link">
                <label htmlFor="login-password">
                  <span>Password</span>
                  <span className="req">*</span>
                </label>
                <button
                  type="button"
                  className="text-link"
                  onClick={handleForgotPassword}
                >
                  Forgot password?
                </button>
              </div>
              <div className="input-wrap">
                <span className="input-icon">
                  <Icon name="lock" size={17} />
                </span>
                <input
                  id="login-password"
                  type={showLoginPass ? "text" : "password"}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="toggle-pass-btn"
                  onClick={() => setShowLoginPass(!showLoginPass)}
                  aria-label={showLoginPass ? "Hide password" : "Show password"}
                >
                  <Icon name={showLoginPass ? "eye-off" : "eye"} size={17} />
                </button>
              </div>
            </div>

            <div className="auth-remember-row">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Keep me signed in on this device</span>
              </label>
            </div>

            <Button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In to My Account"}{" "}
              <Icon name="arrow" size={15} />
            </Button>

            {/* Quick Demo Sign-in for immediate testing */}
            <div className="auth-divider">
              <span>OR QUICK TEST</span>
            </div>

            <button
              type="button"
              className="demo-login-btn"
              onClick={handleDemoLogin}
              disabled={loading}
            >
              <span className="demo-badge">1-Click</span>
              <span>Sign In as Demo Member (Arjun Mehta)</span>
            </button>
          </form>
        )}

        {/* 2. CREATE ACCOUNT FORM */}
        {mode === "register" && (
          <form className="auth-form" onSubmit={handleRegisterSubmit}>
            <div className="form-group">
              <label htmlFor="reg-name">
                <span>Full Name</span>
                <span className="req">*</span>
              </label>
              <div className="input-wrap">
                <span className="input-icon">
                  <Icon name="user" size={17} />
                </span>
                <input
                  id="reg-name"
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Arjun Mehta"
                  autoComplete="name"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="reg-email">
                <span>Email Address</span>
                <span className="req">*</span>
              </label>
              <div className="input-wrap">
                <span className="input-icon">
                  <Icon name="mail" size={17} />
                </span>
                <input
                  id="reg-email"
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="name@example.com"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="reg-phone">
                <span>Mobile Number</span>
                <span className="req">*</span>
              </label>
              <div className="input-wrap">
                <span className="input-icon">
                  <Icon name="phone" size={17} />
                </span>
                <input
                  id="reg-phone"
                  type="tel"
                  value={regPhone}
                  onChange={(e) =>
                    setRegPhone(e.target.value.replace(/[^\d\s+-]/g, ""))
                  }
                  placeholder="+91 98765 43210"
                  autoComplete="tel"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="reg-password">
                <span>Create Password (6+ characters)</span>
                <span className="req">*</span>
              </label>
              <div className="input-wrap">
                <span className="input-icon">
                  <Icon name="lock" size={17} />
                </span>
                <input
                  id="reg-password"
                  type={showRegPass ? "text" : "password"}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="toggle-pass-btn"
                  onClick={() => setShowRegPass(!showRegPass)}
                  aria-label={showRegPass ? "Hide password" : "Show password"}
                >
                  <Icon name={showRegPass ? "eye-off" : "eye"} size={17} />
                </button>
              </div>
            </div>

            <p className="auth-terms-note">
              By creating an account, you agree to AVYR Atelier’s Terms of
              Service and Privacy Policy.
            </p>

            <Button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account & Continue"}{" "}
              <Icon name="arrow" size={15} />
            </Button>
          </form>
        )}

        {/* Footer info */}
        <div className="auth-footer">
          <div className="auth-perks">
            <div>
              <Icon name="shield" size={16} />
              <span>256-Bit Encrypted Data</span>
            </div>
            <div>
              <Icon name="truck" size={16} />
              <span>Saved Shipping Preferences</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginView
