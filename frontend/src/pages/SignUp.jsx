import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { registerUser } from '../authSlice';
import { Brand, AuthCard, FormField, SocialButtons } from '../components/ui/AuthComponents';
import '../styles/theme.css';

const signUpSchema = z.object({
  firstname: z.string().min(3, 'Name must be at least 3 characters'),
  emailID:   z.string().email('Invalid email address'),
  password:  z.string().min(6, 'Password must be at least 6 characters'),
});

/* ── Password strength helper ── */
const getStrength = (pw) => {
  if (!pw) return null;
  let score = 0;
  if (pw.length >= 6)         score++;
  if (pw.length >= 10)        score++;
  if (/[A-Z]/.test(pw))       score++;
  if (/[0-9]/.test(pw))       score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { label: 'Weak',   color: 'var(--red)',    pct: '20%'  };
  if (score <= 3) return { label: 'Fair',   color: 'var(--yellow)', pct: '55%'  };
  if (score === 4) return { label: 'Good',  color: 'var(--accent)', pct: '80%'  };
  return               { label: 'Strong', color: 'var(--green)',  pct: '100%' };
};

function SignUp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [showPass, setShowPass] = useState(false);
  const [password, setPassword] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(signUpSchema),
  });

  useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [navigate, isAuthenticated]);

  const submitData = (data) => { dispatch(registerUser(data)); };

  const strength = getStrength(password);

  return (
    <div className="auth-bg">
      <AuthCard>
        <Brand />

        <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '20px', textAlign: 'center' }}>
          Create your account
        </h2>

        <form onSubmit={handleSubmit(submitData)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          <FormField label="First Name" error={errors.firstname?.message}>
            <input
              {...register('firstname')}
              type="text"
              placeholder="Your name"
              className={`auth-input${errors.firstname ? ' input-error' : ''}`}
            />
          </FormField>

          <FormField label="Email" error={errors.emailID?.message}>
            <input
              {...register('emailID')}
              type="email"
              placeholder="you@example.com"
              className={`auth-input${errors.emailID ? ' input-error' : ''}`}
            />
          </FormField>

          <FormField label="Password" error={errors.password?.message}>
            <div style={{ position: 'relative' }}>
              <input
                {...register('password')}
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                className={`auth-input${errors.password ? ' input-error' : ''}`}
                style={{ paddingRight: '42px' }}
                onChange={e => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPass(p => !p)}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '13px', padding: '2px' }}
              >
                {showPass ? '🙈' : '👁'}
              </button>
            </div>

            {/* Strength bar */}
            {strength && (
              <div style={{ marginTop: '6px' }}>
                <div style={{ height: '3px', background: 'var(--surface-3)', borderRadius: '99px', overflow: 'hidden' }}>
                  <div
                    className="strength-bar"
                    style={{ height: '100%', borderRadius: '99px', background: strength.color, '--strength-w': strength.pct, width: '0%' }}
                  />
                </div>
                <span style={{ fontSize: '11px', color: strength.color, marginTop: '4px', display: 'block' }}>
                  {strength.label} password
                </span>
              </div>
            )}
          </FormField>

          <button type="submit" className="auth-submit" disabled={isSubmitting} style={{ marginTop: '4px' }}>
            {isSubmitting
              ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><span className="spinner" /> Creating account…</span>
              : 'Create Account'
            }
          </button>
        </form>

        <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '12px', lineHeight: 1.5 }}>
          By signing up you agree to our{' '}
          <span style={{ color: 'var(--text-secondary)', cursor: 'pointer' }}>Terms</span>
          {' '}and{' '}
          <span style={{ color: 'var(--text-secondary)', cursor: 'pointer' }}>Privacy Policy</span>
        </p>

        <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)', margin: '16px 0' }}>
          Already have an account?{' '}
          <Link to="/login" className="auth-link">Sign in</Link>
        </p>

        <div className="auth-divider" style={{ marginBottom: '16px' }}>
          <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>OR CONTINUE WITH</span>
        </div>

        <SocialButtons />
      </AuthCard>
    </div>
  );
}

export default SignUp;