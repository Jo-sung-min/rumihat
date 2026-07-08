package com.rumihat.shop.auth;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
    private final OAuth2LoginSuccessHandler successHandler;
    private final String frontendFailureUrl;

    public SecurityConfig(
        OAuth2LoginSuccessHandler successHandler,
        @Value("${app.frontend.auth-failure-url}") String frontendFailureUrl
    ) {
        this.successHandler = successHandler;
        this.frontendFailureUrl = frontendFailureUrl;
    }

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(Customizer.withDefaults())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/**", "/oauth2/**", "/login/oauth2/**").permitAll()
                .anyRequest().permitAll()
            )
            .oauth2Login(oauth -> oauth
                .successHandler(successHandler)
                .failureUrl(frontendFailureUrl)
            )
            .build();
    }
}
