package com.rumihat.shop.auth;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {
    private final String frontendSuccessUrl;

    public OAuth2LoginSuccessHandler(@Value("${app.frontend.auth-success-url}") String frontendSuccessUrl) {
        this.frontendSuccessUrl = frontendSuccessUrl;
    }

    @Override
    public void onAuthenticationSuccess(
        HttpServletRequest request,
        HttpServletResponse response,
        Authentication authentication
    ) throws IOException, ServletException {
        String provider = "oauth";
        String email = "";

        if (authentication instanceof OAuth2AuthenticationToken oauthToken) {
            provider = oauthToken.getAuthorizedClientRegistrationId();
            OAuth2User user = oauthToken.getPrincipal();
            email = resolveEmail(provider, user);
        }

        String token = UUID.randomUUID().toString();
        String redirectUrl = frontendSuccessUrl
            + "?oauth=success"
            + "&provider=" + encode(provider)
            + "&token=" + encode(token)
            + "&email=" + encode(email);

        response.sendRedirect(redirectUrl);
    }

    private String resolveEmail(String provider, OAuth2User user) {
        if ("google".equals(provider)) {
            return user.getAttribute("email");
        }

        if ("kakao".equals(provider)) {
            Object kakaoAccount = user.getAttribute("kakao_account");

            if (kakaoAccount instanceof java.util.Map<?, ?> account) {
                Object email = account.get("email");
                return email instanceof String emailValue ? emailValue : "";
            }
        }

        return "";
    }

    private String encode(String value) {
        return URLEncoder.encode(value == null ? "" : value, StandardCharsets.UTF_8);
    }
}
