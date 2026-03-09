package com.smartq.api.common;

import jakarta.servlet.http.HttpServletRequest;
import java.time.Instant;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BadCredentialsException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ErrorResponse handleBadCredentials(BadCredentialsException exception, HttpServletRequest request) {
        return new ErrorResponse(Instant.now(), HttpStatus.UNAUTHORIZED.value(), "Invalid credentials", request.getRequestURI());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleValidation(MethodArgumentNotValidException exception, HttpServletRequest request) {
        return new ErrorResponse(Instant.now(), HttpStatus.BAD_REQUEST.value(), "Validation failed", request.getRequestURI());
    }

    @ExceptionHandler(ResponseStatusException.class)
    @ResponseStatus
    public ErrorResponse handleResponseStatus(ResponseStatusException exception, HttpServletRequest request) {
        String error = exception.getReason() != null ? exception.getReason() : exception.getStatusCode().toString();
        return new ErrorResponse(Instant.now(), exception.getStatusCode().value(), error, request.getRequestURI());
    }
}
