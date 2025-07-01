import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, Loader } from 'lucide-react'; // Removed Loader2 as only Loader is used

import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from '@/components/ui/input-otp';
import { handleError, handleSuccess } from '@/utils';
import { useState } from 'react';
import { useNavigate } from 'react-router'; // Removed Navigate as it's not directly used for rendering
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ResetPassword() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [loading, setLoading] = useState(false);
    const [resetToken, setResetToken] = useState(''); // resetToken is set but not used
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);


    const handleSendOtp = async () => {
        if (!email) return handleError('Please enter your email.');

        setLoading(true);
        try {
            const res = await fetch('https://prep-ai-backend.onrender.com/api/auth/send-reset-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();

            if (res.ok && data.success) {
                handleSuccess(data.message || 'OTP sent successfully!');
                setStep(2);
            } else {
                handleError(data.message || 'Failed to send OTP');
            }
        } catch (error) {
            handleError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (otp.length !== 6) return handleError('Please enter a valid 6-digit OTP.');

        setLoading(true);
        try {
            const res = await fetch('https://prep-ai-backend.onrender.com/api/auth/verify-reset-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp }),
            });
            const data = await res.json();

            if (res.ok && data.success) {
                handleSuccess('OTP Verified. Please reset your password.');
                setResetToken(data.token); // Store the token, though it's not explicitly used in the current reset-password API call
                setStep(3);
            } else {
                handleError(data.message || 'Invalid OTP');
            }
        } catch (error) {
            handleError('OTP verification failed.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (password.length < 6) return handleError('Password must be at least 6 characters.');
        if (password !== confirm) return handleError('Passwords do not match.');

        setLoading(true);
        try {
            const res = await fetch(`https://prep-ai-backend.onrender.com/api/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, newPassword: password }),
            });
            const data = await res.json();

            if (res.ok && data.success) {
                handleSuccess('Password reset successfully!');
                // Reset all fields
                setStep(1); // Potentially navigate to sign-in, so resetting step to 1 is a good idea.
                setEmail('');
                setOtp('');
                setPassword('');
                setConfirm('');
                setResetToken('');
                // setStep(3); // This line seems contradictory if you're navigating away. Removing this.
                setTimeout(() => {
                    navigate('/sign-in');
                }, 1000);
            } else {
                handleError(data.message || 'Reset failed.');
            }
        } catch (error) {
            handleError('Password reset failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-blue-50 dark:bg-[#000336] px-4 transition-colors duration-300">
            <div className="bg-white dark:bg-gray-900 border border-blue-100 dark:border-gray-700 shadow-md dark:shadow-lg dark:shadow-blue-950 rounded-xl p-8 w-full max-w-md space-y-6 text-center">
                <h2 className="text-2xl font-semibold text-blue-800 dark:text-blue-300">Reset Password</h2>

                {step === 1 && (
                    <>
                        <p className="text-sm text-blue-600 dark:text-gray-400 mb-4">Enter your email to receive an OTP.</p>
                        <Input
                            className="text-blue-800 shadow-sm shadow-blue-800
                                       dark:text-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:shadow-blue-950"
                            type="email"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Button
                            onClick={handleSendOtp}
                            disabled={loading}
                            className="w-full bg-blue-600 text-white
                                       dark:bg-blue-700 dark:hover:bg-blue-800"
                        >
                            {loading ? (
                                <span className="flex items-center">
                                    <Loader className="mr-2 h-4 w-4 animate-spin" /> {/* Spinning icon */}
                                    Sending...
                                </span>
                            ) : 'Send OTP'}
                        </Button>
                    </>
                )}

                {step === 2 && (
                    <>
                        <p className="text-sm text-blue-600 dark:text-gray-400 mb-4">
                            Enter the OTP sent to your email <span className='text-blue-900 dark:text-blue-200 font-medium'>
                                {email}
                            </span>
                        </p>
                        <div className="flex justify-center">
                            <InputOTP maxLength={6} value={otp} onChange={(val) => setOtp(val)}>
                                <InputOTPGroup>
                                    <InputOTPSlot index={0} className="text-blue-800 shadow-sm shadow-blue-800
                                                                       dark:text-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:shadow-blue-950" />
                                    <InputOTPSlot index={1} className="text-blue-800 shadow-sm shadow-blue-800
                                                                       dark:text-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:shadow-blue-950" />
                                    <InputOTPSlot index={2} className="text-blue-800 shadow-sm shadow-blue-800
                                                                       dark:text-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:shadow-blue-950" />
                                </InputOTPGroup>
                                <InputOTPSeparator className="dark:text-gray-400" /> {/* Added dark mode for separator */}
                                <InputOTPGroup>
                                    <InputOTPSlot index={3} className="text-blue-800 shadow-sm shadow-blue-800
                                                                       dark:text-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:shadow-blue-950" />
                                    <InputOTPSlot index={4} className="text-blue-800 shadow-sm shadow-blue-800
                                                                       dark:text-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:shadow-blue-950" />
                                    <InputOTPSlot index={5} className="text-blue-800 shadow-sm shadow-blue-800
                                                                       dark:text-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:shadow-blue-950" />
                                </InputOTPGroup>
                            </InputOTP>
                        </div>

                        <Button
                            onClick={handleVerifyOtp}
                            disabled={otp.length !== 6}
                            className="w-full bg-blue-600 text-white mt-4
                                       dark:bg-blue-700 dark:hover:bg-blue-800"
                        >
                            {loading ? (
                                <span className="flex items-center">
                                    <Loader className="mr-2 h-4 w-4 animate-spin" /> {/* Spinning icon */}
                                    Verifying...
                                </span>
                            ) : 'Verify OTP'}
                        </Button>
                    </>
                )}

                {step === 3 && (
                    <>
                        <p className="text-sm text-blue-600 dark:text-gray-400 mb-4">Enter your new password.</p>

                        <div className="relative">
                            <Input
                                className="text-blue-800 shadow-sm shadow-blue-800 pr-10
                                           dark:text-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:shadow-blue-950"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="New Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 dark:text-blue-400"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        <div className="relative mt-4">
                            <Input
                                className="text-blue-800 shadow-sm shadow-blue-800 pr-10
                                           dark:text-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:shadow-blue-950"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Confirm Password"
                                value={confirm}
                                onChange={(e) => setConfirm(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 dark:text-blue-400"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        <Button
                            onClick={handleResetPassword}
                            className="w-full bg-blue-600 text-white mt-4
                                       dark:bg-blue-700 dark:hover:bg-blue-800"
                        >
                            {loading ? (
                                <span className="flex items-center">
                                    <Loader className="mr-2 h-4 w-4 animate-spin" /> {/* Spinning icon */}
                                    Resetting...
                                </span>
                            ) : 'Reset Password'}
                        </Button>
                    </>
                )}

            </div>
            <ToastContainer />
        </div>
    );
}

export default ResetPassword;