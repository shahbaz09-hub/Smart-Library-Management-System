import React, { Suspense, lazy, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowRight,
  Eye,
  EyeOff,
  Library,
  Lock,
  Mail,
  ShieldPlus,
  Sparkles,
  UserPlus,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { AdminRegistrationModal } from './admin-registration-modal';
import { StudentRegistrationModal } from './student-registration-modal';
import './auth-page-3d.css';

const Auth3DScene = lazy(() => import('./auth-3d-scene'));

type LoginPhase = 'idle' | 'opening' | 'success';

interface AuthPageProps {
  onLogin: (email: string, password: string) => Promise<void> | void;
  onRegister: (name: string, email: string, password: string, confirmPassword?: string) => Promise<void> | void;
  onStudentRegister?: (student: {
    name: string;
    rollNumber: string;
    email: string;
    department: string;
    semester: number;
    password: string;
    confirmPassword?: string;
  }) => Promise<void> | void;
  onAdminRegister?: (admin: {
    name: string;
    email: string;
    password: string;
    confirmPassword?: string;
  }) => Promise<void> | void;
}

export function AuthPage({ onLogin, onStudentRegister, onAdminRegister }: AuthPageProps) {
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<'email' | 'password' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loginPhase, setLoginPhase] = useState<LoginPhase>('idle');
  const [statusText, setStatusText] = useState('');
  const [isCardHovered, setIsCardHovered] = useState(false);

  const [showStudentRegistration, setShowStudentRegistration] = useState(false);
  const [showAdminRegistration, setShowAdminRegistration] = useState(false);

  const isEmailActive = focusedField === 'email' || loginForm.email.trim().length > 0;
  const isPasswordActive = focusedField === 'password' || loginForm.password.trim().length > 0;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!loginForm.email || !loginForm.password) {
      toast.error('Please enter email and password.');
      return;
    }

    setIsLoading(true);
    setLoginPhase('opening');
    setStatusText('Unsealing the digital archive...');

    try {
      await new Promise((resolve) => setTimeout(resolve, 750));
      await onLogin(loginForm.email, loginForm.password);
      setLoginPhase('success');
      setStatusText('Access granted. Launching your dashboard...');
    } catch (error: any) {
      setLoginPhase('idle');
      setStatusText('Access denied. Please verify your credentials.');
      toast.error(error?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setStatusText('');
      }, 2200);
    }
  };

  const fillDemoCredentials = (type: 'user' | 'admin') => {
    if (type === 'admin') {
      setLoginForm({ email: 'admin@demo.com', password: 'demo123' });
      return;
    }
    setLoginForm({ email: 'user@demo.com', password: 'demo123' });
  };

  return (
    <>
      <div className="futuristic-auth-shell">
        <div className="auth-grid">
          <section className="auth-scene-shell">
            <Suspense fallback={<div className="auth-scene-fallback" />}>
              <Auth3DScene cardHovered={isCardHovered} loginPhase={loginPhase} />
            </Suspense>

            <motion.div
              className="auth-copy-panel"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="auth-copy-kicker">
                <Sparkles size={14} />
                Next Gen Library Experience
              </div>
              <h2 className="auth-copy-title">
                Smart Library <span>Management System</span>
              </h2>
              <p className="auth-copy-subtitle">
                Step into an immersive knowledge interface where credentials unlock a living digital library.
                Every login feels like opening a portal to your academic universe.
              </p>
            </motion.div>
          </section>

          <section className="auth-card-wrap">
            <motion.div
              className="auth-glass-card"
              initial={{ opacity: 0, x: 40, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              onMouseEnter={() => setIsCardHovered(true)}
              onMouseLeave={() => setIsCardHovered(false)}
            >
              <div className="auth-card-heading">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 text-[#d4f1f4]"
                >
                  <Library size={18} />
                  <span>Library Access Portal</span>
                </motion.div>

                <h1>Welcome Back</h1>
                <p>Login to continue your books, analytics, and personalized recommendations.</p>
              </div>

              <form className="auth-form" onSubmit={handleSubmit}>
                <motion.div className="auth-input-wrap" whileHover={{ y: -1 }}>
                  <Mail className="auth-input-icon" />
                  <label className={`auth-floating-label ${isEmailActive ? 'is-active' : ''}`} htmlFor="login-email">
                    Email or Username
                  </label>
                  <input
                    id="login-email"
                    className="auth-input"
                    type="email"
                    value={loginForm.email}
                    placeholder="you@college.edu"
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField((field) => (field === 'email' ? null : field))}
                    onChange={(event) => setLoginForm((previous) => ({ ...previous, email: event.target.value }))}
                    disabled={isLoading}
                    autoComplete="email"
                  />
                </motion.div>

                <motion.div className="auth-input-wrap" whileHover={{ y: -1 }}>
                  <Lock className="auth-input-icon" />
                  <label
                    className={`auth-floating-label ${isPasswordActive ? 'is-active' : ''}`}
                    htmlFor="login-password"
                  >
                    Password
                  </label>
                  <input
                    id="login-password"
                    className="auth-input"
                    type={showPassword ? 'text' : 'password'}
                    value={loginForm.password}
                    placeholder="Enter your password"
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField((field) => (field === 'password' ? null : field))}
                    onChange={(event) => setLoginForm((previous) => ({ ...previous, password: event.target.value }))}
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="auth-password-toggle"
                    onClick={() => setShowPassword((value) => !value)}
                    disabled={isLoading}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  <Button type="submit" disabled={isLoading} className="auth-primary-btn">
                    {isLoading ? (
                      <span className="auth-loading-ring" />
                    ) : (
                      <>
                        Login to Smart Library
                        <ArrowRight size={18} />
                      </>
                    )}
                  </Button>
                </motion.div>

                <div className="auth-demo-links">
                  <button
                    type="button"
                    className="auth-demo-pill"
                    onClick={() => fillDemoCredentials('user')}
                    disabled={isLoading}
                  >
                    Demo Student
                  </button>
                  <button
                    type="button"
                    className="auth-demo-pill"
                    onClick={() => fillDemoCredentials('admin')}
                    disabled={isLoading}
                  >
                    Demo Admin
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={statusText || 'idle'}
                    className="auth-status"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.28 }}
                  >
                    {statusText || 'Use your credentials to open the 3D knowledge vault.'}
                  </motion.div>
                </AnimatePresence>

                <div className="auth-secondary-actions">
                  <button
                    type="button"
                    className="auth-outline-btn"
                    onClick={() => setShowStudentRegistration(true)}
                    disabled={isLoading}
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <UserPlus size={15} /> Register Student
                    </span>
                  </button>

                  <button
                    type="button"
                    className="auth-outline-btn"
                    onClick={() => setShowAdminRegistration(true)}
                    disabled={isLoading}
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <ShieldPlus size={15} /> Register Admin
                    </span>
                  </button>
                </div>

                <div className="auth-credential-note">
                  Default demo password: <span>demo123</span>
                </div>
              </form>
            </motion.div>
          </section>
        </div>
      </div>

      <StudentRegistrationModal
        isOpen={showStudentRegistration}
        onClose={() => setShowStudentRegistration(false)}
        onRegister={async (student) => {
          if (!onStudentRegister) {
            toast.error('Student registration is not configured yet.');
            return;
          }

          setIsLoading(true);
          try {
            await onStudentRegister(student);
            toast.success('Student registered successfully.');
            setShowStudentRegistration(false);
          } catch (error: any) {
            toast.error(error?.message || 'Failed to register student.');
          } finally {
            setIsLoading(false);
          }
        }}
      />

      <AdminRegistrationModal
        isOpen={showAdminRegistration}
        onClose={() => setShowAdminRegistration(false)}
        onRegister={async (admin) => {
          if (!onAdminRegister) {
            toast.error('Admin registration is not configured yet.');
            return;
          }

          setIsLoading(true);
          try {
            await onAdminRegister(admin);
            toast.success('Admin registered successfully.');
            setShowAdminRegistration(false);
          } catch (error: any) {
            toast.error(error?.message || 'Failed to register admin.');
          } finally {
            setIsLoading(false);
          }
        }}
      />
    </>
  );
}
