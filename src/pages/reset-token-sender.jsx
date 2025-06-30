import { z } from "zod";
import Cookies from "js-cookie";
import { useCallback, useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { resetTokenSenderMutationFn } from "../services/user-api";
import { useRouter } from "next/router";
const resetPSchema = z.object({
  email: z.string().email().trim().min(2),
  csrfToken: z.string().min(10),
});
const ResetTokenSender = () => {
  const authCSRFToken = Cookies.get("auth-csrf-token");
  const [formValues, setFormValues] = useState({
    email: "",
  });
  const router = useRouter();
  const [errors, setErrors] = useState({});
  // Mutation for Update Password
  const { mutate: resetTokenSender, isLoading: resetTokenSenderLoading } =
    useMutation({
      mutationFn: resetTokenSenderMutationFn,
      onSuccess: () => {
        setErrors({});
        router.push("/reset-password-email-sent");
      },
      onError: (error) => {
        setErrors((prev) => ({
          ...prev,
          general:
            error?.errorMessage ||
            error?.message ||
            "Something went wrong, please try again later.",
        }));
      },
    });
  const emailRef = useRef(null);
  // Dynamically update input styles on error/success
  useEffect(() => {
    const applyInputStyle = (ref, hasError, value) => {
      if (ref?.current) {
        ref.current.style.border = hasError
          ? "1px solid red"
          : "1px solid rgb(86, 88, 105)";
      }
    };

    applyInputStyle(emailRef, !!errors.email, formValues.email);
  }, [errors, formValues]);
  const handleChange = useCallback((e) => {
    setFormValues({ email: e.target.value });
    if (e.target.value == "" || !e.target.value) {
      setErrors({
        ...errors,
        email: `this field can not be empty.`,
      });
      return;
    }
    setErrors({ email: "" }); // clear error on change
  }, []);
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const result = resetPSchema.safeParse({
        ...formValues,
        csrfToken: authCSRFToken,
      });
      if (!result.success) {
        const fieldErrors = {};
        for (const issue of result.error.issues) {
          fieldErrors[issue.path[0]] = issue.message;
        }
        setErrors(fieldErrors);
        return prev;
      }
      // console.log({ resetCode: searchQuery.code, password: result.data.password, csrfToken: authCSRFToken });console.log(result.data);
      resetTokenSender(result.data);
    },
    [formValues]
  );
  return (
    <div className="builder-block builder-a9975e070b944e9fba7286598d81a5bf css-yuvktl">
      <div
        className="builder-block builder-f6cd5c3d9f1c4f9ba4054de2b74352ae css-1rs33wg"
        builder-id="builder-f6cd5c3d9f1c4f9ba4054de2b74352ae"
      >
        <div
          className="builder-block builder-eb893e9dc3c5424cb854a27d20848708 css-nig1bt"
          builder-id="builder-eb893e9dc3c5424cb854a27d20848708"
        >
          {/* Logo */}
          <picture>
            <source
              srcSet="https://cdn.builder.io/api/v1/image/assets%2Fc68c3c02570a4745a92bbb7557b1e04c%2F51069bf2ebd2471dbf09276930414527?format=webp&amp;width=100 100w, https://cdn.builder.io/api/v1/image/assets%2Fc68c3c02570a4745a92bbb7557b1e04c%2F51069bf2ebd2471dbf09276930414527?format=webp&amp;width=200 200w, https://cdn.builder.io/api/v1/image/assets%2Fc68c3c02570a4745a92bbb7557b1e04c%2F51069bf2ebd2471dbf09276930414527?format=webp&amp;width=400 400w, https://cdn.builder.io/api/v1/image/assets%2Fc68c3c02570a4745a92bbb7557b1e04c%2F51069bf2ebd2471dbf09276930414527?format=webp&amp;width=800 800w, https://cdn.builder.io/api/v1/image/assets%2Fc68c3c02570a4745a92bbb7557b1e04c%2F51069bf2ebd2471dbf09276930414527?format=webp&amp;width=1200 1200w, https://cdn.builder.io/api/v1/image/assets%2Fc68c3c02570a4745a92bbb7557b1e04c%2F51069bf2ebd2471dbf09276930414527?format=webp&amp;width=1600 1600w, https://cdn.builder.io/api/v1/image/assets%2Fc68c3c02570a4745a92bbb7557b1e04c%2F51069bf2ebd2471dbf09276930414527?format=webp&amp;width=2000 2000w, https://cdn.builder.io/api/v1/image/assets%2Fc68c3c02570a4745a92bbb7557b1e04c%2F51069bf2ebd2471dbf09276930414527"
              type="image/webp"
            />
            <img
              alt="GPTVictory Logo"
              loading="lazy"
              fetchpriority="auto"
              className="builder-image css-1hbf805"
              src="https://cdn.builder.io/api/v1/image/assets%2Fc68c3c02570a4745a92bbb7557b1e04c%2F51069bf2ebd2471dbf09276930414527"
              srcSet="https://cdn.builder.io/api/v1/image/assets%2Fc68c3c02570a4745a92bbb7557b1e04c%2F51069bf2ebd2471dbf09276930414527?width=100 100w, https://cdn.builder.io/api/v1/image/assets%2Fc68c3c02570a4745a92bbb7557b1e04c%2F51069bf2ebd2471dbf09276930414527?width=200 200w, https://cdn.builder.io/api/v1/image/assets%2Fc68c3c02570a4745a92bbb7557b1e04c%2F51069bf2ebd2471dbf09276930414527?width=400 400w, https://cdn.builder.io/api/v1/image/assets%2Fc68c3c02570a4745a92bbb7557b1e04c%2F51069bf2ebd2471dbf09276930414527?width=800 800w, https://cdn.builder.io/api/v1/image/assets%2Fc68c3c02570a4745a92bbb7557b1e04c%2F51069bf2ebd2471dbf09276930414527?width=1200 1200w, https://cdn.builder.io/api/v1/image/assets%2Fc68c3c02570a4745a92bbb7557b1e04c%2F51069bf2ebd2471dbf09276930414527?width=1600 1600w, https://cdn.builder.io/api/v1/image/assets%2Fc68c3c02570a4745a92bbb7557b1e04c%2F51069bf2ebd2471dbf09276930414527?width=2000 2000w, https://cdn.builder.io/api/v1/image/assets%2Fc68c3c02570a4745a92bbb7557b1e04c%2F51069bf2ebd2471dbf09276930414527"
              sizes="240px"
            />
          </picture>
          <div className="builder-image-sizer css-781yh5"> </div>
        </div>
        <div style={{ color: "red" }}>{errors?.general}</div>
        {/* Form */}
        <form
          aria-label="Registration form"
          className="builder-block builder-a626c486dc1d4ea6a91368dd49f47d2f css-86zdk2"
          builder-id="builder-a626c486dc1d4ea6a91368dd49f47d2f"
          onSubmit={handleSubmit}
        >
          <h1
            className="builder-block builder-0606fd4cae884f32ae570dd6f8456a99 css-1nt83du"
            builder-id="builder-0606fd4cae884f32ae570dd6f8456a99"
          >
            <span
              className="builder-block builder-52427264232349fc99af2a48e4c05d8d builder-has-component css-vky7x4"
              builder-id="builder-52427264232349fc99af2a48e4c05d8d"
            >
              <span className="builder-text css-1qggkls">
                Reset your password
              </span>
            </span>
          </h1>
          {/* Email */}
          <div
            className="builder-block builder-71ad7ae1631d46658b8a30b1adc9eb89 css-rn8l1b"
            builder-id="builder-71ad7ae1631d46658b8a30b1adc9eb89"
          >
            <label
              htmlFor="email"
              className="builder-block builder-5446fba486424e94afb1405e284e3572 css-1tzgbp3"
              builder-id="builder-5446fba486424e94afb1405e284e3572"
            >
              <span
                className="builder-block builder-5458e77326004eee988b5e146b0f3650 builder-has-component css-vky7x4"
                builder-id="builder-5458e77326004eee988b5e146b0f3650"
              >
                <span className="builder-text css-1qggkls">Email</span>
              </span>
            </label>
            <input
              id="email"
              placeholder="Enter your Email"
              aria-describedby="email-error"
              aria-invalid="false"
              required=""
              className="builder-block builder-f0ed78463efb45eba47e05aff02d7ba2 builder-2c2b99b230504b7d8a239ff528137758 builder-2c2b99b230504b7d8a239ff528137758 css-14mpe92"
              builder-id="builder-f0ed78463efb45eba47e05aff02d7ba2"
              name="email"
              type="email"
              value={formValues.email}
              onChange={handleChange}
              ref={emailRef}
            />
            {errors.email && <p className="error-msg">{errors.email}</p>}
          </div>
          {/* Submit Button */}
          <button
            aria-busy="false"
            className="builder-block builder-4726b8ffcc9941278da342a2826c8f26 builder-eed6c2bfcc104c4080b2173c2538ad28 builder-eed6c2bfcc104c4080b2173c2538ad28 css-6a9sin"
            builder-id="builder-4726b8ffcc9941278da342a2826c8f26"
            style={{ cursor: "pointer" }}
            type="submit"
            disabled={resetTokenSenderLoading}
          >
            <span
              className="builder-block builder-2a198bb06e2b4151b3a33942269014a6 css-vky7x4"
              builder-id="builder-2a198bb06e2b4151b3a33942269014a6"
            >
              <span
                className="builder-block builder-0a9849f423354daa9ad3eb55ac572c1b builder-has-component css-vky7x4"
                builder-id="builder-0a9849f423354daa9ad3eb55ac572c1b"
              >
                <span className="builder-text css-1qggkls">
                  {resetTokenSenderLoading ? "Loading..." : "Verify Email"}
                </span>
              </span>
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetTokenSender;
