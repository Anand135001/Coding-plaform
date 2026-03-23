import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { loginUser } from '../authSlice';
import { Brand, AuthCard, FormField, SocialButtons } from '../components/ui/AuthComponents';
import '../styles/theme.css';

const loginSchema = z.object({
  emailID:  z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [showPass, setShowPass] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  const submitData = (data) => { dispatch(loginUser(data)); };

  return (
    <div className="auth-bg">
      <AuthCard>
        <Brand />

        <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '20px', textAlign: 'center' }}>
          Welcome back
        </h2>

        <form onSubmit={handleSubmit(submitData)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

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
              />
              <button
                type="button"
                onClick={() => setShowPass(p => !p)}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '13px', padding: '2px' }}
              >
                {showPass ? '🙈' : '👁'}
              </button>
            </div>
          </FormField>

          <button type="submit" className="auth-submit" disabled={isSubmitting} style={{ marginTop: '4px' }}>
            {isSubmitting
              ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><span className="spinner" /> Signing in…</span>
              : 'Sign In'
            }
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)', margin: '18px 0' }}>
          Don't have an account?{' '}
          <Link to="/signup" className="auth-link">Create one</Link>
        </p>

        <div className="auth-divider" style={{ marginBottom: '16px' }}>
          <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>OR CONTINUE WITH</span>
        </div>

        <SocialButtons />
      </AuthCard>
    </div>
  );
}

export default Login;