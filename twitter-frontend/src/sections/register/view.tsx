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

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserRegistrationSchema, UserRegistrationZodDto } from "@/schemas";
import { useState } from "react";

export default function RegisterView() {
  const router = useRouter();
  const [errorZod, setErrorZod] = useState<string>("");

  const { register: registerUser } = useAuthContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserRegistrationZodDto>({
    resolver: zodResolver(UserRegistrationSchema),
  });

  const onSubmit = async (data: UserRegistrationZodDto) => {
    setErrorZod("");
    try {
      await registerUser(
        data.username,
        data.email,
        data.password,
        data.passwordRepeat
      );
      router.replace(paths.home());
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setErrorZod(err.message);
    }
  };

  const renderHeader = (
    <>
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
          width={100}
          height={100}
          onClick={() => router.push(paths.home())}
          style={{
            cursor: "pointer",
            transition: "all 0.7s ease",
            textShadow: "inherit",
          }}
        />
      </Toolbar>
      <Typography variant="h5" align="center" gutterBottom sx={{ mb: 3 }}>
        Register
      </Typography>
    </>
  );

  const renderForm = (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl fullWidth sx={{ gap: 3 }}>
        <TextField
          label="Username"
          {...register("username")}
          error={!!errors.username}
          helperText={errors.username?.message}
        />

        <TextField
          label="Email"
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
        />

        <TextField
          label="Password"
          type="password"
          {...register("password")}
          error={!!errors.password}
          helperText={errors.password?.message}
        />

        <TextField
          label="Password Repeat"
          type="password"
          {...register("passwordRepeat")}
          error={!!errors.passwordRepeat}
          helperText={errors.passwordRepeat?.message}
        />

        <Button variant="contained" type="submit">
          Register
        </Button>
        {errorZod && (
          <Typography
            color="error"
            variant="body2"
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {errorZod}
          </Typography>
        )}
      </FormControl>
    </form>
  );

  const renderFooter = (
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
  );

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
          maxHeight: 750,
        }}
      >
        <CardContent>
          {renderHeader}

          {renderForm}

          {renderFooter}
        </CardContent>
      </Card>
    </Box>
  );
}
