package com.revisiom.featureflag.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler{
    @ExceptionHandler(FeatureDisabledException.class)
    public ResponseEntity<Map<String,String>> handleFeatureDisabled(FeatureDisabledException ex){
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error",ex.getMessage()));
    }

}
