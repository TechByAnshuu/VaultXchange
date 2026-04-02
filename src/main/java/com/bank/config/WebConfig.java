package com.bank.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.lang.NonNull;

// Configures global CORS so the React frontend (Vercel) can call these APIs (Render)
@Configuration
public class WebConfig implements WebMvcConfigurer {

    // Read the Vercel production URL from env var; fall back to localhost for dev
    @Value("${FRONTEND_URL:http://localhost:5173}")
    private String frontendUrl;

    @Override
    public void addCorsMappings(@NonNull CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins(
                        "http://localhost:5173",          // Vite dev server
                        "http://localhost:3000",           // CRA fallback
                        "https://vaultxchange.vercel.app", // Main production
                        "https://vaultxchange-dev.vercel.app", // Dev production
                        "https://vaultxchange-app.vercel.app", // Secondary/Alt production link
                        frontendUrl.replaceAll("/+$", "")  // env-var override (strip slashes)
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
