
interface SignUpData {
  email: string;
  password: string;
  name?: string;
  userType?: string;
}

interface SignInData {
  email: string;
  password: string;
}

interface VerifyEmailData {
  email: string;
  code: string;
}

interface AuthResult {
  success: boolean;
  message: string;
  data?: any;
  token?: string;
}

interface User {
  id: string;
  email: string;
  name?: string;
  userType?: string;
  isVerified: boolean;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL_AUTH || "http://localhost:3000";

// function for API calls
async function apiCall(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  try {
    const url = `${API_BASE_URL}/${endpoint}`;
    const token =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

    console.log("Making API call to:", url, "with options:", options);
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    });
    console.log("API response status:", response.status);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
}

// Sign up new user
export async function signUpUser(data: SignUpData): Promise<AuthResult> {
  try {
    console.log("Signing up user with data:", data);
    const response = await apiCall("auth/signup", {
      method: "POST",
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        name: data.name,
        userType: data.userType,
      }),
    });

    return {
      success: true,
      message:
        response.message ||
        "Account created successfully! Please check your email for verification code.",
      data: response.data,
    };
  } catch (error: any) {
    console.error("Sign up error:", error);
    return {
      success: false,
      message: error.message || "Failed to create account. Please try again.",
    };
  }
}

//decode JWT token
function decodeJWT(token: string): any {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
}

// Sign in user
export async function signInUser(data: SignInData): Promise<AuthResult> {
  try {
    console.log("Signing in user with data:", data);
    const response = await apiCall("auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
    });
    console.log("Sign in response:", response);

    let userData = response.data;
    if (response.data?.idToken) {
      const decodedToken = decodeJWT(response.data.idToken);
      if (decodedToken) {
        userData = {
          ...response.data,
          user: {
            id: decodedToken.sub || decodedToken.user_id,
            email: decodedToken.email,
            name:
              decodedToken.name ||
              decodedToken.given_name + " " + decodedToken.family_name,
            userType: decodedToken.userType || decodedToken["custom:userType"],
            isVerified: decodedToken.email_verified || true,
            role: decodedToken["cognito:groups"] || [],
            ...Object.keys(decodedToken)
              .filter(
                (key) =>
                  ![
                    "iss",
                    "aud",
                    "exp",
                    "iat",
                    "token_use",
                    "auth_time",
                  ].includes(key)
              )
              .reduce((obj: any, key) => {
                obj[key] = decodedToken[key];
                return obj;
              }, {}),
          },
        };
      }
    }

    if (response.data && typeof window !== "undefined") {
      localStorage.setItem("authToken", response.data.accessToken);
      if (userData.user) {
        localStorage.setItem("user", JSON.stringify(userData.user));
      }
    }

    return {
      success: true,
      message: response.message || "Successfully signed in!",
      data: userData,
      token: response.data.accessToken,
    };
  } catch (error: any) {
    console.error("Sign in error:", error);
    return {
      success: false,
      message: error.message || "Invalid email or password. Please try again.",
    };
  }
}

// Verify email with code
export async function verifyEmail(data: VerifyEmailData): Promise<AuthResult> {
  try {
    const response = await apiCall("auth/verify-email", {
      method: "POST",
      body: JSON.stringify({
        email: data.email,
        code: data.code,
      }),
    });

    return {
      success: true,
      message:
        response.message || "Email verified successfully! You can now sign in.",
      data: response.data,
    };
  } catch (error: any) {
    console.error("Email verification error:", error);
    return {
      success: false,
      message: error.message || "Invalid verification code. Please try again.",
    };
  }
}

// Resend verification code
export async function resendVerificationCode(
  email: string
): Promise<AuthResult> {
  try {
    const response = await apiCall("auth/resend-verification", {
      method: "POST",
      body: JSON.stringify({ email }),
    });

    return {
      success: true,
      message: response.message || "Verification code sent to your email.",
      data: response.data,
    };
  } catch (error: any) {
    console.error("Resend verification error:", error);
    return {
      success: false,
      message:
        error.message ||
        "Failed to resend verification code. Please try again.",
    };
  }
}

// Sign out user
export async function signOutUser(): Promise<AuthResult> {
  try {
    try {
      await apiCall("auth/signout", {
        method: "POST",
      });
    } catch (error) {
      console.warn("Backend signout failed:", error);
    }
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
    }

    return {
      success: true,
      message: "Successfully signed out.",
    };
  } catch (error: any) {
    console.error("Sign out error:", error);
    return {
      success: false,
      message: "Failed to sign out. Please try again.",
    };
  }
}

// Get current user
export async function getCurrentUser(): Promise<User | null> {
  try {
    if (typeof window === "undefined") return null;
    const cachedUser = localStorage.getItem("user");
    const token = localStorage.getItem("authToken");

    if (!token) {
      return null;
    }
    if (cachedUser) {
      try {
        return JSON.parse(cachedUser);
      } catch (error) {
        console.error("Error parsing cached user:", error);
      }
    }
    const response = await apiCall("auth/me", {
      method: "GET",
    });

    if (response.user) {
      localStorage.setItem("user", JSON.stringify(response.user));
      return response.user;
    }

    return null;
  } catch (error: any) {
    console.error("Get current user error:", error);
    if (
      typeof window !== "undefined" &&
      (error.message.includes("401") || error.message.includes("Unauthorized"))
    ) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
    }

    return null;
  }
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("authToken");
}

// Get stored auth token
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("authToken");
}

// Forgot password
// export async function forgotPassword(email: string): Promise<AuthResult> {
//   try {
//     const response = await apiCall("/auth/forgot-password", {
//       method: "POST",
//       body: JSON.stringify({ email }),
//     });

//     return {
//       success: true,
//       message:
//         response.message || "Password reset instructions sent to your email.",
//       data: response.data,
//     };
//   } catch (error: any) {
//     console.error("Forgot password error:", error);
//     return {
//       success: false,
//       message:
//         error.message ||
//         "Failed to send password reset email. Please try again.",
//     };
//   }
// }

// Reset password
// export async function resetPassword(
//   token: string,
//   newPassword: string
// ): Promise<AuthResult> {
//   try {
//     const response = await apiCall("/auth/reset-password", {
//       method: "POST",
//       body: JSON.stringify({
//         token,
//         password: newPassword,
//       }),
//     });

//     return {
//       success: true,
//       message: response.message || "Password reset successfully.",
//       data: response.data,
//     };
//   } catch (error: any) {
//     console.error("Reset password error:", error);
//     return {
//       success: false,
//       message: error.message || "Failed to reset password. Please try again.",
//     };
//   }
// }


export const updateUserDetails = async (
  userData: Partial<User>,
  userId: string
): Promise<AuthResult> => {
  try {
    const response = await apiCall(`auth/update`, {
      method: "POST",
      body: JSON.stringify({ name: userData.name }),
    });

    if (response.status === "SUCCESS") {
      const cachedUser = localStorage.getItem("user");
      let updatedUser = response.user;
      if (cachedUser) {
        try {
          const userObj = JSON.parse(cachedUser);
          updatedUser = { ...userObj, name: userData.name };
        } catch (e) {
          updatedUser = { ...response.user, name: userData.name };
        }
      }
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }

    return {
      success: true,
      message: response.message || "User details updated successfully.",
      data: response.data,
    };
  } catch (error: any) {
    console.error("Update user details error:", error);
    return {
      success: false,
      message:
        error.message || "Failed to update user details. Please try again.",
    };
  }
};