import { useMutation } from "@tanstack/react-query";
import { Loader, Trash, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { setErrorMap, z } from "zod";
import { AdminDashboardLayout } from "../../../components/dashboard-layout";
import {
  createUserMutationFn,
  deleteUserByAdminMutationFn,
  getUsersByAddedByAdmin,
} from "../../../services/user-api";
import styles from "../../../styles/admin_dashboard.module.css";
import { useGlobalContext } from "../../../components/global-context";

const MyUsers = () => {
  const { addedUserQuery } = useGlobalContext();
  const data = addedUserQuery?.data;
  const isLoading = addedUserQuery?.isFetching;
  const refetchUsers = addedUserQuery?.invalidate;
  const [isCreating, setIsCreating] = useState(false);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState({});
  //   const [isLoading, setIsLoading] = useState(false);
  //   const fetchUsersAddedByAdmin = async () => {
  //     setIsLoading(true);
  //     try {
  //       const users = await getUsersByAddedByAdmin();
  //       setUsers(users || []);
  //       setIsLoading(false);
  //     } catch (error) {
  //       console.error("Error fetching Users:", error);
  //       setIsLoading(false);
  //     }
  //   };
  //   // Fetch pending events from the API
  //   useEffect(() => {
  //     fetchUsersAddedByAdmin();
  //   }, []);
  useEffect(() => {
    if (data) {
      setUsers(data);
    }
  }, [data]);
  return (
    <AdminDashboardLayout>
      <div style={{ padding: "2rem", width: "100%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          {!isCreating ? <h1> Created Users</h1> : <span></span>}
          <div>
            <button
              style={{
                background: "transparent",
                border: "1px solid white",
                color: "white",
                padding: "0.5rem 1rem",
                cursor: "pointer",
                marginRight: "0.75rem",
              }}
              onClick={() => setIsCreating((prev) => !prev)}
              //   disabled={isLoading[customerId]}
            >
              {!isCreating ? "Create User" : <X />}
            </button>
            {!isCreating && (
              <button
                style={{
                  background: "transparent",
                  border: "1px solid white",
                  color: "white",
                  padding: "0.5rem 1rem",
                  cursor: "pointer",
                }}
                onClick={refetchUsers}
              >
                Refresh
              </button>
            )}
          </div>
        </div>
        {error?.message && <div className="error-msg">{error.message}</div>}
        {!isCreating && (
          <div className={styles.wrapper}>
            {!isLoading && users?.length > 0 && (
              <table className={styles.table}>
                <thead className={styles.thead}>
                  <tr>
                    <th className={styles.th}>#</th>
                    <th className={styles.th}>Email</th>
                    <th className={styles.th}>Plan</th>
                    <th className={styles.th}>Action</th>
                  </tr>
                </thead>
                {!isLoading && users?.length > 0 && (
                  <tbody>
                    {users?.map((user, idx) => {
                      return (
                        <User
                          key={user.id}
                          user={user}
                          setUsers={setUsers}
                          idx={idx}
                          setError={setError}
                        />
                      );
                    })}
                  </tbody>
                )}
                {isLoading && <Loader className="spin_loader" />}
              </table>
            )}
          </div>
        )}
        {isCreating && (
          <CreatingUserForm
            setIsCreating={setIsCreating}
            fetchUsersAddedByAdmin={addedUserQuery.invalidate}
          />
        )}
        {!isCreating && users.length == 0 && !isLoading && (
          <div style={{ marginTop: "1rem" }}>No created users found.</div>
        )}
        {isLoading && (
          <div>
            <Loader className="spin_loader" />
          </div>
        )}
        {/* <Paginate setPage={setPage} page={page} totalPages={data?.totalPages} /> */}
      </div>
    </AdminDashboardLayout>
  );
};
const userFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  plan: z.enum(["basic", "pro"]).default("basic").optional(),
});
const CreatingUserForm = ({ setIsCreating, fetchUsersAddedByAdmin }) => {
  const [formValues, setFormValues] = useState({ email: "", plan: "basic" });
  const [errors, setErrors] = useState({});
  const emailRef = useRef(null);
  const planRef = useRef(null);
  const { mutate: createUser, isLoading: isPending } = useMutation({
    mutationFn: createUserMutationFn,
    onError: (error) => {
      const message =
        error?.errorMessage || error?.message || "Something went wrong.";
      setErrors((prev) => ({ ...prev, general: message }));
    },
    onSuccess: () => {
      fetchUsersAddedByAdmin();
      setIsCreating(false);
    },
  });
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
    applyInputStyle(planRef, !!errors.plan, formValues.plan);
  }, [errors, formValues]);
  const handleChange = useCallback((e) => {
    setFormValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (e.target.value == "" || !e.target.value) {
      setErrors({
        ...errors,
        [e.target.name]: `this field can not be empty.`,
      });
      return;
    }
    setErrors((prev) => ({ ...prev, [e.target.name]: "" })); // clear error on change
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = userFormSchema.safeParse(formValues);
    if (!result.success) {
      // format errors
      const fieldErrors = {};
      for (const issue of result.error.issues) {
        fieldErrors[issue.path[0]] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    createUser({ ...formValues });
  };
  return (
    <form
      onSubmit={handleSubmit}
      style={{ maxWidth: "50%", marginInline: "auto", marginTop: "2rem" }}
    >
      <h1 style={{ marginBottom: "2rem" }}>Creating User</h1>
      {errors.general && <div className="error-msg">{errors?.general}</div>}
      <div
        className="builder-block builder-6694ebca9d1946498d115cea8dd55061 css-rn8l1b"
        builder-id="builder-6694ebca9d1946498d115cea8dd55061"
      >
        <label
          htmlFor="email"
          className="builder-block builder-870d3f0037dc4043aac45b190279fc12 css-1tzgbp3"
          builder-id="builder-870d3f0037dc4043aac45b190279fc12"
        >
          <span
            className="builder-block builder-4fb4b36374d343d39afdd4032bd52bd5 builder-has-component css-vky7x4"
            builder-id="builder-4fb4b36374d343d39afdd4032bd52bd5"
          >
            <span className="builder-text css-1qggkls">Email</span>
          </span>
        </label>
        <input
          id="email"
          placeholder="Enter your email"
          aria-describedby="password-error"
          aria-invalid="false"
          required=""
          className="builder-block builder-ca5e32caa1d84951bf3a7cb2063372cd builder-2c2b99b230504b7d8a239ff528137758 builder-2c2b99b230504b7d8a239ff528137758 css-14mpe92"
          builder-id="builder-ca5e32caa1d84951bf3a7cb2063372cd"
          name="email"
          type="email"
          value={formValues.email}
          onChange={handleChange}
          ref={emailRef}
        />
        {errors.email && <p className="error-msg">{errors.email}</p>}
      </div>
      {/* Plan */}
      <div
        className="builder-block builder-6694ebca9d1946498d115cea8dd55061 css-rn8l1b"
        builder-id="builder-6694ebca9d1946498d115cea8dd55061"
      >
        <label
          htmlFor="plan"
          className="builder-block builder-870d3f0037dc4043aac45b190279fc12 css-1tzgbp3"
          builder-id="builder-870d3f0037dc4043aac45b190279fc12"
        >
          <span
            className="builder-block builder-4fb4b36374d343d39afdd4032bd52bd5 builder-has-component css-vky7x4"
            builder-id="builder-4fb4b36374d343d39afdd4032bd52bd5"
          >
            <span className="builder-text css-1qggkls">Plan</span>
          </span>
        </label>
        <select
          name="plan"
          value={formValues.plan}
          onChange={handleChange}
          ref={planRef}
          className="builder-block builder-ca5e32caa1d84951bf3a7cb2063372cd builder-2c2b99b230504b7d8a239ff528137758 builder-2c2b99b230504b7d8a239ff528137758 css-14mpe92"
        >
          <option disabled>Select Plan</option>
          <option value="basic">Basic</option>
          <option value="pro">Pro</option>
        </select>
        {errors.plan && <p className="error-msg">{errors.plan}</p>}
      </div>
      {/* Submit Button */}
      <button
        aria-busy="false"
        className="builder-block builder-4726b8ffcc9941278da342a2826c8f26 builder-eed6c2bfcc104c4080b2173c2538ad28 builder-eed6c2bfcc104c4080b2173c2538ad28 css-6a9sin"
        builder-id="builder-4726b8ffcc9941278da342a2826c8f26"
        style={{ cursor: "pointer" }}
        type="submit"
        disabled={isPending}
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
              {isPending ? "Creating In..." : "Create User"}
            </span>
          </span>
        </span>
      </button>
    </form>
  );
};
const User = ({ user, idx, setUsers, setError }) => {
  const { mutate: deleteUserMutation, isLoading: deletingUserLoading } =
    useMutation({
      mutationFn: deleteUserByAdminMutationFn,
      onSuccess: (res) => {
        console.log(res);
        setUsers((prev) => [
          ...prev.filter((item) => item.id !== res.deletedUser.id),
        ]);
      },
      onError: (error) => {
        setError({
          message:
            error?.message || error?.errorMessage || "Something went wrong.",
        });
      },
    });
  const handleDelete = () => {
    setError({});
    deleteUserMutation(user.id);
  };
  return (
    <>
      <tr className={styles.tr}>
        <td className={styles.td}>
          {deletingUserLoading && (
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "0",
                transform: "translateX(-50%)",
                background: "rgba(0,0,0,0.2)",
                backdropFilter: "blur(1px)",
                zIndex: 100,
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Loader className="spin_loader" />
            </div>
          )}
          {idx + 1}
        </td>
        <td className={styles.td}>{user.email}</td>
        <td className={styles.td}>{user.plan}</td>
        <td className={styles.td}>
          <button
            style={{
              background: "transparent",
              border: "1px solid white",
              color: "white",
              padding: "0.2rem 0.5rem",
              cursor: "pointer",
            }}
            disabled={deletingUserLoading}
            onClick={handleDelete}
          >
            <Trash style={{ width: "16px" }} />
          </button>
        </td>
      </tr>
    </>
  );
};
export default MyUsers;
