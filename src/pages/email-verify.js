import { useMutation } from '@tanstack/react-query';
import { useCallback, useEffect, useRef, useState } from 'react';
import { z } from 'zod';
import onEmailVerifyMutationFn from '../services/on-email-varify';
import useSearchQuery from '../hooks/use-search-query';

const emailSchema = z.object({
    email: z.string().email("Wrong Email Id passes")
});

const EmailVerify = ({ subscriptionType }) => {
    const plan = subscriptionType;
    const mode = (subscriptionType == "3DTRIAL") ? "TRIAL" : null;
    const [formValues, setFormValues] = useState({ email: '' });
    const [errors, setErrors] = useState({});
    const { mutate, isLoading: isPending } = useMutation({
        mutationFn: onEmailVerifyMutationFn,
        onSuccess: (res) => {
            window.location.href = res.redirectUrl;
        },
        onError: (error) => {
            console.error('Verify error:', error);
            setErrors({
                general: error.errorMessage
                    || 'Verify failed. Please try again.'
            });
        }
    });
    const emailRef = useRef(null);
    // Dynamically update input styles on error/success
    useEffect(() => {
        const applyInputStyle = (ref, hasError, value) => {
            if (ref?.current) {
                ref.current.style.border = hasError
                    ? '1px solid red'
                    : '1px solid rgb(86, 88, 105)';
            }
        };

        applyInputStyle(emailRef, !!errors.email, formValues.email);
    }, [errors, formValues]);

    const handleChange = (e) => {
        setFormValues({ ...formValues, [e.target.name]: e.target.value });
        if (e.target.value == "" || !e.target.value) {
            setErrors({
                ...errors, [e.target.name]: `this field can not be empty.`
            });
            return;
        }
        if (e.target.name == "password") {
            if ((e.target.value.split("").length) < 8) {
                setErrors({ ...errors, [e.target.name]: `this fields must have at least 8 characters.` });
            };
        }
        setErrors({ ...errors, [e.target.name]: '' }); // clear error on change
    };
    const handleSubmit = useCallback(async (e) => {
            // console.log(process.env.NEXT_PUBLIC_SERVER_BASE_URL);
            e.preventDefault();
            const result = emailSchema.safeParse(formValues);
            if (!result.success) {
                // format errors
                const fieldErrors = {};
                for (const issue of result.error.issues) {
                    fieldErrors[issue.path[0]] = issue.message;
                }
                setErrors(fieldErrors);
            }
            mutate({
                email: result.data.email,
                plan,
                mode: mode
            });
    }, [mode, formValues]);
    return (
        <div className="builder-block builder-a9975e070b944e9fba7286598d81a5bf-- css-yuvktl--">
            <div className="builder-block builder-f6cd5c3d9f1c4f9ba4054de2b74352ae-- css-1rs33wg" builder-id="builder-f6cd5c3d9f1c4f9ba4054de2b74352ae">
                <div className="builder-block builder-eb893e9dc3c5424cb854a27d20848708 css-nig1bt" builder-id="builder-eb893e9dc3c5424cb854a27d20848708">
                    {/* Logo */}
                    <picture>
                        <source srcSet="https://cdn.builder.io/api/v1/image/assets%2Fc68c3c02570a4745a92bbb7557b1e04c%2F51069bf2ebd2471dbf09276930414527?format=webp&amp;width=100 100w, https://cdn.builder.io/api/v1/image/assets%2Fc68c3c02570a4745a92bbb7557b1e04c%2F51069bf2ebd2471dbf09276930414527?format=webp&amp;width=200 200w, https://cdn.builder.io/api/v1/image/assets%2Fc68c3c02570a4745a92bbb7557b1e04c%2F51069bf2ebd2471dbf09276930414527?format=webp&amp;width=400 400w, https://cdn.builder.io/api/v1/image/assets%2Fc68c3c02570a4745a92bbb7557b1e04c%2F51069bf2ebd2471dbf09276930414527?format=webp&amp;width=800 800w, https://cdn.builder.io/api/v1/image/assets%2Fc68c3c02570a4745a92bbb7557b1e04c%2F51069bf2ebd2471dbf09276930414527?format=webp&amp;width=1200 1200w, https://cdn.builder.io/api/v1/image/assets%2Fc68c3c02570a4745a92bbb7557b1e04c%2F51069bf2ebd2471dbf09276930414527?format=webp&amp;width=1600 1600w, https://cdn.builder.io/api/v1/image/assets%2Fc68c3c02570a4745a92bbb7557b1e04c%2F51069bf2ebd2471dbf09276930414527?format=webp&amp;width=2000 2000w, https://cdn.builder.io/api/v1/image/assets%2Fc68c3c02570a4745a92bbb7557b1e04c%2F51069bf2ebd2471dbf09276930414527" type="image/webp" />
                        <img alt="GPTVictory Logo" loading="lazy" fetchpriority="auto" className="builder-image css-1hbf805" src="https://cdn.builder.io/api/v1/image/assets%2Fc68c3c02570a4745a92bbb7557b1e04c%2F51069bf2ebd2471dbf09276930414527" srcSet="https://cdn.builder.io/api/v1/image/assets%2Fc68c3c02570a4745a92bbb7557b1e04c%2F51069bf2ebd2471dbf09276930414527?width=100 100w, https://cdn.builder.io/api/v1/image/assets%2Fc68c3c02570a4745a92bbb7557b1e04c%2F51069bf2ebd2471dbf09276930414527?width=200 200w, https://cdn.builder.io/api/v1/image/assets%2Fc68c3c02570a4745a92bbb7557b1e04c%2F51069bf2ebd2471dbf09276930414527?width=400 400w, https://cdn.builder.io/api/v1/image/assets%2Fc68c3c02570a4745a92bbb7557b1e04c%2F51069bf2ebd2471dbf09276930414527?width=800 800w, https://cdn.builder.io/api/v1/image/assets%2Fc68c3c02570a4745a92bbb7557b1e04c%2F51069bf2ebd2471dbf09276930414527?width=1200 1200w, https://cdn.builder.io/api/v1/image/assets%2Fc68c3c02570a4745a92bbb7557b1e04c%2F51069bf2ebd2471dbf09276930414527?width=1600 1600w, https://cdn.builder.io/api/v1/image/assets%2Fc68c3c02570a4745a92bbb7557b1e04c%2F51069bf2ebd2471dbf09276930414527?width=2000 2000w, https://cdn.builder.io/api/v1/image/assets%2Fc68c3c02570a4745a92bbb7557b1e04c%2F51069bf2ebd2471dbf09276930414527" sizes="240px" />
                    </picture>
                    <div className="builder-image-sizer css-781yh5"> </div>
                </div>

                <div className='error-msg'>{errors?.general}</div>
                {/* Form */}
                {/* Old Form Tag */}
                {/* <form aria-label="Email Verification form" className="builder-block builder-a626c486dc1d4ea6a91368dd49f47d2f css-86zdk2" builder-id="builder-a626c486dc1d4ea6a91368dd49f47d2f"
                    onSubmit={handleSubmit}
                > */}
                <form aria-label="Email Verification form"
                    builder-id="builder-a626c486dc1d4ea6a91368dd49f47d2f"
                    onSubmit={handleSubmit}
                >
                    <h1 className="builder-block builder-0606fd4cae884f32ae570dd6f8456a99 css-1nt83du" builder-id="builder-0606fd4cae884f32ae570dd6f8456a99"><span className="builder-block builder-52427264232349fc99af2a48e4c05d8d builder-has-component css-vky7x4" builder-id="builder-52427264232349fc99af2a48e4c05d8d"><span className="builder-text css-1qggkls">Verify your email</span></span></h1>
                    <div className="builder-block builder-6694ebca9d1946498d115cea8dd55061 css-rn8l1b" builder-id="builder-6694ebca9d1946498d115cea8dd55061">
                        <label htmlFor="password" className="builder-block builder-870d3f0037dc4043aac45b190279fc12 css-1tzgbp3" builder-id="builder-870d3f0037dc4043aac45b190279fc12">
                            <span className="builder-block builder-4fb4b36374d343d39afdd4032bd52bd5 builder-has-component css-vky7x4" builder-id="builder-4fb4b36374d343d39afdd4032bd52bd5">
                                <span className="builder-text css-1qggkls">Email</span>
                            </span>
                        </label>
                        <input
                            id="email"
                            placeholder="Enter your email"
                            aria-describedby="password-error"
                            aria-invalid="false"
                            required=""
                            className="builder-block builder-ca5e32caa1d84951bf3a7cb2063372cd builder-2c2b99b230504b7d8a239ff528137758 builder-2c2b99b230504b7d8a239ff528137758 css-14mpe92" builder-id="builder-ca5e32caa1d84951bf3a7cb2063372cd"
                            name="email"
                            type="email"
                            value={formValues.email}
                            onChange={handleChange}
                            ref={emailRef}
                        />
                        {errors.email && <p className='error-msg'>{errors.email}</p>}
                    </div>

                    {/* Submit Button */}
                    <button aria-busy="false" className="builder-block builder-4726b8ffcc9941278da342a2826c8f26 builder-eed6c2bfcc104c4080b2173c2538ad28 builder-eed6c2bfcc104c4080b2173c2538ad28 css-6a9sin" builder-id="builder-4726b8ffcc9941278da342a2826c8f26" style={{ "cursor": "pointer" }}
                        type="submit"
                        disabled={isPending}
                    >
                        <span className="builder-block builder-2a198bb06e2b4151b3a33942269014a6 css-vky7x4" builder-id="builder-2a198bb06e2b4151b3a33942269014a6">
                            <span className="builder-block builder-0a9849f423354daa9ad3eb55ac572c1b builder-has-component css-vky7x4" builder-id="builder-0a9849f423354daa9ad3eb55ac572c1b">
                                <span className="builder-text css-1qggkls">{isPending ? 'Verifying...' : 'Verify Email'}</span>
                            </span>
                        </span>
                    </button>
                </form>
            </div>
        </div>
    )
};

export default EmailVerify;