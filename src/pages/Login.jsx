import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button, Loading, Textbox } from "../components";
import { useLoginMutation } from "../redux/slices/api/authApiSlice";
import { setCredentials } from "../redux/slices/authSlice";
import { useEffect } from "react";

const Login = () => {
  const { user } = useSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async (data) => {
    try {
      const res = await login(data).unwrap();

      dispatch(setCredentials(res));
      navigate("/");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  useEffect(() => {
    user && navigate("/dashboard");
  }, [user]);

  return (
    <div className='w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-slate-900 relative overflow-hidden'>
      {/* Animated background elements */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30 animate-pulse'></div>
        <div className='absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 dark:bg-indigo-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30 animate-pulse' style={{animationDelay: '2s'}}></div>
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-20 animate-pulse' style={{animationDelay: '4s'}}></div>
      </div>

      <div className='w-full max-w-6xl mx-auto px-4 py-8 flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10'>
        {/* Left side - Branding */}
        <div className='flex-1 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6'>
          <div className='inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-indigo-100 dark:border-gray-700'>
            <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></div>
            <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
              Your productivity hub
            </span>
          </div>

          <div className='space-y-3'>
            <h1 className='text-5xl lg:text-6xl xl:text-7xl font-bold'>
              <span className='bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent'>
                TaskFlow
              </span>
            </h1>
            <p className='text-xl lg:text-2xl text-gray-600 dark:text-gray-400 font-light'>
              Streamline your workflow,<br />amplify your success
            </p>
          </div>

          <div className='flex flex-wrap gap-4 pt-4'>
            <div className='flex items-center gap-2 text-gray-600 dark:text-gray-400'>
              <svg className='w-5 h-5 text-indigo-600' fill='currentColor' viewBox='0 0 20 20'>
                <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
              </svg>
              <span className='text-sm'>Team Collaboration</span>
            </div>
            <div className='flex items-center gap-2 text-gray-600 dark:text-gray-400'>
              <svg className='w-5 h-5 text-indigo-600' fill='currentColor' viewBox='0 0 20 20'>
                <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
              </svg>
              <span className='text-sm'>Real-time Sync</span>
            </div>
            <div className='flex items-center gap-2 text-gray-600 dark:text-gray-400'>
              <svg className='w-5 h-5 text-indigo-600' fill='currentColor' viewBox='0 0 20 20'>
                <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
              </svg>
              <span className='text-sm'>Secure & Private</span>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className='w-full lg:w-auto lg:flex-shrink-0'>
          <div className='w-full md:w-[440px] bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-10 border border-gray-100 dark:border-gray-700'>
            <div className='space-y-2 mb-8'>
              <h2 className='text-3xl font-bold text-gray-900 dark:text-white'>
                Welcome back
              </h2>
              <p className='text-gray-500 dark:text-gray-400'>
                Sign in to continue to your workspace
              </p>
            </div>

            <form onSubmit={handleSubmit(handleLogin)} className='space-y-6'>
              <div className='space-y-4'>
                <Textbox
                  placeholder='Enter your email'
                  type='email'
                  name='email'
                  label='Email Address'
                  className='w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400 px-4 py-3 transition-colors'
                  register={register("email", {
                    required: "Email Address is required!",
                  })}
                  error={errors.email ? errors.email.message : ""}
                />
                
                <Textbox
                  placeholder='Enter your password'
                  type='password'
                  name='password'
                  label='Password'
                  className='w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400 px-4 py-3 transition-colors'
                  register={register("password", {
                    required: "Password is required!",
                  })}
                  error={errors.password ? errors.password?.message : ""}
                />
              </div>

              <div className='flex items-center justify-between text-sm'>
                <label className='flex items-center gap-2 cursor-pointer text-gray-600 dark:text-gray-400'>
                  <input type='checkbox' className='w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500' />
                  <span>Remember me</span>
                </label>
                <a href='#' className='text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium'>
                  Forgot password?
                </a>
              </div>

              {isLoading ? (
                <Loading />
              ) : (
                <Button
                  type='submit'
                  label='Sign In'
                  className='w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/50 transition-all duration-200 transform hover:scale-[1.02]'
                />
              )}

              <div className='relative'>
                <div className='absolute inset-0 flex items-center'>
                  <div className='w-full border-t border-gray-200 dark:border-gray-700'></div>
                </div>
                <div className='relative flex justify-center text-sm'>
                  <span className='px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400'>
                    or continue with
                  </span>
                </div>
              </div>

              <div className='grid grid-cols-2 gap-3'>
                <button
                  type='button'
                  className='flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
                >
                  <svg className='w-5 h-5' viewBox='0 0 24 24'>
                    <path fill='#4285F4' d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z' />
                    <path fill='#34A853' d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z' />
                    <path fill='#FBBC05' d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z' />
                    <path fill='#EA4335' d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z' />
                  </svg>
                  <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>Google</span>
                </button>
                <button
                  type='button'
                  className='flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
                >
                  <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                    <path d='M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z' />
                  </svg>
                  <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>GitHub</span>
                </button>
              </div>

              <p className='text-center text-sm text-gray-600 dark:text-gray-400'>
                Don't have an account?{' '}
                <a href='#' className='text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold'>
                  Sign up for free
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;