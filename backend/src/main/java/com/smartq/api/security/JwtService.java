package com.smartq.api.security;

import com.smartq.api.auth.domain.DemoUser;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

    private final SecretKey signingKey;
    private final long expirationMinutes;

    public JwtService(
        @Value("${smartq.jwt.secret}") String secret,
        @Value("${smartq.jwt.expiration-minutes}") long expirationMinutes
    ) {
        this.signingKey = buildSigningKey(secret);
        this.expirationMinutes = expirationMinutes;
    }

    public String generateToken(DemoUser user) {
        Instant now = Instant.now();
        return Jwts.builder()
            .subject(user.email())
            .claim("role", user.role().name())
            .claim("displayName", user.displayName())
            .issuedAt(Date.from(now))
            .expiration(Date.from(now.plus(expirationMinutes, ChronoUnit.MINUTES)))
            .signWith(signingKey)
            .compact();
    }

    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        String username = extractUsername(token);
        return username.equalsIgnoreCase(userDetails.getUsername()) && !isExpired(token);
    }

    private boolean isExpired(String token) {
        return extractAllClaims(token).getExpiration().before(new Date());
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
            .verifyWith(signingKey)
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }

    private SecretKey buildSigningKey(String secret) {
        if (secret.matches("^[A-Za-z0-9+/=]+$") && secret.length() % 4 == 0) {
            try {
                return Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
            } catch (IllegalArgumentException ignored) {
                // Fall through to raw secret handling.
            }
        }
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }
}

