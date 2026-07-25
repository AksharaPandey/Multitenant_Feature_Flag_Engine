package com.revisiom.featureflag.exception;

public class FeatureDisabledException extends RuntimeException{
    public FeatureDisabledException(String featureKey){
        super("Access Denied: Feature '" + featureKey + "' is currently disabled.");
    }
}
