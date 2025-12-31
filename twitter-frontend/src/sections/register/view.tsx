"use client";

import {
  Button,
  Toolbar,
  CardContent,
  Card,
  FormControl,
  TextField,
  Typography,
  Box,
  Link,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "@/routes/hooks";

import { paths } from "@/routes/paths";
import { useAuthContext } from "@/auth/hooks";
import { useState } from "react";
import { validateUsername, validateEmail, validatePassword, validatePasswordRepeat } from "@/utils/validators";

export default function RegisterView() {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordRepeat, setPasswordRepeat] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const { register } = useAuthContext();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

      const usernameError = validateUsername(username);
    if (usernameError) return setError(usernameError);

    const emailError = validateEmail(email);
    if (emailError) return setError(emailError);

    const passwordError = validatePassword(password);
    if (passwordError) return setError(passwordError);

    const repeatError = validatePasswordRepeat(password, passwordRepeat);
    if (repeatError) return setError(repeatError);

    try {
      
      await register(username, email, password);

      router.replace(paths.home());
    } catch (err) {
      setError("Login Error: " + err);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1d9bf0 0%, #0f4c75 100%)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        px: { xs: 2, sm: 4, md: 8, lg: 16 },
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 550,
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          boxShadow: 6,
          borderRadius: 3,
          height: 700,
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            align="center"
            gutterBottom
            sx={{ mt: 5, mb: 8 }}
          >
            Register
          </Typography>

          <form onSubmit={onSubmit}>
            <FormControl fullWidth sx={{ gap: 3 }}>
              <TextField
                required
                label="Username"
                name="username"
                autoComplete="username"
                onChange={(e) => setUsername(e.target.value)}
              />

              <TextField
                required
                label="Email"
                name="email"
                autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
              />

              <TextField
                required
                label="Password"
                name="password"
                type="password"
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
              />

              <TextField
                required
                label="Password Repeat"
                name="password-repeat"
                type="password"
                autoComplete="current-password"
                onChange={(e) => setPasswordRepeat(e.target.value)}
              />

            {error && (
                <Typography
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
                color="error"
                variant="body2"
                >
                {error}
                </Typography>
            )}

              <Button variant="contained" type="submit" sx={{ mt: 5 }}>
                Register
              </Button>
            </FormControl>
          </form>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              my: 2,
              color: "#536471",
              fontSize: "0.85rem",
            }}
          >
            <Typography>Already have an account? &nbsp;</Typography>
            <Link href={paths.login()}>
              <Typography>Login now!</Typography>
            </Link>
          </Box>

          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              src="/images/twitter-logo.png"
              alt="Logo"
              width={150}
              height={150}
              onClick={() => router.push(paths.home())}
              style={{
                cursor: "pointer",
                transition: "all 0.7s ease",
                textShadow: "inherit",
              }}
            />
          </Toolbar>
        </CardContent>
      </Card>
    </Box>
  );
}
