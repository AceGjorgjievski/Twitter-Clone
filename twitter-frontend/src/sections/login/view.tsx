"use client";

import { paths } from "@/routes/paths";
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

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "@/routes/hooks";
import { useAuthContext } from "@/auth/hooks";
import { validateEmail, validatePassword } from "@/utils/validators";

export default function LoginView() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const { login } = useAuthContext();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailError = validateEmail(email);
    if(emailError) return setError(emailError);

    const passwordError = validatePassword(password);
    if(passwordError) return setError(passwordError);

    try {
      await login(email, password);
      router.replace(paths.home())
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
          height: 600,
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            align="center"
            gutterBottom
            sx={{ mt: 5, mb: 8 }}
          >
            Login
          </Typography>

          <form onSubmit={onSubmit}>
            <FormControl fullWidth sx={{ gap: 3 }}>
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
                Log in
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
            <Typography>Don&apos;t have an account? &nbsp;</Typography>
            <Link href={paths.register()}>
              <Typography>Register now!</Typography>
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
